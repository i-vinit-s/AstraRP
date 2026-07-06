const axios = require("axios");

const api = axios.create({
  baseURL: process.env.BACKEND_URL,

  headers: {
    "x-api-key": process.env.INTERNAL_API_KEY,
  },
});

module.exports = api;
