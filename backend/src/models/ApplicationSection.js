const mongoose = require("mongoose");

const ApplicationSectionSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
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

    order: {
      type: Number,
      default: 0,
    },

    icon: {
      type: String,
      default: "FileText",
    },

    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

ApplicationSectionSchema.index({
  application: 1,
  order: 1,
});

module.exports = mongoose.model("ApplicationSection", ApplicationSectionSchema);
