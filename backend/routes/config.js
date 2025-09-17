const express = require("express");
const router = express.Router();
const db = require("../database/db");

// send configuration logs to database for tracking
router.post("/send", async (req, res) => {
  try {
    const { station, option } = req.body;
    const userId = req.user.id; // set by auth middleware

    if (!station || !option) {
      return res.status(400).json({ status: "error", message: "Station and option are required." });
    }

    // Insert log into SQL table when there is an SQL table created
    const query = `
      INSERT INTO configuration_logs (user_id, station, option, sent_at)
      VALUES (?, ?, ?, NOW())
    `;
    await db.query(query, [userId, station, option]);

    res.json({ status: "success", message: "Configuration sent successfully!" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Database error saving configuration", details: error.message });
      }
});

module.exports = router;