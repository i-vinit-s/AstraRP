const roleService = require("../services/role.service");
const discordService = require("../services/discord.service");
const embedService = require("../services/embed.service");
const { application } = require("../config/client");
const client = require("../config/client");

exports.applicationApproved = async (req, res) => {
  try {
    const { discordId, username, reason } = req.body;

    // Give whitelist role
    await roleService.addRole(discordId, process.env.WHITELIST_ROLE_ID);

    const member = await discordService.getMember(discordId);
    
    const channel = await discordService.getChannel(
      process.env.APPLICATION_CHANNEL_ID,
    );

    await channel.send({
      embeds: [
        embedService.whitelistApproved({
          member,
        }),
      ],
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
    });
  }
};

exports.applicationRejected = async (req, res) => {
  try {
    const { discordId } = req.body;

    const member = await discordService.getMember(discordId);

    const channel = await client.channels.fetch(
      process.env.APPLICATION_CHANNEL_ID,
    );

    await channel.send({
      embeds: [
        embedService.whitelistRejected({
          member,
        }),
      ],
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


exports.getMemberRoles = async (req, res) => {
  try {
    const member = await discordService.getMember(req.params.discordId);

    res.json({
      success: true,
      roles: [...member.roles.cache.keys()],
    });
  } catch (err) {
    console.error(err);

    res.status(404).json({
      success: false,
      message: "Member not found.",
    });
  }
};

exports.announcement = async (req, res) => {
  const { title, content, type, color, author } = req.body;

  const channel = await req.client.channels.fetch(
    process.env.ANNOUNCEMENTS_CHANNEL_ID,
  );

  if (!channel) {
    return res.status(404).json({
      success: false,
      message: "Announcement channel not found.",
    });
  }

  const embed = embedService.announcement({
    title,
    content,
    type,
    color,
    author,
  });

  const message = await channel.send({
    embeds: [embed],
  });

  res.json({
    success: true,
    messageId: message.id,
  });
};