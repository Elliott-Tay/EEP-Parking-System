const express = require("express");
const router = express.Router();
const db = require("../database/db"); // use the same db connection

// Get all movement transactions
// This route fetches all movement transactions from the database
// Example: GET /api/movements
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
// Format: /api/movements/:vehicle_no
// Example: /api/movements/IU123
router.get("/:vehicle_no", async (req, res) => {
  try {
    const { vehicle_no } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM movement_transactions WHERE vehicle_id = ?",
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
// Format: YYYY-MM-DD
// Example: /api/movements/range?start=2025-08-01&end=2025-08-19
router.get("/range", async (req, res) => {
  try {
    const { start, end } = req.query; 

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

// Get all transactions for a specific month
// Format: YYYY-MM (e.g., 2025-08)
router.get("/monthly/:month", async (req, res) => {
  try {
    const { month } = req.params;

    if (!month) {
      return res.status(400).json({ error: "Missing month parameter" });
    }

    const [year, mon] = month.split("-").map(Number);
    if (!year || !mon || mon < 1 || mon > 12) {
      return res.status(400).json({ error: "Invalid month format, use YYYY-MM" });
    }

    const startDate = new Date(year, mon - 1, 1);
    const endDate = new Date(year, mon, 1); // next month

    const [rows] = await db.query(
        `SELECT *
        FROM movement_transactions
        WHERE entry_datetime >= ? AND entry_datetime < ?`,
        [startDate, endDate]
    );


    if (rows.length === 0) {
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
// Format: YYYY-MM (e.g., 2025-08)
// Example: /api/movements/counter/monthly?month=2025-08
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

// POST a new movement transaction with FK checks
router.post("/", async (req, res) => {
  const {
    vehicle_id,
    entry_trans_type,
    entry_station_id,
    entry_datetime,
    entry_datetime_detect,
    exit_trans_type,
    exit_station_id,
    exit_datetime,
    exit_datetime_detect,
    parking_duration,
    parking_charges,
    paid_amount,
    card_type,
    card_number,
    vehicle_number,
    ticket_type,
    ticket_id,
    receipt_bit
  } = req.body;

  if (!vehicle_id || !entry_trans_type || !entry_station_id || !entry_datetime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Upsert entry_trans_type
    if (entry_trans_type) {
      await conn.query(
        `INSERT INTO transtypemaster (log_id, trans_desc, status, updated_by, updated_datetime)
         VALUES (?, ?, 1, 1, NOW())
         ON DUPLICATE KEY UPDATE log_id=log_id`,
        [entry_trans_type, "Unknown"]
      );
    }

    // Upsert exit_trans_type
    if (exit_trans_type) {
      await conn.query(
        `INSERT INTO transtypemaster (log_id, trans_desc, status, updated_by, updated_datetime)
         VALUES (?, ?, 1, 1, NOW())
         ON DUPLICATE KEY UPDATE log_id=log_id`,
        [exit_trans_type, "Unknown"]
      );
    }

    // Upsert entry_station
    if (entry_station_id) {
      await conn.query(
        `INSERT INTO stationinfomaster (station_id, station_type, station_desc, station_ipaddress, zone_id, status, update_by, update_datetiem)
         VALUES (?, 1, 'Unknown', '', 1, 1, 1, NOW())
         ON DUPLICATE KEY UPDATE station_id=station_id`,
        [entry_station_id]
      );
    }

    // Upsert exit_station
    if (exit_station_id) {
      await conn.query(
        `INSERT INTO stationinfomaster (station_id, station_type, station_desc, station_ipaddress, zone_id, status, update_by, update_datetiem)
         VALUES (?, 2, 'Unknown', '', 1, 1, 1, NOW())
         ON DUPLICATE KEY UPDATE station_id=station_id`,
        [exit_station_id]
      );
    }

    // Upsert card_type
    if (card_type) {
      await conn.query(
        `INSERT INTO cardtypemaster (card_id, card_desc, status, updated_by, updated_datetime)
         VALUES (?, 'Unknown', 1, 1, NOW())
         ON DUPLICATE KEY UPDATE card_id=card_id`,
        [card_type]
      );
    }

    // Upsert ticket
    if (ticket_id) {
      await conn.query(
        `INSERT INTO ticketmaster (ticket_id, ticket_type, ticket_no, valid_datetime, expire_datetime, status)
         VALUES (?, ?, 'Unknown', NOW(), NOW(), 0)
         ON DUPLICATE KEY UPDATE ticket_id=ticket_id`,
        [ticket_id, ticket_type || 1]
      );
    }

    // Insert movement transaction
    const [result] = await conn.query(
      `INSERT INTO movement_transactions 
      (vehicle_id, entry_trans_type, entry_station_id, entry_datetime, entry_datetime_detect,
       exit_trans_type, exit_station_id, exit_datetime, exit_datetime_detect,
       parking_duration, parking_charges, paid_amount, card_type, card_number,
       vehicle_number, ticket_type, ticket_id, receipt_bit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vehicle_id,
        entry_trans_type,
        entry_station_id,
        entry_datetime,
        entry_datetime_detect || null,
        exit_trans_type || null,
        exit_station_id || null,
        exit_datetime || null,
        exit_datetime_detect || null,
        parking_duration || null,
        parking_charges || null,
        paid_amount || null,
        card_type || null,
        card_number || null,
        vehicle_number || null,
        ticket_type || null,
        ticket_id || null,
        receipt_bit !== undefined ? receipt_bit : 0
      ]
    );

    await conn.commit();
    res.status(201).json({ message: "Transaction created successfully", log_id: result.insertId });

  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ error: "Database error", details: error.message });
  } finally {
    conn.release();
  }
});

// POST exit transaction in movement transactions
// This assumes the vehicle has already entered and we are just updating the exit details
router.post("/exit", async (req, res) => {
  const {
    vehicle_id,
    exit_trans_type,
    exit_station_id,
    exit_datetime,
    exit_datetime_detect,
    parking_duration,
    parking_charges,
    paid_amount,
    receipt_bit
  } = req.body;

  if (!vehicle_id || !exit_trans_type || !exit_station_id || !exit_datetime) {
    return res.status(400).json({ error: "Missing required fields for exit" });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Find the latest movement transaction for this vehicle
    const [rows] = await conn.query(
      `SELECT * FROM movement_transactions 
       WHERE vehicle_id = ? 
       ORDER BY entry_datetime DESC 
       LIMIT 1`,
      [vehicle_id]
    );

    if (rows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "No entry found for this vehicle" });
    }

    const latest = rows[0];

    if (latest.exit_datetime) {
      await conn.rollback();
      return res.status(400).json({ error: "Exit already recorded for the latest entry" });
    }

    if (exit_trans_type) {
      await conn.query(
        `INSERT INTO transtypemaster (log_id, trans_desc, status, updated_by, updated_datetime)
         VALUES (?, 'Unknown', 1, 1, NOW())
         ON DUPLICATE KEY UPDATE log_id=log_id`,
        [exit_trans_type]
      );
    }

    if (exit_station_id) {
      await conn.query(
        `INSERT INTO stationinfomaster (station_id, station_type, station_desc, station_ipaddress, zone_id, status, update_by, update_datetime)
         VALUES (?, 2, 'Unknown', '', 1, 1, 1, NOW())
         ON DUPLICATE KEY UPDATE station_id=station_id`,
        [exit_station_id]
      );
    }

    // Update exit details in the latest transaction
    await conn.query(
      `UPDATE movement_transactions
       SET exit_trans_type=?, exit_station_id=?, exit_datetime=?, exit_datetime_detect=?,
           parking_duration=?, parking_charges=?, paid_amount=?, receipt_bit=?
       WHERE log_id=?`,
      [
        exit_trans_type,
        exit_station_id,
        exit_datetime,
        exit_datetime_detect || null,
        parking_duration || null,
        parking_charges || null,
        paid_amount || null,
        receipt_bit !== undefined ? receipt_bit : 1,
        latest.log_id
      ]
    );

    await conn.commit();
    res.json({ message: "Exit recorded successfully", log_id: latest.log_id });

  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ error: "Database error", details: error.message });
  } finally {
    conn.release();
  }
});


module.exports = router;