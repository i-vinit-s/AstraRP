const api = require("./api.service");

async function approve(applicationId, reviewerId) {
  return api.patch(`/staff/applications/${applicationId}`, {
    reviewerId,
    status: "accepted",
  });
}

async function reject(applicationId, reviewerId, reason) {
  return api.patch(`/staff/applications/${applicationId}`, {
    reviewerId,
    status: "rejected",
    reason,
  });
}

module.exports = {
  approve,
  reject,
};
