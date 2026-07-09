const mongoose = require("mongoose");

const RequirementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["allowlisted", "discordRole", "permission", "tebex", "custom"],
      required: true,
    },

    value: {
      type: String,
      default: null,
    },

    message: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  },
);

const BadgeSchema = new mongoose.Schema(
  {
    text: String,

    color: {
      type: String,
      default: "gray",
    },
  },
  {
    _id: false,
  },
);

const ApplicationSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      default: "Community",
    },

    categoryExclusive: {
      type: Boolean,
      default: true,
    },

    reapplyCooldownDays: {
      type: Number,
      default: 7,
      min: 0,
    },

    maxAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    route: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    badge: BadgeSchema,

    requirements: {
      type: [RequirementSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Application", ApplicationSchema);
