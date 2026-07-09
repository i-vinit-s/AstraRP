const ApplicationSubmission = require("../models/ApplicationSubmission.js");

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function lock(
  result,
  action = "locked",
  buttonText = "Locked",
  reason = "This application is currently unavailable.",
) {
  result.accessible = false;
  result.action = action;
  result.buttonText = buttonText;
  result.lockReason = reason;

  return result;
}

async function getLatestSubmission(userId, applicationId) {
  return ApplicationSubmission.findOne({
    user: userId,
    application: applicationId,
  }).sort({
    attempt: -1,
    createdAt: -1,
  });
}

async function getAttemptCount(userId, applicationId) {
  return ApplicationSubmission.countDocuments({
    user: userId,
    application: applicationId,
  });
}

async function getCategoryConflict(user, application) {
  if (!application.categoryExclusive) {
    return null;
  }

  return ApplicationSubmission.findOne({
    user: user._id,

    category: application.category,

    application: {
      $ne: application._id,
    },

    status: {
      $in: ["draft", "pending", "accepted"],
    },
  })
    .sort({
      createdAt: -1,
    })
    .populate("application", "title slug category");
}

/*
|--------------------------------------------------------------------------
| Main Access Resolver
|--------------------------------------------------------------------------
*/

async function getApplicationAccess(user, application) {
  const result = {
    accessible: true,

    action: "apply",

    buttonText: application.buttonText || "Apply Now",

    lockReason: null,

    badge: application.badge || null,

    submission: null,

    canReapply: false,

    cooldownEnds: null,

    attemptsUsed: 0,

    attemptsRemaining: null,

    categoryConflict: null,
  };

  /*
  |--------------------------------------------------------------------------
  | Disabled Application
  |--------------------------------------------------------------------------
  |
  | Important:
  |
  | enabled: false does NOT hide the application.
  | It only disables access to the application.
  |
  */

  if (!application.enabled) {
    return lock(
      result,
      "locked",
      "Unavailable",
      "This application is currently unavailable.",
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Latest Submission
  |--------------------------------------------------------------------------
  */

  const submission = await getLatestSubmission(user._id, application._id);

  result.submission = submission;

  /*
  |--------------------------------------------------------------------------
  | Attempt Information
  |--------------------------------------------------------------------------
  */

  const attemptsUsed = await getAttemptCount(user._id, application._id);

  result.attemptsUsed = attemptsUsed;

  if (application.maxAttempts > 0) {
    result.attemptsRemaining = Math.max(
      application.maxAttempts - attemptsUsed,
      0,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Existing Submission State
  |--------------------------------------------------------------------------
  */

  if (submission) {
    switch (submission.status) {
      /*
       * Draft
       */

      case "draft": {
        result.action = "continue";
        result.buttonText = "Continue Application";

        return result;
      }

      /*
       * Pending
       */

      case "pending": {
        result.action = "pending";
        result.buttonText = "Under Review";

        return result;
      }

      /*
       * Accepted
       */

      case "accepted": {
        result.action = "accepted";
        result.buttonText = "Accepted";

        return result;
      }

      /*
       * Rejected
       */

      case "rejected": {
        /*
         * Maximum attempts reached.
         */

        if (
          application.maxAttempts > 0 &&
          attemptsUsed >= application.maxAttempts
        ) {
          result.action = "result";
          result.buttonText = "View Result";
          result.canReapply = false;

          result.lockReason = `You have reached the maximum of ${application.maxAttempts} attempts for this application.`;

          return result;
        }

        /*
         * Cooldown active.
         */

        if (
          submission.cooldownEnds &&
          submission.cooldownEnds.getTime() > Date.now()
        ) {
          result.action = "result";
          result.buttonText = "View Result";
          result.canReapply = false;
          result.cooldownEnds = submission.cooldownEnds;

          return result;
        }

        /*
         * Reapplication available.
         */

        result.action = "reapply";
        result.buttonText = "Reapply";
        result.canReapply = true;
        result.cooldownEnds = null;

        return result;
      }

      /*
       * Closed
       */

      case "closed": {
        /*
         * Maximum attempts reached.
         */

        if (
          application.maxAttempts > 0 &&
          attemptsUsed >= application.maxAttempts
        ) {
          return lock(
            result,
            "locked",
            "Maximum Attempts Reached",
            `You have reached the maximum of ${application.maxAttempts} attempts for this application.`,
          );
        }

        /*
         * Closed submissions allow a fresh attempt.
         */

        result.canReapply = true;

        break;
      }

      default:
        break;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Category Exclusivity
  |--------------------------------------------------------------------------
  |
  | Example:
  |
  | Police Application
  | category: "Government"
  |
  | EMS Application
  | category: "Government"
  |
  | If the user already has an active Police application,
  | they cannot start EMS.
  |
  | Applications in other categories remain unaffected.
  |
  */

  const categoryConflict = await getCategoryConflict(user, application);

  if (categoryConflict) {
    result.categoryConflict = {
      applicationId: categoryConflict.application?._id || null,

      title: categoryConflict.application?.title || "Another application",

      slug: categoryConflict.application?.slug || null,

      category: categoryConflict.application?.category || application.category,

      status: categoryConflict.status,
    };

    return lock(
      result,
      "locked",
      "Locked",
      `You already have an active application in the "${application.category}" category.`,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Maximum Attempts
  |--------------------------------------------------------------------------
  */

  if (application.maxAttempts > 0 && attemptsUsed >= application.maxAttempts) {
    return lock(
      result,
      "locked",
      "Maximum Attempts Reached",
      `You have reached the maximum of ${application.maxAttempts} attempts for this application.`,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Requirements
  |--------------------------------------------------------------------------
  */

  for (const requirement of application.requirements || []) {
    switch (requirement.type) {
      /*
       * Allowlisted
       */

      case "allowlisted": {
        if (!user.isWhitelisted) {
          return lock(
            result,
            "locked",
            "Locked",
            requirement.message || "Requires Allowlist",
          );
        }

        break;
      }

      /*
       * Permission
       */

      case "permission": {
        if (!user.permissions?.includes(requirement.value)) {
          return lock(
            result,
            "locked",
            "Locked",
            requirement.message || "Missing Permission",
          );
        }

        break;
      }

      /*
       * Discord Role
       */

      case "discordRole": {
        /*
         * Your auth middleware currently stores fetched Discord
         * roles in:
         *
         * req.user.discordRoles
         *
         * So we must check discordRoles, not user.roles.
         */

        if (!user.discordRoles?.includes(requirement.value)) {
          return lock(
            result,
            "locked",
            "Locked",
            requirement.message || "Discord Role Required",
          );
        }

        break;
      }

      /*
       * Tebex
       */

      case "tebex": {
        /*
         * Assumes user.perks is either:
         *
         * Map:
         * user.perks.get("priority_application")
         *
         * OR plain object:
         * user.perks["priority_application"]
         */

        const hasPerk =
          typeof user.perks?.get === "function"
            ? Boolean(user.perks.get(requirement.value))
            : Boolean(user.perks?.[requirement.value]);

        if (!hasPerk) {
          return lock(
            result,
            "purchase",
            "Purchase",
            requirement.message || "Purchase Required",
          );
        }

        break;
      }

      /*
       * Custom
       */

      case "custom": {
        return lock(
          result,
          "locked",
          "Unavailable",
          requirement.message || "Unavailable",
        );
      }

      default:
        break;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Available
  |--------------------------------------------------------------------------
  */

  result.accessible = true;
  result.action = "apply";

  result.buttonText =
    submission && ["rejected", "closed"].includes(submission.status)
      ? "Apply Again"
      : application.buttonText || "Apply Now";

  return result;
}

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  getApplicationAccess,
  getCategoryConflict,
  getLatestSubmission,
};
