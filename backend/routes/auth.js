// auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sql, config } = require("../database/db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

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

// ======== REGISTER ========
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const pool = await getPool();

    // Check if user exists
    const existingUser = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("email", sql.VarChar, email)
      .execute("sp_GetUserByUsernameOrEmail");

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Insert user
    await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("email", sql.VarChar, email)
      .input("password_hash", sql.VarChar, password_hash)
      .execute("sp_InsertUser");

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ======== LOGIN ========
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login and JWT token generation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 user:
 *                   type: object
 *                   properties:
 *                     id: { type: integer }
 *                     username: { type: string }
 *                     role: { type: string }
 *       400:
 *         description: Invalid username or password / missing fields
 *       401:
 *         description: Missing token
 *       403:
 *         description: Invalid token
 *       500:
 *         description: Server error
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .execute("sp_GetUserByUsername");

    const user = result.recordset[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Update last login
    await pool
      .request()
      .input("id", sql.Int, user.id)
      .execute("sp_UpdateLastLogin");

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ======== AUTH MIDDLEWARE ========
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = {
  authRouter: router,
  authenticateToken,
};
