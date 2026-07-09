const Application = require("../models/Application");
const ApplicationQuestion = require("../models/ApplicationQuestion");
const ApplicationSection = require("../models/ApplicationSection");
const ApplicationSubmission = require("../models/ApplicationSubmission");

/*
|--------------------------------------------------------------------------
| GET APPLICATION SUBMISSIONS
|--------------------------------------------------------------------------
|
| GET /applications/admin/submissions
|
| Query params:
| - status
| - application
| - page
| - limit
|
*/

exports.getSubmissions = async (req, res) => {
  try {
    const {
      status,
      application: applicationSlug,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (applicationSlug) {
      const application = await Application.findOne({
        slug: applicationSlug.toLowerCase(),
      }).select("_id");

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found.",
        });
      }

      query.application = application._id;
    }

    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (safePage - 1) * safeLimit;

    const [submissions, total] = await Promise.all([
      ApplicationSubmission.find(query)
        .populate({
          path: "user",
          select: "username displayName avatar discordId",
        })
        .populate({
          path: "application",
          select: "slug title category badge",
        })
        .sort({
          submittedAt: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(safeLimit)
        .lean(),

      ApplicationSubmission.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      submissions,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.ceil(total / safeLimit),
      },
    });
  } catch (error) {
    console.error("GET APPLICATION SUBMISSIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load application submissions.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE SUBMISSION
|--------------------------------------------------------------------------
|
| GET /applications/admin/submissions/:submissionId
|
*/

exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await ApplicationSubmission.findById(
      req.params.submissionId,
    )
      .populate({
        path: "user",
        select: "username displayName avatar discordId",
      })
      .populate({
        path: "application",
      })
      .lean();

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Application submission not found.",
      });
    }

    const [sections, questions] = await Promise.all([
      ApplicationSection.find({
        application: submission.application._id,
        enabled: true,
      })
        .sort({
          order: 1,
          createdAt: 1,
        })
        .lean(),

      ApplicationQuestion.find({
        application: submission.application._id,
        enabled: true,
      })
        .sort({
          section: 1,
          order: 1,
          createdAt: 1,
        })
        .lean(),
    ]);

    const answerMap = Object.fromEntries(
      (submission.answers || []).map((item) => [item.questionId, item.answer]),
    );

    const sectionsWithQuestions = sections.map((section) => ({
      ...section,

      questions: questions
        .filter((question) => String(question.section) === String(section._id))
        .map((question) => ({
          ...question,
          answer: answerMap[question.id] ?? null,
        })),
    }));

    return res.status(200).json({
      success: true,
      submission: {
        ...submission,
        sections: sectionsWithQuestions,
      },
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
| ACCEPT APPLICATION
|--------------------------------------------------------------------------
|
| PATCH /applications/admin/submissions/:submissionId/accept
|
*/

exports.acceptSubmission = async (req, res) => {
  try {
    const submission = await ApplicationSubmission.findById(
      req.params.submissionId,
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Application submission not found.",
      });
    }

    if (submission.status !== "pending") {
      return res.status(409).json({
        success: false,
        message: "Only pending applications can be accepted.",
      });
    }

    submission.status = "accepted";

    submission.review = {
      by: req.user._id,
      reason: req.body.reason?.trim() || "",
      reviewedAt: new Date(),
    };

    submission.cooldownEnds = null;

    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Application accepted successfully.",
      submission,
    });
  } catch (error) {
    console.error("ACCEPT APPLICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to accept application.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| REJECT APPLICATION
|--------------------------------------------------------------------------
|
| PATCH /applications/admin/submissions/:submissionId/reject
|
*/

exports.rejectSubmission = async (req, res) => {
  try {
    const submission = await ApplicationSubmission.findById(
      req.params.submissionId,
    ).populate("application");

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Application submission not found.",
      });
    }

    if (submission.status !== "pending") {
      return res.status(409).json({
        success: false,
        message: "Only pending applications can be rejected.",
      });
    }

    const reason = req.body.reason?.trim();

    if (!reason) {
      return res.status(422).json({
        success: false,
        message: "A rejection reason is required.",
      });
    }

    const cooldownDays =
      Number(submission.application?.reapplyCooldownDays) || 0;

    const cooldownEnds =
      cooldownDays > 0
        ? new Date(Date.now() + cooldownDays * 24 * 60 * 60 * 1000)
        : null;

    submission.status = "rejected";

    submission.review = {
      by: req.user._id,
      reason,
      reviewedAt: new Date(),
    };

    submission.cooldownEnds = cooldownEnds;

    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Application rejected successfully.",
      submission,
    });
  } catch (error) {
    console.error("REJECT APPLICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject application.",
    });
  }
};
