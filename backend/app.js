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

// get movement transaction by iu_no
app.get("/api/movements/:iu_no", async (req, res) => {
  try {
    const { iu_no } = req.params;

    // parameterized query to prevent SQL injection
    const [rows] = await db.query(
      "SELECT * FROM movement_transactions WHERE iu_no = ?",
      [iu_no]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No record found for this iu_no" });
    }

    res.json(rows[0]); // return just one object instead of an array
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the Carpark System API");
});

module.exports = app;