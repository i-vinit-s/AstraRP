const User = require("../../models/User");

module.exports = {
  name: "guildMemberAdd",

  async execute(client, member) {
    try {
      const roles = [...member.roles.cache.keys()];

      await User.findOneAndUpdate(
        {
          discordId: member.id,
        },
        {
          roles,
        },
      );

      console.log(`✓ Synced ${member.user.username}`);
    } catch (err) {
      console.error(err);
    }
  },
};
