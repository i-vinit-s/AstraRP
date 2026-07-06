const { getIO } = require("../socket");
const asyncHandler = require("../utils/asyncHandler");
const Application = require("../models/Application");
const questions = require("../config/whitelistQuestions");
const validateApplication = require("../validators/application.validator");
const activityService = require("../services/activity.service");
const { canCreateNewApplication } = require("../utils/applicationCooldown");

exports.getQuestions = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    questions: questions.map((q) => ({
      ...q,
      title: q.title,
      description: q.description || "",
      placeholder: q.placeholder || "",
      category: q.category || "Whitelist",
    })),
  });
});

exports.getMyApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    user: req.user._id,
  }).sort({
    createdAt: -1,
  });

  const mappedAnswers = {};

  const result = canCreateNewApplication(application);

  application?.answers.forEach((item) => {
    mappedAnswers[item.questionId] = item.answer;
  });

  res.json({
    success: true,
    application: application
      ? {
          ...application.toObject(),
          answers: mappedAnswers,
        }
      : null,
    canReapply: result.allowed,
    cooldownEnds: result.cooldownEnds ?? null,
  });
});

exports.saveApplication = asyncHandler(async (req, res) => {
  const { answers } = req.body;

  let formattedAnswers = answers;

  if (!Array.isArray(answers)) {
    formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));
  }

  if (!Array.isArray(answers)) {
    return res.status(400).json({
      success: false,
      message: "Answers must be an array.",
    });
  }

  let application = await Application.findOne({
    user: req.user._id,
    status: "draft",
  });

  if (!application) {
    const count = await Application.countDocuments({
      user: req.user._id,
    });

    application = await Application.create({
      user: req.user._id,
      applicationNumber: count + 1,
      status: "draft",
      answers: formattedAnswers,
    });
  } else {
    application.answers = formattedAnswers;

    await application.save();
  }

  res.status(200).json({
    success: true,
    application,
  });
});

exports.submitApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    user: req.user._id,
    status: "draft",
  }).sort({
    createdAt: -1,
  });

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application not found.",
    });
  }

  if (application.status !== "draft") {
    return res.status(400).json({
      success: false,
      message: "Application already submitted.",
    });
  }

  const validation = validateApplication(application.answers);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      errors: validation.errors,
    });
  }

  application.status = "pending";
  application.submittedAt = new Date();

  await application.save();

  getIO()
    .to("staff")
    .emit("application:new", {
      applicationId: application._id,

      user: {
        username: req.user.username,
        globalName: req.user.globalName,
      },
    });

  await activityService.createActivity({
    type: "application_submitted",
    actor: req.user._id,
    target: req.user._id,
    application: application._id,
  });

  res.json({
    success: true,
    message: "Application submitted successfully.",
    application,
  });
});

exports.createNewApplication = asyncHandler(async (req, res) => {
  const latest = await Application.findOne({
    user: req.user._id,
  }).sort({
    createdAt: -1,
  });

  const { canCreateNewApplication } = require("../utils/applicationCooldown");

  const result = canCreateNewApplication(latest);

  if (!result.allowed) {
    return res.status(400).json({
      success: false,
      message: result.reason,
      cooldownEnds: result.cooldownEnds,
    });
  }

  const count = await Application.countDocuments({
    user: req.user._id,
  });

  const application = await Application.create({
    user: req.user._id,
    applicationNumber: count + 1,
    status: "draft",
    answers: [],
  });

  res.status(201).json({
    success: true,
    application,
  });
});
