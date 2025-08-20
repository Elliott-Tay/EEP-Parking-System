// backend/app.js
const express = require("express");
const cors = require("cors");
const db = require("./database/db");
const movementRouter = require("./routes/movements");

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

module.exports = app;