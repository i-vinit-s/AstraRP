const express = require("express");
const { authLimiter } = require("../middleware/rateLimit");

const {
  discordLogin,
  discordCallback,
  getMe,
  logout,
} = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/discord", authLimiter, discordLogin);

router.get("/callback", authLimiter, discordCallback);

router.get("/me", protect, getMe);

router.post("/logout", protect, logout);

module.exports = router;
