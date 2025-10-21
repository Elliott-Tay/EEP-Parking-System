// backend/app.js
const express = require("express");
const cors = require("cors");
const { swaggerUi, specs } = require("./routes/swagger");
const movementRouter = require("./routes/movements");
const remoteControlRouter = require("./routes/remoteControl");
const configRouter = require("./routes/config");
const seasonRouter = require("./routes/season");
const reportsRouter = require("./routes/reports");
const tariffRouter = require('./routes/tariffSetup');
const outstandingRouter = require('./routes/outstanding');
const { authRouter } = require("./routes/auth");
const systemConfigurationRoute = require("./routes/systemConfiguration")
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

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
app.use("/api/tariff", tariffRouter);

// Outstanding route
app.use("/api/outstanding", outstandingRouter);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = app;