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
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    const { originalname, buffer } = req.file; // Multer buffer
    const { UploadedBy, FileType, Notes } = req.body;

    // Connect to MSSQL
    const pool = await sql.connect(config);
    const request = pool.request();

    request.input("FileName", sql.NVarChar, originalname);
    request.input("FileData", sql.VarBinary(sql.MAX), buffer); // Store file binary in FilePath (or change column name if needed)
    request.input("UploadedBy", sql.NVarChar, UploadedBy || null);
    request.input("Status", sql.NVarChar, "Uploaded");
    request.input("FileType", sql.NVarChar, FileType || null);
    request.input("Notes", sql.NVarChar, Notes || null);

    const query = `
      INSERT INTO CSCR_Files (FileName, FileData, UploadedBy, UploadedAt, FileType, Status, Notes)
      VALUES (@FileName, @FileData, @UploadedBy, GETDATE(), @FileType, @Status, @Notes);
      SELECT SCOPE_IDENTITY() AS FileID;
    `;

    const result = await request.query(query);

    res.status(201).json({
      message: "File uploaded and saved to database successfully",
      FileID: result.recordset[0].FileID
    });

  } catch (err) {
    console.error("Error uploading CSCR file:", err);
    res.status(500).json({ message: "Error uploading file", error: err.message });
  }
});


module.exports = router;