// tests/remoteControl.test.js
const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../database/db");
const remoteControlRouter = require("../routes/remoteControl"); // adjust path

jest.mock("../database/db"); // Mock the db module

const app = express();
app.use(express.json());
app.use("/api/remote-control", remoteControlRouter);

// ---- Create a mock token ----
const JWT_SECRET = process.env.JWT_SECRET || "test-secret"; // match your app secret
const mockUser = { id: 1, username: "testuser", role: "admin" };
const token = jwt.sign(mockUser, JWT_SECRET, { expiresIn: "15m" });

const authHeader = `Bearer ${token}`;

// ---- Helper function to add auth header ----
const postWithAuth = (url) => request(app).post(url).set("Authorization", authHeader);

describe("Remote Control API (Authenticated)", () => {
  test("POST /api/remote-control/gate/open", async () => {
    const res = await postWithAuth("/api/remote-control/gate/open");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Gate open request received",
    });
  });

  test("POST /api/remote-control/gate/open-hold", async () => {
    const res = await postWithAuth("/api/remote-control/gate/open-hold");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Gate open-hold request received",
    });
  });

  test("POST /api/remote-control/gate/close", async () => {
    const res = await postWithAuth("/api/remote-control/gate/close");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Gate close request received",
    });
  });

  test("POST /api/remote-control/system/restart-app", async () => {
    const res = await postWithAuth("/api/remote-control/system/restart-app");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "System restart-app request received",
    });
  });

  test("POST /api/remote-control/card/eject", async () => {
    const res = await postWithAuth("/api/remote-control/card/eject");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Card eject request received",
    });
  });

  test("POST /api/remote-control/system/restart-upos", async () => {
    const res = await postWithAuth("/api/remote-control/system/restart-upos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "System restart-UPOS request received",
    });
  });
});

describe("Remote Control API (Unauthorized)", () => {
  test("POST without token should return 401", async () => {
    const res = await request(app).post("/api/remote-control/gate/open");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({});
  });
});
