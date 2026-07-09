const Application = require("../models/Application");
const ApplicationQuestion = require("../models/ApplicationQuestion");
const ApplicationSubmission = require("../models/ApplicationSubmission");

const { getApplicationAccess } = require("../utils/applicationPermissions");

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function normalizeAnswers(answers = []) {
  if (!Array.isArray(answers)) {
    return [];
  }

  return answers
    .filter(
      (item) =>
        item && typeof item.questionId === "string" && item.questionId.trim(),
    )
    .map((item) => ({
      questionId: item.questionId.trim(),
      answer: item.answer,
    }));
}

function isEmptyAnswer(answer) {
  if (answer === undefined || answer === null) {
    return true;
  }

  if (typeof answer === "string") {
    return answer.trim() === "";
  }

  if (Array.isArray(answer)) {
    return answer.length === 0;
  }

  return false;
}

function validateAnswer(question, answer) {
  const errors = [];
  const validation = question.validation || {};

  if (validation.required && isEmptyAnswer(answer)) {
    errors.push("This field is required.");
    return errors;
  }

  if (isEmptyAnswer(answer)) {
    return errors;
  }

  /*
   * String validation
   */

  if (typeof answer === "string") {
    const trimmedAnswer = answer.trim();

    if (
      validation.minLength != null &&
      trimmedAnswer.length < validation.minLength
    ) {
      errors.push(`Minimum ${validation.minLength} characters required.`);
    }

    if (validation.maxLength != null && answer.length > validation.maxLength) {
      errors.push(`Maximum ${validation.maxLength} characters allowed.`);
    }

    if (validation.regex) {
      try {
        const regex = new RegExp(validation.regex);

        if (!regex.test(answer)) {
          errors.push("Invalid answer format.");
        }
      } catch (error) {
        console.error(
          `Invalid regex for question ${question.id}:`,
          error.message,
        );
      }
    }
  }

  /*
   * Number validation
   */

  if (question.type === "number") {
    const number = Number(answer);

    if (Number.isNaN(number)) {
      errors.push("A valid number is required.");
      return errors;
    }

    if (validation.min != null && number < validation.min) {
      errors.push(`Minimum allowed value is ${validation.min}.`);
    }

    if (validation.max != null && number > validation.max) {
      errors.push(`Maximum allowed value is ${validation.max}.`);
    }
  }

  /*
   * Select / Radio validation
   */

  if (
    ["select", "radio"].includes(question.type) &&
    Array.isArray(question.options)
  ) {
    const allowedValues = question.options.map((option) => option.value);

    if (!allowedValues.includes(answer)) {
      errors.push("Invalid option selected.");
    }
  }

  /*
   * Checkbox validation
   */

  if (question.type === "checkbox") {
    if (!Array.isArray(answer)) {
      errors.push("Invalid checkbox answer.");
      return errors;
    }

    const allowedValues = (question.options || []).map(
      (option) => option.value,
    );

    const invalidOption = answer.some(
      (value) => !allowedValues.includes(value),
    );

    if (invalidOption) {
      errors.push("One or more selected options are invalid.");
    }
  }

  return errors;
}

async function findApplication(slug) {
  return Application.findOne({
    slug: slug.toLowerCase(),
  });
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

async function getNextAttemptNumber(userId, applicationId) {
  const latestSubmission = await ApplicationSubmission.findOne({
    user: userId,
    application: applicationId,
  })
    .sort({
      attempt: -1,
    })
    .select("attempt")
    .lean();

  return (latestSubmission?.attempt || 0) + 1;
}

/*
|--------------------------------------------------------------------------
| GET CURRENT SUBMISSION
|--------------------------------------------------------------------------
|
| GET /applications/:slug/submission
|
*/

exports.getSubmission = async (req, res) => {
  try {
    const application = await findApplication(req.params.slug);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const submission = await getLatestSubmission(req.user._id, application._id);

    return res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error("GET APPLICATION SUBMISSION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load application submission.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET SUBMISSION HISTORY
|--------------------------------------------------------------------------
|
| GET /applications/:slug/history
|
*/

exports.getSubmissionHistory = async (req, res) => {
  try {
    const application = await findApplication(req.params.slug);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const submissions = await ApplicationSubmission.find({
      user: req.user._id,
      application: application._id,
    })
      .sort({
        attempt: -1,
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      totalAttempts: submissions.length,
      submissions,
    });
  } catch (error) {
    console.error("GET SUBMISSION HISTORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load submission history.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| CREATE NEW APPLICATION ATTEMPT
|--------------------------------------------------------------------------
|
| POST /applications/:slug/new
|
*/

exports.createNewApplication = async (req, res) => {
  try {
    const application = await findApplication(req.params.slug);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    /*
     * Application must be enabled.
     */

    if (!application.enabled) {
      return res.status(403).json({
        success: false,
        message: "This application is currently unavailable.",
      });
    }

    /*
     * Check general application access requirements.
     */

    const access = await getApplicationAccess(req.user, application);

    if (!access.accessible && access.action !== "reapply") {
      return res.status(403).json({
        success: false,
        message: access.lockReason || "You cannot access this application.",
        access,
      });
    }

    /*
     * Get latest submission.
     */

    const latestSubmission = await getLatestSubmission(
      req.user._id,
      application._id,
    );

    if (!latestSubmission) {
      return res.status(404).json({
        success: false,
        message:
          "No previous application attempt was found. Start the application normally instead.",
      });
    }

    /*
     * Only rejected applications can create a new attempt.
     */

    if (latestSubmission.status !== "rejected") {
      return res.status(409).json({
        success: false,
        message:
          "A new attempt can only be created after an application has been rejected.",
      });
    }

    /*
     * Enforce reapplication cooldown.
     */

    if (
      latestSubmission.cooldownEnds &&
      latestSubmission.cooldownEnds.getTime() > Date.now()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are currently on a reapplication cooldown.",
        cooldownEnds: latestSubmission.cooldownEnds,
      });
    }

    /*
     * Maximum attempts.
     *
     * 0 means unlimited.
     */

    const attemptCount = await ApplicationSubmission.countDocuments({
      user: req.user._id,
      application: application._id,
    });

    if (
      application.maxAttempts > 0 &&
      attemptCount >= application.maxAttempts
    ) {
      return res.status(403).json({
        success: false,
        message: `You have reached the maximum of ${application.maxAttempts} attempts for this application.`,
      });
    }

    /*
     * Category exclusivity.
     */

    if (application.categoryExclusive) {
      const categoryConflict = await ApplicationSubmission.findOne({
        user: req.user._id,

        category: application.category,

        application: {
          $ne: application._id,
        },

        status: {
          $in: ["draft", "pending", "accepted"],
        },
      }).populate("application", "title slug");

      if (categoryConflict) {
        return res.status(409).json({
          success: false,
          message: `You already have an active application in the "${application.category}" category.`,

          conflict: {
            applicationId: categoryConflict.application?._id || null,

            title:
              categoryConflict.application?.title || "Another application",

            slug: categoryConflict.application?.slug || null,

            status: categoryConflict.status,
          },
        });
      }
    }

    /*
     * Create next attempt.
     */

    const nextAttempt = await getNextAttemptNumber(
      req.user._id,
      application._id,
    );

    const submission = await ApplicationSubmission.create({
      user: req.user._id,

      application: application._id,

      category: application.category,

      attempt: nextAttempt,

      status: "draft",

      answers: [],
    });

    return res.status(201).json({
      success: true,
      message: "New application attempt created successfully.",
      submission,
    });
  } catch (error) {
    console.error("CREATE NEW APPLICATION ERROR:", error);

    // if (error?.code === 11000) {
    //   return res.status(409).json({
    //     success: false,
    //     message:
    //       "A submission attempt already exists. Please refresh and try again.",
    //   });
    // }
    if (error?.code === 11000) {
      console.error("DUPLICATE KEY ERROR:", error);

      return res.status(409).json({
        success: false,
        message: "Duplicate submission index error.",
        keyPattern: error.keyPattern,
        keyValue: error.keyValue,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create a new application attempt.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| SAVE DRAFT
|--------------------------------------------------------------------------
|
| POST /applications/:slug/draft
|
*/

exports.saveDraft = async (req, res) => {
  try {
    const application = await findApplication(req.params.slug);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    /*
     * Check general application access.
     */

    const access = await getApplicationAccess(req.user, application);

    if (!access.accessible || !["apply", "continue"].includes(access.action)) {
      return res.status(403).json({
        success: false,
        message: access.lockReason || "You cannot edit this application.",
        access,
      });
    }

    const answers = normalizeAnswers(req.body.answers);

    /*
     * Only allow answers belonging to real enabled questions.
     */

    const questions = await ApplicationQuestion.find({
      application: application._id,
      enabled: true,
    })
      .select("id")
      .lean();

    const validQuestionIds = new Set(questions.map((question) => question.id));

    const safeAnswers = answers.filter((item) =>
      validQuestionIds.has(item.questionId),
    );

    /*
     * Find latest submission.
     */

    let submission = await getLatestSubmission(req.user._id, application._id);

    /*
     * Continue existing draft.
     */

    if (submission?.status === "draft") {
      submission.answers = safeAnswers;

      await submission.save();

      return res.status(200).json({
        success: true,
        message: "Draft saved successfully.",
        submission,
      });
    }

    /*
     * If another active submission exists, don't create another.
     */

    if (submission && ["pending", "accepted"].includes(submission.status)) {
      return res.status(409).json({
        success: false,
        message: "You already have an active submission for this application.",
      });
    }

    /*
     * Rejected application cooldown.
     */

    if (
      submission?.status === "rejected" &&
      submission.cooldownEnds &&
      submission.cooldownEnds.getTime() > Date.now()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are currently on a reapplication cooldown.",
        cooldownEnds: submission.cooldownEnds,
      });
    }

    /*
     * Maximum attempts.
     *
     * 0 means unlimited.
     */

    const attemptCount = await ApplicationSubmission.countDocuments({
      user: req.user._id,
      application: application._id,
    });

    if (
      application.maxAttempts > 0 &&
      attemptCount >= application.maxAttempts
    ) {
      return res.status(403).json({
        success: false,
        message: `You have reached the maximum of ${application.maxAttempts} attempts for this application.`,
      });
    }

    /*
     * Category exclusivity.
     *
     * Only blocks active submissions from another application
     * in the same category.
     *
     * It does NOT block applications from other categories.
     */

    if (application.categoryExclusive) {
      const categoryConflict = await ApplicationSubmission.findOne({
        user: req.user._id,
        category: application.category,

        application: {
          $ne: application._id,
        },

        status: {
          $in: ["draft", "pending", "accepted"],
        },
      }).populate("application", "title slug");

      if (categoryConflict) {
        return res.status(409).json({
          success: false,
          message: `You already have an active application in the "${application.category}" category.`,
          conflict: {
            applicationId: categoryConflict.application?._id || null,

            title: categoryConflict.application?.title || "Another application",

            slug: categoryConflict.application?.slug || null,

            status: categoryConflict.status,
          },
        });
      }
    }

    /*
     * Create new attempt.
     */

    const nextAttempt = await getNextAttemptNumber(
      req.user._id,
      application._id,
    );

    submission = await ApplicationSubmission.create({
      user: req.user._id,

      application: application._id,

      category: application.category,

      attempt: nextAttempt,

      status: "draft",

      answers: safeAnswers,
    });

    return res.status(201).json({
      success: true,
      message: "New application draft created.",
      submission,
    });
  } catch (error) {
    console.error("SAVE APPLICATION DRAFT ERROR:", error);

    // if (error?.code === 11000) {
    //   return res.status(409).json({
    //     success: false,
    //     message:
    //       "A submission attempt already exists. Please refresh and try again.",
    //   });
    // }

    if (error?.code === 11000) {
      console.error("DUPLICATE KEY ERROR:", error);

      return res.status(409).json({
        success: false,
        message: "Duplicate submission index error.",
        keyPattern: error.keyPattern,
        keyValue: error.keyValue,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to save application draft.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| SUBMIT APPLICATION
|--------------------------------------------------------------------------
|
| POST /applications/:slug/submit
|
*/

exports.submitApplication = async (req, res) => {
  try {
    const application = await findApplication(req.params.slug);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (!application.enabled) {
      return res.status(403).json({
        success: false,
        message: "This application is currently unavailable.",
      });
    }

    const submission = await getLatestSubmission(req.user._id, application._id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message:
          "No application draft was found. Save your application before submitting.",
      });
    }

    if (submission.status !== "draft") {
      return res.status(409).json({
        success: false,
        message: "Only draft applications can be submitted.",
      });
    }

    /*
     * Load questions.
     */

    const questions = await ApplicationQuestion.find({
      application: application._id,
      enabled: true,
    })
      .sort({
        order: 1,
        createdAt: 1,
      })
      .lean();

    /*
     * Create answer lookup map.
     */

    const answerMap = new Map(
      submission.answers.map((item) => [item.questionId, item.answer]),
    );

    /*
     * Server-side validation.
     */

    const validationErrors = {};

    for (const question of questions) {
      const answer = answerMap.get(question.id);

      const errors = validateAnswer(question, answer);

      if (errors.length > 0) {
        validationErrors[question.id] = errors;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      return res.status(422).json({
        success: false,
        message:
          "Please complete all required fields correctly before submitting.",
        errors: validationErrors,
      });
    }

    /*
     * Final category conflict check.
     *
     * This protects against another submission being created
     * between draft creation and final submission.
     */

    if (application.categoryExclusive) {
      const categoryConflict = await ApplicationSubmission.findOne({
        user: req.user._id,

        category: application.category,

        application: {
          $ne: application._id,
        },

        status: {
          $in: ["draft", "pending", "accepted"],
        },
      });

      if (categoryConflict) {
        return res.status(409).json({
          success: false,
          message: `You already have another active application in the "${application.category}" category.`,
        });
      }
    }

    /*
     * Submit application.
     */

    submission.status = "pending";
    submission.submittedAt = new Date();

    submission.review = null;
    submission.cooldownEnds = null;

    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Application submitted successfully.",
      submission,
    });
  } catch (error) {
    console.error("SUBMIT APPLICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit application.",
    });
  }
};
