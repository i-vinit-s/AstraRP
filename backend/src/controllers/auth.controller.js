const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");
const sendToken = require("../utils/sendToken");
const generateToken = require("../utils/generateToken");
const resolvePermissions = require("../utils/permissionResolver");

exports.getMe = asyncHandler(async (req, res) => {
  const user = req.user.toObject();

  const permissions = resolvePermissions(req.user.roles);

  res.json({
    success: true,
    user: {
      ...req.user.toObject(),
      permissions,
      canAccessStaffDashboard:
        permissions.includes("*") || permissions.includes("dashboard.view"),
    },
  });
});

exports.logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

exports.discordLogin = asyncHandler(async (req, res) => {
  const url = authService.getDiscordLoginUrl();

  res.redirect(url);
});

exports.discordCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Authorization code missing.",
    });
  }

  const accessToken = await authService.exchangeCodeForToken(code);
  const discordUser = await authService.getDiscordUser(accessToken);
  const user = await authService.findOrCreateUser(discordUser);

  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect(process.env.CLIENT_URL);
});
