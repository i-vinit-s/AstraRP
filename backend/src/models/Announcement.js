const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },

    category: {
      type: String,
      enum: ["public", "whitelist", "offtopic"],
      required: true,
    },

    type: {
      type: String,
      enum: ["announcement", "maintenance", "event", "update"],
      default: "announcement",
    },

    color: {
      type: String,
      default: "#8c1218",
    },

    published: {
      type: Boolean,
      default: true,
    },

    pinned: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
      default: "",
    },

    discordMessageId: {
      type: String,
      default: "",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Announcement", announcementSchema);
