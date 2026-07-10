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
const PERMISSIONS = require("../config/permissions");

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
  requirePermission(PERMISSIONS.DASHBOARD_VIEW),
  getDashboardStats,
);

/*
|--------------------------------------------------------------------------
| Applications
|--------------------------------------------------------------------------
*/

router.get(
  "/applications",
  requirePermission(PERMISSIONS.APPLICATIONS_VIEW),
  getApplications,
);

router.get(
  "/applications/:id",
  requirePermission(PERMISSIONS.APPLICATIONS_VIEW),
  getApplication,
);

router.patch(
  "/applications/:id",
  requirePermission(PERMISSIONS.APPLICATIONS_REVIEW),
  reviewApplication,
);

/*
|--------------------------------------------------------------------------
| Application Management
|--------------------------------------------------------------------------
*/

router.get(
  "/application-definitions",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_VIEW),
  getApplicationDefinitions,
);

router.post(
  "/application-definitions",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_CREATE),
  createApplicationDefinition,
);

router.get(
  "/application-definitions/:id",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_VIEW),
  getApplicationDefinition,
);

router.patch(
  "/application-definitions/:id",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_EDIT),
  updateApplicationDefinition,
);

router.delete(
  "/application-definitons/:id",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_EDIT),
  deleteApplicationDefinition,
);

router.patch(
  "/application-definitions/:id/status",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_STATUS),
  updateApplicationStatus,
);

/*
|--------------------------------------------------------------------------
| Application Builder
|--------------------------------------------------------------------------
*/

router.get(
  "/application-definitions/:id/builder",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_VIEW),
  getApplicationBuilder,
);

/*
|--------------------------------------------------------------------------
| Sections
|--------------------------------------------------------------------------
*/

router.post(
  "/application-definitions/:id/sections",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_EDIT),
  createSection,
);

router.patch(
  "/application-definitions/:id/sections/reorder",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_EDIT),
  reorderSections,
);

router.patch(
  "/application-definitions/:id/sections/:sectionId",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_EDIT),
  updateSection,
);

router.delete(
  "/application-definitions/:id/sections/:sectionId",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_EDIT),
  deleteSection,
);

/*
|--------------------------------------------------------------------------
| Questions
|--------------------------------------------------------------------------
*/

router.post(
  "/application-definitions/:id/questions",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_EDIT),
  createQuestion,
);

router.patch(
  "/application-definitions/:id/questions/reorder",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_EDIT),
  reorderQuestions,
);

router.patch(
  "/application-definitions/:id/questions/:questionId",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_EDIT),
  updateQuestion,
);

router.delete(
  "/application-definitions/:id/questions/:questionId",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_EDIT),
  deleteQuestion,
);

router.patch(
  "/application-definitions/:id/sections/reorder",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_EDIT),
  reorderApplicationSections,
);

router.patch(
  "/application-definitions/:id/questions/reorder",
  requirePermission(PERMISSIONS.APPLICATIONS_MANAGE_EDIT),
  reorderApplicationQuestions,
);

module.exports = router;
