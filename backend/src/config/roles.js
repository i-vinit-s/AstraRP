const P = require("./permissions");

module.exports = {
  [process.env.ADMIN_ROLE_ID]: ["*"],

  [process.env.MANAGEMENT_ROLE_ID]: [
    P.DASHBOARD_VIEW,
    P.ACTIVITY_VIEW,
    P.ANNOUNCEMENTS_VIEW,

    P.USERS_VIEW,
    P.USERS_EDIT,

    P.WHITELIST_VIEW,
    P.WHITELIST_REVIEW,

    P.SETTINGS_VIEW,
    P.SETTINGS_EDIT,
  ],

  [process.env.MODERATOR_ROLE_ID]: [
    P.DASHBOARD_VIEW,

    P.ACTIVITY_VIEW,

    P.USERS_VIEW,

    P.WHITELIST_VIEW,
    P.WHITELIST_REVIEW,
  ],

  [process.env.SUPPORT_ROLE_ID]: [P.DASHBOARD_VIEW, P.WHITELIST_VIEW],
};
