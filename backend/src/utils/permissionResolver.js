const roles = require("../config/roles");

module.exports = function resolvePermissions(userRoles = []) {
  const resolved = {
    isStaff: false,
    canViewApplications: false,
    canReviewApplications: false,
    canManageApplications: false,
  };

  for (const role of userRoles) {
    const permissions = roles[role];

    if (!permissions) continue;

    Object.entries(permissions).forEach(([key, value]) => {
      if (value) {
        resolved[key] = true;
      }
    });
  }

  return resolved;
};
