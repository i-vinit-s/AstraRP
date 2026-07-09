const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "application_submitted",
        "application_approved",
        "application_rejected",
        "user_registered",
        "announcement_created",
      ],
    },

    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },

    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApplicationSubmission",
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

activitySchema.index({
  createdAt: -1,
});

activitySchema.index({
  application: 1,
  createdAt: -1,
});

activitySchema.index({
  submission: 1,
});

module.exports = mongoose.model("Activity", activitySchema);
