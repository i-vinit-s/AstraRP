require("./config/env");

const client = require("./config/client");

const connectMongo = require("./database/mongoose");
const app = require("./api/server");
const loadCommands = require("./handlers/commandHandler");
const loadEvents = require("./handlers/eventHandler");

const { token } = require("./config/env");

(async () => {
  try {
    await connectMongo();

    loadCommands(client);
    loadEvents(client);

    await client.login(token);

    const PORT = process.env.PORT || 3001;

    app.listen(PORT, () => {
      console.log(`✓ Internal API running on :${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
