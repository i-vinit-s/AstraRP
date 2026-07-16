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

const router = express.Router();

router.use(protect);

router.get("/", requirePermission("isStaff"), getAnnouncements);

router.get("/:id", requirePermission("isStaff"), getAnnouncement);

router.post("/", requirePermission("isStaff"), createAnnouncement);

router.patch(
  "/:id",
  requirePermission("isStaff"),
  updateAnnouncement,
);

router.delete("/:id", requirePermission("isStaff"), deleteAnnouncement);

module.exports = router;
