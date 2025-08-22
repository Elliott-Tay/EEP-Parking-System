const request = require("supertest");
const app = require("../app");
const db = require("../database/db");

// Mock the database module
jest.mock("../database/db",() => ({
    query: jest.fn(),
}));

// Test suite for carpark seasons
describe("Season API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe("GET /api/seasons", () => {
        it("should return all seasons as an array", async () => {
            const fakeData = [
                { season_id: 1, season_name: "Summer", start_date: "2025-06-01", end_date: "2025-08-31" },
                { season_id: 2, season_name: "Winter", start_date: "2025-12-01", end_date: "2026-02-28" }
            ];
            db.query.mockResolvedValue([fakeData]);

            const res = await request(app).get("/api/seasons");
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        })
    })
})