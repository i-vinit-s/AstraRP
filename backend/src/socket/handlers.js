const presence = require("./presence");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = (io, socket) => {
  socket.on("staff:join", async ({ token }) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);

      if (!user?.roles?.includes("staff")) {
        return;
      }

      socket.join("staff");

      presence.add(socket.id, {
        id: user._id,
        username: user.username,
        globalName: user.globalName,
      });

      io.to("staff").emit("staff:online", presence.getAll());
    } catch {
      // Ignore invalid token
    }
  });

  socket.on("disconnect", () => {
    presence.remove(socket.id);

    io.to("staff").emit("staff:online", presence.getAll());
  });
};
