const express = require("express");

const internalRoutes = require("../routes/internal.routes");

const app = express();

app.use(express.json());

app.use("/internal", internalRoutes);

module.exports = app;
