const api = require("./api.service");

async function find(discordId) {
  const { data } = await api.get(`/users/${discordId}`);

  return data.user;
}

module.exports = {
  find,
};
