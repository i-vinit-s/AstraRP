const ApplicationSubmission = require("../models/ApplicationSubmission");
const User = require("../models/User");

const asyncHandler = require("../utils/asyncHandler");
const botService = require("../services/bot.service");
const { getIO } = require("../socket");

/*
|--------------------------------------------------------------------------
| GET DASHBOARD STATS
|--------------------------------------------------------------------------
|
| GET /staff/dashboard
|
*/

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    pendingApplications,
    approvedToday,
    rejectedApplications,
    totalApplications,
  ] = await Promise.all([
    ApplicationSubmission.countDocuments({
      status: "pending",
    }),

    ApplicationSubmission.countDocuments({
      status: "accepted",
      "review.reviewedAt": {
        $gte: startOfToday,
      },
    }),

    ApplicationSubmission.countDocuments({
      status: "rejected",
    }),

    ApplicationSubmission.countDocuments(),
  ]);

  return res.status(200).json({
    success: true,

    stats: {
      pendingApplications,
      approvedToday,
      rejectedApplications,
      totalApplications,
    },
  });
});

/*
|--------------------------------------------------------------------------
| GET APPLICATION SUBMISSIONS
|--------------------------------------------------------------------------
|
| GET /staff/applications
|
| Supported query params:
|
| ?status=pending
| ?status=all
| ?application=whitelist
|
*/

exports.getApplications = asyncHandler(async (req, res) => {
  const {
    status = "pending",
    application,
    search = "",
    page = 1,
    limit = 10,
  } = req.query;

  const currentPage = Math.max(Number(page), 1);
  const pageSize = Math.max(Number(limit), 1);

  const skip = (currentPage - 1) * pageSize;

  const query = {};

  /*
   * Status
   */

  if (status && status !== "all") {
    const allowedStatuses = [
      "draft",
      "pending",
      "accepted",
      "rejected",
      "closed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    query.status = status;
  }

  /*
   * Application filter
   */

  if (application) {
    const Application = require("../models/Application");

    const applicationDefinition = await Application.findOne({
      slug: application.toLowerCase(),
    })
      .select("_id")
      .lean();

    if (!applicationDefinition) {
      return res.status(200).json({
        success: true,
        applications: [],
        pagination: {
          page: currentPage,
          limit: pageSize,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
      });
    }

    query.application = applicationDefinition._id;
  }

  /*
   * Search
   */

  if (search.trim()) {
    const User = require("../models/User");
    const Application = require("../models/Application");

    const regex = new RegExp(search.trim(), "i");

    const [users, applications] = await Promise.all([
      User.find({
        $or: [{ username: regex }, { globalName: regex }, { discordId: regex }],
      }).select("_id"),

      Application.find({
        $or: [{ title: regex }, { slug: regex }],
      }).select("_id"),
    ]);

    query.$or = [
      {
        user: {
          $in: users.map((u) => u._id),
        },
      },
      {
        application: {
          $in: applications.map((a) => a._id),
        },
      },
    ];
  }

  /*
   * Total
   */

  const total = await ApplicationSubmission.countDocuments(query);

  /*
   * Total Pages
   */

  const totalPages = Math.ceil(total / pageSize);

  /*
   * Applications
   */

  const applications = await ApplicationSubmission.find(query)
    .populate("user", "username globalName avatar discordId isWhitelisted")
    .populate(
      "application",
      "slug title description category icon badge enabled",
    )
    .sort({
      submittedAt: -1,
      createdAt: -1,
    })
    .skip(skip)
    .limit(pageSize)
    .lean();

  return res.status(200).json({
    success: true,

    applications,

    pagination: {
      page: currentPage,
      limit: pageSize,
      total,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
    },
  });
});

/*
|--------------------------------------------------------------------------
| GET SINGLE APPLICATION SUBMISSION
|--------------------------------------------------------------------------
|
| GET /staff/applications/:id
|
*/

exports.getApplication = asyncHandler(async (req, res) => {
  const ApplicationQuestion = require("../models/ApplicationQuestion");

  const application = await ApplicationSubmission.findById(req.params.id)
    .populate(
      "user",
      "username globalName avatar discordId isWhitelisted createdAt",
    )
    .populate(
      "application",
      "slug title description category icon badge enabled",
    )
    .populate("review.by", "username globalName avatar discordId")
    .lean();

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application submission not found.",
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Application Reference
  |--------------------------------------------------------------------------
  */

  if (!application.application) {
    console.error(
      `BROKEN APPLICATION REFERENCE: Submission ${application._id} has no valid application definition.`,
    );

    return res.status(409).json({
      success: false,
      message:
        "This submission references an application definition that no longer exists.",
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Load Questions
  |--------------------------------------------------------------------------
  */

  const questions = await ApplicationQuestion.find({
    application: application.application._id,
  })
    .select("id title description type order section")
    .sort({
      order: 1,
      createdAt: 1,
    })
    .lean();

  /*
  |--------------------------------------------------------------------------
  | Question Lookup
  |--------------------------------------------------------------------------
  */

  const questionMap = new Map(
    questions.map((question) => [question.id, question]),
  );

  /*
  |--------------------------------------------------------------------------
  | Attach Question Metadata To Answers
  |--------------------------------------------------------------------------
  */

  application.answers = (application.answers || []).map((answer) => {
    const question = questionMap.get(answer.questionId);

    return {
      ...answer,

      question: question
        ? {
            id: question.id,
            title: question.title,
            description: question.description || "",
            type: question.type,
          }
        : {
            id: answer.questionId,
            title: answer.questionId,
            description: "",
            type: "text",
          },
    };
  });

  return res.status(200).json({
    success: true,
    application,
  });
});

/*
|--------------------------------------------------------------------------
| REVIEW APPLICATION
|--------------------------------------------------------------------------
|
| PATCH /staff/applications/:id
|
| Body:
|
| {
|   "status": "accepted" | "rejected",
|   "reason": "..."
| }
|
*/

exports.reviewApplication = asyncHandler(async (req, res) => {
  const { status, reason = "" } = req.body;

  /*
   * Validate requested status.
   */

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be either accepted or rejected.",
    });
  }

  /*
   * Require rejection reason.
   *
   * Frontend also validates this, but backend validation is mandatory.
   */

  if (status === "rejected" && !reason.trim()) {
    return res.status(422).json({
      success: false,
      message: "A rejection reason is required.",
    });
  }

  /*
   * Load submission.
   */

  const application = await ApplicationSubmission.findById(req.params.id)
    .populate("user")
    .populate("application");

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application submission not found.",
    });
  }

  /*
   * Only pending applications can be reviewed.
   */

  if (application.status !== "pending") {
    return res.status(409).json({
      success: false,
      message: `This application has already been ${application.status}.`,
    });
  }

  /*
   * Save review.
   */

  application.status = status;

  application.review = {
    by: req.user._id,
    reason: reason.trim(),
    reviewedAt: new Date(),
  };

  /*
|--------------------------------------------------------------------------
| Reapplication Cooldown
|--------------------------------------------------------------------------
*/

  if (status === "rejected") {
    const cooldownDays =
      Number(application.application?.reapplyCooldownDays) || 0;

    if (cooldownDays > 0) {
      application.cooldownEnds = new Date(
        Date.now() + cooldownDays * 24 * 60 * 60 * 1000,
      );
    } else {
      application.cooldownEnds = null;
    }
  } else {
    application.cooldownEnds = null;
  }

  await application.save();

  /*
   * Whitelist-specific side effects.
   *
   * IMPORTANT:
   * Do not whitelist users when accepting another application type
   * such as EMS, police, business, etc.
   */

  const isWhitelistApplication = application.application?.slug === "whitelist";

  if (isWhitelistApplication) {
    await User.findByIdAndUpdate(application.user._id, {
      isWhitelisted: status === "accepted",

      applicationStatus: status === "accepted" ? "accepted" : "rejected",
    });
  }

  /*
   * Discord notification.
   *
   * Keep notification failures isolated. A Discord outage must not
   * undo or fail a successful database review.
   */

  try {
    if (status === "accepted") {
      await botService.applicationApproved(
        application.user.discordId,
        application.application?.title,
      );
    }

    if (status === "rejected") {
      await botService.applicationRejected(
        application.user.discordId,
        reason.trim(),
        application.application?.title,
      );
    }
  } catch (error) {
    console.error(
      "APPLICATION REVIEW DISCORD NOTIFICATION ERROR:",
      error.response?.data || error.message || error,
    );
  }

  /*
   * Real-time socket event.
   */

  try {
    const eventName =
      status === "accepted" ? "application:approved" : "application:rejected";

    getIO()
      .to("staff")
      .emit(eventName, {
        applicationId: application._id,

        application: {
          id: application.application?._id,
          slug: application.application?.slug,
          title: application.application?.title,
        },

        actor: {
          id: req.user._id,
          username: req.user.username,
          globalName: req.user.globalName,
        },

        target: {
          id: application.user._id,
          username: application.user.username,
          globalName: application.user.globalName,
        },

        status,

        reviewedAt: application.review.reviewedAt,
      });
  } catch (error) {
    console.error("APPLICATION REVIEW SOCKET ERROR:", error.message || error);
  }

  /*
   * Return updated submission.
   */

  const updatedApplication = await ApplicationSubmission.findById(
    application._id,
  )
    .populate("user", "username globalName avatar discordId isWhitelisted")
    .populate(
      "application",
      "slug title description category icon badge enabled",
    )
    .populate("review.by", "username globalName avatar discordId")
    .lean();

  return res.status(200).json({
    success: true,
    message:
      status === "accepted"
        ? "Application accepted successfully."
        : "Application rejected successfully.",
    application: updatedApplication,
  });
});
