const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const ReviewSchema = new mongoose.Schema(
  {
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reason: {
      type: String,
      default: "",
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const ApplicationSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },

    /*
     * Store category snapshot.
     *
     * This is intentional. If the Application category changes later,
     * old submissions still retain the category they were created under.
     */

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    /*
     * Attempt number for this exact application.
     */

    attempt: {
      type: Number,
      default: 1,
      min: 1,
    },

    status: {
      type: String,
      enum: ["draft", "pending", "accepted", "rejected", "closed"],
      default: "draft",
      index: true,
    },

    answers: {
      type: [AnswerSchema],
      default: [],
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    review: {
      type: ReviewSchema,
      default: null,
    },

    cooldownEnds: {
      type: Date,
      default: null,
    },

    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

/*
 * Prevent duplicate attempt numbers for the same user/application.
 *
 * Allows:
 *
 * User A + Whitelist + Attempt 1
 * User A + Whitelist + Attempt 2
 *
 * But prevents duplicate Attempt 1.
 */

ApplicationSubmissionSchema.index(
  {
    user: 1,
    application: 1,
    attempt: 1,
  },
  {
    unique: true,
  },
);

/*
 * Fast category exclusivity checks.
 */

ApplicationSubmissionSchema.index({
  user: 1,
  category: 1,
  status: 1,
});

/*
 * Fast staff dashboard queries.
 */

ApplicationSubmissionSchema.index({
  application: 1,
  status: 1,
  submittedAt: -1,
});

module.exports = mongoose.model(
  "ApplicationSubmission",
  ApplicationSubmissionSchema,
);
