const request = require("supertest");
const app = require("../app");

describe("GET /api/health", () => {
  it("should return 200 and a success message", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Carpark system backend is running");
  });
});