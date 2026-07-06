const discordService = require("./discord.service");

async function addRole(discordId, roleId) {
  const member = await discordService.getMember(discordId);

  if (!member.roles.cache.has(roleId)) {
    await member.roles.add(roleId);
  }

  return member;
}

async function removeRole(discordId, roleId) {
  const member = await discordService.getMember(discordId);

  if (member.roles.cache.has(roleId)) {
    await member.roles.remove(roleId);
  }

  return member;
}

async function hasRole(discordId, roleId) {
  const member = await discordService.getMember(discordId);

  return member.roles.cache.has(roleId);
}

module.exports = {
  addRole,
  removeRole,
  hasRole,
};
