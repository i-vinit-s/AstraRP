const jwt = require("jsonwebtoken");
const User = require("../models/User");
const discordService = require("../services/bot.service");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    try {
      const roles = await discordService.getMemberRoles(user.discordId);
      req.user.discordRoles = roles;
    } catch (err) {
      console.error("Discord role lookup failed:");
      console.error(err.response?.data || err.message);

      req.user.discordRoles = [];
    }

    next();
  } catch (err) {
    console.error("AUTH ERROR:");
    console.error(err.response?.data || err.message || err);

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = { protect };