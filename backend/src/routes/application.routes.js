const express = require("express");

const {
  getQuestions,
  getMyApplication,
  saveApplication,
  submitApplication,
  createNewApplication,
} = require("../controllers/application.controller");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/questions", getQuestions);

router.get("/me", protect, getMyApplication);

router.post("/me", protect, saveApplication);

router.post("/new", protect, createNewApplication);

router.post("/me/submit", protect, submitApplication);

module.exports = router;
