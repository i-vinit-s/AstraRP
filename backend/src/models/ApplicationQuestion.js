const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },

    value: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const ValidationSchema = new mongoose.Schema(
  {
    required: {
      type: Boolean,
      default: false,
    },
    minLength: Number,
    maxLength: Number,
    min: Number,
    max: Number,
    regex: String,
  },
  {
    _id: false,
  },
);

const VisibilitySchema = new mongoose.Schema(
  {
    dependsOn: String,
    equals: mongoose.Schema.Types.Mixed,
  },
  {
    _id: false,
  },
);

const ApplicationQuestionSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },

    section: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"ApplicationSection"
},

    order: {
      type: Number,
      default: 0,
    },

    id: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    placeholder: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: [
        "text",
        "textarea",
        "number",
        "email",
        "url",
        "select",
        "radio",
        "checkbox",
        "date",
      ],
      default: "text",
    },

    options: {
      type: [OptionSchema],
      default: [],
    },

    validation: {
      type: ValidationSchema,
      default: () => ({}),
    },

    visibility: VisibilitySchema,

    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

ApplicationQuestionSchema.index({
  application: 1,
  section: 1,
  order: 1,
});

module.exports = mongoose.model(
  "ApplicationQuestion",
  ApplicationQuestionSchema,
);
