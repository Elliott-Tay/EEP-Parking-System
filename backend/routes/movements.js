const express = require("express");
const router = express.Router();
const db = require("../database/db"); // use the same db connection
const { sql, config } = require("../database/db"); // use the same db connection
const MovementDTO = require('../DTO/movementDTO');
const TransactionCheckerDTO = require("../DTO/transactionCheckerDTO");
const SeasonCheckerDTO = require("../DTO/seasonCheckerDTO");
const entryStationDTO = require("../DTO/entryStationDTO");
const cors = require('cors');

let entryClients = [];
let exitClients = [];


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

router.get("/", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    const result = await pool.request().execute("dbo.uspGetMovementTrans");

    // Map the recordset to DTOs
    const response = result.recordset.map(row => new MovementDTO(row));

    res.json(response);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database error: " + err.message);
  }
});

/**
 * @swagger
 * /api/movements/entry-movements:
 *   post:
 *     summary: Log vehicle entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               VehicleNo:
 *                 type: string
 *               Station:
 *                 type: string
 *               Time:
 *                 type: string
 *                 format: date-time
 *               Status:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Error
 */
router.post("/entry-movements", async (req, res) => {
  try {
    const data = req.body;

    const pool = await sql.connect(config);

    // Call the stored procedure instead of raw INSERT
    await pool.request()
      .input("vehicle_number", sql.NVarChar, data.VehicleNo)
      .input("entry_station_id", sql.NVarChar, data.Station)
      .input("entry_datetime", sql.DateTime, data.Time)
      .input("entry_datetime_detect", sql.DateTime, new Date()) // detection time = now
      .input("entry_trans_type", sql.NVarChar, data.Status) // or map OK/ERROR to a type
      .execute("sp_InsertEntryMovement"); // <-- call the stored procedure

    res.json({ success: true, ack: "ACK", data });

  } catch (error) {
    console.error("Error in POST /entry-movement:", error);
    res.status(500).json({ success: false, ack: "NACK", error: error.message });
  }
});

/**
 * @swagger
 * /exit-movements:
 *   post:
 *     summary: Log vehicle exit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               VehicleNo:
 *                 type: string
 *               Station:
 *                 type: string
 *               Time:
 *                 type: string
 *                 format: date-time
 *               PaymentCardNo:
 *                 type: string
 *               Fee:
 *                 type: number
 *               Balance:
 *                 type: number
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

router.post("/exit-movements", async (req, res) => {
  try {
    const { Station, Time, VehicleNo, PaymentCardNo, Fee, Balance } = req.body;

    if (!Station || !Time || !VehicleNo) {
      return res.status(400).json({
        success: false,
        ack: "NACK",
        error: "Missing required fields: Station, Time, VehicleNo"
      });
    }

    const pool = await sql.connect(config);

    // Call stored procedure instead of manual SELECT + UPDATE
    await pool.request()
      .input("VehicleNo", sql.NVarChar, VehicleNo)
      .input("Station", sql.NVarChar, Station)
      .input("Time", sql.DateTime, Time)
      .input("PaymentCardNo", sql.NVarChar, PaymentCardNo || null)
      .input("Fee", sql.Decimal(10, 2), Fee || 0)
      .input("Balance", sql.Decimal(10, 2), Balance || 0)
      .execute("sp_UpdateExitMovement"); 

    res.json({
      success: true,
      ack: "ACK",
      message: "Exit info updated via stored procedure"
    });

  } catch (err) {
    console.error("Error updating exit movement:", err);
    res.status(500).json({
      success: false,
      ack: "NACK",
      error: err.message
    });
  }
});

/**
 * @swagger
 * /transaction-checker:
 *   get:
 *     summary: Fetch transaction checker data
 *     responses:
 *       200:
 *         description: List of transaction checker records
 *       500:
 *         description: Database error
 */

router.get("/transaction-checker", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    const result = await pool.request().execute("dbo.uspGetTransactionChecker");

    //Map the recordset to DTOs
    const response = result.recordset.map(row => new TransactionCheckerDTO(row));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error and we cannot fetch transaction_tracker table: ", error});
  }
});

/**
 * @swagger
 * /season-checker:
 *   get:
 *     summary: Fetch season checker data
 *     responses:
 *       200:
 *         description: List of season checker records
 *       500:
 *         description: Database error
 */
router.get("/season-checker", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    const result = await pool.request().execute("dbo.uspGetSeasonChecker");
    //Map the recordset to DTOs
    const response = (result.recordset || []).map(row => new SeasonCheckerDTO(row));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error and we cannot fetch season_tracker table: ", error});
  }
});

/**
 * @swagger
 * /day/{date}:
 *   get:
 *     summary: Fetch movement transactions for a specific date
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-09-12"
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: List of movement transactions for the given date
 *       400:
 *         description: Missing or invalid date parameter
 *       404:
 *         description: No records found for this date
 *       500:
 *         description: Database error
 */
router.get("/day/:date", async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) return res.status(400).json({ error: "Missing date parameter" });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: "Invalid date format, use YYYY-MM-DD" });
    }

    const query = `
      SELECT *
      FROM MovementTrans
      WHERE CONVERT(VARCHAR, entry_datetime, 23) = @date
      ORDER BY entry_datetime ASC
    `;

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('date', sql.VarChar, date) // pass date as string
      .query(query);

    const rows = result.recordset;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No records found for this date" });
    }

    res.json({ date, count: rows.length, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error fetching data", details: error.message });
  }
});

router.get("/monthly/:month", async (req, res) => {
  try {
    const { month } = req.params;
    if (!month) return res.status(400).json({ error: "Missing month parameter" });

    const [year, mon] = month.split("-").map(Number);
    if (!year || !mon || mon < 1 || mon > 12) {
      return res.status(400).json({ error: "Invalid month format, use YYYY-MM" });
    }

    const startDate = new Date(year, mon - 1, 1);
    const endDate = new Date(year, mon, 1); // first day of next month

    const pool = await sql.connect(config); // your MSSQL config
    const result = await pool.request()
      .input("startDate", sql.DateTime, startDate)
      .input("endDate", sql.DateTime, endDate)
      .query(`
        SELECT *
        FROM MovementTrans
        WHERE entry_datetime >= @startDate AND entry_datetime < @endDate
        ORDER BY entry_datetime ASC
      `);

    const rows = result.recordset;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No records found for this month" });
    }

    res.json({ month, count: rows.length, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error fetching monthly data", details: error.message });
  }
});

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

// SSE for entry stations
router.get("/stream/entries", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  entryClients.push(res);

  req.on("close", () => {
    entryClients = entryClients.filter(c => c !== res);
  });
});

// SSE for exit stations
router.get("/stream/exits", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  exitClients.push(res);

  req.on("close", () => {
    exitClients = exitClients.filter(c => c !== res);
  });
});

// Broadcast helpers
function broadcastEntry(data) {
  entryClients.forEach(c => c.write(`data: ${JSON.stringify(data)}\n\n`));
}

function broadcastExit(data) {
  exitClients.forEach(c => c.write(`data: ${JSON.stringify(data)}\n\n`));
}

/**
 * @swagger
 * /entry-station:
 *   post:
 *     summary: Broadcast vehicle entry to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               VehicleNo: { type: string }
 *               Station: { type: string }
 *               Time: { type: string, format: date-time }
 *               Status: { type: string }
 *     responses:
 *       200:
 *         description: Broadcast successful
 *       500:
 *         description: Internal server error
 */
router.post("/entry-station", (req, res) => {
  try {
    const data = req.body;
    broadcastEntry(data);
    res.json({ success: true, ack: "ACK", data });
  } catch (error) {
    console.error("Error in /entry-station:", error);
    res.status(500).json({ success: false, ack: "NACK", error: error.message });
  }
});

/**
 * @swagger
 * /exit-station:
 *   post:
 *     summary: Broadcast vehicle exit to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               VehicleNo: { type: string }
 *               Station: { type: string }
 *               Time: { type: string, format: date-time }
 *               PaymentCardNo: { type: string }
 *               Fee: { type: number }
 *               Balance: { type: number }
 *     responses:
 *       200:
 *         description: Broadcast successful
 *       500:
 *         description: Internal server error
 */
router.post("/exit-station", (req, res) => {
  try {
    const data = req.body;
    broadcastExit(data);
    res.json({ success: true, ack: "ACK", data });
  } catch (error) {
    console.error("Error in /exit-station:", error);
    res.status(500).json({ success: false, ack: "NACK", error: error.message });
  }
});

/**
 * Helper function to update lot status for entry or exit
 */
function updateLot(zone, type, isEntry = true, allocated = 1) {
  // Initialize zone if it doesn’t exist
  if (!lotStatus[zone]) lotStatus[zone] = [];

  // Find slot by type
  let slot = lotStatus[zone].find(s => s.type === type);

  if (!slot) {
    // Initialize slot if it doesn’t exist
    slot = {
      type,
      allocated,      // set initial allocation from payload
      occupied: 0,
      available: allocated,
      updated_at: new Date(),
    };
    lotStatus[zone].push(slot);
  } else {
    // Update allocated if backend provides a new value
    if (allocated > 0) slot.allocated = allocated;
  }

  // Update occupied count
  if (isEntry) {
    slot.occupied = Math.min(slot.allocated, slot.occupied + 1);
  } else {
    slot.occupied = Math.max(0, slot.occupied - 1);
  }

  // Recalculate available and timestamp
  slot.available = slot.allocated - slot.occupied;
  slot.updated_at = new Date();

  return slot;
}

/**
 * @swagger
 * /lot-status-entry:
 *   post:
 *     summary: Update parking lot status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zone: { type: string }
 *               type: { type: string }
 *               msg_type: { type: string }
 *               msg_datetime: { type: string, format: date-time }
 *               msg: { type: string }
 *     responses:
 *       200:
 *         description: Lot status received successfully
 *       400:
 *         description: Invalid request payload
 *       500:
 *         description: Internal server error
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
 * /lot-status-exit:
 *   post:
 *     summary: Update parking lot status on exit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zone: { type: string }
 *               type: { type: string }
 *               msg_type: { type: string }
 *               msg_datetime: { type: string, format: date-time }
 *               msg: { type: string }
 *     responses:
 *       200:
 *         description: Lot status received successfully
 *       400:
 *         description: Invalid request payload
 *       500:
 *         description: Internal server error
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