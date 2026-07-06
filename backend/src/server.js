require("dotenv").config();

const http = require("http");
const { initSocket } = require("./socket");
const app = require("./app");
const connectDB = require("./config/database");

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  initSocket(server);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
