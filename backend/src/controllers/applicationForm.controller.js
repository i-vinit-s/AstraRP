const Application = require("../models/Application");
const ApplicationSection = require("../models/ApplicationSection");
const ApplicationQuestion = require("../models/ApplicationQuestion");
const ApplicationSubmission = require("../models/ApplicationSubmission");

const {
  getApplicationAccess,
} = require("../utils/applicationPermissions");

/*
|--------------------------------------------------------------------------
| GET APPLICATION FORM
|--------------------------------------------------------------------------
|
| GET /applications/:slug/form
|
*/

exports.getApplicationForm = async (req, res) => {
  try {
    /*
     * Find application.
     */

    const application = await Application.findOne({
      slug: req.params.slug,
    }).lean();

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
     * Check application access requirements.
     */

    const access = await getApplicationAccess(req.user, application);

    const viewableActions = [
      "apply",
      "continue",
      "pending",
      "accepted",
      "result",
      "rejected",
      "reapply",
    ];

    if (!access.accessible && !viewableActions.includes(access.action)) {
      return res.status(403).json({
        success: false,
        message: access.lockReason || "You cannot access this application.",
        access,
      });
    }

    /*
     * Load sections and questions.
     */

    const sections = await ApplicationSection.find({
      application: application._id,
      enabled: true,
    })
      .sort({
        order: 1,
        createdAt: 1,
      })
      .lean();

    const questions = await ApplicationQuestion.find({
      application: application._id,
      enabled: true,
    })
      .sort({
        section: 1,
        order: 1,
        createdAt: 1,
      })
      .lean();

    /*
     * Attach questions to their sections.
     */

    const sectionsWithQuestions = sections.map((section) => ({
      ...section,

      questions: questions.filter(
        (question) => String(question.section) === String(section._id),
      ),
    }));

    /*
     * Questions without a valid section are preserved under General.
     *
     * This prevents a misconfigured question from silently disappearing
     * from the application form.
     */

    const sectionIds = new Set(sections.map((section) => String(section._id)));

    const unsectionedQuestions = questions.filter(
      (question) =>
        !question.section || !sectionIds.has(String(question.section)),
    );

    if (unsectionedQuestions.length > 0) {
      sectionsWithQuestions.push({
        _id: "general",
        title: "General",
        order: Number.MAX_SAFE_INTEGER,
        questions: unsectionedQuestions,
      });
    }

    /*
     * Load latest submission attempt.
     *
     * Sorting by attempt descending is critical because users may have
     * multiple historical attempts after rejection and reapplication.
     */

    const submission = await ApplicationSubmission.findOne({
      user: req.user._id,
      application: application._id,
    })
      .sort({
        attempt: -1,
        createdAt: -1,
      })
      .lean();

    /*
     * Reapplication state.
     */

    let canReapply = false;
    let cooldownEnds = null;

    if (submission?.status === "rejected") {
      cooldownEnds = submission.cooldownEnds || null;

      canReapply =
        !cooldownEnds || new Date(cooldownEnds).getTime() <= Date.now();
    }

    return res.status(200).json({
      success: true,
      application,
      access: {
        ...access,
        canReapply,
        cooldownEnds,
      },
      sections: sectionsWithQuestions,
      questions,
      submission,
      canReapply,
      cooldownEnds,
    });
  } catch (error) {
    console.error("GET APPLICATION FORM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load application form.",
    });
  }
};
