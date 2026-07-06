const User = require("../models/User");

async function syncGuild(guild) {
  await guild.members.fetch();

  for (const member of guild.members.cache.values()) {
    await User.findOneAndUpdate(
      {
        discordId: member.id,
      },
      {
        roles: [...member.roles.cache.keys()],
      },
    );
  }

  console.log(`✓ Synced ${guild.members.cache.size} members`);
}

module.exports = {
  syncGuild,
};
