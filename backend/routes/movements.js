const express = require("express");
const router = express.Router();
const db = require("../database/db"); // use the same db connection

// get all movement transactions
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM movement_transactions");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error and we cannot fetch movement_transactions table: ", error});
  }
});

// Get movement transaction by vehicle number
router.get("/:vehicle_no", async (req, res) => {
  try {
    const { vehicle_no } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM movement_transactions WHERE vehicle_number = ?",
      [vehicle_no]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No record found for this vehicle_no" });
    }

    res.json(rows[0]); // return just one object
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error fetching vehicle",
      details: error.message,
    });
  }
});

// get movement transactions by date range
router.get("/range", async (req, res) => {
  try {
    const { start, end } = req.query; // e.g., ?start=2025-08-01&end=2025-08-19

    if (!start || !end) {
      return res.status(400).json({ error: "Missing start or end date" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format, use YYYY-MM-DD" });
    }

    if (startDate > endDate) {
      return res.status(400).json({ error: "Start date cannot be after end date" });
    }

    // Increment endDate by 1 day so we include the end day completely
    const inclusiveEndDate = new Date(endDate);
    inclusiveEndDate.setDate(inclusiveEndDate.getDate() + 1);

    // Query database
    const [rows] = await db.query(
      `SELECT *
       FROM movement_transactions
       WHERE entry_time >= ? AND entry_time < ?
       ORDER BY entry_time ASC`,
      [startDate, inclusiveEndDate]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No records found for this range" });
    }

    res.json({
      start,
      end,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error fetching data", details: error.message });
  }
});

// get monthly movement transactions
router.get("/monthly/:month", async (req, res) => {
  try {
    const { month } = req.params; // now using route param

    if (!month) {
      return res.status(400).json({ error: "Missing month parameter" });
    }

    // Parse year and month
    const [year, mon] = month.split("-").map(Number);
    if (!year || !mon || mon < 1 || mon > 12) {
      return res.status(400).json({ error: "Invalid month format, use YYYY-MM" });
    }

    // Start and end of the month
    const startDate = new Date(year, mon - 1, 1);
    const endDate = new Date(year, mon, 1); // first day of next month

    // Query database
    const [rows] = await db.query(
      `SELECT *
       FROM movement_transactions
       WHERE entry_datetime >= ? AND entry_datetime < ?
       ORDER BY entry_datetime ASC`,
      [startDate, endDate]
    );

    if(rows.length === 0) {
      return res.status(404).json({ error: "No records found for this month" });
    }

    res.json({
      month,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error fetching monthly data", details: error.message });
  }
});

// get monthly statistics
router.get("/counter/monthly", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Missing month parameter" });
    }

    // Parse year and month
    const [year, mon] = month.split("-").map(Number);
    if (!year || !mon || mon < 1 || mon > 12) {
      return res.status(400).json({ error: "Invalid month format, use YYYY-MM" });
    }

    // Start and end of the month
    const startDate = new Date(year, mon - 1, 1);
    const endDate = new Date(year, mon, 1); // next month

    // Query database
    const [rows] = await db.query(
      `SELECT MONTH(entry_datetime) AS month, YEAR(entry_datetime) AS year, COUNT(*) AS entries
       FROM movement_transactions
       WHERE entry_datetime >= ? AND entry_datetime < ?
       GROUP BY YEAR(entry_datetime), MONTH(entry_datetime)
       ORDER BY YEAR(entry_datetime), MONTH(entry_datetime)`,
      [startDate, endDate]
    );

    res.json({
      month,
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error fetching monthly statistics", details: error.message });
  }
});


module.exports = router;