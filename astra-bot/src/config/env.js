require("dotenv").config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  mongoUri: process.env.MONGO_URI,
  backendUrl: process.env.BACKEND_URL,
  internalApiKey: process.env.INTERNAL_API_KEY,
};
