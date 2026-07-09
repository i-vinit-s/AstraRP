const P = require("./permissions");

module.exports = {
  [process.env.ADMIN_ROLE_ID]: ["*"],

  [process.env.MANAGEMENT_ROLE_ID]: [
    P.DASHBOARD_VIEW,
    P.APPLICATIONS_VIEW,
    P.APPLICATIONS_REVIEW,
  ],

  [process.env.MODERATOR_ROLE_ID]: [
    P.DASHBOARD_VIEW,
    P.APPLICATIONS_VIEW,
    P.APPLICATIONS_REVIEW,
  ],

  [process.env.SUPPORT_ROLE_ID]: [
    P.DASHBOARD_VIEW,
    P.APPLICATIONS_VIEW,
  ],
};