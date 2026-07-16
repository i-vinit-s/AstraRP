const express = require("express");

const {
  getDashboardStats,
  getApplications,
  getApplication,
  reviewApplication,
} = require("../controllers/staff.controller");

const {
  getApplicationDefinitions,
  getApplicationDefinition,
  createApplicationDefinition,
  updateApplicationDefinition,
  updateApplicationStatus,
  deleteApplicationDefinition,
} = require("../controllers/applicationManagement.controller");

const {
  getApplicationBuilder,

  createSection,
  updateSection,
  deleteSection,
  reorderSections,

  createQuestion,
  updateQuestion,
  deleteQuestion,
  reorderQuestions,

  reorderApplicationSections,
  reorderApplicationQuestions,
} = require("../controllers/applicationBuilder.controller");

const { protect } = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(protect);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  requirePermission("isStaff"),
  getDashboardStats,
);

/*
|--------------------------------------------------------------------------
| Applications
|--------------------------------------------------------------------------
*/

router.get("/applications", requirePermission("canViewApplications"), getApplications);

router.get("/applications/:id", requirePermission("canReviewApplications"), getApplication);

router.patch(
  "/applications/:id",
  requirePermission("canReviewApplications"),
  reviewApplication,
);

/*
|--------------------------------------------------------------------------
| Application Management
|--------------------------------------------------------------------------
*/

router.get(
  "/application-definitions",
  requirePermission("canManageApplications"),
  getApplicationDefinitions,
);

router.post(
  "/application-definitions",
  requirePermission("canManageApplications"),
  createApplicationDefinition,
);

router.get(
  "/application-definitions/:id",
  requirePermission("canManageApplications"),
  getApplicationDefinition,
);

router.patch(
  "/application-definitions/:id",
  requirePermission("canManageApplications"),
  updateApplicationDefinition,
);

router.delete(
  "/application-definitons/:id",
  requirePermission("canManageApplications"),
  deleteApplicationDefinition,
);

router.patch(
  "/application-definitions/:id/status",
  requirePermission("canManageApplications"),
  updateApplicationStatus,
);

/*
|--------------------------------------------------------------------------
| Application Builder
|--------------------------------------------------------------------------
*/

router.get(
  "/application-definitions/:id/builder",
  requirePermission("canManageApplications"),
  getApplicationBuilder,
);

/*
|--------------------------------------------------------------------------
| Sections
|--------------------------------------------------------------------------
*/

router.post(
  "/application-definitions/:id/sections",
  requirePermission("canManageApplications"),
  createSection,
);

router.patch(
  "/application-definitions/:id/sections/reorder",
  requirePermission("canManageApplications"),
  reorderSections,
);

router.patch(
  "/application-definitions/:id/sections/:sectionId",
  requirePermission("canManageApplications"),
  updateSection,
);

router.delete(
  "/application-definitions/:id/sections/:sectionId",
  requirePermission("canManageApplications"),
  deleteSection,
);

/*
|--------------------------------------------------------------------------
| Questions
|--------------------------------------------------------------------------
*/

router.post(
  "/application-definitions/:id/questions",
  requirePermission("canManageApplications"),
  createQuestion,
);

router.patch(
  "/application-definitions/:id/questions/reorder",
  requirePermission("canManageApplications"),
  reorderQuestions,
);

router.patch(
  "/application-definitions/:id/questions/:questionId",
  requirePermission("canManageApplications"),
  updateQuestion,
);

router.delete(
  "/application-definitions/:id/questions/:questionId",
  requirePermission("canManageApplications"),
  deleteQuestion,
);

router.patch(
  "/application-definitions/:id/sections/reorder",
  requirePermission("canManageApplications"),
  reorderApplicationSections,
);

router.patch(
  "/application-definitions/:id/questions/reorder",
  requirePermission("canManageApplications"),
  reorderApplicationQuestions,
);

module.exports = router;
