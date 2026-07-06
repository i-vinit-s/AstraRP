require("./config/env");

const fs = require("fs");
const path = require("path");

const { REST, Routes } = require("discord.js");

const { token, clientId, guildId } = require("./config/env");

const commands = [];

const commandsPath = path.join(__dirname, "commands");

const folders = fs.readdirSync(commandsPath);

for (const folder of folders) {
  const folderPath = path.join(commandsPath, folder);

  const files = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of files) {
    const command = require(path.join(folderPath, file));

    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log(`Deploying ${commands.length} commands...`);

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("✓ Commands deployed.");
  } catch (err) {
    console.error(err);
  }
})();
