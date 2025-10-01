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

// Get lta-collection files
router.get("/lta-collection", async (req, res) => {
  const { fileDate } = req.query;

  try {
    await sql.connect(config);

    let query = "SELECT * FROM LTACollectionFile";
    if (fileDate) {
      query += " WHERE CONVERT(date, create_datetime) = @fileDate";
    }

    const request = new sql.Request();
    if (fileDate) request.input("fileDate", sql.Date, fileDate);

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching LTA Collection File:", err);
    res.status(500).json({ error: "Failed to fetch LTA Collection File" });
  } finally {
    sql.close();
  }
});

// Get LTA Acknowledgement
router.get("/lta-acknowledge", async (req, res) => {
  const { fileDate } = req.query; // optional filter

  try {
    await sql.connect(config);
    let query = "SELECT * FROM LTAAcknowledgement";

    if (fileDate) {
      query += " WHERE CONVERT(date, settle_date) = @fileDate";
    }

    const request = new sql.Request();
    if (fileDate) request.input("fileDate", sql.Date, fileDate);

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching LTA Acknowledge files:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  } finally {
    await sql.close();
  }
});

// Get LTA Result
router.get("/lta-result", async (req, res) => {
  const { fileDate } = req.query; // optional filter

  try {
    await sql.connect(config);
    let query = "SELECT * FROM LTAResult";

    if (fileDate) {
      query += " WHERE CONVERT(date, SettleDate) = @fileDate";
    }

    const request = new sql.Request();
    if (fileDate) request.input("fileDate", sql.Date, fileDate);

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching LTA Acknowledge files:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  } finally {
    await sql.close();
  }
});

module.exports = router;