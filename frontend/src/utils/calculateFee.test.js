// tests/calculateFee.vehicleCategories.test.js
import { calculateParkingFee } from "../src/utils/calculateFee.js";

const tariffs = [
  // Car only
  { vehicle_type: "Car", day_of_week: "Mon - Fri", from_time: "08:00:00", to_time: "18:00:00", every: 60, first_min_fee: "2,00", min_fee: "2,00", min_charge: "2,00", max_charge: "10,00" },

  // Car / HGV
  { vehicle_type: "Car / HGV", day_of_week: "Mon - Fri", from_time: "08:00:00", to_time: "18:00:00", every: 60, first_min_fee: "3,00", min_fee: "3,00", min_charge: "3,00", max_charge: "15,00" },

  // Car / HGV / MC
  { vehicle_type: "Car / HGV / MC", day_of_week: "Mon - Fri", from_time: "08:00:00", to_time: "18:00:00", every: 60, first_min_fee: "4,00", min_fee: "4,00", min_charge: "4,00", max_charge: "20,00" },

  // Overnight interval for testing
  { vehicle_type: "Car", day_of_week: "Mon - Fri", from_time: "22:00:00", to_time: "06:00:00", every: 60, first_min_fee: "5,00", min_fee: "5,00", min_charge: "5,00", max_charge: "25,00" },

  // PH interval
  { vehicle_type: "Car", day_of_week: "PH", from_time: "00:00:00", to_time: "23:59:59", every: 60, first_min_fee: "6,00", min_fee: "6,00", min_charge: "6,00", max_charge: "30,00" },
];

describe("Vehicle category exact-match tests", () => {

  test("Car matches only Car tariffs", () => {
    const entry = "2025-11-03T09:00:00";
    const exit = "2025-11-03T11:00:00";
    const result = calculateParkingFee(entry, exit, "Car", tariffs);

    console.log("Car only result:", result);
    // Should only use Car-only tariff, not Car/HGV or Car/HGV/MC
    expect(result.totalFee).toBe(4); // 2-hour stay, every 60 mins, first_min_fee + 1*min_fee
  });

  test("Car / HGV matches only Car / HGV tariffs", () => {
    const entry = "2025-11-03T09:00:00";
    const exit = "2025-11-03T11:00:00";
    const result = calculateParkingFee(entry, exit, "Car / HGV", tariffs);

    console.log("Car / HGV result:", result);
    expect(result.totalFee).toBe(6); // 2-hour stay, first_min_fee + 1*min_fee
  });

  test("Car / HGV / MC matches only Car / HGV / MC tariffs", () => {
    const entry = "2025-11-03T09:00:00";
    const exit = "2025-11-03T11:00:00";
    const result = calculateParkingFee(entry, exit, "Car / HGV / MC", tariffs);

    console.log("Car / HGV / MC result:", result);
    expect(result.totalFee).toBe(8); // 2-hour stay
  });

  test("Overnight midnight charges split across two days", () => {
    const entry = "2025-11-03T23:00:00"; // Monday
    const exit = "2025-11-04T05:00:00"; // Tuesday
    const result = calculateParkingFee(entry, exit, "Car", tariffs);

    console.log("Overnight result:", result);
    expect(result.daySummaries.length).toBe(2);
    expect(result.totalFee).toBeGreaterThan(0);
  });

  test("Grace time period only charges first_min_fee", () => {
    const entry = "2025-11-05T10:00:00";
    const exit = "2025-11-05T10:15:00"; // 15 minutes stay
    const result = calculateParkingFee(entry, exit, "Car", tariffs);

    console.log("Grace time result:", result);
    expect(result.totalFee).toBe(2);
  });

  test("Public holiday tariffs applied", () => {
    const phDate = "2025-12-25"; // Christmas PH
    const entry = `${phDate}T09:00:00`;
    const exit = `${phDate}T12:00:00`;
    const result = calculateParkingFee(entry, exit, "Car", tariffs);

    console.log("PH day result:", result);
    expect(result.totalFee).toBeGreaterThanOrEqual(6); // first_min_fee applied
    expect(result.daySummaries[0].day).toContain("Thu"); // 25th Dec 2025 is Thursday
  });

});
