// backend/app.js
const express = require("express");
const cors = require("cors");
const movementRouter = require("./routes/movements");
const seasonRouter = require("./routes/season")

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the Carpark System API");
});

// health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Carpark system backend is running" });
});

// movement transactions routes
app.use("/api/movements", movementRouter);

// season routes
app.use("/api/seasons", seasonRouter);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

module.exports = app;