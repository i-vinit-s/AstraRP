require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth.routes");
const staffRoutes = require("./routes/staff.routes");
const applicationsRoutes = require("./routes/applications.routes");

const { generalLimiter } = require("./middleware/rateLimit");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(helmet());
app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Astra RP Backend API",
  });
});

app.use(generalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/staff/announcements", require("./routes/announcement.routes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
