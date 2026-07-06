const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    applicationNumber: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "pending", "accepted", "rejected", "changes_requested"],
      default: "draft",
    },

    answers: {
      type: [answerSchema],
      default: [],
    },

    submittedAt: Date,

    reviewedAt: Date,

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewReason: {
      type: String,
      default: "",
    },

    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
