const axios = require("axios");
const qs = require("qs");
const User = require("../models/User");
const activityService = require("../services/activity.service");

const getDiscordLoginUrl = () => {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify email",
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
};

const exchangeCodeForToken = async (code) => {
  const { data } = await axios.post(
    "https://discord.com/api/oauth2/token",
    qs.stringify({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return data.access_token;
};

const getDiscordUser = async (accessToken) => {
  const { data } = await axios.get("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
};

const findOrCreateUser = async (discordUser) => {
  let user = await User.findOne({
    discordId: discordUser.id,
  });

  const avatar = discordUser.avatar
    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
    : "";

  if (!user) {
    user = await User.create({
      discordId: discordUser.id,
      username: discordUser.username,
      globalName: discordUser.global_name || "",
      avatar,
      email: discordUser.email || "",
      lastLogin: new Date(),
    });
    await activityService.createActivity({
      type: "user_registered",
      target: user._id,
    });
  } else {
    user.username = discordUser.username;
    user.globalName = discordUser.global_name || "";
    user.avatar = avatar;
    user.email = discordUser.email || "";
    user.lastLogin = new Date();

    await user.save();
  }

  return user;
};

module.exports = {
  getDiscordLoginUrl,
  exchangeCodeForToken,
  getDiscordUser,
  findOrCreateUser,
};
