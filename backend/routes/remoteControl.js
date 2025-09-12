const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { sql, config } = require("../database/db"); 
const parkingLotDTO = require("../DTO/parkingLotDTO");

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
    console.log(`Client ${clientId} disconnected`);
    lotStatusClients = lotStatusClients.filter((c) => c.id !== clientId);
  });
});

// 🔹 Normal endpoint (polling)
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

router.post("/gate/open", async (req, res) => {
  console.log("Gate open requested");
  res.json({ success: true, message: "Gate open request received" });
});

router.post("/gate/open-hold", async (req, res) => {
  console.log("Gate open and hold requested");
  res.json({ success: true, message: "Gate open-hold request received" });
});

router.post("/gate/close", async (req, res) => {
  console.log("Gate close requested");
  res.json({ success: true, message: "Gate close request received" });
});

router.post("/system/restart-app", async (req, res) => {
  console.log("System restart app requested");
  res.json({ success: true, message: "System restart-app request received" });
});

router.post("/card/eject", async (req, res) => {
  console.log("Card eject requested");
  res.json({ success: true, message: "Card eject request received" });
});

router.post("/system/restart-upos", async (req, res) => {
  console.log("System restart UPOS requested");
  res.json({ success: true, message: "System restart-UPOS request received" });
});

module.exports = router;