const express = require("express");
const router = express.Router();
const { sql, config } = require("../database/db");

// Optional: create a DTO to control output format
class AuthorizedCarDTO {
  constructor(row) {
    this.id = row.id;
    this.plateNumber = row.plate_number;
    this.ownerName = row.owner_name;
    this.vehicleType = row.vehicle_type;
    this.authorizationType = row.authorization_type;
    this.validFrom = row.valid_from;
    this.validTo = row.valid_to;
    this.notes = row.notes;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }
}

// ---------------- GET all ----------------
router.get("/authorized-cars", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM AuthorizedCars");
    const response = (result.recordset || []).map(row => new AuthorizedCarDTO(row));
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Cannot fetch AuthorizedCars", details: error.message });
  }
});

// ---------------- GET one by ID ----------------
router.get("/authorized-cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("id", sql.BigInt, id)
      .query("SELECT * FROM AuthorizedCars WHERE id = @id");
    if (!result.recordset.length) return res.status(404).json({ error: "Car not found" });
    res.json(new AuthorizedCarDTO(result.recordset[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Cannot fetch AuthorizedCar", details: error.message });
  }
});

// ---------------- CREATE new ----------------
router.post("/authorized-cars", async (req, res) => {
  try {
    const { plateNumber, ownerName, vehicleType, authorizationType, validFrom, validTo, notes } = req.body;

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("plate_number", sql.VarChar(20), plateNumber)
      .input("owner_name", sql.VarChar(100), ownerName)
      .input("vehicle_type", sql.VarChar(10), vehicleType)
      .input("authorization_type", sql.VarChar(10), authorizationType)
      .input("valid_from", sql.Date, validFrom)
      .input("valid_to", sql.Date, validTo)
      .input("notes", sql.Text, notes || null)
      .query(`
        INSERT INTO AuthorizedCars 
        (plate_number, owner_name, vehicle_type, authorization_type, valid_from, valid_to, notes)
        OUTPUT INSERTED.*
        VALUES (@plate_number, @owner_name, @vehicle_type, @authorization_type, @valid_from, @valid_to, @notes)
      `);

    res.status(201).json(new AuthorizedCarDTO(result.recordset[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Cannot create AuthorizedCar", details: error.message });
  }
});

// ---------------- UPDATE by ID ----------------
router.put("/authorized-cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { plateNumber, ownerName, vehicleType, authorizationType, validFrom, validTo, notes } = req.body;

    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("id", sql.BigInt, id)
      .input("plate_number", sql.VarChar(20), plateNumber)
      .input("owner_name", sql.VarChar(100), ownerName)
      .input("vehicle_type", sql.VarChar(10), vehicleType)
      .input("authorization_type", sql.VarChar(10), authorizationType)
      .input("valid_from", sql.Date, validFrom)
      .input("valid_to", sql.Date, validTo)
      .input("notes", sql.Text, notes || null)
      .query(`
        UPDATE AuthorizedCars
        SET plate_number = @plate_number,
            owner_name = @owner_name,
            vehicle_type = @vehicle_type,
            authorization_type = @authorization_type,
            valid_from = @valid_from,
            valid_to = @valid_to,
            notes = @notes,
            updated_at = CURRENT_TIMESTAMP
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (!result.recordset.length) return res.status(404).json({ error: "Car not found" });

    res.json(new AuthorizedCarDTO(result.recordset[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Cannot update AuthorizedCar", details: error.message });
  }
});

// ---------------- DELETE by ID ----------------
router.delete("/authorized-cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("id", sql.BigInt, id)
      .query(`
        DELETE FROM AuthorizedCars
        OUTPUT DELETED.*
        WHERE id = @id
      `);

    if (!result.recordset.length) return res.status(404).json({ error: "Car not found" });

    res.json({ message: "AuthorizedCar deleted successfully", deleted: new AuthorizedCarDTO(result.recordset[0]) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Cannot delete AuthorizedCar", details: error.message });
  }
});

module.exports = router;