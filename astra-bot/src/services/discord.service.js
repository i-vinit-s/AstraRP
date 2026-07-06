const client = require("../config/client");

async function getGuild() {
  return client.guilds.fetch(process.env.GUILD_ID);
}

async function getMember(discordId) {
  const guild = await getGuild();

  return guild.members.fetch(discordId);
}

async function getChannel(channelId) {
  return client.channels.fetch(channelId);
}

module.exports = {
  getGuild,
  getMember,
  getChannel,
};
