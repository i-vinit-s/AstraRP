const jwt = require("jsonwebtoken");
const User = require("../models/User");
const discordService = require("../services/bot.service");

/*
|--------------------------------------------------------------------------
| Helper: Attach Discord Roles
|--------------------------------------------------------------------------
*/

async function attachDiscordRoles(user) {
  try {
    const roles = await discordService.getMemberRoles(user.discordId);

    user.discordRoles = Array.isArray(roles) ? roles : [];
  } catch (error) {
    console.error("Discord role lookup failed:");
    console.error(error.response?.data || error.message);

    user.discordRoles = [];
  }

  return user;
}

/*
|--------------------------------------------------------------------------
| Protected Authentication
|--------------------------------------------------------------------------
|
| Use this middleware for routes that REQUIRE authentication.
|
| Example:
|
| router.get("/:slug/form", protect, getApplicationForm);
|
*/

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

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

    await attachDiscordRoles(user);

    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH ERROR:");
    console.error(error.response?.data || error.message || error);

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Optional Authentication
|--------------------------------------------------------------------------
|
| Use this middleware for public routes where authentication is optional.
|
| Logged out:
| req.user = null
|
| Logged in:
| req.user = User document
|
| An invalid/expired token does NOT block the public request.
|
*/

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      req.user = null;
      return next();
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      req.user = null;

      return next();
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      req.user = null;

      return next();
    }

    await attachDiscordRoles(user);

    req.user = user;

    return next();
  } catch (error) {
    console.error("OPTIONAL AUTH ERROR:");
    console.error(error.response?.data || error.message || error);

    /*
     * Since this is optional authentication,
     * don't block access to the public route.
     */

    req.user = null;

    return next();
  }
};

module.exports = {
  protect,
  optionalAuth,
};
