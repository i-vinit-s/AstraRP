const express = require("express");

const {
  getDashboardStats,
  getApplications,
  getApplication,
  reviewApplication,
} = require("../controllers/staff.controller");

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

module.exports = router;
