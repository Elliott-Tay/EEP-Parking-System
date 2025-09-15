const request = require("supertest");
const app = require("../app");
const db = require("../database/db");
const sql = require("mssql");
const config = require("../database/db");
const { Server } = require("socket.io");
const http = require("http");
const jwt = require("jsonwebtoken");


describe("Auth Routes", () => {
  describe("POST /api/auth/register", () => {
    it("should fail if fields are missing", async () => {
      const res = await request(app).post("/api/auth/register").send({
        username: "testuser",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Missing required fields");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "password123",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.username).toBe("testuser");
    });

    it("should fail with wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "wrongpassword",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Invalid username or password");
    });
  });
});