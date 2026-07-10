const mongoose = require("mongoose");

const Application = require("../models/Application");
const ApplicationSection = require("../models/ApplicationSection");
const ApplicationQuestion = require("../models/ApplicationQuestion");

const asyncHandler = require("../utils/asyncHandler");

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function findApplication(applicationId) {
  if (!isValidObjectId(applicationId)) {
    return null;
  }

  return Application.findById(applicationId);
}

/*
|--------------------------------------------------------------------------
| GET APPLICATION BUILDER
|--------------------------------------------------------------------------
|
| GET /api/staff/application-definitions/:id/builder
|
| Returns:
| - application definition
| - sections
| - questions attached to each section
| - unsectioned questions
|
*/

exports.getApplicationBuilder = asyncHandler(async (req, res) => {
  const application = await findApplication(req.params.id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application definition not found.",
    });
  }

  const [sections, questions] = await Promise.all([
    ApplicationSection.find({
      application: application._id,
    })
      .sort({
        order: 1,
        createdAt: 1,
      })
      .lean(),

    ApplicationQuestion.find({
      application: application._id,
    })
      .sort({
        order: 1,
        createdAt: 1,
      })
      .lean(),
  ]);

  const sectionIds = new Set(sections.map((section) => String(section._id)));

  const sectionsWithQuestions = sections.map((section) => ({
    ...section,

    questions: questions.filter(
      (question) =>
        question.section && String(question.section) === String(section._id),
    ),
  }));

  const unsectionedQuestions = questions.filter(
    (question) =>
      !question.section || !sectionIds.has(String(question.section)),
  );

  return res.status(200).json({
    success: true,

    application,

    sections: sectionsWithQuestions,

    unsectionedQuestions,
  });
});

/*
|--------------------------------------------------------------------------
| CREATE SECTION
|--------------------------------------------------------------------------
|
| POST /api/staff/application-definitions/:id/sections
|
*/

exports.createSection = asyncHandler(async (req, res) => {
  const application = await findApplication(req.params.id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application definition not found.",
    });
  }

  const {
    title,
    description = "",
    icon = "FileText",
    enabled = true,
  } = req.body;

  if (!title?.trim()) {
    return res.status(422).json({
      success: false,
      message: "Section title is required.",
    });
  }

  /*
   * Automatically place new section after existing sections.
   */

  const lastSection = await ApplicationSection.findOne({
    application: application._id,
  })
    .sort({
      order: -1,
    })
    .select("order")
    .lean();

  const order = lastSection ? lastSection.order + 1 : 0;

  const section = await ApplicationSection.create({
    application: application._id,

    title: title.trim(),

    description: String(description || "").trim(),

    icon: String(icon || "FileText").trim(),

    order,

    enabled: Boolean(enabled),
  });

  return res.status(201).json({
    success: true,
    message: "Section created successfully.",
    section,
  });
});

/*
|--------------------------------------------------------------------------
| UPDATE SECTION
|--------------------------------------------------------------------------
|
| PATCH /api/staff/application-definitions/:id/sections/:sectionId
|
*/

exports.updateSection = asyncHandler(async (req, res) => {
  const { id, sectionId } = req.params;

  if (!isValidObjectId(id) || !isValidObjectId(sectionId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid application or section ID.",
    });
  }

  const section = await ApplicationSection.findOne({
    _id: sectionId,
    application: id,
  });

  if (!section) {
    return res.status(404).json({
      success: false,
      message: "Section not found.",
    });
  }

  const { title, description, icon, enabled } = req.body;

  if (title !== undefined) {
    if (!String(title).trim()) {
      return res.status(422).json({
        success: false,
        message: "Section title cannot be empty.",
      });
    }

    section.title = String(title).trim();
  }

  if (description !== undefined) {
    section.description = String(description || "").trim();
  }

  if (icon !== undefined) {
    section.icon = String(icon || "FileText").trim();
  }

  if (enabled !== undefined) {
    section.enabled = Boolean(enabled);
  }

  await section.save();

  return res.status(200).json({
    success: true,
    message: "Section updated successfully.",
    section,
  });
});

/*
|--------------------------------------------------------------------------
| DELETE SECTION
|--------------------------------------------------------------------------
|
| DELETE /api/staff/application-definitions/:id/sections/:sectionId
|
| Questions are NOT deleted.
| They become unsectioned questions instead.
|
*/

exports.deleteSection = asyncHandler(async (req, res) => {
  const { id, sectionId } = req.params;

  if (!isValidObjectId(id) || !isValidObjectId(sectionId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid application or section ID.",
    });
  }

  const section = await ApplicationSection.findOne({
    _id: sectionId,
    application: id,
  });

  if (!section) {
    return res.status(404).json({
      success: false,
      message: "Section not found.",
    });
  }

  /*
   * Preserve questions by removing their section reference.
   */

  await ApplicationQuestion.updateMany(
    {
      application: id,
      section: section._id,
    },
    {
      $set: {
        section: null,
      },
    },
  );

  await section.deleteOne();

  return res.status(200).json({
    success: true,
    message:
      "Section deleted. Its questions were moved to the unsectioned area.",
  });
});

/*
|--------------------------------------------------------------------------
| REORDER SECTIONS
|--------------------------------------------------------------------------
|
| PATCH /api/staff/application-definitions/:id/sections/reorder
|
| Body:
|
| {
|   "sectionIds": [
|     "id1",
|     "id2",
|     "id3"
|   ]
| }
|
*/

exports.reorderSections = asyncHandler(async (req, res) => {
  const application = await findApplication(req.params.id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application definition not found.",
    });
  }

  const { sectionIds } = req.body;

  if (!Array.isArray(sectionIds)) {
    return res.status(422).json({
      success: false,
      message: "sectionIds must be an array.",
    });
  }

  const uniqueIds = [...new Set(sectionIds.map(String))];

  if (uniqueIds.length !== sectionIds.length) {
    return res.status(422).json({
      success: false,
      message: "Duplicate section IDs are not allowed.",
    });
  }

  if (uniqueIds.some((id) => !isValidObjectId(id))) {
    return res.status(422).json({
      success: false,
      message: "One or more section IDs are invalid.",
    });
  }

  const sections = await ApplicationSection.find({
    _id: {
      $in: uniqueIds,
    },

    application: application._id,
  }).select("_id");

  if (sections.length !== uniqueIds.length) {
    return res.status(422).json({
      success: false,
      message: "One or more sections do not belong to this application.",
    });
  }

  await ApplicationSection.bulkWrite(
    uniqueIds.map((sectionId, index) => ({
      updateOne: {
        filter: {
          _id: sectionId,
          application: application._id,
        },

        update: {
          $set: {
            order: index,
          },
        },
      },
    })),
  );

  return res.status(200).json({
    success: true,
    message: "Sections reordered successfully.",
  });
});

/*
|--------------------------------------------------------------------------
| CREATE QUESTION
|--------------------------------------------------------------------------
|
| POST /api/staff/application-definitions/:id/questions
|
*/

exports.createQuestion = asyncHandler(async (req, res) => {
  const application = await findApplication(req.params.id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application definition not found.",
    });
  }

  const {
    section = null,
    id,
    title,
    description = "",
    placeholder = "",
    type = "text",
    options = [],
    validation = {},
    visibility,
    enabled = true,
  } = req.body;

  if (!id?.trim()) {
    return res.status(422).json({
      success: false,
      message: "Question ID is required.",
    });
  }

  if (!title?.trim()) {
    return res.status(422).json({
      success: false,
      message: "Question title is required.",
    });
  }

  /*
   * Question IDs must be unique inside one application.
   */

  const normalizedQuestionId = String(id)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (!normalizedQuestionId) {
    return res.status(422).json({
      success: false,
      message: "Invalid question ID.",
    });
  }

  const existingQuestion = await ApplicationQuestion.findOne({
    application: application._id,
    id: normalizedQuestionId,
  }).lean();

  if (existingQuestion) {
    return res.status(409).json({
      success: false,
      message: "A question with this ID already exists in this application.",
    });
  }

  /*
   * Validate section if provided.
   */

  let sectionDocument = null;

  if (section) {
    if (!isValidObjectId(section)) {
      return res.status(422).json({
        success: false,
        message: "Invalid section ID.",
      });
    }

    sectionDocument = await ApplicationSection.findOne({
      _id: section,
      application: application._id,
    });

    if (!sectionDocument) {
      return res.status(422).json({
        success: false,
        message: "The selected section does not belong to this application.",
      });
    }
  }

  /*
   * Find next order inside the selected section.
   */

  const lastQuestion = await ApplicationQuestion.findOne({
    application: application._id,
    section: sectionDocument?._id || null,
  })
    .sort({
      order: -1,
    })
    .select("order")
    .lean();

  const order = lastQuestion ? lastQuestion.order + 1 : 0;

  const question = await ApplicationQuestion.create({
    application: application._id,

    section: sectionDocument?._id || null,

    order,

    id: normalizedQuestionId,

    title: String(title).trim(),

    description: String(description || "").trim(),

    placeholder: String(placeholder || "").trim(),

    type,

    options: Array.isArray(options) ? options : [],

    validation: {
      required: Boolean(validation?.required),

      ...(validation?.minLength !== undefined && {
        minLength: Number(validation.minLength),
      }),

      ...(validation?.maxLength !== undefined && {
        maxLength: Number(validation.maxLength),
      }),

      ...(validation?.min !== undefined && {
        min: Number(validation.min),
      }),

      ...(validation?.max !== undefined && {
        max: Number(validation.max),
      }),

      ...(validation?.regex && {
        regex: String(validation.regex),
      }),
    },

    visibility: visibility?.dependsOn
      ? {
          dependsOn: String(visibility.dependsOn),
          equals: visibility.equals,
        }
      : undefined,

    enabled: Boolean(enabled),
  });

  return res.status(201).json({
    success: true,
    message: "Question created successfully.",
    question,
  });
});

/*
|--------------------------------------------------------------------------
| UPDATE QUESTION
|--------------------------------------------------------------------------
|
| PATCH /api/staff/application-definitions/:id/questions/:questionId
|
*/

exports.updateQuestion = asyncHandler(async (req, res) => {
  const { id, questionId } = req.params;

  if (!isValidObjectId(id) || !isValidObjectId(questionId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid application or question ID.",
    });
  }

  const question = await ApplicationQuestion.findOne({
    _id: questionId,
    application: id,
  });

  if (!question) {
    return res.status(404).json({
      success: false,
      message: "Question not found.",
    });
  }

  const {
    section,
    title,
    description,
    placeholder,
    type,
    options,
    validation,
    visibility,
    enabled,
  } = req.body;

  /*
  |--------------------------------------------------------------------------
  | Section movement
  |--------------------------------------------------------------------------
  */

  if (section !== undefined) {
    let newSection = null;

    if (section !== null && section !== "") {
      if (!isValidObjectId(section)) {
        return res.status(422).json({
          success: false,
          message: "Invalid section ID.",
        });
      }

      const sectionExists = await ApplicationSection.exists({
        _id: section,
        application: id,
      });

      if (!sectionExists) {
        return res.status(422).json({
          success: false,
          message: "The selected section does not belong to this application.",
        });
      }

      newSection = section;
    }

    const currentSection = question.section ? String(question.section) : null;

    const targetSection = newSection ? String(newSection) : null;

    /*
     * Only calculate a new order if the question is actually moving.
     */

    if (currentSection !== targetSection) {
      const lastQuestion = await ApplicationQuestion.findOne({
        application: id,
        section: newSection,
        _id: {
          $ne: question._id,
        },
      })
        .sort({
          order: -1,
        })
        .select("order")
        .lean();

      question.section = newSection;

      question.order = lastQuestion ? Number(lastQuestion.order) + 1 : 0;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Basic fields
  |--------------------------------------------------------------------------
  */

  if (title !== undefined) {
    if (!String(title).trim()) {
      return res.status(422).json({
        success: false,
        message: "Question title cannot be empty.",
      });
    }

    question.title = String(title).trim();
  }

  if (description !== undefined) {
    question.description = String(description || "").trim();
  }

  if (placeholder !== undefined) {
    question.placeholder = String(placeholder || "").trim();
  }

  if (type !== undefined) {
    question.type = type;
  }

  /*
  |--------------------------------------------------------------------------
  | Options
  |--------------------------------------------------------------------------
  */

  if (options !== undefined) {
    question.options = Array.isArray(options) ? options : [];
  }

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  if (validation !== undefined) {
    question.validation = {
      required: Boolean(validation?.required),

      ...(validation?.minLength !== undefined && {
        minLength: Number(validation.minLength),
      }),

      ...(validation?.maxLength !== undefined && {
        maxLength: Number(validation.maxLength),
      }),

      ...(validation?.min !== undefined && {
        min: Number(validation.min),
      }),

      ...(validation?.max !== undefined && {
        max: Number(validation.max),
      }),

      ...(validation?.regex && {
        regex: String(validation.regex),
      }),
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Conditional visibility
  |--------------------------------------------------------------------------
  */

  if (visibility !== undefined) {
    question.visibility = visibility?.dependsOn
      ? {
          dependsOn: String(visibility.dependsOn),
          equals: visibility.equals,
        }
      : undefined;
  }

  /*
  |--------------------------------------------------------------------------
  | Enabled state
  |--------------------------------------------------------------------------
  */

  if (enabled !== undefined) {
    question.enabled = Boolean(enabled);
  }

  await question.save();

  return res.status(200).json({
    success: true,
    message: "Question updated successfully.",
    question,
  });
});

/*
|--------------------------------------------------------------------------
| DELETE QUESTION
|--------------------------------------------------------------------------
|
| DELETE /api/staff/application-definitions/:id/questions/:questionId
|
*/

exports.deleteQuestion = asyncHandler(async (req, res) => {
  const { id, questionId } = req.params;

  if (!isValidObjectId(id) || !isValidObjectId(questionId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid application or question ID.",
    });
  }

  const question = await ApplicationQuestion.findOneAndDelete({
    _id: questionId,
    application: id,
  });

  if (!question) {
    return res.status(404).json({
      success: false,
      message: "Question not found.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Question deleted successfully.",
  });
});

/*
|--------------------------------------------------------------------------
| REORDER QUESTIONS
|--------------------------------------------------------------------------
|
| PATCH /api/staff/application-definitions/:id/questions/reorder
|
| Body:
|
| {
|   "questions": [
|     {
|       "id": "question-mongo-id",
|       "section": "section-mongo-id",
|       "order": 0
|     }
|   ]
| }
|
| This supports both reordering and moving questions between sections.
|
*/

exports.reorderQuestions = asyncHandler(async (req, res) => {
  const application = await findApplication(req.params.id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application definition not found.",
    });
  }

  const { questions } = req.body;

  if (!Array.isArray(questions)) {
    return res.status(422).json({
      success: false,
      message: "questions must be an array.",
    });
  }

  const questionIds = questions.map((question) => String(question.id));

  if (new Set(questionIds).size !== questionIds.length) {
    return res.status(422).json({
      success: false,
      message: "Duplicate question IDs are not allowed.",
    });
  }

  if (questionIds.some((id) => !isValidObjectId(id))) {
    return res.status(422).json({
      success: false,
      message: "One or more question IDs are invalid.",
    });
  }

  /*
   * Verify all questions belong to this application.
   */

  const existingQuestions = await ApplicationQuestion.find({
    _id: {
      $in: questionIds,
    },

    application: application._id,
  }).select("_id");

  if (existingQuestions.length !== questionIds.length) {
    return res.status(422).json({
      success: false,
      message: "One or more questions do not belong to this application.",
    });
  }

  /*
   * Verify all referenced sections belong to this application.
   */

  const sectionIds = [
    ...new Set(
      questions
        .map((question) => question.section)
        .filter(Boolean)
        .map(String),
    ),
  ];

  if (sectionIds.some((id) => !isValidObjectId(id))) {
    return res.status(422).json({
      success: false,
      message: "One or more section IDs are invalid.",
    });
  }

  if (sectionIds.length > 0) {
    const existingSections = await ApplicationSection.find({
      _id: {
        $in: sectionIds,
      },

      application: application._id,
    }).select("_id");

    if (existingSections.length !== sectionIds.length) {
      return res.status(422).json({
        success: false,
        message: "One or more sections do not belong to this application.",
      });
    }
  }

  await ApplicationQuestion.bulkWrite(
    questions.map((question, index) => ({
      updateOne: {
        filter: {
          _id: question.id,
          application: application._id,
        },

        update: {
          $set: {
            section: question.section || null,

            order: Number.isFinite(Number(question.order))
              ? Number(question.order)
              : index,
          },
        },
      },
    })),
  );

  return res.status(200).json({
    success: true,
    message: "Questions reordered successfully.",
  });
});

exports.reorderApplicationSections = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { sectionIds } = req.body;

  if (!Array.isArray(sectionIds) || !sectionIds.length) {
    return res.status(422).json({
      success: false,
      message: "sectionIds must be a non-empty array.",
    });
  }

  const application = await Application.findById(id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application definition not found.",
    });
  }

  const sections = await ApplicationSection.find({
    application: application._id,
  }).select("_id");

  const existingIds = new Set(sections.map((section) => String(section._id)));

  if (
    sectionIds.length !== sections.length ||
    sectionIds.some((sectionId) => !existingIds.has(String(sectionId)))
  ) {
    return res.status(422).json({
      success: false,
      message:
        "sectionIds must contain every section belonging to this application exactly once.",
    });
  }

  if (new Set(sectionIds.map(String)).size !== sectionIds.length) {
    return res.status(422).json({
      success: false,
      message: "Duplicate section IDs are not allowed.",
    });
  }

  await ApplicationSection.bulkWrite(
    sectionIds.map((sectionId, index) => ({
      updateOne: {
        filter: {
          _id: sectionId,
          application: application._id,
        },

        update: {
          $set: {
            order: index,
          },
        },
      },
    })),
  );

  return res.status(200).json({
    success: true,
    message: "Sections reordered successfully.",
  });
});

exports.reorderApplicationQuestions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { questions } = req.body;

  if (!Array.isArray(questions) || !questions.length) {
    return res.status(422).json({
      success: false,
      message: "questions must be a non-empty array.",
    });
  }

  const application = await Application.findById(id);

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application definition not found.",
    });
  }

  const existingQuestions = await ApplicationQuestion.find({
    application: application._id,
  }).select("_id");

  const existingIds = new Set(
    existingQuestions.map((question) => String(question._id)),
  );

  const receivedIds = questions.map((question) => String(question.id));

  if (
    receivedIds.length !== existingQuestions.length ||
    receivedIds.some((questionId) => !existingIds.has(questionId))
  ) {
    return res.status(422).json({
      success: false,
      message:
        "The reorder payload must contain every question belonging to this application exactly once.",
    });
  }

  if (new Set(receivedIds).size !== receivedIds.length) {
    return res.status(422).json({
      success: false,
      message: "Duplicate question IDs are not allowed.",
    });
  }

  await ApplicationQuestion.bulkWrite(
    questions.map((question) => ({
      updateOne: {
        filter: {
          _id: question.id,
          application: application._id,
        },

        update: {
          $set: {
            order: Number(question.order),
            section: question.section || null,
          },
        },
      },
    })),
  );

  return res.status(200).json({
    success: true,
    message: "Questions reordered successfully.",
  });
});