const express = require("express");
const { sql, config } = require("../database/db"); // your MSSQL config
const router = express.Router();

// Initialize SQL pool
let pool;
async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

// ====================== GET HOLIDAYS BY YEAR ======================
router.get("/holidays/:year", async (req, res) => {
  const { year } = req.params;

  if (!year || isNaN(year)) {
    return res.status(400).json({ error: "Invalid year" });
  }

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("year", sql.Int, parseInt(year))
      .query(`
        SELECT id, holiday_date, description, remarks
        FROM PublicHolidays
        WHERE YEAR(holiday_date) = @year
        ORDER BY holiday_date ASC
      `);

    res.json({
      status: "success",
      message: `Holidays for year ${year} fetched successfully`,
      year,
      count: result.recordset.length,
      holidays: result.recordset
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error fetching holidays", details: err.message });
  }
});

// ====================== SAVE / UPDATE HOLIDAYS ======================
router.post("/holidays", async (req, res) => {
  const { year, holidays } = req.body;

  if (!year || !holidays || !Array.isArray(holidays)) {
    return res.status(400).json({ error: "Year and holidays array are required" });
  }

  try {
    const pool = await getPool();

    // Start transaction
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    const request = new sql.Request(transaction);

    // Optionally: delete all holidays for this year first
    await request
      .input("year", sql.Int, parseInt(year))
      .query("DELETE FROM PublicHolidays WHERE YEAR(holiday_date) = @year");

    // Insert new holidays
    for (const h of holidays) {
        const insertRequest = new sql.Request(transaction); 
        await insertRequest
            .input("date", sql.Date, new Date(h.date))
            .input("description", sql.NVarChar(255), h.description)
            .input("remarks", sql.NVarChar(255), h.remarks || "")
            .query(`
            INSERT INTO PublicHolidays (holiday_date, description, remarks)
            VALUES (@date, @description, @remarks)
            `);
        }

    await transaction.commit();
    res.json({ message: `${holidays.length} holidays saved successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error saving holidays", details: err.message });
  }
});

// ====================== DELETE HOLIDAY ======================
router.delete("/holidays/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid holiday ID" });
  }

  try {
    const pool = await getPool();
    await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM PublicHolidays WHERE id = @id");

    res.json({ message: `Holiday ${id} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error deleting holiday", details: err.message });
  }
});

// --- GET season holders ---
router.get("/season-holder", async (req, res) => {
  const { seasonNo, vehicleNo, holderName, company } = req.query;

  try {
    const pool = await getPool();
    let query = "SELECT * FROM SeasonHolders WHERE 1=1";
    const request = pool.request();

    const { searchTerm } = req.query; 

    if (seasonNo) {
        query += " AND season_no = @seasonNo";
        request.input("seasonNo", sql.VarChar, seasonNo);
    }

    if (searchTerm) {
        query += ` AND (
            season_no LIKE @searchTerm OR
            vehicle_no LIKE @searchTerm OR
            holder_name LIKE @searchTerm OR
            company LIKE @searchTerm
        )`;
        request.input("searchTerm", sql.NVarChar, `%${searchTerm}%`);
    }

    const result = await request.query(query);
    res.json({ count: result.recordset.length, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});


module.exports = router;
