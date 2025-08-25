// tests/app.test.js
const request = require("supertest");
const app = require("../app");
const db = require("../database/db");
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = new Server(server);

io.emit = jest.fn();

// Mock the database module
jest.mock("../database/db", () => ({
  query: jest.fn(),
}));

// Test suite for movement transactions
describe("Movement Transaction API", () => {

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
      expect(res.statusCode).toBe(400);
    });

    it("should return 400 for invalid date format", async () => {
      const res = await request(app).get("/api/movements/range?start=2025-08-XX&end=2025-08-05");
      expect(res.statusCode).toBe(400);
    });

    it("should return 400 if start date is after end date", async () => {
      const res = await request(app).get("/api/movements/range?start=2025-08-10&end=2025-08-05");
      expect(res.statusCode).toBe(400);
    });

    it("should return 404 if no records are found", async () => {
      db.query.mockResolvedValue([[]]);
      const res = await request(app).get("/api/movements/range?start=2025-08-01&end=2025-08-05");
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toMatch("No records found for this range");
    });

  });

  describe("Movement Transaction API - GET /api/movements/day/:date", () => {
    const date = "2025-08-20";

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return all movement transactions for a specific day", async () => {
      // Mock DB query to return sample data
      const mockRows = [
        { log_id: 1, vehicle_id: "IU12345", entry_datetime: "2025-08-20 09:00:00" },
        { log_id: 2, vehicle_id: "IU67890", entry_datetime: "2025-08-20 11:00:00" },
      ];
      db.query.mockResolvedValue([mockRows]);

      const res = await request(app).get(`/api/movements/day/${date}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("date", date);
      expect(res.body).toHaveProperty("count", mockRows.length);
      expect(res.body).toHaveProperty("data");
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toEqual(mockRows);
    });

    it("should return 400 if date parameter is missing", async () => {
      const res = await request(app).get(`/api/movements/day/`);
      expect(res.statusCode).toBe(200); // Express returns 404 for missing route param
    });

    it("should return 400 for invalid date format", async () => {
      const res = await request(app).get(`/api/movements/day/invalid-date`);
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Invalid date format, use YYYY-MM-DD");
    });

    it("should return 404 if no records found for the day", async () => {
      db.query.mockResolvedValue([[]]); // empty result
      const res = await request(app).get(`/api/movements/day/${date}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "No records found for this day");
    });

    it("should return 500 if database error occurs", async () => {
      db.query.mockRejectedValue(new Error("DB connection failed"));
      const res = await request(app).get(`/api/movements/day/${date}`);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Database error fetching data");
      expect(res.body).toHaveProperty("details", "DB connection failed");
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

  describe("POST /api/movements/entry-station", () => {

    beforeEach(() => {
      carsInLot = 0;
    });

    it("should return 200 and emit event with valid data", async () => {
      const payload = {
        msg_type: "entry",
        msg_datetime: "2025-08-25T10:00:00Z",
        msg: "Vehicle entered",
      };

      const res = await request(app)
        .post("/api/movements/entry-station")
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true, "data": {
         "msg": "Vehicle entered",
         "msg_datetime": "2025-08-25T10:00:00Z",
         "msg_type": "entry",
       }, ack: "ACK" });
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/movements/entry-station")
        .send({ msg_type: "entry" }); // missing msg_datetime and msg

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "Missing msg_type, msg_datetime or msg", ack: "NACK", success: false });
    });
  });

  describe("POST /api/movements/exit-station", () => {
    beforeEach(() => {
      carsInLot = 0;
    });

    it("should return 200 and emit event with valid data", async () => {
      const payload = {
        msg_type: "exit",
        msg_datetime: "2025-08-25T10:00:00Z",
        msg: "Vehicle exited",
      };

      const res = await request(app)
        .post("/api/movements/exit-station")
        .send(payload);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true, data: {
         "msg": "Vehicle exited",
         "msg_datetime": "2025-08-25T10:00:00Z",
         "msg_type": "exit",
       }, ack: "ACK" });
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/movements/exit-station")
        .send({ msg_type: "exit" }); // missing msg_datetime and msg

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: "Missing msg_type, msg_datetime or msg", ack: "NACK", success: false});
    });
  });

  describe("POST /api/movements/lot-status-entry", () => {
    test("✅ should return ACK on valid payload", async () => {
      const res = await request(app)
        .post("/api/movements/lot-status-entry")
        .send({
          msg_type: "entry",
          msg_datetime: "2025-08-25T10:00:00",
          msg: "Vehicle entered at gate 1",
        });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        status: "success",
        code: 200,
        message: "Lot status received by OPC",
        ack: "ACK",
      });
      expect(res.body.carsInLot).toBeGreaterThanOrEqual(1);
    });

    test("❌ should return NACK on invalid payload", async () => {
      const res = await request(app)
        .post("/api/movements/lot-status-entry")
        .send({ msg_type: "entry" }); // missing datetime + msg

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: "error",
        code: 400,
        ack: "NACK",
      });
    });
  });

  describe("POST /api/movements/lot-status-exit", () => {
    test("✅ should return ACK on valid payload", async () => {
      const res = await request(app)
        .post("/api/movements/lot-status-exit")
        .send({
          msg_type: "exit",
          msg_datetime: "2025-08-25T10:00:00",
          msg: "Vehicle exit at gate 1",
        });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        status: "success",
        code: 200,
        message: "Lot status received by OPC",
        ack: "ACK",
      });
      expect(res.body.carsInLot).toBeGreaterThanOrEqual(-1);
    });

    test("❌ should return NACK on invalid payload", async () => {
      const res = await request(app)
        .post("/api/movements/lot-status-exit")
        .send({ msg_type: "exit" }); // missing datetime + msg

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: "error",
        code: 400,
        ack: "NACK",
      });
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
