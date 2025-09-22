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

// Update a season by ID
// Example: PUT /api/seasons/:season_id
router.put("/:season_id", async (req, res) => {
    const { season_id } = req.params;
    const { name, start_date, end_date, price } = req.body; // adjust fields based on your schema

    try {
        // Check if season exists
        const [rows] = await db.query("SELECT * FROM seasons WHERE season_id = ?", [season_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Season not found" });
        }

        // Update season
        await db.query(
            `UPDATE seasons 
             SET name = ?, start_date = ?, end_date = ?, price = ?
             WHERE season_id = ?`,
            [name, start_date, end_date, price, season_id]
        );

        res.json({ message: "Season updated successfully" });
    } catch (err) {
        console.error("Error updating season:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
});

module.exports = router;