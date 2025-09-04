// tests/remoteControl.test.js
const request = require("supertest");
const express = require("express");
const db = require("../database/db");
const remoteControlRouter = require("../routes/remoteControl"); // adjust path

jest.mock("../database/db"); // Mock the db module

const app = express();
app.use(express.json());
app.use("/api/remote-control", remoteControlRouter);

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

    expect(res.statusCode).toBe(200);
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

describe("PATCH /api/remote-control/lot-status/:zone/:type", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update allocated and occupied and return updated row with available", async () => {
    // Mock the first update query
    db.query
      .mockResolvedValueOnce({
        rows: [{ zone: "A", type: "hourly", allocated: 50, occupied: 30 }],
      })
      // Mock total recompute query
      .mockResolvedValueOnce({
        rows: [{ allocated: 70, occupied: 42 }],
      })
      // Mock total update query
      .mockResolvedValueOnce({});

    const res = await request(app)
      .patch("/api/remote-control/lot-status/A/hourly")
      .send({ allocated: 50, occupied: 30 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      zone: "A",
      type: "hourly",
      allocated: 50,
      occupied: 30,
      available: 20,
    });

    expect(db.query).toHaveBeenCalledTimes(3);
  });

  it("should return 400 if no fields provided", async () => {
    const res = await request(app)
      .patch("/api/remote-control/lot-status/A/hourly")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "No fields to update" });
  });

  it("should return 404 if zone/type not found", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .patch("/api/remote-control/lot-status/X/hourly")
      .send({ allocated: 10 });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Zone/type not found" });
  });

  it("should return 500 if db.query fails", async () => {
    db.query.mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .patch("/api/remote-control/lot-status/A/hourly")
      .send({ allocated: 10 });

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Failed to update lot data" });
  });
});
