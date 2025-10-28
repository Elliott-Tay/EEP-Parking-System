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
 // Wednesday block (New: Crosses midnight)
 {
  vehicle_type: "Car/Van",
  day_of_week: "Wed",
  from_time: "22:00:00",
  to_time: "02:00:00", // Span until 02:00 the next day
  rate_type: "Hourly",
  every: 60,
  min_fee: 100,
  grace_time: 0,
  min_charge: 0,
  max_charge: 1000,
  effective_start: "2025-01-01T00:00:00",
  effective_end: "2025-12-31T23:59:59"
 },
 // Thursday Block (Standard rate for crossover test)
 {
  vehicle_type: "Car/Van",
  day_of_week: "Thu",
  from_time: "00:00:00",
  to_time: "23:59:00",
  rate_type: "Hourly",
  every: 60,
  min_fee: 120,
  grace_time: 0,
  min_charge: 100,
  max_charge: 1500,
  effective_start: "2025-01-01T00:00:00",
  effective_end: "2025-12-31T23:59:59"
 },
 // Friday Block 1 (Limited Effective Dates - Should only apply on Oct 10th)
 {
  vehicle_type: "Car/Van",
  day_of_week: "Fri",
  from_time: "08:00:00",
  to_time: "17:00:00",
  rate_type: "Hourly",
  every: 60,
  min_fee: 500, // Expensive rate for testing
  grace_time: 0,
  min_charge: 500,
  max_charge: 5000,
  effective_start: "2025-10-10T00:00:00", // Fri, Oct 10th
  effective_end: "2025-10-10T23:59:59"
 },
 // Friday Block 2 (Standard Rate - Applies outside the limited block)
 {
  vehicle_type: "Car/Van",
  day_of_week: "Fri",
  from_time: "00:00:00",
  to_time: "23:59:00",
  rate_type: "Hourly",
  every: 60,
  min_fee: 100,
  grace_time: 0,
  min_charge: 100,
  max_charge: 1500,
  effective_start: "2025-01-01T00:00:00",
  effective_end: null // No end date
 },
 // Weekend blocks
  {
    vehicle_type: "Car/Van",
    day_of_week: "Sat",
    from_time: "08:00:00",
    to_time: "20:00:00",
    rate_type: "Hourly",
    every: 60,
    min_fee: 150,
    grace_time: 15,
    min_charge: 100,
    max_charge: 1800,
    effective_start: "2025-10-01T00:00:00",
    effective_end: "2025-12-31T23:59:59"
  },
  {
    vehicle_type: "Car/Van",
    day_of_week: "Sat",
    from_time: "20:01:00",
    to_time: "23:59:00",
    rate_type: "Hourly",
    every: 60,
    min_fee: 200,
    grace_time: 15,
    min_charge: 100,
    max_charge: 2000,
    effective_start: "2025-10-01T00:00:00",
    effective_end: "2025-12-31T23:59:59"
  },
  {
    vehicle_type: "Car/Van",
    day_of_week: "Sun",
    from_time: "08:00:00",
    to_time: "20:00:00",
    rate_type: "Hourly",
    every: 60,
    min_fee: 150,
    grace_time: 15,
    min_charge: 100,
    max_charge: 1800,
    effective_start: "2025-10-01T00:00:00",
    effective_end: "2025-12-31T23:59:59"
  },
  {
    vehicle_type: "Car/Van",
    day_of_week: "Sun",
    from_time: "20:01:00",
    to_time: "23:59:00",
    rate_type: "Hourly",
    every: 60,
    min_fee: 200,
    grace_time: 15,
    min_charge: 100,
    max_charge: 2000,
    effective_start: "2025-10-01T00:00:00",
    effective_end: "2025-12-31T23:59:59"
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

// Sample public holidays (Mon, Oct 20th)
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
  // Mon (17:30-23:59): Block 1 (17:30-18:00) 1h*200=200. Block 2 (18:00-23:59) 6h*200=1200. Mon Total = 1400.
  // Tue (00:00-03:30): 3.5h rounds to 4h*150=600.
  // Total = 1400 + 600 = 2000.
  expect(fee).toBe(2000);
 });

 test("Parking on a public holiday (Mon, Oct 20th)", () => {
  const pfc = new ParkingFeeComputer("2025-10-20T10:00:00", "2025-10-20T13:00:00", feeModels, publicHolidays);
  const fee = pfc.computeParkingFee("Car/Van");
  expect(fee).toBe(900); // 3h * 300
 });

 test("Minimum charge enforced per block (not per day, overridden by grace)", () => {
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

 test("Just over grace time (16 mins) applies hourly rate and min charge", () => {
  const pfc = new ParkingFeeComputer("2025-10-06T12:10:00", "2025-10-06T12:26:00", feeModels, publicHolidays);
  const fee = pfc.computeParkingFee("Car/Van");
  // Duration 16 mins -> Over 15 min grace. Rounds up to 1h charge (200). Min charge is 100.
  expect(fee).toBe(200); 
 });

 test("Overnight parking hitting daily maximums (Mon capped + Tue capped)", () => {
  const pfc = new ParkingFeeComputer("2025-10-06T12:00:00", "2025-10-07T12:00:00", feeModels, publicHolidays);
  const fee = pfc.computeParkingFee("Car/Van");
  // Mon (12:00-23:59): Calculated 2400. Capped at Mon Max Charge (2000).
  // Tue (00:00-12:00): Calculated 12h * 150 = 1800. Capped at Tue Max Charge (1800).
  // Total = 2000 + 1800 = 3800.
  expect(fee).toBe(3800);
 });

 test("New: Effective Date Filtering (Parking on Oct 3rd - skips Oct 10th rate)", () => {
 // Fri, Oct 3rd. The expensive 500/hr block is only effective on Oct 10th.
 const pfc = new ParkingFeeComputer("2025-10-03T09:00:00", "2025-10-03T11:00:00", feeModels, publicHolidays);
 const fee = pfc.computeParkingFee("Car/Van");
 // Should use the standard Friday rate (100/hr).
 // Duration 2 hours * 100 = 200.
 expect(fee).toBe(200);
 });

  test("Boundary test: ends exactly on block transition", () => {
    const pfc = new ParkingFeeComputer("2025-10-06T17:00:00", "2025-10-06T18:00:00", feeModels, publicHolidays);
    const fee = pfc.computeParkingFee("Car/Van");
    // Should count as exactly 1h in first block only.
    expect(fee).toBe(200);
  });

  test("Fractional-hour rounding up (1h 1m → 2h charge)", () => {
    const pfc = new ParkingFeeComputer("2025-10-06T14:00:00", "2025-10-06T15:01:00", feeModels, publicHolidays);
    const fee = pfc.computeParkingFee("Car/Van");
    // 1h 1m → 2h billed @200/h = 400
    expect(fee).toBe(400);
  });

  test("Exact block alignment at 18:01:00 (no double charge)", () => {
    const pfc = new ParkingFeeComputer("2025-10-06T18:01:00", "2025-10-06T19:01:00", feeModels, publicHolidays);
    const fee = pfc.computeParkingFee("Car/Van");
    // Entirely within second block: 1 h * 200 = 200
    expect(fee).toBe(200);
  });

  test("Invalid input: exit before entry returns 0", () => {
    const pfc = new ParkingFeeComputer("2025-10-06T18:00:00", "2025-10-06T17:00:00", feeModels, publicHolidays);
    const fee = pfc.computeParkingFee("Car/Van");
    expect(fee).toBe(0);
  });

  test("Unknown vehicle type safely returns 0", () => {
    const pfc = new ParkingFeeComputer("2025-10-06T12:00:00", "2025-10-06T13:00:00", feeModels, publicHolidays);
    const fee = pfc.computeParkingFee("Motorcycle"); // no model defined
    expect(fee).toBe(0);
  });

  test("Vehicle type not defined returns 0", () => {
    const pfc = new ParkingFeeComputer("2025-10-06T12:00:00", "2025-10-06T14:00:00", feeModels, publicHolidays);
    const fee = pfc.computeParkingFee("Bus");
    expect(fee).toBe(0);
  });

  test("Zero-duration parking returns 0", () => {
    const pfc = new ParkingFeeComputer("2025-10-06T12:00:00", "2025-10-06T12:00:00", feeModels, publicHolidays);
    const fee = pfc.computeParkingFee("Car/Van");
    expect(fee).toBe(0);
  });

  test("Block shorter than grace time results in no charge", () => {
    const shortBlockFeeModel = [
      { vehicle_type: "Car/Van", day_of_week: "Mon", from_time: "12:00:00", to_time: "12:10:00", rate_type: "Hourly", every: 60, min_fee: 200, grace_time: 15, min_charge: 100, max_charge: 2000 }
    ];
    const pfc = new ParkingFeeComputer("2025-10-06T12:00:00", "2025-10-06T12:10:00", shortBlockFeeModel);
    const fee = pfc.computeParkingFee("Car/Van");
    expect(fee).toBe(0);

  });

  test("Crosses into public holiday at midnight (PH rate applies correctly)", () => {
      const pfc = new ParkingFeeComputer(
        "2025-10-19T23:00:00",
        "2025-10-20T02:00:00",
        feeModels,
        publicHolidays
      );
      const fee = pfc.computeParkingFee("Car/Van");

      // Sun 23:00–23:59 → falls into 20:01–23:59 block, 1h ≈ rounds to 1h * 200 = 200
      // PH 00:00–02:00 → 2h * 300 = 600
      // Total = 200 + 600 = 800
      expect(fee).toBe(800);
  });

  test("Overlapping blocks within same day sum correctly", () => {
    const overlapBlocks = [
      { vehicle_type: "Car/Van", day_of_week: "Mon", from_time: "12:00:00", to_time: "14:00:00", rate_type: "Hourly", every: 60, min_fee: 100, grace_time: 0, min_charge: 0, max_charge: 1000 },
      { vehicle_type: "Car/Van", day_of_week: "Mon", from_time: "13:00:00", to_time: "15:00:00", rate_type: "Hourly", every: 60, min_fee: 200, grace_time: 0, min_charge: 0, max_charge: 1000 }
    ];
    const pfc = new ParkingFeeComputer("2025-10-06T12:30:00", "2025-10-06T14:30:00", overlapBlocks);
    const fee = pfc.computeParkingFee("Car/Van");
    // Block1: 12:30–14:00 → 1.5h → rounds up 2h *100 = 200
    // Block2: 13:00–14:30 → 1.5h → rounds up 2h *200 = 400
    // Total = 600
    expect(fee).toBe(600);
  });

  test("Multi-block & multi-day parking", () => {
    // Entry: Monday 17:30 → Exit: Tuesday 03:30
    const pfc = new ParkingFeeComputer(
      "2025-10-06T17:30:00",
      "2025-10-07T03:30:00",
      feeModels,
      publicHolidays
    );

    const fee = pfc.computeParkingFee("Car/Van");

      // Calculations using your feeModels:
      // Monday:
      //   Block 1: 17:30–18:00 = 0.5h → rounds to 1h * min_fee 200 = 200
      //   Block 2: 18:01–23:59 ≈ 6h → 6h * min_fee 200 = 1200
      //   Total Mon = 200 + 1200 = 1400
      // Tuesday:
      //   00:00–03:30 ≈ 3.5h → rounds to 4h * min_fee 150 = 600
      // Total = 1400 + 600 = 2000
      expect(fee).toBe(2000);
  });
      
});
