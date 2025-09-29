const express = require("express");
const { sql, config } = require("../database/db"); // your MSSQL config
const router = express.Router();
const { DateTime } = require("luxon")

function parseTime(str) {
  // str = "08:00" or "08:00:00"
  const [h, m, s] = str.split(":").map(Number);
  return new Date(1970, 0, 1, h, m, s || 0);
}

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
        // Convert times to Singapore Time
        const effectiveStartSG = DateTime.fromISO(effectiveStart, { zone: "Asia/Singapore" }).startOf("day").toJSDate();
        const effectiveEndSG = DateTime.fromISO(effectiveEnd, { zone: "Asia/Singapore" }).endOf("day").toJSDate();

        const fromTimeSG = DateTime.fromISO(slot.from, { zone: "Asia/Singapore" }).toJSDate();
        const toTimeSG = DateTime.fromISO(slot.to, { zone: "Asia/Singapore" }).toJSDate();

        // 1️⃣ Delete overlapping slots first
        await new sql.Request(transaction)
          .input("vehicle_type", sql.NVarChar, vehicleType)
          .input("day_of_week", sql.NVarChar, day)
          .input("from_time", sql.Time, fromTimeSG)
          .input("to_time", sql.Time, toTimeSG)
          .input("effective_start", sql.DateTime2, effectiveStartSG)
          .input("effective_end", sql.DateTime2, effectiveEndSG)
          .query(`
            DELETE FROM TariffRates
            WHERE vehicle_type = @vehicle_type
              AND day_of_week = @day_of_week
              AND effective_start <= @effective_end
              AND effective_end >= @effective_start
              AND (from_time < @to_time AND to_time > @from_time)
          `);

        // 2️⃣ Insert the new slot
        await new sql.Request(transaction)
          .input("vehicle_type", sql.NVarChar, vehicleType)
          .input("day_of_week", sql.NVarChar, day)
          .input("from_time", sql.Time, fromTimeSG)
          .input("to_time", sql.Time, toTimeSG)
          .input("rate_type", sql.NVarChar, slot.rateType || "Hourly")
          .input("every", sql.Int, slot.every || null)
          .input("min_fee", sql.Money, slot.minFee || null)
          .input("grace_time", sql.Int, slot.graceTime || null)
          .input("first_min_fee", sql.Money, slot.firstMinFee || null)
          .input("min_charge", sql.Money, slot.min || null)
          .input("max_charge", sql.Money, slot.max || null)
          .input("effective_start", sql.DateTime2, effectiveStartSG)
          .input("effective_end", sql.DateTime2, effectiveEndSG)
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

// GET Tariff setup (view)
router.get("/tariff-setup", async (req, res) => {
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
        SELECT *
        FROM TariffRates
        WHERE vehicle_type = @vehicle_type
        ORDER BY effective_start DESC
      `);

    if (result.recordset.length === 0) {
      return res.json({});
    }

    // Assume you want the most recent effective_start group
    const latestStart = result.recordset[0].effective_start;
    const filtered = result.recordset.filter(
      r => r.effective_start.getTime() === latestStart.getTime()
    );

    // Format response
    const response = {
      effectiveStartDate: latestStart.toISOString().split("T")[0].split("-").reverse().join("/"),
      effectiveStartTime: latestStart.toISOString().split("T")[1].slice(0, 5),
      effectiveEndDate: filtered[0].effective_end.toISOString().split("T")[0].split("-").reverse().join("/"),
      effectiveEndTime: filtered[0].effective_end.toISOString().split("T")[1].slice(0, 5),
    };

    // Group by day_of_week
    const groupedRates = {};
    for (const row of filtered) {
      if (!groupedRates[row.day_of_week]) {
        groupedRates[row.day_of_week] = [];
      }

      // Convert TIME fields to HH:MM
      const fromTime = row.from_time ? row.from_time.toTimeString().slice(0, 5) : null;
      const toTime = row.to_time ? row.to_time.toTimeString().slice(0, 5) : null;

      groupedRates[row.day_of_week].push({
        from: fromTime,
        to: toTime,
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

module.exports = router; 