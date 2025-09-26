// backend/app.js
const express = require("express");
const cors = require("cors");
const { swaggerUi, specs } = require("./routes/swagger");
const movementRouter = require("./routes/movements");
const remoteControlRouter = require("./routes/remoteControl");
const configRouter = require("./routes/config");
const seasonRouter = require("./routes/season");
const reportsRouter = require("./routes/reports");
const tariffRouter = require('./routes/tariffSetup')
const { authRouter } = require("./routes/auth");
const systemConfigurationRoute = require("./routes/systemConfiguration")

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the Carpark System API");
});

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Carpark system backend is running" });
});

// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Movement transactions routes
app.use("/api/movements", movementRouter);

// Remote control routes
app.use("/api/remote-control", remoteControlRouter);

// Configuration routes
app.use("/api/config", configRouter);

// Season routes
app.use("/api/seasons", seasonRouter);

// Reports routes
app.use("/api/reports", reportsRouter);

// Auth routes
app.use("/api/auth", authRouter);

// System configuration
app.use("/api/system-configuration", systemConfigurationRoute)

// Tariff route
app.use('/api/tariff', tariffRouter);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ⚠️ Remove req.io = io here — use app.locals.io in routes instead

module.exports = app;