import { calculateParkingFee } from "./calculateFee";

const baseTariff = {
  vehicle_type: "Car/Van",
  every: 60,
  first_min_fee: 1,
  min_fee: 1,
  min_charge: 2,
  max_charge: 30,
};

// Use full-day intervals to avoid gaps
const mockTariffs = [
  // Monday
  { ...baseTariff, day_of_week: "Mon", from_time: "2025-10-13T00:00:00", to_time: "2025-10-13T23:59:59" },
  { ...baseTariff, day_of_week: "Tue", from_time: "2025-10-14T00:00:00", to_time: "2025-10-14T23:59:59" },
  { ...baseTariff, day_of_week: "Wed", from_time: "2025-10-15T00:00:00", to_time: "2025-10-15T23:59:59" },
  { ...baseTariff, day_of_week: "Thu", from_time: "2025-10-16T00:00:00", to_time: "2025-10-16T23:59:59" },
  { ...baseTariff, day_of_week: "Fri", from_time: "2025-10-17T00:00:00", to_time: "2025-10-17T23:59:59" },
  { ...baseTariff, day_of_week: "Sat", from_time: "2025-10-18T00:00:00", to_time: "2025-10-18T23:59:59" },
  { ...baseTariff, day_of_week: "Sun", from_time: "2025-10-19T00:00:00", to_time: "2025-10-19T23:59:59" },
  { ...baseTariff, day_of_week: "PH", from_time: "2025-12-25T00:00:00", to_time: "2025-12-25T23:59:59" },
];

describe("Parking Fee Calculation", () => {
  test("calculates fee correctly for same-day parking", () => {
    const entry = "2025-10-13T08:00:00";
    const exit = "2025-10-13T12:00:00";

    const result = calculateParkingFee(entry, exit, "Car/Van", mockTariffs);

    expect(result.totalHours).toBeCloseTo(4);
    expect(result.totalFee).toBeGreaterThan(0);
    expect(result.daySummaries.length).toBe(1);
  });

  test("calculates fee correctly for overnight parking (crosses midnight)", () => {
    const entry = "2025-10-13T22:00:00";
    const exit = "2025-10-14T07:00:00";

    const result = calculateParkingFee(entry, exit, "Car/Van", mockTariffs);

    expect(result.totalHours).toBeCloseTo(9);
    expect(result.totalFee).toBeGreaterThan(0);
    expect(result.daySummaries.length).toBeGreaterThanOrEqual(2);
  });

  test("calculates fee correctly for weekend full-day parking", () => {
    const entry = "2025-10-18T09:00:00"; // Saturday
    const exit = "2025-10-18T23:00:00";

    const result = calculateParkingFee(entry, exit, "Car/Van", mockTariffs);

    expect(result.totalHours).toBeCloseTo(14);
    expect(result.totalFee).toBeGreaterThan(0);
    expect(result.daySummaries.length).toBe(1);
  });

  test("calculates fee correctly for multi-day week span", () => {
    const entry = "2025-10-13T13:19:00"; // Monday
    const exit = "2025-10-22T17:19:00"; // Wednesday next week

    const result = calculateParkingFee(entry, exit, "Car/Van", mockTariffs);

    expect(result.totalHours).toBeCloseTo(220, 0);
    expect(result.totalFee).toBeGreaterThan(0);
    expect(result.daySummaries.length).toBeGreaterThan(5);
  });

  test("calculates fee correctly across public holiday overnight", () => {
    const entry = "2025-12-24T20:00:00"; // Christmas Eve
    const exit = "2025-12-25T08:00:00"; // Christmas Day (PH)

    const result = calculateParkingFee(entry, exit, "Car/Van", mockTariffs);

    expect(result.totalHours).toBeCloseTo(12);
    expect(result.totalFee).toBeGreaterThan(0);
    expect(result.daySummaries.length).toBeGreaterThanOrEqual(2);
  });
});
