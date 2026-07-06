const { ActivityType } = require("discord.js");
const syncService = require("../../services/sync.service");

module.exports = {
  name: "clientReady",
  once: true,
  
  async execute(client) {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);

    client.user.setPresence({
      activities: [
        {
          name: "Astra Roleplay",
          type: ActivityType.Watching,
        },
      ],
      status: "online",
    });
    
    await syncService.syncGuild(guild);
    
    console.log("");
    console.log("==================================");
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Servers : ${client.guilds.cache.size}`);
    console.log(`Users   : ${client.users.cache.size}`);
    console.log("==================================");
    console.log("");

  },
};
