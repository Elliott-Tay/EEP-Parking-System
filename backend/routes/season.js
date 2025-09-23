const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { sql, config } = require("../database/db");

// Get all seasons
// This route fetches all seasons from the database
// Example: GET /api/seasons
router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM SeasonHolders"); // no destructuring
        res.json(result.recordset); // use recordset to get rows
    } catch (err) {
        console.error("Error fetching seasons:", err);
        res.status(500).json({ error: "Internal server error", err: err.message });
    }
});

// GET /api/seasons/:season_id/transactions?search=term
router.get("/:season_id/transactions", async (req, res) => {
  const { season_id } = req.params;
  const { search } = req.query; // <-- get search query

  try {
    const pool = await sql.connect(config);
    let query = "SELECT * FROM SeasonHolders WHERE season_no = @season_id";
    
    const request = pool.request().input("season_id", sql.NVarChar, season_id);

    // If search is provided, add a filter for season_no
    if (search) {
      query += " AND season_no LIKE @search";
      request.input("search", sql.NVarChar, `%${search}%`);
    }

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Season not found" });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching season transactions:", err);
    res.status(500).json({ error: "Internal server error", err: err.message });
  }
});

// GET /api/seasons/to-be-expired
router.get("/to-be-expired", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const query = `
      SELECT * FROM SeasonHolders
      WHERE YEAR(valid_to) = YEAR(GETDATE())
        AND MONTH(valid_to) = MONTH(GETDATE())
    `;
    const result = await pool.request().query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "No seasons expiring this month" });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching seasons:", err);
    res.status(500).json({ error: "Internal server error", err: err.message });
  }
});

// Change season no
router.put("/change-season", async (req, res) => {
  const { oldSeasonNo, newSeasonNo } = req.body;

  if (!oldSeasonNo || !newSeasonNo) {
    return res.status(400).json({ error: "oldSeasonNo and newSeasonNo are required" });
  }

  try {
    const pool = await sql.connect(config);

    const query = `
      UPDATE SeasonHolders
      SET season_no = @newSeasonNo
      WHERE season_no = @oldSeasonNo
    `;

    const request = pool.request()
      .input("newSeasonNo", sql.NVarChar, newSeasonNo)
      .input("oldSeasonNo", sql.NVarChar, oldSeasonNo);

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Old Season No not found" });
    }

    res.json({ message: `Season No updated from ${oldSeasonNo} to ${newSeasonNo}` });
  } catch (err) {
    console.error("Error updating season:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// Create a season holder
router.post("/season-holder", async (req, res) => {
  const {
    serial_no,
    season_no,
    vehicle_no,
    season_type,
    holder_type,
    holder_name,
    company,
    season_status,
    address,
    valid_from,
    valid_to,
    employee_no,
    telephone,
  } = req.body;

  // Validate required fields
  if (!serial_no || !season_no || !vehicle_no || !season_type || !holder_type || !holder_name || !season_status || !valid_from || !valid_to) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const pool = await sql.connect(config);

    const query = `
      INSERT INTO SeasonHolders
      (serial_no, season_no, vehicle_no, season_type, holder_type, holder_name, company, season_status, address, valid_from, valid_to, employee_no, telephone, created_at, updated_at)
      VALUES
      (@serial_no, @season_no, @vehicle_no, @season_type, @holder_type, @holder_name, @company, @season_status, @address, @valid_from, @valid_to, @employee_no, @telephone, GETDATE(), GETDATE())
    `;

    const request = pool.request()
      .input("serial_no", sql.NVarChar, serial_no)
      .input("season_no", sql.NVarChar, season_no)
      .input("vehicle_no", sql.NVarChar, vehicle_no)
      .input("season_type", sql.NVarChar, season_type)
      .input("holder_type", sql.NVarChar, holder_type)
      .input("holder_name", sql.NVarChar, holder_name)
      .input("company", sql.NVarChar, company || null)
      .input("season_status", sql.NVarChar, season_status)
      .input("address", sql.NVarChar, address || null)
      .input("valid_from", sql.Date, valid_from)
      .input("valid_to", sql.Date, valid_to)
      .input("employee_no", sql.NVarChar, employee_no || null)
      .input("telephone", sql.NVarChar, telephone || null);

    const result = await request.query(query);

    console.log("Insert result:", result);

    res.json({ message: "Season holder saved successfully!" });
  } catch (err) {
    console.error("Error inserting season holder:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});


module.exports = router;