const express = require("express");

const {
  discordLogin,
  discordCallback,
  getMe,
  logout,
} = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/discord", discordLogin);

router.get("/callback", discordCallback);

router.get("/me", protect, getMe);

router.post("/logout", protect, logout);

module.exports = router;
