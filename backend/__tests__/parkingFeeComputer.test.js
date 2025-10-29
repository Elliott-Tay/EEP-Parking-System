const { ParkingFeeComputer } = require('../routes/parkingFeeCompute');

// --- Test Data Setup ---
// The fee models for the whole week including PH
const feeModels = [
  // Monday (All blocks @ $1/hr, Max $30)
  { vehicle_type: "Car/Van", day_of_week: "Mon", from_time: "00:00:00", to_time: "11:59:00", rate_type: "Hourly", every: 60, min_fee: 1, grace_time: 15, min_charge: 1, max_charge: 30 },
  { vehicle_type: "Car/Van", day_of_week: "Mon", from_time: "12:00:00", to_time: "18:00:00", rate_type: "Hourly", every: 60, min_fee: 1, grace_time: 15, min_charge: 1, max_charge: 30 },
  { vehicle_type: "Car/Van", day_of_week: "Mon", from_time: "18:01:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 1, grace_time: 15, min_charge: 1, max_charge: 30 },

  // Tuesday (@ $1/hr, Max $30)
  { vehicle_type: "Car/Van", day_of_week: "Tue", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 1, grace_time: 15, min_charge: 1, max_charge: 30 },

  // Wednesday (@ $1/hr, Max $30)
  { vehicle_type: "Car/Van", day_of_week: "Wed", from_time: "00:00:00", to_time: "21:59:00", rate_type: "Hourly", every: 60, min_fee: 1, grace_time: 15, min_charge: 1, max_charge: 30 },
  { vehicle_type: "Car/Van", day_of_week: "Wed", from_time: "22:00:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 1, grace_time: 15, min_charge: 1, max_charge: 30 },
  
  // Thursday (@ $1/hr, Max $30)
  { vehicle_type: "Car/Van", day_of_week: "Thu", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 1, grace_time: 15, min_charge: 1, max_charge: 30 },

  // Friday
  { vehicle_type: "Car/Van", day_of_week: "Fri", from_time: "00:00:00", to_time: "07:59:00", rate_type: "Hourly", every: 60, min_fee: 1.5, grace_time: 15, min_charge: 1.5, max_charge: 35 },
  { vehicle_type: "Car/Van", day_of_week: "Fri", from_time: "08:00:00", to_time: "17:00:00", rate_type: "Hourly", every: 60, min_fee: 1, grace_time: 15, min_charge: 1, max_charge: 30, effective_start: "2025-10-10", effective_end: "2025-10-10" }, // LIMITED RATE
  { vehicle_type: "Car/Van", day_of_week: "Fri", from_time: "08:00:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 1.5, grace_time: 15, min_charge: 1.5, max_charge: 35 }, // STANDARD RATE

  // Saturday (@ $2/hr, Max $45)
  { vehicle_type: "Car/Van", day_of_week: "Sat", from_time: "00:00:00", to_time: "07:59:00", rate_type: "Hourly", every: 60, min_fee: 2, grace_time: 15, min_charge: 2, max_charge: 45 },
  { vehicle_type: "Car/Van", day_of_week: "Sat", from_time: "08:00:00", to_time: "20:00:00", rate_type: "Hourly", every: 60, min_fee: 2, grace_time: 15, min_charge: 2, max_charge: 45 },
  { vehicle_type: "Car/Van", day_of_week: "Sat", from_time: "20:01:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 2, grace_time: 15, min_charge: 2, max_charge: 45 },

  // Sunday (@ $2/hr, Max $45)
  { vehicle_type: "Car/Van", day_of_week: "Sun", from_time: "00:00:00", to_time: "07:59:00", rate_type: "Hourly", every: 60, min_fee: 2, grace_time: 15, min_charge: 2, max_charge: 45 },
  { vehicle_type: "Car/Van", day_of_week: "Sun", from_time: "08:00:00", to_time: "20:00:00", rate_type: "Hourly", every: 60, min_fee: 2, grace_time: 15, min_charge: 2, max_charge: 45 },
  { vehicle_type: "Car/Van", day_of_week: "Sun", from_time: "20:01:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 2, grace_time: 15, min_charge: 2, max_charge: 45 },

  // Public Holiday (@ $3/hr, Max $50)
  { vehicle_type: "Car/Van", day_of_week: "PH", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 3, grace_time: 15, min_charge: 3, max_charge: 50 }
];

// Sample public holiday (Mon, Oct 20th, 2025)
const publicHolidays = ["2025-10-20T00:00:00"];


describe("ParkingFeeComputer - Comprehensive Hourly Tests", () => {
    
    // Monday, Oct 6th, 2025 is used for standard weekly tests.

    // --- 1. Basic Functionality & Grace Time ---
    test("1.1 Parking within grace time returns zero fee (Mon)", () => {
        const pfc = new ParkingFeeComputer("2025-10-06T10:00:00", "2025-10-06T10:10:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // Duration 10 mins < 15 min grace.
        expect(fee).toBe(0);
    });

    test("1.2 Parking just over grace time results in 1-hour minimum fee (Mon)", () => {
        const pfc = new ParkingFeeComputer("2025-10-06T10:00:00", "2025-10-06T10:16:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // Duration 16 mins > 15 min grace. Rounds to 1h @ $1/hr.
        expect(fee).toBe(1);
    });

    test("1.3 Fractional-hour rounding up (1h 1m -> 2h charge)", () => {
        const pfc = new ParkingFeeComputer("2025-10-06T14:00:00", "2025-10-06T15:01:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // 1h 1m rounds to 2h @ $1/hr.
        expect(fee).toBe(2);
    });

    // --- 2. Block Transitions & Multi-Day ---
    test("2.1 Same-day parking spanning two blocks (Mon 17:45 to 19:45)", () => {
        const pfc = new ParkingFeeComputer("2025-10-06T17:45:00", "2025-10-06T19:45:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // Block 2 (12:00-18:00): 17:45 - 18:00 (15 min). Over grace. Rounds to 1h. Fee: $1.
        // Block 3 (18:01-23:59): 18:01 - 19:45 (1h 44m). Rounds to 2h. Fee: $2.
        // Total: $1 + $2 = $3
        expect(fee).toBe(3);
    });

    test("2.2 Overnight parking spanning Wed (Block 2) into Thu (full day)", () => {
        const pfc = new ParkingFeeComputer("2025-10-08T23:00:00", "2025-10-09T01:30:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // Wed (22:00-23:59): 23:00 - 23:59 (59 min). Rounds to 1h @ $1/hr. Fee: $1.
        // Thu (00:00-23:59): 00:00 - 01:30 (1h 30m). Rounds to 2h @ $1/hr. Fee: $2.
        // Total: $1 + $2 = $3
        expect(fee).toBe(3);
    });

    // --- 3. Maximum Charge Enforcement ---
    test("3.1 Long stay on a Public Holiday hits the PH daily maximum charge ($50)", () => {
        // Mon, Oct 20th is PH. Rate $3/hr, Max $50.
        const pfc = new ParkingFeeComputer("2025-10-20T00:00:00", "2025-10-20T23:59:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // Calculated: 24h * $3 = $72. Capped at Max Charge: $50.
        expect(fee).toBe(50);
    });

    test("3.2 Long stay across multiple days hits both daily maximums (Sat/Sun)", () => {
        // Sat rate $2/hr, Max $45. Sun rate $2/hr, Max $45.
        const pfc = new ParkingFeeComputer("2025-10-04T08:00:00", "2025-10-05T20:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // Sat (08:00-23:59): 16h. Calculated: 16h * $2 = $32. Capped at $45 (no change).
        // Sun (00:00-20:00): 20h. Calculated: 20h * $2 = $40. Capped at $45 (no change).
        // Total: $32 + $40 = $72.
        expect(fee).toBe(72);
    });

    // --- 4. Public Holiday and Effective Date Logic ---
    test("4.1 Public Holiday rate correctly overrides the standard day rate (Mon)", () => {
        // Mon, Oct 20th is PH. Rate $3/hr. Mon rate $1/hr.
        const pfc = new ParkingFeeComputer("2025-10-20T10:00:00", "2025-10-20T13:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // 3h * $3/hr = $9.
        expect(fee).toBe(9);
    });

    test("4.2 Limited Effective Date applies the special lower rate (Fri, Oct 10th)", () => {
        // Fri, Oct 10th: Limited 08:00-17:00 block @ $1/hr should be chosen over the standard $1.5/hr block.
        const pfc = new ParkingFeeComputer("2025-10-10T09:00:00", "2025-10-10T12:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // 3 hours * $1/hr = $3.
        expect(fee).toBe(3);
    });

    test("4.3 Effective Date Filtering: Standard rate applies when date is outside the limited period (Fri, Oct 3rd)", () => {
        // Fri, Oct 3rd: Limited block is skipped. Standard 08:00-23:59 block @ $1.5/hr should be used.
        const pfc = new ParkingFeeComputer("2025-10-03T09:00:00", "2025-10-03T12:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // 3 hours * $1.5/hr = $4.5.
        expect(fee).toBe(4.5);
    });

    // --- 5. Edge Cases (Zero duration, invalid input) ---
    test("5.1 Zero-duration parking returns 0", () => {
        const pfc = new ParkingFeeComputer("2025-10-06T12:00:00", "2025-10-06T12:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        expect(fee).toBe(0);
    });
    
    test("5.2 Invalid input: exit before entry returns 0", () => {
        const pfc = new ParkingFeeComputer("2025-10-06T18:00:00", "2025-10-06T17:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        expect(fee).toBe(0);
    });

    // --- 6. Multi-Day and Daily Maximum Scenarios (Existing) ---
    
    test("6.1 Full 24-hour stay (Mon) confirms calculated fee is under the daily max", () => {
        // Mon rate: $1/hr, Max: $30.
        const pfc = new ParkingFeeComputer("2025-10-06T00:00:00", "2025-10-06T23:59:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // Total duration is 24 hours. Calculated fee: 24 * $1 = $24. Since $24 < $30 max, $24 is charged.
        expect(fee).toBe(24);
    });
    
    test("6.2 Multi-day stay: Friday (Max $35) into Saturday (Max $45)", () => {
        // Entry: Fri, Oct 3rd 20:00:00, Exit: Sat, Oct 4th 08:00:00
        const pfc = new ParkingFeeComputer("2025-10-03T20:00:00", "2025-10-04T08:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        
        // Day 1 (Fri): 20:00 to 23:59 (4 hours). Rate $1.5/hr. Fee: 4 * $1.5 = $6. (Well below $35 max)
        // Day 2 (Sat): 00:00 to 08:00 (8 hours). Rate $2/hr. Fee: 8 * $2 = $16. (Well below $45 max)
        // Total: $6 + $16 = $22.
        expect(fee).toBe(22);
    });

    test("6.3 Multi-day stay: Sunday (Max $45) into Public Holiday Monday (Max $50)", () => {
        // Entry: Sun, Oct 19th 22:00:00, Exit: Mon, Oct 20th 05:00:00 (Oct 20th is PH)
        const pfc = new ParkingFeeComputer("2025-10-19T22:00:00", "2025-10-20T05:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        
        // Day 1 (Sun): 22:00 to 23:59 (2 hours). Rate $2/hr. Fee: 2 * $2 = $4.
        // Day 2 (PH Mon): 00:00 to 05:00 (5 hours). Rate $3/hr. Fee: 5 * $3 = $15.
        // Total: $4 + $15 = $19.
        expect(fee).toBe(19);
    });
    
    // --- 7. Boundary and Rate Edge Cases (Existing) ---

    test("7.1 Multi-day stay near maximum charge (Thu/Fri)", () => {
        // Entry: Thu, Oct 2nd 10:00:00, Exit: Fri, Oct 3rd 10:00:00 (24 hours total)
        const pfc = new ParkingFeeComputer("2025-10-02T10:00:00", "2025-10-03T10:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        
        // Day 1 (Thu): 10:00 to 23:59 (14 hours). Rate $1/hr. Fee: $14. (Max $30)
        // Day 2 (Fri, standard rate): 00:00 to 10:00 (10 hours). Rate $1.5/hr. Fee: 10 * $1.5 = $15. (Max $35)
        // Total: $14 + $15 = $29.
        expect(fee).toBe(29);
    });

    test("7.2 Grace time across a rate block transition (Mon 12:00:00 boundary)", () => {
        // Entry: Mon 11:55:00 (Block 1), Exit: Mon 12:11:00 (Block 2) -> 16 minutes total.
        const pfc = new ParkingFeeComputer("2025-10-06T11:55:00", "2025-10-06T12:11:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        
        // Duration 16 mins > 15 min grace. Should be charged the min fee from the relevant blocks.
        // Since both blocks have the same rate ($1/hr), the total minimum charge is $1.
        expect(fee).toBe(1);
    });

    test("7.3 Long stay on Limited Date (Fri, Oct 10th) spanning three rate models", () => {
        // Entry: Fri, Oct 10th 06:00:00, Exit: Fri, Oct 10th 20:00:00
        const pfc = new ParkingFeeComputer("2025-10-10T06:00:00", "2025-10-10T20:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        
        // 1. Early Morning (06:00 - 07:59): 2h @ $1.5/hr = $3.00
        // 2. Limited Rate (08:00 - 17:00): 9h @ $1.0/hr = $9.00
        // 3. Standard Evening (17:01 - 20:00): 3h @ $1.5/hr = $4.50
        // Total: 14 hours. $3.00 + $9.00 + $4.50 = $16.50. (Max $35)
        expect(fee).toBe(16.50);
    });
    
    // --- 8. Max Charge and Time Boundary Stress Tests (Existing) ---

    test("8.1 Multi-day stay that exceeds max on Day 1 and continues (Sat/Sun)", () => {
        // Entry: Sat, Oct 4th 00:00:00, Exit: Sun, Oct 5th 00:00:01
        const pfc = new ParkingFeeComputer("2025-10-04T00:00:00", "2025-10-05T00:00:01", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        
        // Day 1 (Sat): 24 hours @ $2/hr = $48. Capped at Max $45. Fee 1: $45.
        // Day 2 (Sun): 1 second (00:00:00 to 00:00:01). Rounds to 1 hour @ $2/hr. Fee 2: $2.
        // Total: $45 + $2 = $47.
        expect(fee).toBe(47);
    });

    test("8.2 Exact grace period duration returns zero (Mon)", () => {
        // Duration is exactly 15 minutes. Should be 0.
        const pfc = new ParkingFeeComputer("2025-10-06T15:00:00", "2025-10-06T15:15:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        expect(fee).toBe(0);
    });

    test("8.3 Single-day stay that is just over the daily calculated max (Sat)", () => {
        // Entry: Sat 00:00:00, Exit: Sat 23:00:00 (23 hours total)
        const pfc = new ParkingFeeComputer("2025-10-04T00:00:00", "2025-10-04T23:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        
        // Calculated: 23 hours @ $2/hr = $46. Daily Max: $45.
        // Should be capped at $45.
        expect(fee).toBe(45);
    });
    
    // --- 9. Multi-Week Stress Tests (New) ---

    test("9.1 Eight-day continuous parking (Mon to next Tue) hitting all daily maxes", () => {
        // Entry: Mon, Oct 6th 08:00:00, Exit: Tue, Oct 14th 08:00:00 (8 days total)
        const pfc = new ParkingFeeComputer("2025-10-06T08:00:00", "2025-10-14T08:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        
        // Mon 6th: 16h @ $1/hr = $16 (Max $30)
        // Tue 7th - Thu 9th: 3 days * $24 (24h * $1/hr) = $72 (Max $30/day)
        // Fri 10th: 24h @ $1.5/hr = $36. Capped at $35.
        // Sat 11th: 24h @ $2/hr = $48. Capped at $45.
        // Sun 12th: 24h @ $2/hr = $48. Capped at $45.
        // Mon 13th: 24h @ $1/hr = $24 (Max $30)
        // Tue 14th: 8h @ $1/hr = $8 (Max $30)
        // Total: $16 + $72 + $35 + $45 + $45 + $24 + $3 = $240.00
        expect(fee).toBe(240.00);
    });

    test("9.2 Long stay spanning multiple days and ending on a Public Holiday", () => {
        // Entry: Thu, Oct 16th 10:00:00, Exit: Mon, Oct 20th 10:00:00 (Oct 20th is PH)
        const pfc = new ParkingFeeComputer("2025-10-16T10:00:00", "2025-10-20T10:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        
        // Thu 16th: 14h @ $1/hr = $14
        // Fri 17th: 24h @ $1.5/hr = $35 (capped)
        // Sat 18th: 24h @ $2/hr = $45 (capped)
        // Sun 19th: 24h @ $2/hr = $45 (capped)
        // Mon 20th (PH): 10h @ $3/hr = $30
        // Total: $14 + $35 + $45 + $45 + $30 = $169.00
        expect(fee).toBe(169.00);
    });

    test("9.3 Overnight stay across Limited Date Friday into Standard Saturday", () => {
        // Entry: Fri, Oct 10th 16:00:00, Exit: Sat, Oct 11th 09:00:00
        const pfc = new ParkingFeeComputer("2025-10-10T16:00:00", "2025-10-11T09:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        
        // Day 1 (Fri, Oct 10th - Limited Day):
        // 16:00-17:00 (1h): Limited Rate (08:00-17:00) @ $1/hr = $1.00
        // 17:01-23:59 (7h): Standard Rate (08:00-23:59) @ $1.5/hr = $10.50
        // Total Fri: $11.50 (Max $35)
        
        // Day 2 (Sat, Oct 11th):
        // 00:00-09:00 (9h): Sat Rate @ $2/hr = $18.00 (Max $45)
        
        // Grand Total: $11.50 + $18.00 = $29.50
        expect(fee).toBe(29.50);
    });

  describe("10. Public Holiday, Limited Rate, and Grace Period Tests", () => {
    // We need to define the public holiday for this test set (PH rules: $3/hr, Max $50)
    const phDate = "2025-10-20"; // Monday, Oct 20th 2025
    const publicHolidays = [
      { date: phDate, description: "Placeholder PH" }
    ];

    test("10.1 Date-Specific Rate Hit (Limited Friday 2025-10-10)", () => {
      // Test the special rule: 08:00-17:00 on 2025-10-10 has a rate of $1/hr (instead of the standard $1.5)
      // Entry: Fri, Oct 10th 07:00:00, Exit: Fri, Oct 10th 10:00:00 (3 hours total)
      
      // Breakdown:
      // 07:00 - 08:00: 1h @ $1.50 (Standard Fri rule) = $1.50
      // 08:00 - 10:00: 2h @ $1.00 (Limited Fri rule) = $2.00
      // Total: $3.50 (Max $35)
      const pfc = new ParkingFeeComputer("2025-10-10T07:00:00", "2025-10-10T10:00:00", feeModels, publicHolidays);
      const fee = pfc.computeParkingFee("Car/Van");
      expect(fee).toBe(3.50);
    });

    test("10.2 Grace Period Success (15 minutes or less is free)", () => {
      // Test the 15-minute grace period (Mon rate: $1/hr, min_fee: 1, grace_time: 15)
      // Entry: Mon, Oct 6th 10:00:00, Exit: Mon, Oct 6th 10:15:00 (Exactly 15 minutes)
      const pfc = new ParkingFeeComputer("2025-10-06T10:00:00", "2025-10-06T10:15:00", feeModels, publicHolidays);
      const fee = pfc.computeParkingFee("Car/Van");
      expect(fee).toBe(0.00);
    });

    test("10.3 Grace Period Failure (16 minutes triggers min charge)", () => {
      // Test exceeding the grace period by one minute
      // Entry: Mon, Oct 6th 10:00:00, Exit: Mon, Oct 6th 10:16:00 (16 minutes)
      // Fee should be the minimum charge of $1.00
      const pfc = new ParkingFeeComputer("2025-10-06T10:00:00", "2025-10-06T10:16:00", feeModels, publicHolidays);
      const fee = pfc.computeParkingFee("Car/Van");
      expect(fee).toBe(1.00);
    });
  });

  // --- 11. Edge Cases to test robustness ---
  test("Edge 1: Entry/Exit exactly at block boundaries (Mon 12:00-18:00)", () => {
      const pfc = new ParkingFeeComputer("2025-10-06T12:00:00", "2025-10-06T18:00:00", feeModels, publicHolidays);
      const fee = pfc.computeParkingFee("Car/Van");
      // 6 hours @ $1/hr = $6 (daily max $30 not hit)
      expect(fee).toBe(6);
  });

  test("Edge 2: Stay that hits exact daily max (Sat 00:00-22:30)", () => {
      const pfc = new ParkingFeeComputer("2025-10-04T00:00:00", "2025-10-04T22:30:00", feeModels, publicHolidays);
      const fee = pfc.computeParkingFee("Car/Van");
      // 23 hours @ $2/hr = $46, daily max = $45
      expect(fee).toBe(45);
  });

  test("Edge 3: PH with parking just under grace (10 min)", () => {
      const pfc = new ParkingFeeComputer("2025-10-20T09:00:00", "2025-10-20T09:10:00", feeModels, publicHolidays);
      const fee = pfc.computeParkingFee("Car/Van");
      // Grace time = 15 min, so fee = 0
      expect(fee).toBe(0);
  });

  test("Edge 4: Unknown vehicle type returns 0", () => {
      const pfc = new ParkingFeeComputer("2025-10-06T10:00:00", "2025-10-06T12:00:00", feeModels, publicHolidays);
      const fee = pfc.computeParkingFee("Motorbike");
      expect(fee).toBe(0); // Assuming your implementation returns 0 for unsupported types
  });

  test("Edge 5: 1 minute over 1 hour triggers 2-hour charge", () => {
      const pfc = new ParkingFeeComputer("2025-10-06T10:00:00", "2025-10-06T11:01:00", feeModels, publicHolidays);
      const fee = pfc.computeParkingFee("Car/Van");
      expect(fee).toBe(2); // Correct rounding to next hour
  });
});
