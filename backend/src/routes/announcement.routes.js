const express = require("express");

const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcement.controller");

const { protect } = require("../middleware/auth");

const requirePermission = require("../middleware/requirePermission");

const P = require("../config/permissions");

const router = express.Router();

router.use(protect);

router.get("/", requirePermission(P.ANNOUNCEMENTS_VIEW), getAnnouncements);

router.get("/:id", requirePermission(P.ANNOUNCEMENTS_VIEW), getAnnouncement);

router.post("/", requirePermission(P.ANNOUNCEMENTS_CREATE), createAnnouncement);

router.patch(
  "/:id",
  requirePermission(P.ANNOUNCEMENTS_EDIT),
  updateAnnouncement,
);

router.delete(
  "/:id",
  requirePermission(P.ANNOUNCEMENTS_DELETE),
  deleteAnnouncement,
);

module.exports = router;
