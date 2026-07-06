const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
    },

    globalName: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    roles: {
      type: [String],
      default: ["user"],
    },

    isWhitelisted: {
      type: Boolean,
      default: false,
    },

    applicationStatus: {
      type: String,
      enum: ["none", "pending", "accepted", "rejected"],
      default: "none",
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
