const express = require("express");
const router = express.Router();
const { sql, config } = require("../database/db");
const authenticateJWT = require("../../middleware/auth");

// Get outstanding settlement
router.get("/settlement", authenticateJWT, async (req, res) => {
  const { fileDate } = req.query; 

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

// Get outstanding acknowledgement
router.get("/acknowledgement", authenticateJWT, async (req, res) => {
  const { fileDate } = req.query;

  try {
    await sql.connect(config);

    let query = "SELECT * FROM OutstandingAcknowledgement";
    if (fileDate) {
      query += " WHERE CONVERT(date, created_at) = @fileDate";
    }

    const request = new sql.Request();
    if (fileDate) request.input("fileDate", sql.Date, fileDate);

    const result = await request.query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching acknowledgements:", err);
    res.status(500).json({ error: "Failed to fetch acknowledgements" });
  }
});

// Get outstanding summary
router.get("/summary", authenticateJWT, async (req, res) => {
  const { fileDate } = req.query;

  try {
    await sql.connect(config);

    let query = "SELECT * FROM OutstandingSummary";
    if (fileDate) {
      query += " WHERE CONVERT(date, create_time) = @fileDate";
    }

    const request = new sql.Request();
    if (fileDate) request.input("fileDate", sql.Date, fileDate);

    const result = await request.query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching acknowledgements:", err);
    res.status(500).json({ error: "Failed to fetch acknowledgements" });
  }
});

// Get lta-collection files
router.get("/lta-collection", authenticateJWT, async (req, res) => {
  const { fileDate } = req.query;

  try {
    await sql.connect(config);

    let query = "SELECT * FROM LTACollectionFile";
    if (fileDate) {
      query += " WHERE CONVERT(date, create_datetime) = @fileDate";
    }

    const request = new sql.Request();
    if (fileDate) request.input("fileDate", sql.Date, fileDate);

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching LTA Collection File:", err);
    res.status(500).json({ error: "Failed to fetch LTA Collection File" });
  } finally {
    sql.close();
  }
});

// Get LTA Acknowledgement
router.get("/lta-acknowledge", authenticateJWT, async (req, res) => {
  const { fileDate } = req.query; 

  try {
    await sql.connect(config);
    let query = "SELECT * FROM LTAAcknowledgement";

    if (fileDate) {
      query += " WHERE CONVERT(date, settle_date) = @fileDate";
    }

    const request = new sql.Request();
    if (fileDate) request.input("fileDate", sql.Date, fileDate);

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching LTA Acknowledge files:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  } finally {
    await sql.close();
  }
});

// Get LTA Result
router.get("/lta-result", authenticateJWT, async (req, res) => {
  const { fileDate } = req.query; 

  try {
    await sql.connect(config);
    let query = "SELECT * FROM LTAResult";

    if (fileDate) {
      query += " WHERE CONVERT(date, SettleDate) = @fileDate";
    }

    const request = new sql.Request();
    if (fileDate) request.input("fileDate", sql.Date, fileDate);

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching LTA Acknowledge files:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  } finally {
    await sql.close();
  }
});

// Get CEPAS Collection Report with pagination
router.get("/cepas_collection", authenticateJWT, async (req, res) => {
  try {
    const { startDate, endDate, page = 1, pageSize = 10 } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    const pool = await sql.connect(config);

    const offset = (page - 1) * pageSize;

    const result = await pool
      .request()
      .input("startDate", sql.Date, startDate)
      .input("endDate", sql.Date, endDate)
      .input("offset", sql.Int, offset)
      .input("pageSize", sql.Int, pageSize)
      .query(`
        SELECT *
        FROM CepasCollectionReport
        WHERE CAST(send_datetime AS DATE) BETWEEN @startDate AND @endDate
        ORDER BY send_datetime DESC
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching CEPAS reports" });
  }
});

// Get UPOS Collection Report with pagination
router.get("/upos_collection_report", authenticateJWT, async (req, res) => {
  try {
    const { startDate, endDate, page = 1, pageSize = 10 } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    const pool = await sql.connect(config);
    const offset = (page - 1) * pageSize;

    const result = await pool
      .request()
      .input("startDate", sql.Date, startDate)
      .input("endDate", sql.Date, endDate)
      .input("offset", sql.Int, offset)
      .input("pageSize", sql.Int, pageSize)
      .query(`
        SELECT *
        FROM UPOSCollectionReport
        WHERE report_date BETWEEN @startDate AND @endDate
        ORDER BY report_date DESC
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching UPOS reports" });
  }
});

// Get UPOS Collection Report with pagination
router.get("/upos_collection_file", authenticateJWT, async (req, res) => {
  try {
    const { startDate, endDate, page = 1, pageSize = 10 } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    const pool = await sql.connect(config);
    const offset = (page - 1) * pageSize;

    const result = await pool
      .request()
      .input("startDate", sql.Date, startDate)
      .input("endDate", sql.Date, endDate)
      .input("offset", sql.Int, offset)
      .input("pageSize", sql.Int, pageSize)
      .query(`
        SELECT *
        FROM UposCollectionFileReport
        WHERE CAST(send_datetime AS DATE) BETWEEN @startDate AND @endDate
        ORDER BY send_datetime DESC
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching UPOS reports" });
  }
});

// Get LCSC Cashcard Collection report with pagination
router.get("/lcsc_cashcard_collection", authenticateJWT, async (req, res) => {
  try {
    const { startDate, endDate, page = 1, pageSize = 10 } = req.query;

    // Validate input
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required" });
    }

    const pool = await sql.connect(config);
    const offset = (page - 1) * pageSize;

    const result = await pool
      .request()
      .input("startDate", sql.Date, startDate)
      .input("endDate", sql.Date, endDate)
      .input("offset", sql.Int, offset)
      .input("pageSize", sql.Int, pageSize)
      .query(`
        SELECT *
        FROM [LCSCCashcardCollection]
        WHERE CAST(Date AS DATE) BETWEEN @startDate AND @endDate
        ORDER BY Date DESC
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching LCSC Cashcard Collection:", err);
    res.status(500).json({ error: "Server error fetching LCSC Cashcard Collection" });
  }
});

module.exports = router;