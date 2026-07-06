const { EmbedBuilder } = require("discord.js");

exports.whitelistApproved = ({ member }) => {
  return new EmbedBuilder()
    .setColor("#57F287")
    .setTitle("✅ Whitelist Approved")
    .setDescription(`${member} has been successfully whitelisted.`)
    .setTimestamp();
};

exports.whitelistRejected = ({ member }) => {
  return new EmbedBuilder()
    .setColor("#ED4245")
    .setTitle("❌ Whitelist Rejected")
    .setDescription(`${member}'s whitelist application has been rejected.`)
    .setTimestamp();
};

exports.announcement = ({ title, content, type, color, author }) => {
  return new EmbedBuilder()
    .setColor(color || "#8c1218")
    .setTitle(`${title}`)
    .setDescription(content)
    .addFields(
      {
        name: "Category",
        value: type.charAt(0).toUpperCase() + type.slice(1),
        inline: true,
      },
    )
    .setFooter({
      text: "Astra Roleplay",
    })
    .setTimestamp();
};