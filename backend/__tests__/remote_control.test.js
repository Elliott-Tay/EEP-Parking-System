// tests/remoteControl.test.js
const request = require("supertest");
const express = require("express");
const db = require("../database/db");
const remoteControlRouter = require("../routes/remoteControl"); // adjust path

jest.mock("../database/db"); // Mock the db module

const app = express();
app.use(express.json());
app.use("/api/remote-control", remoteControlRouter);

/*
describe("GET /api/remote-control/lot-status", () => {
  it("should return parking lot data with correct totals and available spots", async () => {
    db.query.mockResolvedValue({
      rows: [
        { zone: "A", type: "hourly", allocated: 10, occupied: 5 },
        { zone: "A", type: "season", allocated: 20, occupied: 12 },
        { zone: "B", type: "hourly", allocated: 15, occupied: 7 },
        { zone: "B", type: "season", allocated: 25, occupied: 10 },
      ],
    });

    const res = await request(app).get("/api/remote-control/lot-status");

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      A: {
        hourly: { allocated: 10, occupied: 5, available: 5 },
        season: { allocated: 20, occupied: 12, available: 8 },
        total: { allocated: 30, occupied: 17, available: 13 },
      },
      B: {
        hourly: { allocated: 15, occupied: 7, available: 8 },
        season: { allocated: 25, occupied: 10, available: 15 },
        total: { allocated: 40, occupied: 17, available: 23 },
      },
    });
  });

  it("should return 500 if db.query fails", async () => {
    db.query.mockRejectedValue(new Error("DB error"));

    const res = await request(app).get("/api/remote-control/lot-status");

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Failed to fetch lot data" });
  });
});
*/

describe("Remote Control API", () => {
  test("POST /api/remote-control/gate/open", async () => {
    const res = await request(app).post("/api/remote-control/gate/open");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Gate open request received",
    });
  });

  test("POST /api/remote-control/gate/open-hold", async () => {
    const res = await request(app).post("/api/remote-control/gate/open-hold");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Gate open-hold request received",
    });
  });

  test("POST /api/remote-control/gate/close", async () => {
    const res = await request(app).post("/api/remote-control/gate/close");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Gate close request received",
    });
  });

  test("POST /api/remote-control/system/restart-app", async () => {
    const res = await request(app).post("/api/remote-control/system/restart-app");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "System restart-app request received",
    });
  });

  test("POST /api/remote-control/card/eject", async () => {
    const res = await request(app).post("/api/remote-control/card/eject");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Card eject request received",
    });
  });

  test("POST /api/remote-control/system/restart-upos", async () => {
    const res = await request(app).post("/api/remote-control/system/restart-upos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "System restart-UPOS request received",
    });
  });
});
