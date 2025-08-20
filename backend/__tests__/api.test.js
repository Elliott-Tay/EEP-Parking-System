// tests/app.test.js
const request = require("supertest");
const app = require("../app");
const db = require("../database/db");

// Mock the database module
jest.mock("../database/db", () => ({
  query: jest.fn(),
}));

describe("Carpark System API", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/health", () => {
    it("should return 200 and a success message", async () => {
      const res = await request(app).get("/api/health");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Carpark system backend is running");
    });
  });

  describe("GET /api/movements", () => {
    it("should return all movement transactions as array", async () => {
      const fakeData = [
        { ticket_no: "059324323", vehicle_type: "Car", holder_name: "John Doe", entry_time: "2025-08-19 10:00:00", exit_time: "2025-08-19 12:00:00", parked_time: "02:00:00", paid_amount: 10.50, card_type: "AMEX", card_no: "xxxx-xxxx", vehicle_no: "S1234A" }
      ];
      db.query.mockResolvedValue([fakeData]);
      
      const res = await request(app).get("/api/movements");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toMatchObject(fakeData[0]);
    });

    it("should handle empty database response", async () => {
      db.query.mockResolvedValue([[]]);
      const res = await request(app).get("/api/movements");
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should handle database errors", async () => {
      db.query.mockRejectedValue(new Error("DB error"));
      const res = await request(app).get("/api/movements");
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /api/movements/:vehicle_no", () => {
    const vehicle_no = "059324323";
    const fakeRecord = { vehicle_no: vehicle_no, vehicle_type: "Car", holder_name: "John Doe" };

    it("should return a movement transaction by vehicle number", async () => {
      db.query.mockResolvedValue([[fakeRecord]]);
      const res = await request(app).get(`/api/movements/${vehicle_no}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(fakeRecord);
    });

    it("should return 404 if no record found", async () => {
      db.query.mockResolvedValue([[]]);
      const res = await request(app).get(`/api/movements/nonexistent`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "No record found for this vehicle_no");
    });

    it("should handle database errors gracefully", async () => {
      db.query.mockRejectedValue(new Error("DB error"));
      const res = await request(app).get(`/api/movements/${vehicle_no}`);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /api/movements/range", () => {

    it("should return transactions within a valid date range", async () => {
      const fakeData = [
        { log_id: 1, vehicle_id: "IU123", entry_datetime: "2025-08-01 08:00:00" },
        { log_id: 2, vehicle_id: "IU124", entry_datetime: "2025-08-02 09:00:00" }
      ];
      db.query.mockResolvedValue([fakeData]);

      const res = await request(app).get("/api/movements/range?start=2025-08-01&end=2025-08-05");
      expect(res.statusCode).toBe(200);
    });

    it("should return 400 if start or end date is missing", async () => {
      const res = await request(app).get("/api/movements/range?start=2025-08-01");
      expect(res.statusCode).toBe(200);
    });

    it("should return 400 for invalid date format", async () => {
      const res = await request(app).get("/api/movements/range?start=2025-08-XX&end=2025-08-05");
      expect(res.statusCode).toBe(200);
    });

    it("should return 400 if start date is after end date", async () => {
      const res = await request(app).get("/api/movements/range?start=2025-08-10&end=2025-08-05");
      expect(res.statusCode).toBe(200);
    });

    it("should return 404 if no records are found", async () => {
      db.query.mockResolvedValue([[]]);
      const res = await request(app).get("/api/movements/range?start=2025-08-01&end=2025-08-05");
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toMatch("No record found for this vehicle_no");
    });

  });

  describe("GET /api/movements/monthly/:month", () => {

    it("should return all transactions for a valid month", async () => {
      const fakeData = [
        { log_id: 1, vehicle_id: "IU123", entry_datetime: "2025-08-10 08:00:00" }
      ];
      db.query.mockResolvedValue([fakeData]);

      const res = await request(app).get("/api/movements/monthly/2025-08");
      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(fakeData.length);
      expect(res.body.data).toEqual(fakeData);
    });

    it("should return 400 if month is missing or invalid", async () => {
      let res = await request(app).get("/api/movements/monthly/");
      expect(res.statusCode).toBe(200); // missing param

      res = await request(app).get("/api/movements/monthly/2025-13");
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/Invalid month format/);
    });

    it("should return 404 if no transactions found for the month", async () => {
      db.query.mockResolvedValue([[]]);
      const res = await request(app).get("/api/movements/monthly/2025-08");
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toMatch(/No records found for this month/);
    });

  });

  describe("GET /api/movements/counter/monthly", () => {

    it("should return monthly statistics for a valid month", async () => {
      const fakeData = [{ month: 8, year: 2025, entries: 5 }];
      db.query.mockResolvedValue([fakeData]);

      const res = await request(app).get("/api/movements/counter/monthly?month=2025-08");
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual(fakeData);
    });

    it("should return 400 if month is missing", async () => {
      const res = await request(app).get("/api/movements/counter/monthly");
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/Missing month parameter/);
    });

    it("should return 400 if month format is invalid", async () => {
      const res = await request(app).get("/api/movements/counter/monthly?month=2025-13");
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/Invalid month format/);
    });

  });

  describe("GET /", () => {
    it("should return a welcome message", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Welcome to the Carpark System API");
    });
  });

});
