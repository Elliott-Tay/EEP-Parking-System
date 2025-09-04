const express = require("express");
const router = express.Router();
const db = require("../database/db"); 

/**
 * @swagger
 * /lot-status:
 *   get:
 *     summary: Get parking lot status by zone and type
 *     description: Returns parking lot data organized by zone and type, including allocated, occupied, and available spots.
 *     tags:
 *       - Parking Lots
 *     responses:
 *       200:
 *         description: Successfully retrieved lot data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   hourly:
 *                     type: object
 *                     additionalProperties:
 *                       type: object
 *                       properties:
 *                         allocated:
 *                           type: integer
 *                           example: 10
 *                         occupied:
 *                           type: integer
 *                           example: 5
 *                         available:
 *                           type: integer
 *                           example: 5
 *                   season:
 *                     type: object
 *                     additionalProperties:
 *                       type: object
 *                       properties:
 *                         allocated:
 *                           type: integer
 *                           example: 20
 *                         occupied:
 *                           type: integer
 *                           example: 12
 *                         available:
 *                           type: integer
 *                           example: 8
 *                   total:
 *                     type: object
 *                     properties:
 *                       allocated:
 *                         type: integer
 *                         example: 30
 *                       occupied:
 *                         type: integer
 *                         example: 17
 *                       available:
 *                         type: integer
 *                         example: 13
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch lot data"
 */
router.get("/lot-status", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT zone, type, allocated, occupied
      FROM parking_lots
    `);

    const rows = result.rows;

    // Transform into same shape as lotMockData
    const data = {};

    rows.forEach((row) => {
      const { zone, type, allocated, occupied } = row;

      if (!data[zone]) {
        data[zone] = { hourly: {}, season: {}, total: { allocated: 0, occupied: 0, available: 0 } };
      }

      data[zone][type] = {
        allocated,
        occupied,
        available: allocated - occupied,
      };

      // update totals
      data[zone].total.allocated += allocated;
      data[zone].total.occupied += occupied;
      data[zone].total.available = data[zone].total.allocated - data[zone].total.occupied;
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch lot data" });
  }
});

/**
 * @swagger
 * /lot-status/{zone}/{type}:
 *   patch:
 *     summary: Update parking lot allocation or occupancy for a specific zone and type
 *     description: >
 *       Updates the `allocated` and/or `occupied` counts for a given zone and type (`hourly` or `season`).
 *       If totals are affected, they are recalculated automatically.
 *     tags:
 *       - Parking Lots
 *     parameters:
 *       - in: path
 *         name: zone
 *         required: true
 *         schema:
 *           type: string
 *         description: The zone identifier (e.g., "A", "B").
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [hourly, season]
 *         description: The parking type to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               allocated:
 *                 type: integer
 *                 example: 50
 *               occupied:
 *                 type: integer
 *                 example: 30
 *             description: Fields to update. At least one must be provided.
 *     responses:
 *       200:
 *         description: Successfully updated parking lot data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 zone:
 *                   type: string
 *                   example: "A"
 *                 type:
 *                   type: string
 *                   example: "hourly"
 *                 allocated:
 *                   type: integer
 *                   example: 50
 *                 occupied:
 *                   type: integer
 *                   example: 30
 *                 available:
 *                   type: integer
 *                   example: 20
 *       400:
 *         description: No fields provided to update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No fields to update"
 *       404:
 *         description: Zone/type not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Zone/type not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update lot data"
 */
router.patch("/lot-status/:zone/:type", async (req, res) => {
  const { zone, type } = req.params;
  const { allocated, occupied } = req.body;

  try {
    const fields = [];
    const values = [];
    let idx = 1;

    if (allocated !== undefined) {
      fields.push(`allocated = $${idx++}`);
      values.push(allocated);
    }
    if (occupied !== undefined) {
      fields.push(`occupied = $${idx++}`);
      values.push(occupied);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(zone, type);

    // 1️⃣ Update the requested row
    const query = `
      UPDATE parking_lots
      SET ${fields.join(", ")}
      WHERE zone = $${idx++} AND type = $${idx}
      RETURNING *;
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Zone/type not found" });
    }

    // 2️⃣ If hourly/season was updated, recompute totals
    if (type !== "total") {
      const totalResult = await db.query(
        `
        SELECT
          SUM(allocated) AS allocated,
          SUM(occupied) AS occupied
        FROM parking_lots
        WHERE zone = $1 AND type IN ('hourly', 'season');
        `,
        [zone]
      );

      const { allocated: totalAllocated, occupied: totalOccupied } =
        totalResult.rows[0];

      await db.query(
        `
        UPDATE parking_lots
        SET allocated = $1, occupied = $2
        WHERE zone = $3 AND type = 'total';
        `,
        [totalAllocated, totalOccupied, zone]
      );
    }

    // 3️⃣ Return the updated row (plus recalculated available)
    const updated = result.rows[0];
    res.json({
      zone: updated.zone,
      type: updated.type,
      allocated: updated.allocated,
      occupied: updated.occupied,
      available: updated.allocated - updated.occupied,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update lot data" });
  }
});

module.exports = router;