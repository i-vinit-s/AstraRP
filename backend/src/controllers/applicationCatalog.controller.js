const Application = require("../models/Application");
const { getApplicationAccess } = require("../utils/applicationPermissions");

/*
|--------------------------------------------------------------------------
| GET ALL APPLICATIONS
|--------------------------------------------------------------------------
|
| GET /applications
|
| Important:
|
| - Returns enabled AND disabled applications.
| - Disabled applications remain visible but locked.
| - Logged-out users receive action: "login".
| - Logged-in users get their real application access state.
|
*/

exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({})
      .sort({
        order: 1,
        createdAt: 1,
      })
      .lean();

    /*
    |--------------------------------------------------------------------------
    | Resolve Access
    |--------------------------------------------------------------------------
    */

    const resolvedApplications = await Promise.all(
      applications.map(async (application) => {
        /*
         * Logged-out user
         */

        if (!application.enabled) {
          return {
            ...application,
            accessible: false,
            action: "disabled",
            buttonText: "Unavailable",
            lockReason:
              application.disabledMessage ||
              "This application is currently unavailable.",
            submission: null,
            canReapply: false,
            cooldownEnds: null,
            attemptsUsed: 0,
            attemptsRemaining:
              application.maxAttempts > 0 ? application.maxAttempts : null,
            categoryConflict: null,
          };
        }

        if (!req.user) {
          return {
            ...application,
            accessible: false,
            action: "login",
            buttonText: "Login to Apply",
            lockReason:
              "You must log in with Discord before accessing this application.",
            submission: null,
            canReapply: false,
            cooldownEnds: null,
            attemptsUsed: 0,
            attemptsRemaining:
              application.maxAttempts > 0 ? application.maxAttempts : null,
            categoryConflict: null,
          };
        }

        /*
         * Logged-in user
         */

        const access = await getApplicationAccess(req.user, application);

        return {
          ...application,
          accessible: access.accessible,
          action: access.action,
          buttonText: access.buttonText,
          lockReason: access.lockReason,
          canReapply: access.canReapply,
          cooldownEnds: access.cooldownEnds,
          attemptsUsed: access.attemptsUsed,
          attemptsRemaining: access.attemptsRemaining,
          categoryConflict: access.categoryConflict,

          /*
           * Don't return the entire submission with all answers
           * on the catalog endpoint.
           *
           * Cards only need basic submission metadata.
           */

          submission: access.submission
            ? {
                id: access.submission._id,
                status: access.submission.status,
                attempt: access.submission.attempt,
                submittedAt: access.submission.submittedAt,
                cooldownEnds: access.submission.cooldownEnds,
                createdAt: access.submission.createdAt,
                updatedAt: access.submission.updatedAt,
              }
            : null,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      count: resolvedApplications.length,
      applications: resolvedApplications,
    });
  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load applications.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE APPLICATION CATALOG ITEM
|--------------------------------------------------------------------------
|
| GET /applications/:slug
|
| Returns application metadata + current user's access state.
|
*/

exports.getApplicationBySlug = async (req, res) => {
  try {
    const application = await Application.findOne({
      slug: req.params.slug.toLowerCase(),
    }).lean();

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    /*
     * Logged-out user
     */

    if (!application.enabled) {
      return {
        ...application,
        accessible: false,
        action: "disabled",
        buttonText: "Unavailable",
        lockReason:
          application.disabledMessage ||
          "This application is currently unavailable.",
        submission: null,
        canReapply: false,
        cooldownEnds: null,
        attemptsUsed: 0,
        attemptsRemaining:
          application.maxAttempts > 0 ? application.maxAttempts : null,
        categoryConflict: null,
      };
    }

    if (!req.user) {
      return res.status(200).json({
        success: true,

        application: {
          ...application,
          accessible: false,
          action: "login",
          buttonText: "Login to Apply",
          lockReason:
            "You must log in with Discord before accessing this application.",
          submission: null,
          canReapply: false,
          cooldownEnds: null,
          attemptsUsed: 0,
          attemptsRemaining:
            application.maxAttempts > 0 ? application.maxAttempts : null,
          categoryConflict: null,
        },
      });
    }

    /*
     * Logged-in user
     */

    const access = await getApplicationAccess(req.user, application);

    return res.status(200).json({
      success: true,

      application: {
        ...application,
        accessible: access.accessible,
        action: access.action,
        buttonText: access.buttonText,
        lockReason: access.lockReason,
        canReapply: access.canReapply,
        cooldownEnds: access.cooldownEnds,
        attemptsUsed: access.attemptsUsed,
        attemptsRemaining: access.attemptsRemaining,
        categoryConflict: access.categoryConflict,
        submission: access.submission
          ? {
              id: access.submission._id,
              status: access.submission.status,
              attempt: access.submission.attempt,
              submittedAt: access.submission.submittedAt,
              cooldownEnds: access.submission.cooldownEnds,
              review: access.submission.review,
              createdAt: access.submission.createdAt,
              updatedAt: access.submission.updatedAt,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("GET APPLICATION BY SLUG ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load application.",
    });
  }
};
