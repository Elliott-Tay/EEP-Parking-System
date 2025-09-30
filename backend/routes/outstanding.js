const express = require("express");
const router = express.Router();
const { sql, config } = require("../database/db");

// Get outstanding settlement
router.get("/settlement", async (req, res) => {
  const { fileDate } = req.query; // optional filter by date

  try {
    await sql.connect(config);

    let query = "SELECT * FROM OutstandingSettlement";
    if (fileDate) {
      query += ` WHERE CONVERT(date, created_at) = @fileDate`;
    }

    const request = new sql.Request();
    if (fileDate) request.input("fileDate", sql.Date, fileDate);

    const result = await request.query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// Get outstanding acknowledgement
router.get("/acknowledgement", async (req, res) => {
  const { fileDate } = req.query;

  try {
    await sql.connect(config);

    let query = "SELECT * FROM OutstandingAcknowledgement";
    if (fileDate) {
      query += " WHERE CONVERT(date, created_at) = @fileDate";
    }

    const request = new sql.Request();
    if (fileDate) request.input("fileDate", sql.Date, fileDate);

    const result = await request.query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching acknowledgements:", err);
    res.status(500).json({ error: "Failed to fetch acknowledgements" });
  }
});

// Get outstanding summary
router.get("/summary", async (req, res) => {
  const { fileDate } = req.query;

  try {
    await sql.connect(config);

    let query = "SELECT * FROM OutstandingSummary";
    if (fileDate) {
      query += " WHERE CONVERT(date, created_at) = @fileDate";
    }

    const request = new sql.Request();
    if (fileDate) request.input("fileDate", sql.Date, fileDate);

    const result = await request.query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching acknowledgements:", err);
    res.status(500).json({ error: "Failed to fetch acknowledgements" });
  }
});

module.exports = router;