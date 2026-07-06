const resolvePermissions = require("../utils/permissionResolver");

module.exports = (permission) => {
  return (req, res, next) => {
    const permissions = resolvePermissions(req.user.discordRoles);

    if (permissions.includes("*") || permissions.includes(permission)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "You do not have permission.",
    });
  };
};
