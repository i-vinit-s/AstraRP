const Application = require("../models/Application");
const ApplicationSubmission = require("../models/ApplicationSubmission");
const ApplicationQuestion = require("../models/ApplicationQuestion");

async function getApplication(slug) {
  return Application.findOne({
    slug,
    enabled: true,
  });
}

async function getQuestions(applicationId) {
  return ApplicationQuestion.find({
    application: applicationId,
    enabled: true,
  })
    .sort({
      section: 1,
      order: 1,
    })
    .lean();
}

async function getSubmission(userId, applicationId) {
  return ApplicationSubmission.findOne({
    user: userId,
    application: applicationId,
  });
}

async function createSubmission(userId, application) {
  return ApplicationSubmission.create({
    user: userId,
    application: application._id,
    applicationSlug: application.slug,
  });
}

module.exports = {
  getApplication,
  getQuestions,
  getSubmission,
  createSubmission,
};
