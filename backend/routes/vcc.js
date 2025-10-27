// auth.js
const express = require("express");
const { sql, config } = require("../database/db");
const authenticateJWT = require("../../middleware/auth");

const router = express.Router();

// ======== Initialize SQL Pool ========
let pool;
async function getPool() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log("Connected to SQL Server");
    } catch (err) {
      console.error("SQL Connection Error:", err);
      throw err;
    }
  }
  return pool;
}

// Get VCC White List with optional IU No filter
router.get('/vcc-white-list', authenticateJWT, async (req, res) => {
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
router.get('/vcc-exit-transactions', authenticateJWT, async (req, res) => {
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


module.exports = router;
