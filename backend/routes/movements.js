const express = require("express");
const router = express.Router();
const db = require("../database/db"); // use the same db connection

/**
 * @swagger
 * tags:
 *   name: Movements
 *   description: Endpoints for vehicle movement transactions
 */

// Keep a simple in-memory counter (reset on server restart)
carsInLot = 0

// In-memory lot status
let lotStatus = {};

/**
 * @swagger
 * /movements:
 *   get:
 *     summary: Get all movement transactions
 *     tags: [Movements]
 *     responses:
 *       200:
 *         description: List of movement transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Database error
 */
router.get("/", async (req, res) => {
  try {
    // amend the db query when Daniel provides the table name
    const [rows] = await db.query("SELECT * FROM movement_transactions");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error and we cannot fetch movement_transactions table: ", error});
  }
});

router.get("/transaction-checker", async (req, res) => {
  try {
    // amend the db query when Daniel provides the table name
    const [rows] = await db.query("SELECT * FROM transaction_tracker");
    res.json(rows)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error and we cannot fetch transaction_tracker table: ", error});
  }
});


router.get("/season-checker", async (req, res) => {
  try {
    // amend the db query when Daniel provides the table name
    const [rows] = await db.query("SELECT * FROM season_tracker");
    res.json(rows)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error and we cannot fetch season_tracker table: ", error});
  }
});

/**
 * @swagger
 * /movements/range:
 *   get:
 *     summary: Get movement transactions within a date range
 *     tags: [Movements]
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           example: "2025-08-01"
 *         required: true
 *         description: Start date in YYYY-MM-DD
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           example: "2025-08-19"
 *         required: true
 *         description: End date in YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Transactions found
 *       400:
 *         description: Invalid request
 *       404:
 *         description: No records found
 */
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
        WHERE entry_datetime >= ? AND entry_datetime < ?
        ORDER BY entry_datetime ASC;`,
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

/**
 * @swagger
 * /movements/{vehicle_no}:
 *   get:
 *     summary: Get movement transaction by vehicle number
 *     tags: [Movements]
 *     parameters:
 *       - in: path
 *         name: vehicle_no
 *         required: true
 *         schema:
 *           type: string
 *         example: IU123
 *     responses:
 *       200:
 *         description: A movement record for that vehicle
 *       404:
 *         description: No record found
 */
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

/**
 * @swagger
 * /movements/day/{date}:
 *   get:
 *     summary: Get movement transactions for a single day
 *     tags: [Movements]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: 2025-08-20
 *     responses:
 *       200:
 *         description: Transactions found
 *       400:
 *         description: Invalid or missing date
 *       404:
 *         description: No records found
 */
router.get("/day/:date", async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({ error: "Missing date parameter" });
    }

    const startDate = new Date(date);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format, use YYYY-MM-DD" });
    }

    // End of the day (next day at 00:00)
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    // Query database
    const [rows] = await db.query(
      `SELECT *
       FROM movement_transactions
       WHERE entry_datetime >= ? AND entry_datetime < ?
       ORDER BY entry_datetime ASC`,
      [startDate, endDate]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No records found for this day" });
    }

    res.json({
      date,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error fetching data", details: error.message });
  }
});

/**
 * @swagger
 * /monthly/{month}:
 *   get:
 *     summary: Get all transactions for a specific month
 *     description: Returns all movement transactions for a given month (format: YYYY-MM).
 *     tags: [Movements]
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-(0[1-9]|1[0-2])$'
 *         description: Month in format YYYY-MM (e.g., 2025-08)
 *         example: "2025-08"
 *     responses:
 *       200:
 *         description: Transactions found for the given month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 month:
 *                   type: string
 *                   example: "2025-08"
 *                 count:
 *                   type: integer
 *                   example: 12
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 101
 *                       vehicle_plate:
 *                         type: string
 *                         example: "ABC1234"
 *                       entry_datetime:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-05T09:30:00Z"
 *                       exit_datetime:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-08-05T12:45:00Z"
 *       400:
 *         description: Missing or invalid month parameter
 *       404:
 *         description: No records found for this month
 *       500:
 *         description: Database error fetching monthly data
 */
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

/**
 * @swagger
 * /counter/monthly:
 *   get:
 *     summary: Get monthly statistics of transactions
 *     description: Returns aggregated statistics (entry counts) for the given month (format: YYYY-MM).
 *     tags: [Movements]
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-(0[1-9]|1[0-2])$'
 *         description: Month in format YYYY-MM (e.g., 2025-08)
 *         example: "2025-08"
 *     responses:
 *       200:
 *         description: Statistics found for the given month
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 month:
 *                   type: string
 *                   example: "2025-08"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       year:
 *                         type: integer
 *                         example: 2025
 *                       month:
 *                         type: integer
 *                         example: 8
 *                       entries:
 *                         type: integer
 *                         example: 120
 *       400:
 *         description: Missing or invalid month parameter
 *       500:
 *         description: Database error fetching monthly statistics
 */
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

/**
 * @swagger
 * /movements/entry:
 *   post:
 *     summary: Create a new entry transaction
 *     tags: [Movements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicle_id:
 *                 type: string
 *               entry_trans_type:
 *                 type: string
 *               entry_station_id:
 *                 type: string
 *               entry_datetime:
 *                 type: string
 *                 example: "2025-08-25T09:30:00Z"
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Database error
 */
router.post("/entry", async (req, res) => {
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

/**
 * @swagger
 * /movements/exit:
 *   post:
 *     summary: Record an exit for a vehicle
 *     tags: [Movements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicle_id:
 *                 type: string
 *               exit_trans_type:
 *                 type: string
 *               exit_station_id:
 *                 type: string
 *               exit_datetime:
 *                 type: string
 *                 example: "2025-08-25T09:45:00Z"
 *     responses:
 *       200:
 *         description: Exit recorded successfully
 *       400:
 *         description: Missing fields / exit already recorded
 *       404:
 *         description: No entry found
 *       500:
 *         description: Database error
 */
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

/**
 * @swagger
 * /movements/entry-station:
 *   post:
 *     summary: Receive entry station status (TS → OPC)
 *     tags: [Movements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               msg_type:
 *                 type: string
 *               msg_datetime:
 *                 type: string
 *               msg:
 *                 type: string
 *     responses:
 *       200:
 *         description: Acknowledged successfully
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Internal server error
 */
router.post("/entry-station", (req, res) => {
  try {
    const { msg_type, msg_datetime, msg } = req.body;

    // Basic validation
    if (!msg_type || !msg_datetime || !msg) {
      const errorPayload = { message: "Missing msg_type, msg_datetime or msg" };
      req.io?.emit("entry-station-error", errorPayload);
      return res.status(400).json({
        success: false,
        ack: "NACK",
        ...errorPayload,
      });
    }

    // Validate datetime
    if (isNaN(Date.parse(msg_datetime))) {
      const errorPayload = { message: "Invalid datetime format" };
      req.io?.emit("entry-station-error", errorPayload);
      return res.status(400).json({
        success: false,
        ack: "NACK",
        ...errorPayload,
      });
    }

    // Emit event via socket
    const payload = { msg_type, msg_datetime, msg };
    req.io?.emit("entry-station", payload);

    return res.status(200).json({
      success: true,
      ack: "ACK",
      data: payload,
    });

  } catch (error) {
    console.error("Error in /entry-station:", error.stack || error);
    const errorPayload = { message: "Internal server error: " + error };
    req.io?.emit("entry-station-error", errorPayload);
    return res.status(500).json({
      success: false,
      ack: "NACK",
      ...errorPayload,
    });
  }
});

/**
 * @swagger
 * /movements/exit-station:
 *   post:
 *     summary: Receive exit station status (TS → OPC)
 *     tags: [Movements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               msg_type:
 *                 type: string
 *               msg_datetime:
 *                 type: string
 *               msg:
 *                 type: string
 *     responses:
 *       200:
 *         description: Acknowledged successfully
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Internal server error
 */
router.post("/exit-station", (req, res) => {
  try {
    const { msg_type, msg_datetime, msg } = req.body;

    // Basic validation
    if (!msg_type || !msg_datetime || !msg) {
      const errorPayload = { message: "Missing msg_type, msg_datetime or msg" };
      req.io?.emit("exit-station-error", errorPayload);
      return res.status(400).json({
        success: false,
        ack: "NACK",
        ...errorPayload,
      });
    }

    // Validate datetime
    if (isNaN(Date.parse(msg_datetime))) {
      const errorPayload = { message: "Invalid datetime format" };
      req.io?.emit("exit-station-error", errorPayload);
      return res.status(400).json({
        success: false,
        ack: "NACK",
        ...errorPayload,
      });
    }

    // Emit event via socket
    const payload = { msg_type, msg_datetime, msg };
    req.io?.emit("exit-station", payload);

    return res.status(200).json({
      success: true,
      ack: "ACK",
      data: payload,
    });

  } catch (error) {
    console.error("Error in /exit-station:", error.stack || error);
    const errorPayload = { message: "Internal server error: " + error };
    req.io?.emit("exit-station-error", errorPayload);
    return res.status(500).json({
      success: false,
      ack: "NACK",
      ...errorPayload,
    });
  }
});

/**
 * Helper function to update lot status for entry or exit
 */
function updateLot(zone, type, isEntry = true) {
  if (!lotStatus[zone]) {
    // Initialize zone if it doesn’t exist
    lotStatus[zone] = [];
  }

  let slot = lotStatus[zone].find(t => t.type === type);

  if (!slot) {
    // Initialize type in zone if it doesn’t exist
    slot = { type, allocated: 0, occupied: 0, updated_at: new Date() };
    lotStatus[zone].push(slot);
  }

  // Update occupied count
  if (isEntry) {
    slot.occupied = Math.min(slot.allocated, slot.occupied + 1);
  } else {
    slot.occupied = Math.max(0, slot.occupied - 1);
  }

  // Update timestamp
  slot.updated_at = new Date();

  // Compute available dynamically
  slot.available = slot.allocated - slot.occupied;

  return slot;
}

/**
 * @swagger
 * paths:
 *   /lot-status-entry:
 *     post:
 *       summary: Record a car entering the lot
 *       description: "Receives lot entry information for a specific zone and type.\nUpdates the occupied count and emits the new lot status via socket.\nReturns acknowledgment to the caller."
 *       tags:
 *         - Lot Status
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - zone
 *                 - type
 *                 - msg_type
 *                 - msg_datetime
 *                 - msg
 *               properties:
 *                 zone:
 *                   type: string
 *                   description: Zone name (e.g., "zoneA")
 *                   example: "zoneA"
 *                 type:
 *                   type: string
 *                   description: Parking type (hourly, season, etc.)
 *                   example: "hourly"
 *                 msg_type:
 *                   type: string
 *                   description: Type of message (e.g., "entry")
 *                   example: "entry"
 *                 msg_datetime:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of the event
 *                   example: "2025-09-01T10:15:30Z"
 *                 msg:
 *                   type: string
 *                   description: Additional message or note
 *                   example: "Car entered"
 *       responses:
 *         '200':
 *           description: Lot entry recorded successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "success"
 *                   code:
 *                     type: integer
 *                     example: 200
 *                   message:
 *                     type: string
 *                     example: "Lot status received"
 *                   ack:
 *                     type: string
 *                     example: "ACK"
 *                   slot:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "hourly"
 *                       allocated:
 *                         type: integer
 *                         example: 50
 *                       occupied:
 *                         type: integer
 *                         example: 10
 *                       available:
 *                         type: integer
 *                         example: 40
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-01T10:15:30Z"
 *         '400':
 *           description: Invalid request payload
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "error"
 *                   code:
 *                     type: integer
 *                     example: 400
 *                   message:
 *                     type: string
 *                     example: "Invalid request payload"
 *                   ack:
 *                     type: string
 *                     example: "NACK"
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "error"
 *                   code:
 *                     type: integer
 *                     example: 500
 *                   message:
 *                     type: string
 *                     example: "Internal server error"
 *                   ack:
 *                     type: string
 *                     example: "NACK"
 */

router.post("/lot-status-entry", async (req, res) => {
  try {
    const { zone, type, msg_type, msg_datetime, msg } = req.body;

    if (!zone || !type || !msg_type || !msg_datetime || !msg) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Invalid request payload",
        ack: "NACK",
      });
    }

    const updatedSlot = updateLot(zone, type, true);

    // Emit updated lot status via socket
    req.io?.emit("lot-update", { zone, slot: updatedSlot });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Lot status received",
      ack: "ACK",
      slot: updatedSlot,
    });
  } catch (error) {
    console.error("Lot Status Entry Error:", error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
      ack: "NACK",
    });
  }
});

/**
 * @swagger
 * paths:
 *   /lot-status-exit:
 *     post:
 *       summary: Record a car exiting the lot
 *       description: "Receives lot exit information for a specific zone and type.\nUpdates the occupied count and emits the new lot status via socket.\nReturns acknowledgment to the caller."
 *       tags:
 *         - Lot Status
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - zone
 *                 - type
 *                 - msg_type
 *                 - msg_datetime
 *                 - msg
 *               properties:
 *                 zone:
 *                   type: string
 *                   description: Zone name (e.g., "zoneA")
 *                   example: "zoneA"
 *                 type:
 *                   type: string
 *                   description: Parking type (hourly, season, etc.)
 *                   example: "hourly"
 *                 msg_type:
 *                   type: string
 *                   description: Type of message (e.g., "exit")
 *                   example: "exit"
 *                 msg_datetime:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of the event
 *                   example: "2025-09-01T10:20:30Z"
 *                 msg:
 *                   type: string
 *                   description: Additional message or note
 *                   example: "Car exited"
 *       responses:
 *         '200':
 *           description: Lot exit recorded successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "success"
 *                   code:
 *                     type: integer
 *                     example: 200
 *                   message:
 *                     type: string
 *                     example: "Lot status received"
 *                   ack:
 *                     type: string
 *                     example: "ACK"
 *                   slot:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "hourly"
 *                       allocated:
 *                         type: integer
 *                         example: 50
 *                       occupied:
 *                         type: integer
 *                         example: 9
 *                       available:
 *                         type: integer
 *                         example: 41
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-01T10:20:30Z"
 *         '400':
 *           description: Invalid request payload
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "error"
 *                   code:
 *                     type: integer
 *                     example: 400
 *                   message:
 *                     type: string
 *                     example: "Invalid request payload"
 *                   ack:
 *                     type: string
 *                     example: "NACK"
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "error"
 *                   code:
 *                     type: integer
 *                     example: 500
 *                   message:
 *                     type: string
 *                     example: "Internal server error"
 *                   ack:
 *                     type: string
 *                     example: "NACK"
 */

router.post("/lot-status-exit", async (req, res) => {
  try {
    const { zone, type, msg_type, msg_datetime, msg } = req.body;

    if (!zone || !type || !msg_type || !msg_datetime || !msg) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Invalid request payload",
        ack: "NACK",
      });
    }

    const updatedSlot = updateLot(zone, type, false);

    // Emit updated lot status via socket
    req.io?.emit("lot-update", { zone, slot: updatedSlot });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Lot status received",
      ack: "ACK",
      slot: updatedSlot,
    });
  } catch (error) {
    console.error("Lot Status Exit Error:", error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
      ack: "NACK",
    });
  }
});

module.exports = router;