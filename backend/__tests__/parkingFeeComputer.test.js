const { ParkingFeeComputer } = require('../routes/parkingFeeCompute');;

// Sample fee models for Car/Van
const feeModels = [
  // Monday blocks
  {
    vehicle_type: "Car/Van",
    day_of_week: "Mon",
    from_time: "12:00:00",
    to_time: "18:00:00",
    rate_type: "Hourly",
    every: 60,
    min_fee: 200,
    grace_time: 15,
    min_charge: 100,
    max_charge: 2000,
    effective_start: "2025-10-01T00:00:00",
    effective_end: "2025-10-31T23:59:59"
  },
  {
    vehicle_type: "Car/Van",
    day_of_week: "Mon",
    from_time: "18:01:00",
    to_time: "23:59:00",
    rate_type: "Hourly",
    every: 60,
    min_fee: 200,
    grace_time: 15,
    min_charge: 100,
    max_charge: 2000,
    effective_start: "2025-10-01T00:00:00",
    effective_end: "2025-10-31T23:59:59"
  },
  // Tuesday blocks
  {
    vehicle_type: "Car/Van",
    day_of_week: "Tue",
    from_time: "00:00:00",
    to_time: "23:59:00",
    rate_type: "Hourly",
    every: 60,
    min_fee: 150,
    grace_time: 0,
    min_charge: 100,
    max_charge: 1800,
    effective_start: "2025-10-01T00:00:00",
    effective_end: "2025-10-31T23:59:59"
  },
  // Public Holiday rate
  {
    vehicle_type: "Car/Van",
    day_of_week: "PH",
    from_time: "00:00:00",
    to_time: "23:59:00",
    rate_type: "Hourly",
    every: 60,
    min_fee: 300,
    grace_time: 0,
    min_charge: 200,
    max_charge: 2500,
    effective_start: "2025-01-01T00:00:00",
    effective_end: "2025-12-31T23:59:59"
  }
];

// Sample public holidays
const publicHolidays = ["2025-10-20T00:00:00"];

describe("ParkingFeeComputer - Multi-day & Multi-block", () => {
  test("Same day within first block with grace time", () => {
    const pfc = new ParkingFeeComputer("2025-10-06T12:10:00", "2025-10-06T12:20:00", feeModels, publicHolidays);
    const fee = pfc.computeParkingFee("Car/Van");
    expect(fee).toBe(0); // within 15 min grace
  });

  test("Same day spanning two blocks (2 hours duration)", () => {
    const pfc = new ParkingFeeComputer("2025-10-06T17:30:00", "2025-10-06T19:30:00", feeModels, publicHolidays);
    const fee = pfc.computeParkingFee("Car/Van");
    // Block 1 (17:30-18:00 = 30m): Rounds to 1h charge (200).
    // Block 2 (18:00-19:30 = 90m): Rounds to 2h charge (400).
    // Total = 600.
    expect(fee).toBe(600);
  });

  test("Overnight parking spanning Mon and Tue (Corrected Calc)", () => {
    const pfc = new ParkingFeeComputer("2025-10-06T17:30:00", "2025-10-07T03:30:00", feeModels, publicHolidays);
    const fee = pfc.computeParkingFee("Car/Van");
    // Mon (17:30-23:59): Block 1 (17:30-18:00) 1h*200=200. Block 2 (18:00-23:59) 6h*200=1200. Mon Total = 1400 (under Mon max 2000).
    // Tue (00:00-03:30): 3.5h rounds to 4h*150=600.
    // Total = 1400 + 600 = 2000.
    expect(fee).toBe(2000);
  });

  test("Minimum charge enforced per day (within grace time)", () => {
    const pfc = new ParkingFeeComputer("2025-10-06T12:10:00", "2025-10-06T12:20:00", feeModels, publicHolidays);
    const fee = pfc.computeParkingFee("Car/Van");
    expect(fee).toBe(0); // grace time overrides min_charge
  });

  test("Maximum charge enforced per day (Mon)", () => {
    const longParking = new ParkingFeeComputer("2025-10-06T12:00:00", "2025-10-06T23:59:00", feeModels, publicHolidays);
    const fee = longParking.computeParkingFee("Car/Van");
    // Calculated fee is 2400 (12h*200). Max charge for Mon is 2000.
    expect(fee).toBe(2000);
  });

  test("New: Just over grace time (16 mins) applies hourly rate and min charge", () => {
    const pfc = new ParkingFeeComputer("2025-10-06T12:10:00", "2025-10-06T12:26:00", feeModels, publicHolidays);
    const fee = pfc.computeParkingFee("Car/Van");
    // Duration 16 mins -> Over 15 min grace. Rounds up to 1h charge (200). Min charge is 100.
    expect(fee).toBe(200);
  });

  test("New: Overnight parking hitting daily maximums (Mon capped + Tue capped)", () => {
    const pfc = new ParkingFeeComputer("2025-10-06T12:00:00", "2025-10-07T12:00:00", feeModels, publicHolidays);
    const fee = pfc.computeParkingFee("Car/Van");
    // Mon (12:00-23:59): Calculated 2400. Capped at Mon Max Charge (2000).
    // Tue (00:00-12:00): Calculated 12h * 150 = 1800. Capped at Tue Max Charge (1800).
    // Total = 2000 + 1800 = 3800.
    expect(fee).toBe(3800);
  });
});