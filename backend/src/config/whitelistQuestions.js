module.exports = [
  {
    id: "age",
    category: "Basic Information",
    title: "How old are you?",
    description:
      "You must be at least the minimum age required to join Astra Roleplay.",
    placeholder: "Enter your age...",
    type: "number",
    required: true,
  },

  {
    id: "country",
    category: "Basic Information",
    title: "Which country are you from?",
    description: "This helps us understand your timezone and language.",
    placeholder: "India",
    type: "text",
    required: true,
  },

  {
    id: "experience",
    category: "Roleplay Experience",
    title: "Describe your previous roleplay experience.",
    description:
      "Mention communities you've played on, characters you've created, and your RP experience.",
    placeholder: "Tell us about your RP experience...",
    type: "textarea",
    required: true,
    minLength: 100,
    maxLength: 1000,
  },

  {
    id: "character_story",
    category: "Character Story",
    title: "Tell us about the character you plan to play.",
    description: "Write a detailed backstory for your first character.",
    placeholder: "Character backstory...",
    type: "textarea",
    required: true,
    minLength: 250,
    maxLength: 2500,
  },
];
