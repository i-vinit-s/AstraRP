const questions = require("../config/whitelistQuestions");

function validateApplication(answers = []) {
  const errors = [];

  if (!Array.isArray(answers)) {
    return {
      valid: false,
      errors: ["Answers must be an array."],
    };
  }

  // Convert answers into a map for easier lookup
  const answerMap = {};

  for (const answer of answers) {
    answerMap[answer.questionId] = answer.answer;
  }

  for (const question of questions) {
    const value = answerMap[question.id];

    // Required
    if (question.required) {
      if (!value || String(value).trim() === "") {
        errors.push(`${question.label} is required.`);
        continue;
      }
    }

    if (!value) continue;

    // Number validation
    if (question.type === "number") {
      if (isNaN(Number(value))) {
        errors.push(`${question.label} must be a number.`);
      }
    }

    // Minimum length
    if (
      question.minLength &&
      String(value).trim().length < question.minLength
    ) {
      errors.push(
        `${question.label} must be at least ${question.minLength} characters.`,
      );
    }

    // Maximum length
    if (
      question.maxLength &&
      String(value).trim().length > question.maxLength
    ) {
      errors.push(
        `${question.label} must be less than ${question.maxLength} characters.`,
      );
    }
  }

  // Unknown question IDs
  const validIds = questions.map((q) => q.id);

  for (const answer of answers) {
    if (!validIds.includes(answer.questionId)) {
      errors.push(`Unknown question "${answer.questionId}".`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = validateApplication;
