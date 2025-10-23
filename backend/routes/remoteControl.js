const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { sql, config } = require("../database/db"); 
const parkingLotDTO = require("../DTO/parkingLotDTO");
const { authenticateToken } = require("./auth");
const authenticateJWT = require("../../middleware/auth");

// Keep track of all connected SSE clients
let lotStatusClients = [];

// 🔹 Helper: send data to all SSE clients
function broadcastLotStatus(data) {
  lotStatusClients.forEach((client) => {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// 🔹 SSE Endpoint: clients subscribe here
router.get("/lot-status/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  lotStatusClients.push(newClient);

  // Remove client on disconnect
  req.on("close", () => {
    lotStatusClients = lotStatusClients.filter((c) => c.id !== clientId);
  });
});

/**
 * @swagger
 * /lot-status:
 *   get:
 *     summary: Fetch current parking lot status
 *     responses:
 *       200:
 *         description: Successfully fetched parking lot status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   hourly:
 *                     type: object
 *                   season:
 *                     type: object
 *                   total:
 *                     type: object
 *                     properties:
 *                       allocated: { type: integer }
 *                       occupied: { type: integer }
 *                       available: { type: integer }
 *       500:
 *         description: Failed to fetch lot data
 */
router.get("/lot-status", async (req, res) => {
  try {
    let pool = await sql.connect(config);
    const result = await pool.request().execute("dbo.uspGetParkingLots");
    const rows = result.recordset;
    const data = {};

    rows.forEach((row) => {
      const lot = new parkingLotDTO(row);
      const { zone, type, allocated, occupied } = lot;

      if (!data[zone]) {
        data[zone] = {
          hourly: {},
          season: {},
          total: { allocated: 0, occupied: 0, available: 0 },
        };
      }

      data[zone][type] = {
        allocated,
        occupied,
        available: allocated - occupied,
      };

      data[zone].total.allocated += allocated;
      data[zone].total.occupied += occupied;
      data[zone].total.available =
        data[zone].total.allocated - data[zone].total.occupied;
    });

    res.json(data);

    // 🔹 Push update to SSE clients too
    broadcastLotStatus(data);

  } catch (err) {
    console.error("SQL error", err);
    res.status(500).json({ error: "Failed to fetch lot data" });
  }
});

// Update parking lot status
router.patch("/lot-status/:zone/:type", async (req, res) => {
  const { zone, type } = req.params;
  const { allocated, occupied } = req.body;

  if (!zone || !type) {
    return res.status(400).json({ error: "zone and type are required" });
  }

  if (
    allocated === undefined ||
    occupied === undefined ||
    isNaN(allocated) ||
    isNaN(occupied)
  ) {
    return res.status(400).json({ error: "allocated and occupied must be valid numbers" });
  }

  if (occupied > allocated) {
    return res
      .status(400)
      .json({ error: "occupied slots cannot exceed allocated slots" });
  }

  try {
    const pool = await sql.connect(config);

    const query = `
      UPDATE ParkingLotStatus
      SET allocated = @allocated,
          occupied = @occupied
      WHERE zone = @zone AND type = @type;

      SELECT allocated, occupied, available
      FROM ParkingLotStatus
      WHERE zone = @zone AND type = @type;
    `;

    const request = pool.request();
    request.input("allocated", sql.Int, allocated);
    request.input("occupied", sql.Int, occupied);
    request.input("zone", sql.NVarChar, zone);
    request.input("type", sql.NVarChar, type);

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Zone or type not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error updating lot status:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// Log parking lot status history
router.post("/lot-status-history", async (req, res) => {
  const { zone, type, allocated, occupied, users } = req.body;

  if (!zone || !type || allocated === undefined || occupied === undefined) {
    return res.status(400).json({ error: "zone, type, allocated, and occupied are required" });
  }

  try {
    const pool = await sql.connect(config);

    // Insert a new record in LotStatusHistory
    await pool.request()
      .input("zone", sql.NVarChar, zone)
      .input("type", sql.NVarChar, type)
      .input("allocated", sql.Int, allocated)
      .input("occupied", sql.Int, occupied)
      .input("users", sql.NVarChar, users || '') 
      .query(`
        INSERT INTO LotStatusHistory (zone, type, allocated, occupied, users, updated_at)
        VALUES (@zone, @type, @allocated, @occupied, @users, GETDATE())
   `);

    res.status(201).json({
      message: `Lot status logged successfully for zone ${zone} (${type})`,
      zone,
      type,
      allocated,
      occupied,
      users: users || 0,
    });
  } catch (err) {
    console.error("Error logging lot status:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// Remote control actions open gate
router.post("/gate/open", authenticateToken, async (req, res) => {
  console.log("Gate open requested");
  res.json({ success: true, message: "Gate open request received" });
});

// Remote control actions open and hold gate
router.post("/gate/open-hold", authenticateToken, async (req, res) => {
  console.log("Gate open and hold requested");
  res.json({ success: true, message: "Gate open-hold request received" });
});

// Remote control actions close gate
router.post("/gate/close", authenticateToken, async (req, res) => {
  console.log("Gate close requested");
  res.json({ success: true, message: "Gate close request received" });
});

// Remote control actions restart app
router.post("/system/restart-app", authenticateToken, async (req, res) => {
  console.log("System restart app requested");
  res.json({ success: true, message: "System restart-app request received" });
});

// Remote control actions eject card
router.post("/card/eject", authenticateToken, async (req, res) => {
  console.log("Card eject requested");
  res.json({ success: true, message: "Card eject request received" });
});

// Remote control actions restart UPOS
router.post("/system/restart-upos", authenticateToken, async (req, res) => {
  console.log("System restart UPOS requested");
  res.json({ success: true, message: "System restart-UPOS request received" });
});

// Log the remote control logs
router.post("/remote-control-logs", authenticateJWT, async (req, res) => {
  const { event_time, action, user, device, status, remarks } = req.body;

  if (!event_time || !action || !user || !device || !status) {
    return res.status(400).json({ error: "All fields except remarks are required" });
  }

  try {
    const pool = await sql.connect(config);

    const query = `
      INSERT INTO RemoteControlHistory 
        (event_time, action, [user], device, status, remarks, created_at, updated_at)
      VALUES 
        (@event_time, @action, @user, @device, @status, @remarks, GETDATE(), GETDATE())
    `;

    const request = pool.request()
      .input("event_time", sql.DateTime, event_time)
      .input("action", sql.NVarChar, action)
      .input("user", sql.NVarChar, user)
      .input("device", sql.NVarChar, device)
      .input("status", sql.NVarChar, status)
      .input("remarks", sql.NVarChar, remarks || null); // allow null if not provided

    const result = await request.query(query);

    res.json({ message: "Remote control log inserted successfully", rowsAffected: result.rowsAffected[0] });
  } catch (err) {
    console.error("Error inserting remote control log:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// Get Lot Status History
router.get("/lot-status-history", authenticateJWT, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    
    const query = `SELECT * FROM LotStatusHistory ORDER BY updated_at DESC`;

    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching lot status history:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// Get remote control logs
router.get("/remote-control-logs", authenticateJWT, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const query = `
      SELECT 
        *
      FROM RemoteControlHistory
      ORDER BY event_time DESC
    `;

    const result = await pool.request().query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching remote control logs:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// Get list of stations
router.get("/stations", authenticateJWT, async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const query = `
      SELECT 
        id,
        station_name,
        type,
        status,
        FORMAT(last_update, 'yyyy-MM-dd HH:mm:ss') AS last_update,
        FORMAT(created_at, 'yyyy-MM-dd HH:mm:ss') AS created_at,
        FORMAT(updated_at, 'yyyy-MM-dd HH:mm:ss') AS updated_at
      FROM stations
      ORDER BY station_name ASC
    `;

    const result = await pool.request().query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching stations:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

module.exports = router;