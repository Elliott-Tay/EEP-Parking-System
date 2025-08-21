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

module.exports = router;