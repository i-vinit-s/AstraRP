const express = require("express");

const router = express.Router();

const auth = require("../middleware/internalAuth");
const authenticateInternal = require("../middleware/authenticateInternal");

const {
  applicationApproved,
  applicationRejected,
  getMemberRoles,
  announcement,
} = require("../controllers/internal.controller");

router.use(auth);

// Application routes
router.post("/application/approved", applicationApproved);

router.post("/application/rejected", applicationRejected);

// Member routes
router.get("/member/:discordId/roles", getMemberRoles);

router.post("/announcement", authenticateInternal, announcement);

module.exports = router;
