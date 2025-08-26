const express = require("express");
const router = express.Router();
const db = require("../database/db");

// Get all seasons
// This route fetches all seasons from the database
// Example: GET /api/seasons
router.get("/", async (req, res) => {
    try {
        // edit the table name if necessary
        // Assuming the table name is 'seasons'
        const [rows] = await db.query("SELECT * FROM seasons");
        res.json(rows);
    } catch (err) {
        console.error("Error fetching seasons:", err)
        res.status(500).json({ error: "Internal server error: ", err: err.message});
    }
});

// Get a specific season by ID
// Example: GET /api/seasons/:season_id     
router.get("/:season_id", async (req, res) => {
    const { season_id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM seasons WHERE season_id = ?", [season_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Season not found" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("Error fetching season:", err);
        res.status(500).json({ error: "Internal server error: ", err: err.message });
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