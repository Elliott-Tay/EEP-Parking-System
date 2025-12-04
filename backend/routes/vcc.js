// auth.js
const express = require("express");
const { sql, config } = require("../database/db");

const router = express.Router();

// ======== Initialize SQL Pool ========
let pool;
async function getPool() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
    } catch (err) {
      console.error("SQL Connection Error:", err);
      throw err;
    }
  }
  return pool;
}

// Get VCC White List with optional IU No filter
router.get('/vcc-white-list', async (req, res) => {
    const { iuNo } = req.query;

    try {
        const pool = await sql.connect(config);
        let query = `SELECT * FROM VCCWhitelistReport WHERE 1=1`;
        const request = pool.request();

        if (iuNo) {
            query += ` AND IUNo LIKE '%' + @iuNo + '%'`;
            request.input('iuNo', sql.NVarChar, iuNo);
        }

        const result = await request.query(query);

        const whiteList = result.recordset.map(row => ({
            iuNo: row.IUNo,
            vehicleNo: row.VehicleNo,
            validFrom: row.ValidFrom,
            validTo: row.ValidTo
        }));

        res.json({ success: true, data: whiteList });
    } catch (err) {
        console.error("Error fetching VCC whitelist:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get VCC Exit Transactions with optional IU Ticket No filter
router.get('/vcc-exit-transactions', async (req, res) => {
  const { iuNo } = req.query;

  try {
    await sql.connect(config);

    let query = `
      SELECT IUTicketNo, TransactionType, ExitTime, ParkedMinutes, ParkedTimeText,
             ParkingFee, CardType, VehicleNo, TicketNo, Status
      FROM dbo.VCCExitTransaction
      WHERE 1=1
    `;

    const request = new sql.Request();

    if (iuNo) {
      query += ` AND IUTicketNo LIKE '%' + @iuNo + '%'`;
      request.input('iuNo', sql.NVarChar, iuNo);
    }

    const result = await request.query(query);

    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get VCC Collection Comparison with optional filters
router.get("/vcc-collection-comparison", async (req, res) => {
  const { startDate, endDate, minDifference, maxDifference } = req.query;

  try {
    const pool = await sql.connect(config);
    let query = `
      SELECT [S/N] AS SerialNo,
             [Date],
             [Consolidated Settlement] AS ConsolidatedSettlement,
             [Acknowledge Settlement - Consolidated] AS AckSettlementConsolidated,
             [Acknowledge - Settlement] AS AckMinusSettlement
      FROM dbo.VCCCollectionComparison
      WHERE 1=1
    `;
    const request = pool.request();

    // Optional filters
    if (startDate) {
      query += ` AND [Date] >= @startDate`;
      request.input("startDate", sql.Date, startDate);
    }
    if (endDate) {
      query += ` AND [Date] <= @endDate`;
      request.input("endDate", sql.Date, endDate);
    }
    if (minDifference) {
      query += ` AND [Acknowledge - Settlement] >= @minDifference`;
      request.input("minDifference", sql.Decimal(18, 2), minDifference);
    }
    if (maxDifference) {
      query += ` AND [Acknowledge - Settlement] <= @maxDifference`;
      request.input("maxDifference", sql.Decimal(18, 2), maxDifference);
    }

    query += ` ORDER BY [Date] DESC`;

    const result = await request.query(query);

    res.json({
      success: true,
      data: result.recordset.map((row) => ({
        serialNo: row.SerialNo,
        date: row.Date,
        consolidatedSettlement: row.ConsolidatedSettlement,
        acknowledgeSettlementConsolidated: row.AckSettlementConsolidated,
        acknowledgeMinusSettlement: row.AckMinusSettlement,
      })),
    });
  } catch (err) {
    console.error("Error fetching VCC collection comparison:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching VCC collection comparison data.",
    });
  }
});

// ===== GET all records =====
router.get("/vcc-list", async (req, res) => {
  const { vcc, class: classFilter } = req.query;

  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    let query = `SELECT VCC, Description, Class, Id FROM VCCList WHERE 1=1`;

    if (vcc) {
      query += " AND VCC LIKE '%' + @vcc + '%'";
      request.input("vcc", sql.NVarChar, vcc);
    }

    if (classFilter) {
      query += " AND Class = @class";
      request.input("class", sql.NVarChar, classFilter);
    }

    const result = await request.query(query);

    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error("Error fetching VCC List:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===== GET single record by ID =====
router.get("/vcc-list/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT VCC, Description, Class, Id FROM VCCList WHERE Id = @id");

    if (!result.recordset.length) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    console.error("Error fetching VCC record:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===== CREATE new record =====
router.post("/vcc-list", async (req, res) => {
  const { vcc, description, class: className } = req.body;

  if (!vcc || !description || !className) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("vcc", sql.NVarChar, vcc)
      .input("description", sql.NVarChar, description)
      .input("class", sql.NVarChar, className)
      .query("INSERT INTO VCCList (VCC, Description, Class) VALUES (@vcc, @description, @class); SELECT SCOPE_IDENTITY() AS Id");

    res.status(201).json({ success: true, data: { id: result.recordset[0].Id, vcc, description, class: className } });
  } catch (err) {
    console.error("Error creating VCC record:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===== UPDATE record by ID =====
router.put("/vcc-list/:id", async (req, res) => {
  const { id } = req.params;
  const { vcc, description, class: className } = req.body;

  if (!vcc || !description || !className) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("id", sql.Int, id)
      .input("vcc", sql.NVarChar, vcc)
      .input("description", sql.NVarChar, description)
      .input("class", sql.NVarChar, className)
      .query("UPDATE VCCList SET VCC = @vcc, Description = @description, Class = @class WHERE Id = @id");

    res.json({ success: true, message: "Record updated" });
  } catch (err) {
    console.error("Error updating VCC record:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ===== DELETE record by ID =====
router.delete("/vcc-list/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM VCCList WHERE Id = @id");

    res.json({ success: true, message: "Record deleted" });
  } catch (err) {
    console.error("Error deleting VCC record:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
