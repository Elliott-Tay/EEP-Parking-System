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
  const { username, email, password, role } = req.body;

  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required" });
  }

  try {
    const pool = await getPool();

    // Check if username or email already exists
    const existingUser = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("email", sql.VarChar, email)
      .query(`
        SELECT * FROM Users 
        WHERE username = @username OR email = @email
      `);

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Default values
    const is_active = true;
    const email_verified = false;
    const created_at = new Date();
    const updated_at = new Date();

    // Insert user
    await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("email", sql.VarChar, email)
      .input("password_hash", sql.VarChar, password_hash)
      .input("role", sql.VarChar, role || "user")
      .input("is_active", sql.Bit, is_active)
      .input("email_verified", sql.Bit, email_verified)
      .input("created_at", sql.DateTime, created_at)
      .input("updated_at", sql.DateTime, updated_at)
      .query(`
        INSERT INTO users
        (username, email, password_hash, role, is_active, email_verified, created_at, updated_at)
        VALUES (@username, @email, @password_hash, @role, @is_active, @email_verified, @created_at, @updated_at)
      `);

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

    // Insert login log
    await pool
      .request()
      .input("user_id", sql.Int, user.id)
      .input("username", sql.VarChar, user.username) // <-- add this
      .input("login_time", sql.DateTime, new Date())
      .input("ip_address", sql.VarChar, req.ip)
      .input("device_info", sql.VarChar, req.headers["user-agent"])
      .query(
        "INSERT INTO UserLoginLog (user_id, username, login_time, ip_address, device_info) VALUES (@user_id, @username, @login_time, @ip_address, @device_info)"
    );
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", async (req, res) => {
  const { userId } = req.body; // Pass the user's ID from frontend or decoded JWT
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  try {
    const pool = await getPool();

    // Update the latest login record for this user
    await pool
      .request()
      .input("user_id", sql.Int, userId)
      .input("logout_time", sql.DateTime, new Date())
      .query(`
        UPDATE UserLoginLog
        SET logout_time = @logout_time
        WHERE user_id = @user_id AND logout_time IS NULL
      `);

    res.json({ message: "Logout recorded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ======== CHANGE PASSWORD ========
router.post("/change-password", async (req, res) => {
  const { username, old_password, new_password } = req.body;

  if (!username || !old_password || !new_password) {
    return res.status(400).json({ error: "Username, old password, and new password are required" });
  }

  try {
    const pool = await getPool();

    // Fetch user by username
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .execute("sp_GetUserByUsername"); // make sure this SP exists

    const user = result.recordset[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(old_password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    // Hash new password
    const newHash = await bcrypt.hash(new_password, 12);

    // Update password in DB
    await pool
      .request()
      .input("id", sql.Int, user.id)
      .input("password_hash", sql.VarChar, newHash)
      .execute("sp_UpdateUserPassword");

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
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
