const express = require("express");
const { sql, config } = require("../database/db"); // your MSSQL config
const router = express.Router();
const { DateTime } = require("luxon")
const authenticateJWT = require("../../middleware/auth");

// Get all parking tariffs
router.get("/tariff-rates", async (req, res) => {
  try {
    const pool = await sql.connect(config); 
    const result = await pool.request().query("SELECT * FROM TariffRates ORDER BY vehicle_type, day_of_week, from_time");
    res.json({ success: true, data: result.recordset });
  } 
  catch (err) {     
    console.error("Error fetching tariffs:", err);
    res.status(500).json({ success: false, error: "Failed to fetch tariffs" }); 
  }
});

// setup the new tariff
router.post("/tariff-setup", async (req, res) => {
  const { vehicleType, effectiveStart, effectiveEnd, rates } = req.body;

  if (!vehicleType || !effectiveStart || !effectiveEnd || !rates) {
    return res.status(400).json({ error: "vehicleType, effectiveStart, effectiveEnd, and rates are required" });
  }

  try {
    const pool = await sql.connect(config);
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    for (const [day, slots] of Object.entries(rates)) {
      for (const slot of slots) {
        // Use the times and dates as strings directly
        const fromTimeStr = slot.from;   // "08:00:00"
        const toTimeStr = slot.to;       // "12:00:00"
        const effectiveStartStr = effectiveStart; // "2025-10-01 00:00:00"
        const effectiveEndStr = effectiveEnd;     // "2025-10-31 23:59:59"

        // 1️⃣ Delete overlapping slots first
        await new sql.Request(transaction)
          .input("vehicle_type", sql.NVarChar, vehicleType)
          .input("day_of_week", sql.NVarChar, day)
          .input("from_time", sql.VarChar, fromTimeStr)
          .input("to_time", sql.VarChar, toTimeStr)
          .input("effective_start", sql.VarChar, effectiveStartStr)
          .input("effective_end", sql.VarChar, effectiveEndStr)
          .query(`
            DELETE FROM TariffRates
            WHERE vehicle_type = @vehicle_type
              AND day_of_week = @day_of_week
              AND effective_start <= @effective_end
              AND effective_end >= @effective_start
              AND (CONVERT(VARCHAR(8), from_time, 108) < @to_time
                   AND CONVERT(VARCHAR(8), to_time, 108) > @from_time)
          `);

        // 2️⃣ Insert the new slot
        await new sql.Request(transaction)
          .input("vehicle_type", sql.NVarChar, vehicleType)
          .input("day_of_week", sql.NVarChar, day)
          .input("from_time", sql.VarChar, fromTimeStr)
          .input("to_time", sql.VarChar, toTimeStr)
          .input("rate_type", sql.NVarChar, slot.rateType || "Hourly")
          .input("every", sql.Int, slot.every || null)
          .input("min_fee", sql.Money, slot.minFee || null)
          .input("grace_time", sql.Int, slot.graceTime || null)
          .input("first_min_fee", sql.Money, slot.firstMinFee || null)
          .input("min_charge", sql.Money, slot.min || null)
          .input("max_charge", sql.Money, slot.max || null)
          .input("effective_start", sql.VarChar, effectiveStartStr)
          .input("effective_end", sql.VarChar, effectiveEndStr)
          .query(`
            INSERT INTO TariffRates (
              vehicle_type, day_of_week, from_time, to_time, rate_type, every, min_fee, grace_time, first_min_fee, min_charge, max_charge, effective_start, effective_end
            ) VALUES (
              @vehicle_type, @day_of_week, @from_time, @to_time, @rate_type, @every, @min_fee, @grace_time, @first_min_fee, @min_charge, @max_charge, @effective_start, @effective_end
            );
          `);
      }
    }

    await transaction.commit();
    res.json({ message: "Tariff setup saved successfully" });
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});


// Delete tariff rates by vehicle type and effective start date
router.delete("/tariff-slot", async (req, res) => {
  const { vehicleType, dayOfWeek, fromTime, toTime, effectiveStart, effectiveEnd } = req.body;

  if (!vehicleType || !dayOfWeek || !fromTime || !toTime || !effectiveStart || !effectiveEnd) {
    return res.status(400).json({ error: "All fields are required to identify the slot" });
  }

  try {
    const pool = await sql.connect(config);

    // Use the effective dates as strings in YYYY-MM-DD format
    const effectiveStartStr = effectiveStart.split("T")[0];
    const effectiveEndStr = effectiveEnd.split("T")[0];

    const result = await pool.request()
      .input("vehicle_type", sql.NVarChar, vehicleType)
      .input("day_of_week", sql.NVarChar, dayOfWeek)
      .input("from_time", sql.VarChar, fromTime)   // as string HH:MM:SS
      .input("to_time", sql.VarChar, toTime)       // as string HH:MM:SS
      .input("effective_start", sql.Date, effectiveStartStr)
      .input("effective_end", sql.Date, effectiveEndStr)
      .query(`
        DELETE FROM TariffRates
        WHERE vehicle_type = @vehicle_type
          AND day_of_week = @day_of_week
          AND CONVERT(VARCHAR(8), from_time, 108) = @from_time
          AND CONVERT(VARCHAR(8), to_time, 108) = @to_time
          AND CAST(effective_start AS DATE) = @effective_start
          AND CAST(effective_end AS DATE) = @effective_end
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Slot not found" });
    }

    res.json({ message: "Slot deleted successfully" });
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// GET Tariff setup (view)
router.get("/tariff-setup", authenticateJWT, async (req, res) => {
  const { vehicleType } = req.query;

  if (!vehicleType) {
    return res.status(400).json({ error: "vehicleType is required" });
  }

  try {
    const pool = await sql.connect(config);

    // Get all tariffs for this vehicle type
    const result = await pool
      .request()
      .input("vehicle_type", sql.NVarChar, vehicleType)
      .query(`
        SELECT 
          vehicle_type,
          day_of_week,
          CONVERT(VARCHAR(8), from_time, 108) AS from_time,
          CONVERT(VARCHAR(8), to_time, 108) AS to_time,
          rate_type,
          every,
          min_fee,
          grace_time,
          first_min_fee,
          min_charge,
          max_charge,
          effective_start,
          effective_end
        FROM TariffRates
        WHERE vehicle_type = @vehicle_type
        ORDER BY effective_start DESC
      `);

    const records = result.recordset;
    if (!records || records.length === 0) return res.json({});

    // Find the latest effective_start
    const latestStart = records[0].effective_start;
    const filtered = records.filter(
      r => r.effective_start.getTime() === latestStart.getTime()
    );

    // Format response directly from DB values
    const response = {
      effectiveStart: filtered[0].effective_start, // will be in SQL DATETIME format
      effectiveEnd: filtered[0].effective_end,     // same
    };

    // Group rates by day_of_week
    const groupedRates = {};
    for (const row of filtered) {
      if (!groupedRates[row.day_of_week]) groupedRates[row.day_of_week] = [];

      groupedRates[row.day_of_week].push({
        from: row.from_time,   // SQL TIME string as-is
        to: row.to_time,       // SQL TIME string as-is
        rateType: row.rate_type,
        every: row.every,
        minFee: row.min_fee,
        graceTime: row.grace_time,
        firstMinFee: row.first_min_fee,
        min: row.min_charge,
        max: row.max_charge,
      });
    }

    res.json({ ...response, ...groupedRates });
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// Get all registrations
router.get("/multiple-season", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM MultipleSeasonRegistrations");
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error("Error fetching registrations:", err);
    res.status(500).json({ success: false, error: "Failed to fetch registrations" });
  }
});

// Get a single registration by serialNo
router.get("/multiple-season/:serialNo", async (req, res) => {
  const { serialNo } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("serialNo", sql.NVarChar, serialNo)
      .query("SELECT * FROM MultipleSeasonRegistrations WHERE serialNo = @serialNo");

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, error: "Registration not found" });
    }

    res.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    console.error("Error fetching registration:", err);
    res.status(500).json({ success: false, error: "Failed to fetch registration" });
  }
});

// Create a new registration
router.post("/multiple-season", async (req, res) => {
  const {
    serialNo,
    company,
    seasonStatus,
    address,
    validFrom,
    validTo,
    telephone,
    numIU,
    zoneAllowed,
    numSeasonPurchased,
    iuList,
  } = req.body;

  let pool;

  try {
    // Connect pool
    pool = await sql.connect(config);

    // Create transaction tied to the pool
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    // Insert parent record
    const request = new sql.Request(transaction);
    request.input("SerialNo", sql.NVarChar, serialNo);
    request.input("Company", sql.NVarChar, company);
    request.input("SeasonStatus", sql.NVarChar, seasonStatus);
    request.input("Address", sql.NVarChar, address);
    request.input("ValidFrom", sql.Date, validFrom);
    request.input("ValidTo", sql.Date, validTo);
    request.input("Telephone", sql.NVarChar, telephone);
    request.input("NumIU", sql.Int, numIU);
    request.input("ZoneAllowed", sql.NVarChar, zoneAllowed);
    request.input("NumSeasonPurchased", sql.Int, numSeasonPurchased);

    const result = await request.query(`
      INSERT INTO MultipleSeasonRegistrations
      (SerialNo, Company, SeasonStatus, Address,
       ValidFrom, ValidTo, Telephone, NumIU,
       ZoneAllowed, NumSeasonPurchased)
      OUTPUT INSERTED.Id
      VALUES (@SerialNo, @Company, @SeasonStatus, @Address,
              @ValidFrom, @ValidTo, @Telephone, @NumIU,
              @ZoneAllowed, @NumSeasonPurchased)
    `);

    const registrationId = result.recordset[0].Id;

    // Insert IU records
    for (const iu of iuList || []) {
      const iuReq = new sql.Request(transaction);
      iuReq.input("RegistrationId", sql.UniqueIdentifier, registrationId);
      iuReq.input("IUNo", sql.NVarChar, iu.iuNo);
      iuReq.input("IUType", sql.NVarChar, iu.type);

      await iuReq.query(`
        INSERT INTO IURegistrations (RegistrationId, IUNo, IUType)
        VALUES (@RegistrationId, @IUNo, @IUType)
      `);
    }

    await transaction.commit();
    res.json({ message: "Registration successful", serialNo, registrationId });
  } catch (err) {
    console.error("Error inserting registration:", err);
    try {
      if (pool) {
        const transaction = new sql.Transaction(pool);
        if (!transaction._aborted) await transaction.rollback();
      }
    } catch (_) {}
    res.status(500).json({ error: "Failed to register multiple season", details: err.message });
  } finally {
    if (pool) pool.close();
  }
});

// Delete a registration by serialNo
router.delete("/multiple-season/:serialNo", (req, res) => {
  const { serialNo } = req.params;
  const index = multipleSeasonRegisters.findIndex(r => r.serialNo === serialNo);
  if (index === -1) return res.status(404).json({ error: "Registration not found" });

  multipleSeasonRegisters.splice(index, 1);
  res.json({ message: "Registration deleted successfully" });
});

module.exports = router; 