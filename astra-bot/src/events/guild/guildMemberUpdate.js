const User = require("../../models/User");

module.exports = {
  name: "guildMemberUpdate",

  async execute(client, oldMember, newMember) {
    try {
      const roles = [...newMember.roles.cache.keys()];

      await User.findOneAndUpdate(
        {
          discordId: newMember.id,
        },
        {
          roles,
        },
      );

      console.log(`✓ Synced roles for ${newMember.user.username}`);
    } catch (err) {
      console.error(err);
    }
  },
};
