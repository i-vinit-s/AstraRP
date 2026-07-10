const mongoose = require("mongoose");

const Application = require("../models/Application");
const ApplicationSubmission = require("../models/ApplicationSubmission");
const ApplicationQuestion = require("../models/ApplicationQuestion");
const ApplicationSection = require("../models/ApplicationSection");
const asyncHandler = require("../utils/asyncHandler");

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function generateSlug(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeRequirements(requirements) {
  if (!Array.isArray(requirements)) {
    return [];
  }

  return requirements
    .filter((requirement) => requirement?.type)
    .map((requirement) => ({
      type: requirement.type,
      value: requirement.value || null,
      message: String(requirement.message || "").trim(),
    }));
}

/*
|--------------------------------------------------------------------------
| GET ALL APPLICATION DEFINITIONS
|--------------------------------------------------------------------------
|
| GET /api/staff/application-definitions
|
*/

exports.getApplicationDefinitions = asyncHandler(async (req, res) => {
  const applications = await Application.find()
    .sort({
      order: 1,
      createdAt: 1,
    })
    .lean();

  const applicationIds = applications.map((application) => application._id);

  const [submissionCounts, questionCounts, sectionCounts] = await Promise.all([
    ApplicationSubmission.aggregate([
      {
        $match: {
          application: {
            $in: applicationIds,
          },
        },
      },
      {
        $group: {
          _id: "$application",
          count: {
            $sum: 1,
          },
        },
      },
    ]),

    ApplicationQuestion.aggregate([
      {
        $match: {
          application: {
            $in: applicationIds,
          },
        },
      },
      {
        $group: {
          _id: "$application",
          count: {
            $sum: 1,
          },
        },
      },
    ]),

    ApplicationSection.aggregate([
      {
        $match: {
          application: {
            $in: applicationIds,
          },
        },
      },
      {
        $group: {
          _id: "$application",
          count: {
            $sum: 1,
          },
        },
      },
    ]),
  ]);

  const submissionCountMap = new Map(
    submissionCounts.map((item) => [String(item._id), item.count]),
  );

  const questionCountMap = new Map(
    questionCounts.map((item) => [String(item._id), item.count]),
  );

  const sectionCountMap = new Map(
    sectionCounts.map((item) => [String(item._id), item.count]),
  );

  const result = applications.map((application) => ({
    ...application,

    submissionCount: submissionCountMap.get(String(application._id)) || 0,

    questionCount: questionCountMap.get(String(application._id)) || 0,

    sectionCount: sectionCountMap.get(String(application._id)) || 0,
  }));

  return res.status(200).json({
    success: true,
    count: result.length,
    applications: result,
  });
});

/*
|--------------------------------------------------------------------------
| GET ONE APPLICATION DEFINITION
|--------------------------------------------------------------------------
|
| GET /api/staff/application-definitions/:id
|
*/

exports.getApplicationDefinition = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid application ID.",
    });
  }

  const application = await Application.findById(id).lean();

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application definition not found.",
    });
  }

  const [sections, questions, submissionCount] = await Promise.all([
    ApplicationSection.find({
      application: application._id,
    })
      .sort({
        order: 1,
        createdAt: 1,
      })
      .lean(),

    ApplicationQuestion.find({
      application: application._id,
    })
      .sort({
        order: 1,
        createdAt: 1,
      })
      .lean(),

    ApplicationSubmission.countDocuments({
      application: application._id,
    }),
  ]);

  const sectionsWithQuestions = sections.map((section) => ({
    ...section,

    questions: questions.filter((question) => {
      if (!question.section) {
        return false;
      }

      return String(question.section) === String(section._id);
    }),
  }));

  const unsectionedQuestions = questions.filter(
    (question) => !question.section,
  );

  return res.status(200).json({
    success: true,

    application: {
      ...application,
      submissionCount,
    },

    sections: sectionsWithQuestions,
    questions,
    unsectionedQuestions,
  });
});

/*
|--------------------------------------------------------------------------
| CREATE APPLICATION DEFINITION
|--------------------------------------------------------------------------
|
| POST /api/staff/application-definitions
|
*/

exports.createApplicationDefinition = asyncHandler(async (req, res) => {
  const {
    title,
    slug: requestedSlug,
    description = "",
    category = "Community",
    categoryExclusive = true,
    reapplyCooldownDays = 7,
    maxAttempts = 0,
    order = 0,
    enabled = true,
    badge,
    requirements = [],
  } = req.body;

  /*
   * Validate title.
   */

  if (!title?.trim()) {
    return res.status(422).json({
      success: false,
      message: "Application title is required.",
    });
  }

  /*
   * Generate slug from explicitly provided slug or title.
   */

  const slug = generateSlug(requestedSlug || title);

  if (!slug) {
    return res.status(422).json({
      success: false,
      message: "A valid application slug could not be generated.",
    });
  }

  /*
   * Prevent duplicate slugs.
   */

  const existingApplication = await Application.findOne({
    slug,
  }).lean();

  if (existingApplication) {
    return res.status(409).json({
      success: false,
      message: "An application with this slug already exists.",
    });
  }

  /*
   * Validate numeric settings.
   */

  const cooldownDays = Number(reapplyCooldownDays);
  const attempts = Number(maxAttempts);
  const applicationOrder = Number(order);

  if (
    !Number.isFinite(cooldownDays) ||
    cooldownDays < 0 ||
    !Number.isFinite(attempts) ||
    attempts < 0 ||
    !Number.isFinite(applicationOrder)
  ) {
    return res.status(422).json({
      success: false,
      message: "Invalid application settings.",
    });
  }

  /*
   * Create application.
   *
   * Route is generated automatically. Admins should not manually enter it.
   */

  const application = await Application.create({
    title: title.trim(),
    slug,
    description: String(description || "").trim(),
    category: String(category || "Community").trim(),
    categoryExclusive: Boolean(categoryExclusive),

    reapplyCooldownDays: cooldownDays,
    maxAttempts: attempts,

    route: `/applications/${slug}`,

    order: applicationOrder,
    enabled: Boolean(enabled),

    badge: badge?.text
      ? {
          text: String(badge.text).trim(),
          color: String(badge.color || "gray").trim(),
        }
      : undefined,

    requirements: normalizeRequirements(requirements),
  });

  return res.status(201).json({
    success: true,
    message: "Application created successfully.",
    application,
  });
});

/*
|--------------------------------------------------------------------------
| UPDATE APPLICATION DEFINITION
|--------------------------------------------------------------------------
|
| PATCH /api/staff/application-definitions/:id
|
*/

exports.updateApplicationDefinition = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid application ID.",
    });
  }

  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application definition not found.",
    });
  }

  const {
    title,
    slug: requestedSlug,
    description,
    category,
    categoryExclusive,
    reapplyCooldownDays,
    maxAttempts,
    order,
    requirements,
    enabled,
  } = req.body;

  /*
   * Update title.
   */

  if (title !== undefined) {
    if (!String(title).trim()) {
      return res.status(422).json({
        success: false,
        message: "Application title cannot be empty.",
      });
    }

    application.title = String(title).trim();
  }

  /*
   * Update slug.
   *
   * Changing a slug also changes the generated frontend route.
   */

  if (requestedSlug !== undefined) {
    const slug = generateSlug(requestedSlug);

    if (!slug) {
      return res.status(422).json({
        success: false,
        message: "Invalid application slug.",
      });
    }

    const duplicate = await Application.findOne({
      slug,
      _id: {
        $ne: application._id,
      },
    }).lean();

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Another application already uses this slug.",
      });
    }

    application.slug = slug;
    application.route = `/applications/${slug}`;
  }

  if (description !== undefined) {
    application.description = String(description || "").trim();
  }

  if (category !== undefined) {
    if (!String(category).trim()) {
      return res.status(422).json({
        success: false,
        message: "Application category cannot be empty.",
      });
    }

    application.category = String(category).trim();
  }

  if (categoryExclusive !== undefined) {
    application.categoryExclusive = Boolean(categoryExclusive);
  }

  /*
   * Update cooldown.
   */

  if (reapplyCooldownDays !== undefined) {
    const cooldownDays = Number(reapplyCooldownDays);

    if (!Number.isFinite(cooldownDays) || cooldownDays < 0) {
      return res.status(422).json({
        success: false,
        message: "Reapplication cooldown must be zero or greater.",
      });
    }

    application.reapplyCooldownDays = cooldownDays;
  }

  /*
   * Update maximum attempts.
   *
   * Zero means unlimited attempts.
   */

  if (maxAttempts !== undefined) {
    const attempts = Number(maxAttempts);

    if (!Number.isFinite(attempts) || attempts < 0) {
      return res.status(422).json({
        success: false,
        message: "Maximum attempts must be zero or greater.",
      });
    }

    application.maxAttempts = attempts;
  }

  if (order !== undefined) {
    const applicationOrder = Number(order);

    if (!Number.isFinite(applicationOrder)) {
      return res.status(422).json({
        success: false,
        message: "Application order must be a valid number.",
      });
    }

    application.order = applicationOrder;
  }

  /*
   * Update requirements.
   */

  if (requirements !== undefined) {
    application.requirements = normalizeRequirements(requirements);
  }

  /*
   * Open / close application.
   *
   * Keep the badge synchronized with the application status.
   */

  if (enabled !== undefined) {
    if (typeof enabled !== "boolean") {
      return res.status(422).json({
        success: false,
        message: "Enabled must be a boolean.",
      });
    }

    /*
     * Validate before opening a closed application.
     */

    if (enabled && !application.enabled) {
      const validation = await validateApplicationForPublishing(
        application._id,
      );

      if (!validation.valid) {
        return res.status(422).json({
          success: false,
          message:
            "This application cannot be opened because its configuration is invalid.",
          errors: validation.errors,
        });
      }
    }

    application.enabled = enabled;

    /*
     * Synchronize badge with open/closed status.
     */

    application.badge = enabled
      ? {
          text: "OPEN",
          color: "green",
        }
      : {
          text: "CLOSED",
          color: "red",
        };
  }

  await application.save();

  return res.status(200).json({
    success: true,
    message: "Application updated successfully.",
    application,
  });
});

/*
|--------------------------------------------------------------------------
| UPDATE APPLICATION STATUS
|--------------------------------------------------------------------------
|
| PATCH /api/staff/application-definitions/:id/status
|
| Body:
|
| {
|   "enabled": false
| }
|
*/

exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid application ID.",
    });
  }

  if (typeof req.body.enabled !== "boolean") {
    return res.status(422).json({
      success: false,
      message: "The enabled field must be a boolean.",
    });
  }

  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application definition not found.",
    });
  }

  application.enabled = req.body.enabled;

  /*
   * Keep the badge synchronized with open/closed state.
   *
   * We only modify the badge when it already represents OPEN or CLOSED.
   * This preserves custom badges such as PRIORITY, LIMITED, or NEW.
   */

  const currentBadgeText = application.badge?.text?.toUpperCase();

  if (
    !currentBadgeText ||
    currentBadgeText === "OPEN" ||
    currentBadgeText === "CLOSED"
  ) {
    application.badge = {
      text: application.enabled ? "OPEN" : "CLOSED",
      color: application.enabled ? "green" : "red",
    };
  }

  await application.save();

  return res.status(200).json({
    success: true,

    message: application.enabled
      ? "Application reopened successfully."
      : "Application closed successfully.",

    application,
  });
});

/*
|--------------------------------------------------------------------------
| DELETE APPLICATION DEFINITION
|--------------------------------------------------------------------------
|
| PATCH /api/staff/application-definitions/:id/delete
|
*/

exports.deleteApplicationDefinition = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid application ID.",
    });
  }

  const application = await Application.findById(id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application definition not found.",
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Protect applications with existing submissions
  |--------------------------------------------------------------------------
  |
  | Never hard-delete an application definition once users have submitted
  | applications against it.
  |
  | Old ApplicationSubmission documents still reference this Application.
  | Deleting it would leave orphaned references.
  |
  */

  const submissionCount = await ApplicationSubmission.countDocuments({
    application: application._id,
  });

  if (submissionCount > 0) {
    return res.status(409).json({
      success: false,
      message: `This application cannot be deleted because it has ${submissionCount} existing submission${
        submissionCount === 1 ? "" : "s"
      }. Close the application instead.`,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Delete questions and sections
  |--------------------------------------------------------------------------
  |
  | Safe because no submission references this application.
  |
  */

  await Promise.all([
    ApplicationQuestion.deleteMany({
      application: application._id,
    }),

    ApplicationSection.deleteMany({
      application: application._id,
    }),
  ]);

  /*
  |--------------------------------------------------------------------------
  | Delete application definition
  |--------------------------------------------------------------------------
  */

  await application.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Application deleted successfully.",
  });
});

async function validateApplicationForPublishing(applicationId) {
  const application = await Application.findById(applicationId).lean();

  if (!application) {
    return {
      valid: false,
      errors: ["Application definition not found."],
    };
  }

  const questions = await ApplicationQuestion.find({
    application: applicationId,
  })
    .sort({ order: 1 })
    .lean();

  const errors = [];

  const enabledQuestions = questions.filter(
    (question) => question.enabled !== false,
  );

  if (!enabledQuestions.length) {
    errors.push(
      "The application must have at least one enabled question before it can be opened.",
    );
  }

  const questionIds = new Set();

  for (const question of enabledQuestions) {
    if (!question.id?.trim()) {
      errors.push(
        `Question "${question.title || "Untitled"}" has no question ID.`,
      );
    } else if (questionIds.has(question.id)) {
      errors.push(`Duplicate question ID detected: "${question.id}".`);
    } else {
      questionIds.add(question.id);
    }

    if (!question.title?.trim()) {
      errors.push(`Question "${question.id || "unknown"}" has no title.`);
    }

    if (["select", "radio", "checkbox"].includes(question.type)) {
      const validOptions = Array.isArray(question.options)
        ? question.options.filter(
            (option) => option.label?.trim() && option.value?.trim(),
          )
        : [];

      if (!validOptions.length) {
        errors.push(
          `Question "${question.title}" requires at least one valid option.`,
        );
      }

      const optionValues = validOptions.map((option) => option.value);

      if (new Set(optionValues).size !== optionValues.length) {
        errors.push(
          `Question "${question.title}" contains duplicate option values.`,
        );
      }
    }

    const validation = question.validation || {};

    if (
      validation.minLength != null &&
      validation.maxLength != null &&
      validation.minLength > validation.maxLength
    ) {
      errors.push(
        `Question "${question.title}" has a minimum length greater than its maximum length.`,
      );
    }

    if (
      validation.min != null &&
      validation.max != null &&
      validation.min > validation.max
    ) {
      errors.push(
        `Question "${question.title}" has a minimum value greater than its maximum value.`,
      );
    }

    if (validation.regex) {
      try {
        new RegExp(validation.regex);
      } catch {
        errors.push(
          `Question "${question.title}" contains an invalid regular expression.`,
        );
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}