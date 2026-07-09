const express = require("express");

const router = express.Router();

const { protect, optionalAuth } = require("../middleware/auth");

const requirePermission = require("../middleware/requirePermission");
const PERMISSIONS = require("../config/permissions");

const {
  getApplications,
  getApplicationBySlug,
} = require("../controllers/applicationCatalog.controller");

const {
  getApplicationForm,
} = require("../controllers/applicationForm.controller");

const {
  getSubmission,
  getSubmissionHistory,
  createNewApplication,
  saveDraft,
  submitApplication,
} = require("../controllers/applicationSubmission.controller");

/*
|--------------------------------------------------------------------------
| Public Catalog Routes
|--------------------------------------------------------------------------
|
| These routes work for both logged-in and logged-out users.
|
*/

router.get("/", optionalAuth, getApplications);

/*
|--------------------------------------------------------------------------
| Protected Application Form
|--------------------------------------------------------------------------
*/

router.get("/:slug/form", protect, getApplicationForm);

/*
|--------------------------------------------------------------------------
| Protected Application Submissions
|--------------------------------------------------------------------------
*/

router.get("/:slug/submission", protect, getSubmission);

router.get("/:slug/history", protect, getSubmissionHistory);

router.post("/:slug/new", protect, createNewApplication);

router.post("/:slug/draft", protect, saveDraft);

router.post("/:slug/submit", protect, submitApplication);

/*
|--------------------------------------------------------------------------
| Single Application Metadata
|--------------------------------------------------------------------------
|
| Keep this last so specific /:slug/... routes are matched first.
|
*/

router.get("/:slug", optionalAuth, getApplicationBySlug);

module.exports = router;
