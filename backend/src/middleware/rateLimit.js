const rateLimit = require("express-rate-limit");

/*
 * Standard JSON response.
 */

function createHandler(message) {
  return (req, res) => {
    return res.status(429).json({
      success: false,
      message,
    });
  };
}

/*
 * Public routes (IP based)
 */

function createPublicLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,

    standardHeaders: true,
    legacyHeaders: false,

    handler: createHandler(message),
  });
}

/*
 * Authenticated routes (Discord ID)
 */

function createUserLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,

    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator(req) {
      return req.user.discordId;
    },

    handler: createHandler(message),
  });
}

module.exports = {
  generalLimiter: createPublicLimiter({
    windowMs: 60 * 1000,
    max: 120,
    message: "Too many requests. Please slow down.",
  }),

  authLimiter: createPublicLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many login attempts. Please try again in 15 minutes.",
  }),

  submitLimiter: createUserLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message:
      "You have reached the application submission limit. Please wait before trying again.",
  }),

  updateLimiter: createUserLimiter({
    windowMs: 60 * 1000,
    max: 60,
    message: "Too many update requests. Please slow down.",
  }),
};
