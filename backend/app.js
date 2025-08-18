// backend/app.js
const express = require("express");
const cors = require("cors");
const db = require("./database/db");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Carpark system backend is running" });
});

// get all movement transactions
app.get("/api/movements", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM movement_transactions");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error: ", error});
  }
});

// welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the Carpark System API");
});

module.exports = app;