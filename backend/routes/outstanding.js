const express = require("express");
const router = express.Router();
const { sql, config } = require("../database/db");

router.get("/settlement", async (req, res) => {
  const { fileDate } = req.query; // optional filter by date

  try {
    await sql.connect(config);

    let query = "SELECT * FROM OutstandingSettlement";
    if (fileDate) {
      query += ` WHERE CONVERT(date, created_at) = @fileDate`;
    }

    const request = new sql.Request();
    if (fileDate) request.input("fileDate", sql.Date, fileDate);

    const result = await request.query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

module.exports = router;