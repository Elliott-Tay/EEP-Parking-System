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

router.post("/entry-movements", async (req, res) => {
  try {
    const data = req.body;

    const pool = await sql.connect(config);

    await pool.request()
      .input("vehicle_number", sql.NVarChar, data.VehicleNo)
      .input("entry_station_id", sql.NVarChar, data.Station)
      .input("entry_datetime", sql.DateTime, data.Time)
      .input("entry_datetime_detect", sql.DateTime, new Date()) // maybe detection time = now
      .input("entry_trans_type", sql.NVarChar, data.Status) // or map OK/ERROR to a type
      .query(`
        INSERT INTO MovementTrans 
          (vehicle_number, entry_station_id, entry_datetime, entry_datetime_detect, entry_trans_type, update_datetime) 
        VALUES 
          (@vehicle_number, @entry_station_id, @entry_datetime, @entry_datetime_detect, @entry_trans_type, GETDATE())
      `);

    res.json({ success: true, ack: "ACK", data });

  } catch (error) {
    console.error("Error in POST /entry-movement:", error);
    res.status(500).json({ success: false, ack: "NACK", error: error.message });
  }
});

router.post("/exit-movements", async (req, res) => {
  try {
    const {
      Station,
      Time,
      VehicleNo,
      PaymentCardNo,
      Fee,
      Balance,
    } = req.body;

    if (!Station || !Time || !VehicleNo) {
      return res.status(400).json({
        success: false,
        ack: "NACK",
        error: "Missing required fields: Station, Time, VehicleNo"
      });
    }

    const pool = await sql.connect(config);

    await pool.request()
      .input("exit_station_id", sql.NVarChar, Station)
      .input("exit_datetime", sql.DateTime, Time)
      .input("exit_datetime_detect", sql.DateTime, new Date())
      .input("vehicle_number", sql.NVarChar, VehicleNo)
      .input("card_number", sql.NVarChar, PaymentCardNo || null)
      .input("card_type", sql.NVarChar, null) // frontend doesn’t send card_type
      .input("parking_charges", sql.Decimal(10, 2), Fee || 0)
      .input("paid_amount", sql.Decimal(10, 2), Balance || 0)
      .input("update_datetime", sql.DateTime, new Date())
      .query(`
        INSERT INTO MovementTrans (
          exit_station_id,
          exit_datetime,
          exit_datetime_detect,
          vehicle_number,
          card_number,
          card_type,
          parking_charges,
          paid_amount,
          update_datetime
        )
        VALUES (
          @exit_station_id,
          @exit_datetime,
          @exit_datetime_detect,
          @vehicle_number,
          @card_number,
          @card_type,
          @parking_charges,
          @paid_amount,
          @update_datetime
        )
      `);

    res.json({
      success: true,
      ack: "ACK",
      message: "Exit movement recorded"
    });

  } catch (err) {
    console.error("Error inserting exit movement:", err);
    res.status(500).json({
      success: false,
      ack: "NACK",
      error: err.message
    });
  }
});


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

// Call these whenever a new POST comes in
router.post("/entry-station", (req, res) => {
  try {
    const data = req.body;
    console.log('data', data);
    broadcastEntry(data);
    res.json({ success: true, ack: "ACK", data });
  } catch (error) {
    console.error("Error in /entry-station:", error);
    res.status(500).json({ success: false, ack: "NACK", error: error.message });
  }
});

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