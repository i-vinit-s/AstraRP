module.exports = {
  [process.env.ADMIN_ROLE_ID]: {
    isStaff: true,
    canManageApplications: true,
  },

  [process.env.WHITELIST_RESPONSE_ROLE_ID]: {
    canViewApplications: true,
    canReviewApplications: true,
  },
};