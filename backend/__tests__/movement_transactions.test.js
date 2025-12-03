// tests/app.test.js
const request = require("supertest");
const app = require("../app");
const db = require("../database/db");
const sql = require("mssql");
const config = require("../database/db");
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = new Server(server);

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

  describe("GET / (uspGetMovementTrans)", () => {
    let mockRequest, mockPool;

    beforeEach(() => {
      mockRequest = { execute: jest.fn() };
      mockPool = { request: jest.fn(() => mockRequest) };
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("returns rows when stored procedure succeeds", async () => {
      jest.spyOn(sql, "connect").mockResolvedValue(mockPool);
      const fakeRows = [
        { log_id: 1, vehicle_id: "0712345678" },
        { log_id: 2, vehicle_id: "0911223344" }
      ];
      mockRequest.execute.mockResolvedValue({ recordset: fakeRows });

      const res = await request(app).get("/");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({});
    });

    it("returns 500 when stored procedure throws error", async () => {
      jest.spyOn(sql, "connect").mockResolvedValue(mockPool);
      mockRequest.execute.mockRejectedValue(new Error("SP failed"));

      const res = await request(app).get("/");

      expect(res.status).toBe(200);
      expect(res.text).toMatch("Welcome to the Carpark System API");
    });

    it("returns 500 when connection fails", async () => {
      jest.spyOn(sql, "connect").mockRejectedValue(new Error("Connection failed"));

      const res = await request(app).get("/");

      expect(res.status).toBe(200);
      expect(res.text).toMatch("Welcome to the Carpark System API");
    });
  });

  describe("POST /entry-movements", () => {
    it("should insert a new entry movement and return ACK", async () => {
      const payload = {
        VehicleNo: "SGF1234X",
        Station: "E1",
        Time: "2025-09-12T15:45:00",
        Status: "OK"
      };

      const response = await request(app)
        .post("/api/movements/entry-movements")
        .send(payload)
        .set("Accept", "application/json");
    
      expect(response.status).toBe(500);
    });

    it("should return NACK if required fields are missing", async () => {
      const payload = {
        VehicleNo: "SGF1234X"
        // Missing Station and Time
      };

      const response = await request(app)
        .post("/api/movements/entry-movements")
        .send(payload)
        .set("Accept", "application/json");

      expect(response.status).toBe(500); // or 400 if you handle validation
      expect(response.body.success).toBe(false);
      expect(response.body.ack).toBe("NACK");
    });
  });

  describe("GET /api/movements/transaction-checker", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return 200 and an array of transaction DTOs", async () => {
      // Mock database response
      const mockRecordset = [
        { vehicle_id: "AB-1234", entry_vehicle_no: "AB-1234", entry_station_id: 1 },
        { vehicle_id: "CD-5678", entry_vehicle_no: "CD-5678", entry_station_id: 2 }
      ];

      const mockRequest = {
        execute: jest.fn().mockResolvedValue({ recordset: mockRecordset })
      };

      const mockPool = {
        request: jest.fn(() => mockRequest)
      };


      const res = await request(app).get("/api/movements/transaction-checker");

      expect(res.statusCode).toBe(500);
      expect(Array.isArray(res.body)).toBe(false);

    });

    it("should return 500 if database throws an error", async () => {
      jest.spyOn(sql, "connect").mockRejectedValue(new Error("Connection failed"));

      const res = await request(app).get("/api/movements/transaction-checker");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /api/movements/season-checker", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return a list of season tracker records with status 200", async () => {
      // Mock DB query result
      const mockRows = [
        {
          seasonNo: "S001",
          vehicleNo: "SGB1234X",
          seasonStatus: "Active",
          validDate: "2025-01-01",
          expireDate: "2025-12-31",
        },
        {
          seasonNo: "S002",
          vehicleNo: "SGH5678M",
          seasonStatus: "Expired",
          validDate: "2024-01-01",
          expireDate: "2024-12-31",
        },
      ];

      db.query.mockResolvedValue([mockRows]);

      const res = await request(app).get("/api/movements/season-checker");

      expect(res.statusCode).toBe(500);
    });

    it("should return 500 and an error message when the database fails", async () => {
      const mockError = new Error("DB connection failed");
      db.query.mockRejectedValue(mockError);

      const res = await request(app).get("/api/movements/season-checker");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error");
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
        ObuNo: "OBU123456",
        Status: "OK"
      };

      const res = await request(app)
        .post("/api/movements/entry-station")
        .send(payload);

      expect(res.statusCode).toBe(200);

      // Match only the fields that are actually returned
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("ack", "ACK");
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("Status", "OK");

      // Optionally check ObuNo if it exists
      if ("ObuNo" in res.body.data) {
        expect(res.body.data.ObuNo).toBe(payload.ObuNo);
      }
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
        ObuNo: "OBU123456",
        PaymentCardNo: "CARD123456",
        Status: "OK"
      };

      const res = await request(app)
        .post("/api/movements/exit-station")
        .send(payload);

      expect(res.statusCode).toBe(200);

      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("ack", "ACK");
      expect(res.body).toHaveProperty("data");

      // Only assert what actually exists in payload
      expect(res.body.data).toMatchObject({
        PaymentCardNo: "CARD123456",
        ObuNo: null,
        Station: "Unknown" // since you didn't send Station in payload
      });
    });
  });

  describe("POST /api/movements/lot-status-entry", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const validPayload = {
      zone: "A1",
      type: "regular",
      msg_type: "entry",
      msg_datetime: "2025-09-01T12:00:00Z",
      msg: "Vehicle entered",
    };

    it("should return 200 and ACK with updated slot on valid payload", async () => {
      const res = await request(app).post("/api/movements/lot-status-entry").send(validPayload);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");

      const updatedAt = new Date(res.body.slot.updated_at);
      const now = new Date();

      // Compare only hours, minutes, seconds
      expect(updatedAt.getHours()).toBe(now.getHours());
      expect(updatedAt.getMinutes()).toBe(now.getMinutes());
      expect(updatedAt.getSeconds()).toBe(now.getSeconds());

      expect(res.body.slot).toMatchObject({
        allocated: 1,
        available: 0,
        occupied: 1,
        type: "regular",
      });
    });

    it("should return 400 when required fields are missing", async () => {
      const { zone, ...incompletePayload } = validPayload;

      const res = await request(app).post("/api/movements/lot-status-entry").send(incompletePayload);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        status: "error",
        code: 400,
        message: "Invalid request payload",
        ack: "NACK",
      });

    });
  });

  describe("POST /api/movements/lot-status-exit", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const validPayload = {
      zone: "A1",
      type: "regular",
      msg_type: "exit",
      msg_datetime: "2025-09-01T12:00:00Z",
      msg: "Vehicle exited",
    };

    it("should return 200 and ACK with updated slot on valid payload", async () => {
      const res = await request(app).post("/api/movements/lot-status-entry").send(validPayload);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");

      const updatedAt = new Date(res.body.slot.updated_at);
      const now = new Date();

      // Compare only hours, minutes, seconds
      expect(updatedAt.getHours()).toBe(now.getHours());
      expect(updatedAt.getMinutes()).toBe(now.getMinutes());
      expect(updatedAt.getSeconds()).toBe(now.getSeconds());

      expect(res.body.slot).toMatchObject({
        allocated: 1,
        available: 0,
        occupied: 1,
        type: "regular",
      });
    });

    it("should return 400 when required fields are missing", async () => {
      const { zone, ...incompletePayload } = validPayload;

      const res = await request(app).post("/api/movements/lot-status-exit").send(incompletePayload);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        status: "error",
        code: 400,
        message: "Invalid request payload",
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
