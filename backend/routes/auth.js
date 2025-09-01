// auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// ======== In-memory stores (replace with DB) ========
const users = new Map(); // key: email, value: { id, email, passwordHash }
const refreshTokens = new Map(); // key: userId, value: current valid refresh token

// ======== helpers ========
const ACCESS_TTL_SEC = 15 * 60; // 15 min
const REFRESH_TTL_SEC = 7 * 24 * 60 * 60; // 7 days
const SALT_ROUNDS = 12;

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TTL_SEC });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TTL_SEC });
}

function setAuthCookies(res, accessToken, refreshToken) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: ACCESS_TTL_SEC * 1000,
    path: "/",
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: REFRESH_TTL_SEC * 1000,
    path: "/auth/refresh", // tighten scope if you want
  });
}

function clearAuthCookies(res) {
  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/auth/refresh" });
}

// ======== middleware ========
function requireAuth(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // { userId, email }
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ======== routes ========

// Register
router.post("/register", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  if (users.has(email)) return res.status(409).json({ error: "Email already registered" });

  if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = { id: uuidv4(), email, passwordHash };
  users.set(email, user);

  // issue tokens
  const accessToken = signAccessToken({ userId: user.id, email });
  const refreshToken = signRefreshToken({ userId: user.id, email });
  refreshTokens.set(user.id, refreshToken);

  setAuthCookies(res, accessToken, refreshToken);
  res.status(201).json({ user: { id: user.id, email } });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = users.get(email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = signAccessToken({ userId: user.id, email });
  const refreshToken = signRefreshToken({ userId: user.id, email });
  refreshTokens.set(user.id, refreshToken); // rotate
  setAuthCookies(res, accessToken, refreshToken);
  res.json({ user: { id: user.id, email } });
});

// Refresh (silent)
router.post("/refresh", (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) return res.status(401).json({ error: "Missing refresh token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET); // { userId, email, iat, exp }
    const current = refreshTokens.get(payload.userId);
    if (current !== token) return res.status(401).json({ error: "Refresh token revoked" });

    // rotate tokens
    const newAccess = signAccessToken({ userId: payload.userId, email: payload.email });
    const newRefresh = signRefreshToken({ userId: payload.userId, email: payload.email });
    refreshTokens.set(payload.userId, newRefresh);
    setAuthCookies(res, newAccess, newRefresh);

    res.json({ ok: true });
  } catch {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  try {
    const rt = req.cookies?.refresh_token;
    if (rt) {
      // best-effort revoke
      try {
        const { userId } = jwt.verify(rt, process.env.JWT_REFRESH_SECRET);
        refreshTokens.delete(userId);
      } catch {}
    }
    clearAuthCookies(res);
    res.json({ ok: true });
  } catch {
    res.json({ ok: true });
  }
});

// Example protected route
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: { id: req.user.userId, email: req.user.email } });
});

module.exports = { authRouter: router, requireAuth };
