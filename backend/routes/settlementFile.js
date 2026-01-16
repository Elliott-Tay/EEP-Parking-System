const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { sql, config } = require("../database/db");
const fs = require("fs");

// --- Multer setup for memory storage ---
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- POST /cscr-files/upload ---
router.post("/cscr-files/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, buffer } = req.file;

    const {
      SendDateTime,
      TotalTransNo,
      TotalTransAmount,
      FailTransNo,
      FailTransAmount,
      OkTransNo,
      OkTransAmount
    } = req.body;

    // Basic validation
    if (
      !SendDateTime ||
      TotalTransNo == null ||
      TotalTransAmount == null ||
      FailTransNo == null ||
      FailTransAmount == null ||
      OkTransNo == null ||
      OkTransAmount == null
    ) {
      return res.status(400).json({
        message: "Missing required settlement fields"
      });
    }

    const pool = await sql.connect(config);

    await pool.request()
    .input("SendDateTime", sql.DateTime2, SendDateTime)
    .input("FileName", sql.NVarChar(255), originalname)
    .input("TotalTransNo", sql.Int, TotalTransNo)
    .input("TotalTransAmount", sql.Decimal(18, 2), TotalTransAmount)
    .input("FailTransNo", sql.Int, FailTransNo)
    .input("FailTransAmount", sql.Decimal(18, 2), FailTransAmount)
    .input("OkTransNo", sql.Int, OkTransNo)
    .input("OkTransAmount", sql.Decimal(18, 2), OkTransAmount)
    .query(`
      INSERT INTO CSCR_Files (
        SendDateTime,
        FileName,
        TotalTransNo,
        TotalTransAmount,
        FailTransNo,
        FailTransAmount,
        OkTransNo,
        OkTransAmount
      )
      VALUES (
        @SendDateTime,
        @FileName,
        @TotalTransNo,
        @TotalTransAmount,
        @FailTransNo,
        @FailTransAmount,
        @OkTransNo,
        @OkTransAmount
      )
    `);

    res.status(201).json({
      message: "CSCR file and settlement data saved successfully"
    });

  } catch (err) {
    console.error("Error uploading CSCR file:", err);
    res.status(500).json({
      message: "Error uploading CSCR file",
      error: err.message
    });
  }
});

// Get all CSCR files (metadata only)
router.get("/cscr-files/get", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query(`
      SELECT
        FileID,
        SendDateTime,
        FileName,
        TotalTransNo,
        TotalTransAmount,
        FailTransNo,
        FailTransAmount,
        OkTransNo,
        OkTransAmount
      FROM CSCR_Files
      ORDER BY SendDateTime DESC
    `);

    res.status(200).json({
      message: "CSCR files fetched successfully",
      files: result.recordset
    });

  } catch (err) {
    console.error("Error fetching CSCR files:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a specific CSCR file (metadata only)
router.get("/cscr-files/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);

    const result = await pool.request()
      .input("FileID", sql.Int, id)
      .query(`
        SELECT
          FileID,
          SendDateTime,
          FileName,
          TotalTransNo,
          TotalTransAmount,
          FailTransNo,
          FailTransAmount,
          OkTransNo,
          OkTransAmount
        FROM CSCR_Files
        WHERE FileID = @FileID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    res.status(200).json({
      message: "CSCR file fetched successfully",
      file: result.recordset[0]
    });

  } catch (err) {
    console.error("Error fetching CSCR file:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;