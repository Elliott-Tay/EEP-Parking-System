const express = require("express");
const multer = require("multer");
const { sql, config } = require("../database/db");

const router = express.Router();

// Use memory storage for multer
const upload = multer({ storage: multer.memoryStorage() });

// POST /tariff-image
router.post("/tariff-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { originalname, mimetype, buffer, size } = req.file;

    // Connect to database
    const pool = await sql.connect(config);

    // Insert the new image
    await pool.request()
      .input("filename", sql.NVarChar, originalname)
      .input("mimetype", sql.NVarChar, mimetype)
      .input("size", sql.Int, size)
      .input("image_data", sql.VarBinary(sql.MAX), buffer)
      .query(`
        INSERT INTO TariffImages (filename, mimetype, size, image_data)
        VALUES (@filename, @mimetype, @size, @image_data)
      `);

    res.status(201).json({
      message: "Image uploaded and replaced successfully",
      filename: originalname
    });

  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// GET /tariff-image
router.get("/tariff-image", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request()
      .query(`
        SELECT TOP 1 filename, mimetype, size, image_data
        FROM TariffImages
        ORDER BY id DESC
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ error: "No image found" });
    }

    const image = result.recordset[0];

    res.setHeader("Content-Type", image.mimetype);
    res.setHeader("Content-Length", image.size);
    res.send(image.image_data);

  } catch (err) {
    console.error("Error fetching image:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});


module.exports = router;
