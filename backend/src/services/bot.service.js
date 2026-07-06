const axios = require("axios");

const botApi = axios.create({
  baseURL: process.env.INTERNAL_API_URL,
  headers: {
    "x-api-key": process.env.INTERNAL_API_KEY,
  },
});

exports.applicationApproved = async (discordId) => {
  return botApi.post("/internal/application/approved", {
    discordId,
  });
};

exports.applicationRejected = async (discordId) => {
  return botApi.post("/internal/application/rejected", {
    discordId,
  });
};

exports.getMemberRoles = async (discordId) => {
  const { data } = await botApi.get(`/internal/member/${discordId}/roles`);

  return data.roles;
};

exports.sendAnnouncement = async (announcement) => {
  const { data } = await botApi.post("/internal/announcement", {
    title: announcement.title,
    content: announcement.content,
    type: announcement.type,
    color: announcement.color,
    author: announcement.author?.globalName || announcement.author?.username,
  });

  return data.messageId;
};
