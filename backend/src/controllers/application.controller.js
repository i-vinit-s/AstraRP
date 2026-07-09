const Application = require("../models/Application");
const ApplicationQuestion = require("../models/ApplicationQuestion");
const ApplicationSubmission = require("../models/ApplicationSubmission");

exports.getQuestions = async (req, res) => {
  try {
    const application = await Application.findOne({
      slug: req.params.slug,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const questions = await ApplicationQuestion.find({
      application: application._id,
      enabled: true,
    }).sort({
      section: 1,
      order: 1,
    });

    res.json({
      success: true,
      application,
      questions,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.saveDraft = async (req, res) => {
  try {
    const application = await Application.findOne({
      slug: req.params.slug,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
      });
    }

    let submission = await ApplicationSubmission.findOne({
      user: req.user._id,
      application: application._id,
    });

    if (!submission) {
      submission = await ApplicationSubmission.create({
        user: req.user._id,
        application: application._id,
        applicationSlug: application.slug,
      });
    }

    submission.answers = req.body.answers;

    await submission.save();

    res.json({
      success: true,
      submission,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
    });
  }
};

exports.getSubmission = async (req, res) => {
  const application = await Application.findOne({
    slug: req.params.slug,
  });

  const submission = await ApplicationSubmission.findOne({
    user: req.user._id,
    application: application._id,
  });

  res.json({
    success: true,
    submission,
  });
};

exports.submit = async (req, res) => {
  const application = await Application.findOne({
    slug: req.params.slug,
  });

  const submission = await ApplicationSubmission.findOne({
    user: req.user._id,
    application: application._id,
  });

  if (!submission) {
    return res.status(404).json({
      success: false,
    });
  }

  submission.status = "pending";
  submission.submittedAt = new Date();

  await submission.save();

  res.json({
    success: true,
  });
};