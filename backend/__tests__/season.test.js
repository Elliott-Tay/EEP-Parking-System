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
                { season_id: 13423, name: "Tai Seng Carpark", start_date: "2025-06-01", end_date: "2025-08-31" },
                { season_id: 13422, name: "Macpherson Carpark", start_date: "2025-12-01", end_date: "2026-02-28" }
            ];
            db.query.mockResolvedValue([fakeData]);

            const res = await request(app).get("/api/seasons");
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        })

        it("should handle empty database response", async () => {
            db.query.mockResolvedValue([[]]);
            const res = await request(app).get("/api/seasons");
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual([]);
        });
    })

    describe("Seasons API - GET /api/seasons/:season_id", () => {
        const season_id = 13423;

        afterEach(() => {
            jest.clearAllMocks();
        });

        it("should return a specific season by ID", async () => {
            const mockSeason = { season_id: 13423, name: "Tai Seng Carpark", start_date: "2025-06-01", end_date: "2025-08-31" };
            db.query.mockResolvedValue([[mockSeason]]); // mock DB response

            const res = await request(app).get(`/api/seasons/${season_id}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty("season_id", season_id);
            expect(res.body).toHaveProperty("name", "Tai Seng Carpark");
            expect(res.body).toHaveProperty("start_date", "2025-06-01");
            expect(res.body).toHaveProperty("end_date", "2025-08-31");
        });

        it("should return 404 if season not found", async () => {
            db.query.mockResolvedValue([[]]); // no rows
            const res = await request(app).get(`/api/seasons/999`);
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty("error", "Season not found");
        });

        it("should return 500 if database error occurs", async () => {
            db.query.mockRejectedValue(new Error("DB connection failed"));
            const res = await request(app).get(`/api/seasons/${season_id}`);
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty("error", "Internal server error: ");
            expect(res.body).toHaveProperty("err", "DB connection failed");
        });
    });
})