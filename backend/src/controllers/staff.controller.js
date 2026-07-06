const { getIO } = require("../socket");
const User = require("../models/User");
const Application = require("../models/Application");
const asyncHandler = require("../utils/asyncHandler");
const botService = require("../services/bot.service");
const Activity = require("../models/Activity");
const activityService = require("../services/activity.service");

exports.getApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({
    status: "pending",
  })
    .populate("user", "username globalName avatar discordId")
    .sort({
      submittedAt: 1,
    });

  res.json({
    success: true,
    count: applications.length,
    applications,
  });
});

exports.getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate("user")
    .populate("reviewedBy", "username globalName");

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application not found.",
    });
  }

  res.json({
    success: true,
    application,
  });
});

exports.reviewApplication = asyncHandler(async (req, res) => {
  const { status, reason } = req.body;

  const allowed = ["accepted", "rejected"];

  if (!allowed.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status.",
    });
  }

  const application = await Application.findById(req.params.id).populate(
    "user",
  );

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application not found.",
    });
  }

  application.status = status;
  application.reviewReason = reason || "";
  application.reviewedAt = new Date();
  application.reviewedBy = req.user._id;

  if (status === "accepted") {
    await User.findByIdAndUpdate(application.user._id, {
      isWhitelisted: true,
      whitelistedAt: new Date(),
    });

    await activityService.createActivity({
      type: "application_approved",
      actor: req.user._id,
      target: application.user._id,
      application: application._id,
    });

    getIO()
      .to("staff")
      .emit("application:approved", {
        applicationId: application._id,

        actor: {
          username: req.user.username,
          globalName: req.user.globalName,
        },

        target: {
          username: application.user.username,
          globalName: application.user.globalName,
        },
      });
  }

  if (status === "rejected") {
    await User.findByIdAndUpdate(application.user._id, {
      isWhitelisted: false,
    });

    await activityService.createActivity({
      type: "application_rejected",
      actor: req.user._id,
      target: application.user._id,
      application: application._id,
    });

    getIO()
      .to("staff")
      .emit("application:rejected", {
        applicationId: application._id,

        actor: {
          username: req.user.username,
          globalName: req.user.globalName,
        },

        target: {
          username: application.user.username,
          globalName: application.user.globalName,
        },
      });
  }
  await application.save();

  try {
    if (status === "accepted") {
      await botService.applicationApproved(application.user.discordId);
    }

    if (status === "rejected") {
      await botService.applicationRejected(application.user.discordId, reason);
    }
  } catch (error) {
    console.error("Error sending Discord notification:", error);
  }

  res.json({
    success: true,
    application,
  });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select(
      "username globalName avatar discordId isWhitelisted whitelistedAt createdAt",
    )
    .sort({
      createdAt: -1,
    });

  res.json({
    success: true,
    count: users.length,
    users,
  });
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const application = await Application.findOne({
    user: user._id,
  })
    .sort({ createdAt: -1 })
    .select("_id status submittedAt reviewedAt reviewReason");

  res.json({
    success: true,
    user,
    application,
  });
});

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    pendingApplications,
    approvedToday,
    totalUsers,
    totalApplications,
    recentActivity,
  ] = await Promise.all([
    Application.countDocuments({ status: "pending" }),

    Application.countDocuments({
      status: "accepted",
      reviewedAt: { $gte: startOfToday },
    }),

    User.countDocuments(),

    Application.countDocuments(),

    Activity.find()
      .populate("actor", "username globalName avatar")
      .populate("target", "username globalName avatar")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
  ]);

  res.json({
    success: true,
    stats: {
      pendingApplications,
      approvedToday,
      totalUsers,
      totalApplications,
    },
    recentActivity,
  });
});

exports.getRecentActivity = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const skip = (page - 1) * limit;

  const [activity, total] = await Promise.all([
    Activity.find()
      .populate("actor", "username globalName avatar")
      .populate("target", "username globalName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Activity.countDocuments(),
  ]);

  res.json({
    success: true,
    activity,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrevious: page > 1,
    },
  });
});