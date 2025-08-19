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

  describe("GET /api/movements/:iu_no", () => {
    const iu_no = "059324323";
    const fakeRecord = { IU_no: iu_no, vehicle_type: "Car", holder_name: "John Doe" };

    it("should return a movement transaction by IU number", async () => {
      db.query.mockResolvedValue([[fakeRecord]]);
      const res = await request(app).get(`/api/movements/${iu_no}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject(fakeRecord);
    });

    it("should return 404 if no record found", async () => {
      db.query.mockResolvedValue([[]]);
      const res = await request(app).get(`/api/movements/nonexistent`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "No record found for this iu_no");
    });

    it("should handle database errors gracefully", async () => {
      db.query.mockRejectedValue(new Error("DB error"));
      const res = await request(app).get(`/api/movements/${iu_no}`);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error");
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
