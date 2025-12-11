const express = require("express");
const router = express.Router();
const db = require("../database/db"); // use the same db connection
const { sql, config } = require("../database/db"); // use the same db connection
const MovementDTO = require('../DTO/movementDTO');;
const SeasonCheckerDTO = require("../DTO/seasonCheckerDTO");
const cors = require('cors');
const authenticateJWT = require("../../middleware/auth");
const auth = require("./auth");

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

// --- GET all movement transactions ---
router.get("/", authenticateJWT, async (req, res) => {
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

// Get all movement transactions for admin (paginated + filtering + date range)
router.get("/admin", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    let request = pool.request();

    // Pagination defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // Dynamic WHERE conditions
    let conditions = [];

    // Filtering options
    if (req.query.vehicle_number) {
      conditions.push("vehicle_number = @vehicle_number");
      request.input("vehicle_number", sql.VarChar, req.query.vehicle_number);
    }

    if (req.query.card_number) {
      conditions.push("card_number = @card_number");
      request.input("card_number", sql.VarChar, req.query.card_number);
    }

    if (req.query.entry_station_id) {
      conditions.push("entry_station_id = @entry_station_id");
      request.input("entry_station_id", sql.VarChar, req.query.entry_station_id);
    }

    if (req.query.exit_station_id) {
      conditions.push("exit_station_id = @exit_station_id");
      request.input("exit_station_id", sql.VarChar, req.query.exit_station_id);
    }

    // ⭐ NEW: Filter by vehicle_id
    if (req.query.vehicle_id) {
      conditions.push("vehicle_id = @vehicle_id");
      request.input("vehicle_id", sql.Int, req.query.vehicle_id);
    }

    // Date range filters
    if (req.query.entry_from) {
      conditions.push("entry_datetime >= @entry_from");
      request.input("entry_from", sql.DateTime, req.query.entry_from);
    }
    if (req.query.entry_to) {
      conditions.push("entry_datetime <= @entry_to");
      request.input("entry_to", sql.DateTime, req.query.entry_to);
    }

    if (req.query.exit_from) {
      conditions.push("exit_datetime >= @exit_from");
      request.input("exit_from", sql.DateTime, req.query.exit_from);
    }
    if (req.query.exit_to) {
      conditions.push("exit_datetime <= @exit_to");
      request.input("exit_to", sql.DateTime, req.query.exit_to);
    }

    // Build WHERE clause
    const whereClause =
      conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    // Query total count
    const totalResult = await request.query(`
      SELECT COUNT(*) AS total
      FROM MovementTrans
      ${whereClause}
    `);

    const total = totalResult.recordset[0].total;

    // Apply pagination
    request.input("limit", sql.Int, limit);
    request.input("offset", sql.Int, offset);

    // Final data SELECT
    const dataResult = await request.query(`
      SELECT 
        vehicle_id,
        entry_station_id,
        entry_datetime,
        exit_datetime,
        parking_charges,
        paid_amount,
        card_number,
        vehicle_number,
        paymentTransactionTime
      FROM MovementTrans
      ${whereClause}
      ORDER BY entry_datetime DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY;
    `);

    res.json({
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
      data: dataResult.recordset,
    });

  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// Unauthorised route for call-centre which do not require login
router.get("/call-center-movement", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute("dbo.uspGetMovementTrans");
    
    res.json(result.recordset); // return raw SQL rows directly
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

        // Call the stored procedure with ALL necessary inputs
        await pool.request()
          .input("vehicle_number", sql.NVarChar, data.VehicleNo)
          .input("entry_station_id", sql.NVarChar, data.Station)
          .input("entry_datetime", sql.DateTime, data.Time)
          .input("entry_datetime_detect", sql.DateTime, new Date())
          .input("entry_trans_type", sql.NVarChar, data.Status || "OK") // Use default
          .input("OBU_number", sql.NVarChar, data.OBU_number)
          .input("VCC", sql.NVarChar, data.VCC)
          .input("cardNumber", sql.NVarChar, data.CardNumber)
          .input("DSRC", sql.NVarChar, data.DSRC)
          .execute("sp_InsertEntryMovement"); 

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
    const { Station, Time, VehicleNo, PaymentCardNo, Fee, Balance, OBU_number, VCC, DSRC, DeductedAmount, PaymentTransactionTime, TypeOfPayment, EntryTime, ExitTime } = req.body;

    if (!Station || !Time || !VehicleNo) {
      return res.status(400).json({
        success: false,
        ack: "NACK",
        error: "Missing required fields: Station, Time, VehicleNo"
      });
    }

    const pool = await sql.connect(config);

    // Build payload matching DB fields
    const payload = {
      Station: Station,    
      ObuNo: OBU_number || null,
      VehicleNo,
      VCC: VCC || null,
      PaymentCardNo: PaymentCardNo || null,
      DSRC: DSRC || null,
      DeductedAmount: DeductedAmount || 0,
      PaymentTransactionTime: PaymentTransactionTime || null,
      TypeOfPayment: TypeOfPayment || null,
      EntryTime: EntryTime || Time,
      ExitTime: ExitTime || Time
    };

    // Call stored procedure
    await pool.request()
      .input("VehicleNo", sql.NVarChar, payload.VehicleNo)
      .input("Station", sql.NVarChar, Station)
      .input("Time", sql.DateTime, Time)
      .input("PaymentCardNo", sql.NVarChar, payload.PaymentCardNo)
      .input("Fee", sql.Decimal(10, 2), Fee || 0)
      .input("Balance", sql.Decimal(10, 2), Balance || 0)
      .input("OBU_number", sql.NVarChar, payload.ObuNo)
      .input("VCC", sql.NVarChar, payload.VCC)
      .input("DSRC", sql.NVarChar, payload.DSRC)
      .input("DeductedAmount", sql.Decimal(10, 2), payload.DeductedAmount)
      .input("PaymentTransactionTime", sql.DateTime, payload.PaymentTransactionTime)
      .input("TypeOfPayment", sql.NVarChar, payload.TypeOfPayment)
      .input("EntryTime", sql.DateTime, req.body.EntryTime || null)
      .input("ExitTime", sql.DateTime, payload.ExitTime)
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

    // Return the raw recordset directly
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Database error and we cannot fetch transaction_tracker table: ",
      details: error
    });
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
router.get("/day/:date", authenticateJWT, async (req, res) => {
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

router.get("/monthly/:month", authenticateJWT, async (req, res) => {
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

router.get("/overstayed", authenticateJWT, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query(`
      SELECT *,
             DATEDIFF(HOUR, entry_datetime, ISNULL(exit_datetime, GETDATE())) AS hours_parked
      FROM MovementTrans
      WHERE DATEDIFF(HOUR, entry_datetime, ISNULL(exit_datetime, GETDATE())) > 72
      ORDER BY entry_datetime ASC
    `);

    const rows = result.recordset;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "No vehicles have overstayed 72 hours." });
    }

    res.json({ count: rows.length, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error fetching overstayed vehicles", details: err.message });
  }
});

// --- GET entry transactions ---
router.get("/entry-transactions", authenticateJWT, async (req, res) => {
  const { start_date, end_date, ticket_search } = req.query;

  try {
    const pool = await sql.connect(config);
    let query = "SELECT * FROM MovementTrans WHERE 1=1";
    const request = pool.request();

    // Filter by Ticket/Card/Vehicle No (partial match)
    if (ticket_search) {
      query += ` AND (
        ticket_id LIKE @ticket_search OR
        card_number LIKE @ticket_search OR
        vehicle_number LIKE @ticket_search
      )`;
      request.input("ticket_search", sql.NVarChar, `%${ticket_search}%`);
    }

    // Filter by entry_datetime/date range
    if (start_date) {
      query += " AND entry_datetime >= @start_date";
      request.input("start_date", sql.DateTime, new Date(start_date));
    }
    if (end_date) {
      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999);
      query += " AND entry_datetime <= @end_date";
      request.input("end_date", sql.DateTime, end);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// --- GET exit transactions with flexible filters ---
router.get("/exit-valid-transactions", authenticateJWT, async (req, res) => {
  const { start_date, end_date, ticket_id, vehicle_number, card_number } = req.query;

  try {
    const pool = await sql.connect(config);
    let query = "SELECT * FROM MovementTrans WHERE exit_datetime IS NOT NULL";
    const request = pool.request();

    // Optional filters
    if (ticket_id) {
      query += " AND ticket_id LIKE @ticket_id";
      request.input("ticket_id", sql.NVarChar, `%${ticket_id}%`);
    }

    if (vehicle_number) {
      query += " AND vehicle_number LIKE @vehicle_number";
      request.input("vehicle_number", sql.NVarChar, `%${vehicle_number}%`);
    }

    if (card_number) {
      query += " AND card_number LIKE @card_number";
      request.input("card_number", sql.NVarChar, `%${card_number}%`);
    }

    // Date range filters
    if (start_date) {
      query += " AND exit_datetime >= @start_date";
      request.input("start_date", sql.DateTime, new Date(start_date));
    }

    if (end_date) {
      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999); // include the full day
      query += " AND exit_datetime <= @end_date";
      request.input("end_date", sql.DateTime, end);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// --- GET exit invalid transactions ---
router.get("/exit-invalid-transactions", authenticateJWT, async (req, res) => {
  const { start_date, end_date, ticket_id, vehicle_number, card_number } = req.query;

  try {
    const pool = await sql.connect(config);
    let query = "SELECT * FROM MovementTrans WHERE exit_datetime IS NULL AND parking_charges IS NULL AND paid_amount IS NULL ";
    const request = pool.request();

    // Optional filters
    if (ticket_id) {
      query += " AND ticket_id LIKE @ticket_id";
      request.input("ticket_id", sql.NVarChar, `%${ticket_id}%`);
    }

    if (vehicle_number) {
      query += " AND vehicle_number LIKE @vehicle_number";
      request.input("vehicle_number", sql.NVarChar, `%${vehicle_number}%`);
    }

    if (card_number) {
      query += " AND card_number LIKE @card_number";
      request.input("card_number", sql.NVarChar, `%${card_number}%`);
    }

    // Date range filters based on entry_datetime
    if (start_date) {
      query += " AND entry_datetime >= @start_date";
      request.input("start_date", sql.DateTime, new Date(start_date));
    }

    if (end_date) {
      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999);
      query += " AND entry_datetime <= @end_date";
      request.input("end_date", sql.DateTime, end);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});


// --- GET daily consolidated summary ---
router.get("/daily-consolidated-summary", authenticateJWT, async (req, res) => {
  const { start_date, end_date, search } = req.query;

  try {
    const pool = await sql.connect(config);

    let query = `
      SELECT 
        CAST(entry_datetime AS DATE) AS log_date,
        SUM(ISNULL(paid_amount,0)) AS totalPayments,
        COUNT(*) AS totalTransactions,
        SUM(CASE WHEN ISNULL(parking_charges,0) <> ISNULL(paid_amount,0) THEN 1 ELSE 0 END) AS discrepancies
      FROM MovementTrans
      WHERE 1=1
    `;

    const request = pool.request();

    // Filter by date range
    if (start_date) {
      query += " AND entry_datetime >= @start_date";
      request.input("start_date", sql.DateTime, new Date(start_date));
    }
    if (end_date) {
      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999);
      query += " AND entry_datetime <= @end_date";
      request.input("end_date", sql.DateTime, end);
    }

    query += " GROUP BY CAST(entry_datetime AS DATE) ORDER BY log_date DESC";

    const result = await request.query(query);
    let summaries = result.recordset;

    // Optional search filter (date or totals)
    if (search) {
      const term = search.toLowerCase();
      summaries = summaries.filter(
        (r) =>
          r.log_date.toISOString().includes(term) ||
          r.totalPayments.toString().includes(term) ||
          r.totalTransactions.toString().includes(term) ||
          r.discrepancies.toString().includes(term)
      );
    }

    res.json(summaries);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// --- GET CSV download for a specific date ---
router.get("/daily-summary/download/:date", async (req, res) => {
  const { date } = req.params;

  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    request.input("date", sql.Date, new Date(date));

    const query = `
      SELECT *
      FROM MovementTrans
      WHERE CAST(entry_datetime AS DATE) = @date
    `;

    const result = await request.query(query);
    const records = result.recordset;

    if (!records.length) {
      return res.status(404).json({ error: "No records found for this date" });
    }

    // Convert to CSV
    const headers = Object.keys(records[0]);
    const csvData = [
      headers.join(","), // header row
      ...records.map((r) => headers.map((h) => `"${r[h] ?? ""}"`).join(",")),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=daily_summary_${date}.csv`
    );
    res.send(csvData);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// GET all station errors
router.get("/station-error-history", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query(`
      SELECT 
      *
      FROM StationErrorHistory
      ORDER BY error_timestamp DESC
    `);

    res.json({ errors: result.recordset });
  } catch (err) {
    console.error("Error fetching station errors:", err);
    res.status(500).json({ errors: [], message: "Failed to fetch station errors" });
  }
});

// --- POST create or update entry transaction with upserts --- 
router.post("/entry-transaction", async (req, res) => {
  const {
    transaction_id,
    vehicle_id,
    vehicle_number,
    card_number,
    entry_station_id,
    entry_datetime,
    parking_charges,
    paid_amount,
    receipt_bit
  } = req.body;

  // Validate required fields
  if (!transaction_id || !vehicle_id || !entry_station_id || !entry_datetime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    const result = await request
      .input("transaction_id", sql.Int, transaction_id)
      .input("vehicle_id", sql.Int, vehicle_id)
      .input("vehicle_number", sql.NVarChar, vehicle_number || null)
      .input("card_number", sql.NVarChar, card_number || null)
      .input("entry_station_id", sql.NVarChar, entry_station_id)
      .input("entry_datetime", sql.DateTime, entry_datetime)
      .input("parking_charges", sql.Decimal(10,2), parking_charges || 0)
      .input("paid_amount", sql.Decimal(10,2), paid_amount || 0)
      .input("receipt_bit", sql.Bit, receipt_bit || 0)
      .query(`
        INSERT INTO SuccessfulTransactions
        (transaction_id, vehicle_id, vehicle_number, card_number, entry_station_id, entry_datetime, parking_charges, paid_amount, receipt_bit)
        VALUES
        (@transaction_id, @vehicle_id, @vehicle_number, @card_number, @entry_station_id, @entry_datetime, @parking_charges, @paid_amount, @receipt_bit);

        SELECT SCOPE_IDENTITY() AS id;
      `);

    res.status(201).json({
      message: "Entry transaction logged successfully",
      id: result.recordset[0].id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// --- POST update exit transaction with upserts ---
router.post("/exit-transaction", async (req, res) => {
  const {
    vehicle_id,
    exit_station_id,
    exit_datetime,
    parking_charges,
    paid_amount,
    receipt_bit
  } = req.body;

  if (!vehicle_id || !exit_station_id || !exit_datetime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    request
      .input("vehicle_id", sql.Int, vehicle_id)
      .input("exit_station_id", sql.NVarChar, exit_station_id)
      .input("exit_datetime", sql.DateTime, exit_datetime)
      .input("parking_charges", sql.Decimal(10,2), parking_charges || null)
      .input("paid_amount", sql.Decimal(10,2), paid_amount || null)
      .input("receipt_bit", sql.Bit, receipt_bit !== undefined ? receipt_bit : 0);

    // Update the latest open entry for this vehicle
    const result = await request.query(`
      UPDATE SuccessfulTransactions
      SET 
        exit_station_id = @exit_station_id,
        exit_datetime = @exit_datetime,
        parking_charges = @parking_charges,
        paid_amount = @paid_amount,
        receipt_bit = @receipt_bit
      WHERE id = (
        SELECT TOP 1 id
        FROM SuccessfulTransactions
        WHERE vehicle_id = @vehicle_id
          AND exit_datetime IS NULL
        ORDER BY entry_datetime DESC
      );

      SELECT @@ROWCOUNT AS updatedRows;
    `);

    if (result.recordset[0].updatedRows === 0) {
      return res.status(404).json({ error: "No matching open entry transaction found" });
    }

    res.status(200).json({ message: "Exit transaction logged successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

// GET /api/movement/outstanding?reportDate=YYYY-MM-DD&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get("/outstanding", authenticateJWT, async (req, res) => {
  const { reportDate } = req.query;

  if (!reportDate) {
    return res.status(400).json({ error: "reportDate is required" });
  }

  try {
    const pool = await sql.connect(config);

    const query = `
      SELECT *
      FROM MovementTrans
      WHERE CAST(entry_datetime AS DATE) = @reportDate
        AND exit_datetime IS NULL
      ORDER BY entry_datetime DESC
    `;

    const result = await pool.request()
      .input("reportDate", sql.Date, reportDate)
      .query(query);

    res.json({ data: result.recordset || [] });
  } catch (err) {
    console.error("Error fetching outstanding movement transactions:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// Get IU Frequency
router.get("/iu-frequency", authenticateJWT, async (req, res) => {
  const { startDate, endDate, iuNo } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "startDate and endDate are required" });
  }

  try {
    const pool = await sql.connect(config);

    let query = `
      SELECT card_number AS iuNo, COUNT(*) AS frequency
      FROM MovementTrans
      WHERE CAST(entry_datetime AS DATE) BETWEEN @startDate AND @endDate
    `;

    if (iuNo) {
      query += " AND card_number = @iuNo";
    }

    query += " GROUP BY card_number ORDER BY frequency DESC"; // <-- changed here

    const request = pool.request();
    request.input("startDate", sql.Date, startDate);
    request.input("endDate", sql.Date, endDate);
    if (iuNo) request.input("iuNo", sql.VarChar, iuNo);

    const result = await request.query(query);

    res.json({ data: result.recordset || [] });
  } catch (err) {
    console.error("Error fetching IU frequency:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});


// GET Complimentary Movements by ticket
router.get("/complimentary", authenticateJWT, async (req, res) => {
  const { ticket_no } = req.query;

  if (!ticket_no) {
    return res.status(400).json({ error: "ticket_no is required" });
  }

  try {
    const pool = await sql.connect(config);

    const request = pool.request();
    request.input("ticket_no", sql.Int, parseInt(ticket_no, 10));

    const query = `
      SELECT *
      FROM ComplimentaryTickets
      WHERE ticket_id = @ticket_no
    `;

    const result = await request.query(query);
    const tickets = result.recordset.map((t) => ({
      serial_no: t.ticket_id,
      complimentary_no: t.vehicle_id,
      issue_time: t.issued_datetime
        ? new Date(t.issued_datetime).toISOString().slice(0, 16).replace("T", " ")
        : "-",
      issue_by: t.issued_by || "-",
      expire_time: t.update_datetime
        ? new Date(t.update_datetime).toISOString().slice(0, 16).replace("T", " ")
        : "-",
      entry_time: t.entry_datetime
        ? new Date(t.entry_datetime).toISOString().slice(0, 16).replace("T", " ")
        : "-",
      exit_time: t.exit_datetime
        ? new Date(t.exit_datetime).toISOString().slice(0, 16).replace("T", " ")
        : "-",
      iu_card_no: t.vehicle_number || "-",
      parked_time: t.entry_datetime && t.exit_datetime
        ? Math.round((new Date(t.exit_datetime) - new Date(t.entry_datetime)) / 60000) + " min"
        : "-",
      parking_fee: t.ticket_type === 0 ? 0 : "-", // example, adjust if needed
    }));

    res.json(tickets);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// Get redemption enquiry
router.get("/redemption-enquiry", authenticateJWT, async (req, res) => {
  const { fromDate, toDate, serialFrom, serialTo, ticketNo } = req.query;

  try {
    await sql.connect(config);
    let query = "SELECT * FROM DailyRedemptionEnquiry WHERE 1=1";

    const request = new sql.Request();

    if (fromDate) {
      query += " AND report_period_start >= @fromDate";
      request.input("fromDate", sql.Date, fromDate);
    }

    if (toDate) {
      query += " AND report_period_end <= @toDate";
      request.input("toDate", sql.Date, toDate);
    }

    if (serialFrom) {
      query += " AND serial_no >= @serialFrom";
      request.input("serialFrom", sql.VarChar, serialFrom);
    }

    if (serialTo) {
      query += " AND serial_no <= @serialTo";
      request.input("serialTo", sql.VarChar, serialTo);
    }

    if (ticketNo) {
      query += " AND redemption_no = @ticketNo";
      request.input("ticketNo", sql.VarChar, ticketNo);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching Daily Redemption Enquiry:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  } finally {
    await sql.close();
  }
});

// --- GET Complimentary Tickets ---
router.get("/complimentary-tickets", authenticateJWT, async (req, res) => {
  const { start_date, end_date, search } = req.query;

  try {
    const pool = await sql.connect(config);

    let query = `
      SELECT * FROM ComplimentaryTickets;
    `;

    const request = pool.request();

    // Filter by date range
    if (start_date) {
      query += " AND CAST(issued_datetime AS DATE) >= @start_date";
      request.input("start_date", sql.DateTime, new Date(start_date));
    }
    if (end_date) {
      const end = new Date(end_date);
      end.setHours(23, 59, 59, 999);
      query += " AND CAST(issued_datetime AS DATE) <= @end_date";
      request.input("end_date", sql.DateTime, end);
    }

    const result = await request.query(query);
    let tickets = result.recordset;

    // Optional search filter
    if (search) {
      const term = search.toLowerCase();
      tickets = tickets.filter(
        (t) =>
          t.ticket_id.toString().includes(term) ||
          t.vehicle_number.toLowerCase().includes(term) ||
          t.issued_by?.toLowerCase().includes(term) ||
          t.reason?.toLowerCase().includes(term) ||
          t.status.toLowerCase().includes(term)
      );
    }

    // Map to frontend-friendly format
    tickets = tickets.map((t) => ({
      id: t.ticket_id,
      date: t.issued_datetime?.toISOString().split("T")[0] || "-",
      ticketNo: `CMP-${String(t.ticket_id).padStart(5, "0")}`,
      issuedBy: t.issued_by || "-",
      reason: t.reason || "-",
      status: t.status,
    }));

    res.json(tickets);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// Get movement chart data for display
router.get("/movement-chart", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute("dbo.uspGetMovementTrans");

    const movements = result.recordset;

    // Initialize an object to accumulate counts
    const hourlyCounts = {};

    movements.forEach((row) => {
      // Format entry and exit hours as "HH:00"
      const entryHour = row.entry_datetime
        ? new Date(row.entry_datetime).getHours().toString().padStart(2, "0") + ":00"
        : null;
      const exitHour = row.exit_datetime
        ? new Date(row.exit_datetime).getHours().toString().padStart(2, "0") + ":00"
        : null;

      if (entryHour) {
        hourlyCounts[entryHour] = hourlyCounts[entryHour] || { hour: entryHour, entries: 0, exits: 0 };
        hourlyCounts[entryHour].entries += 1;
      }

      if (exitHour) {
        hourlyCounts[exitHour] = hourlyCounts[exitHour] || { hour: exitHour, entries: 0, exits: 0 };
        hourlyCounts[exitHour].exits += 1;
      }
    });

    // Convert the object into a sorted array
    const response = Object.values(hourlyCounts).sort((a, b) => a.hour.localeCompare(b.hour));

    res.json(response);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Database error: " + err.message);
  }
});

// get hourly-max-occupancy
router.get("/hourly-max-occupancy", async (req, res) => {
  const { zone, startDate, endDate } = req.query;

  if (!zone || !startDate || !endDate) {
    return res.status(400).json({ error: "zone, startDate, and endDate are required" });
  }

  try {
    const pool = await sql.connect(config);

    // Make sure endDate is inclusive
    const endDateInclusive = new Date(endDate);
    endDateInclusive.setDate(endDateInclusive.getDate() + 1);

    const request = pool.request()
      .input("zone", sql.NVarChar, zone)
      .input("startDate", sql.DateTime, new Date(startDate))
      .input("endDate", sql.DateTime, endDateInclusive);

    const query = `
      ;WITH HourlyCounts AS (
        SELECT 
          DATEPART(HOUR, entry_datetime) AS [hour],
          COUNT(*) AS entries
        FROM MovementTrans
        WHERE entry_station_id = @zone
          AND entry_datetime >= @startDate AND entry_datetime < @endDate
        GROUP BY DATEPART(HOUR, entry_datetime)
      ),
      HourlyExits AS (
        SELECT 
          DATEPART(HOUR, exit_datetime) AS [hour],
          COUNT(*) AS exits
        FROM MovementTrans
        WHERE exit_station_id = @zone
          AND exit_datetime >= @startDate AND exit_datetime < @endDate
        GROUP BY DATEPART(HOUR, exit_datetime)
      ),
      HourlyOccupancy AS (
        SELECT
          hc.hour,
          @zone AS zone,
          ISNULL(hc.entries,0) - ISNULL(he.exits,0) AS occupancy
        FROM HourlyCounts hc
        FULL OUTER JOIN HourlyExits he ON hc.hour = he.hour
      )
      SELECT
        ho.hour,
        ho.zone,
        ho.occupancy,
        MAX(ho.occupancy) OVER() AS season_max,
        '' AS remarks
      FROM HourlyOccupancy ho
      ORDER BY ho.hour
    `;

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
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

async function logStationError(stationName, errorDescription) {
  try {
    const pool = await sql.connect(config);
    const query = `
      INSERT INTO StationErrorHistory 
        (error_timestamp, station_name, error_description, resolved, created_at, updated_at)
      VALUES 
        (GETDATE(), @stationName, @errorDescription, 0, GETDATE(), GETDATE())
    `;
    await pool.request()
      .input("stationName", sql.NVarChar, stationName)
      .input("errorDescription", sql.NVarChar, errorDescription)
      .query(query);

  } catch (err) {
    console.error("Failed to log station error:", err);
  }
}

router.get('/tailgating', authenticateJWT, async (req, res) => {
  const { iuNo, startDate, endDate } = req.query;

  try {
    await sql.connect(config);
    let query = `SELECT * FROM TailgatingReport WHERE 1=1`;

    if (iuNo) query += ` AND iu_no = '${iuNo}'`;
    if (startDate) query += ` AND occurrence_datetime >= '${startDate}'`;
    if (endDate) query += ` AND occurrence_datetime <= '${endDate}'`;

    const result = await sql.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

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
router.post("/entry-station", async (req, res) => {
  try {
    const data = req.body;

    // Map keys to match frontend expectation
    const payload = {
      VehicleNo: data.VehicleNo,
      Station: data.Station,
      Time: data.Time,
      Status: data.Status || "OK",
      ObuNo: data.OBU_number,
      VCC: data.VCC,
      CardNumber: data.CardNumber,
      DSRC: data.DSRC,
    };

    broadcastEntry(payload); // send mapped payload

    if (data.Status && data.Status.toUpperCase() === "ERROR") {
      const errors = Array.isArray(data.errors) ? data.errors : [data.errors || "Unknown error"];
      for (const errMsg of errors) {
        await logStationError(data.Station || "Unknown Station", errMsg);
      }
    }

    res.json({ success: true, ack: "ACK", data: payload });
  } catch (error) {
    console.error("Error in /entry-station:", error);
    await logStationError(req.body.Station || "Unknown Station", error.message);
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
router.post("/exit-station", async (req, res) => {
  try {
    const data = req.body;

    // Map keys to match frontend
    const payload = {
      Station: data.Station || "Unknown",
      Status: data.Status || "OK",
      ObuNo: data.OBU_number || null,                 // 1. OBU ID
      VehicleNo: data.VehicleNo,                      // 2. Vehicle LP
      VCC: data.VCC || null,                          // 3. VCC
      PaymentCardNo: data.PaymentCardNo || null,      // 4. Card CAN ID (Blank)
      DSRC: data.DSRC || null, // 5. EEP DSRC Device ID
      DeductedAmount: data.DeductedAmount || 0,       // 6. Deducted amount (0)
      PaymentTransactionTime: data.PaymentTransactionTime || null, // 7. Payment Transaction Time (Blank)
      TypeOfPayment: data.TypeOfPayment || null,      // 8. Type of Payment (Blank)
      EntryTime: data.EntryTime || null,               // 9. Entry Time
      ExitTime: data.ExitTime || null                 // 10. Exit Time
    };

    broadcastExit(payload);

    if (data.Status && data.Status.toUpperCase() === "ERROR") {
      const errors = Array.isArray(data.errors) ? data.errors : [data.errors || "Unknown error"];
      for (const errMsg of errors) {
        await logStationError(data.Station || "Unknown Station", errMsg);
      }
    }

    res.json({ success: true, ack: "ACK", data: payload });
  } catch (error) {
    console.error("Error in /exit-station:", error);
    await logStationError(req.body.Station || "Unknown Station", error.message);
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