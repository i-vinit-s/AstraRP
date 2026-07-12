const { EmbedBuilder } = require("discord.js");

exports.whitelistApproved = ({ member }) => {
  return new EmbedBuilder()
    .setTitle("Astra Roleplay")
    .setColor("#57F287")
    .setDescription(`Your application has been **Accepted**.`)
    .addFields({
      name: `Applicant`,
      value: `${member}`,
    })
    .setImage("https://i.ibb.co/d0Kn6XmF/2.png")
    .setFooter({
      text: `#CraftYourLegacy`
    })
    .setTimestamp();
};

exports.whitelistRejected = ({ member }) => {
  return new EmbedBuilder()
    .setTitle("Astra Roleplay")
    .setColor("#ED4245")
    .setDescription(
      `Your application has been **Rejected**. Feel free to apply again.`,
    )
    .addFields({
      name: `Applicant`,
      value: `${member}`,
    })
    .setImage("https://i.ibb.co/jvPmz06x/1.png")
    .setFooter({
      text: `#CraftYourLegacy`,
    })
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