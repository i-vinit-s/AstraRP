const express = require("express");

const {
  getDashboardStats,
  getRecentActivity,

  getApplications,
  getApplication,
  reviewApplication,

  getUsers,
  getUser,
} = require("../controllers/staff.controller");

const { protect } = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");

const PERMISSIONS = require("../config/permissions");

const router = express.Router();

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

router.get(
  "/activity",
  requirePermission(PERMISSIONS.ACTIVITY_VIEW),
  getRecentActivity,
);

/*
|--------------------------------------------------------------------------
| Whitelist
|--------------------------------------------------------------------------
*/

router.get(
  "/applications",
  requirePermission(PERMISSIONS.WHITELIST_VIEW),
  getApplications,
);

router.get(
  "/applications/:id",
  requirePermission(PERMISSIONS.WHITELIST_VIEW),
  getApplication,
);

router.patch(
  "/applications/:id",
  requirePermission(PERMISSIONS.WHITELIST_REVIEW),
  reviewApplication,
);

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

router.get("/users", requirePermission(PERMISSIONS.USERS_VIEW), getUsers);

router.get("/users/:id", requirePermission(PERMISSIONS.USERS_VIEW), getUser);

module.exports = router;
