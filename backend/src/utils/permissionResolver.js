const roles = require("../config/roles");

module.exports = function resolvePermissions(userRoles = []) {
  const permissions = new Set();

  for (const role of userRoles) {
    const perms = roles[role];

    if (!perms) continue;

    perms.forEach((perm) => permissions.add(perm));
  }

  return [...permissions];
};
