const { ParkingFeeComputer } = require('../routes/parkingFeeCompute');

// --- Test Data Setup (Standard Models) ---
// Mon-Fri: $1/hr, Max $30 (3 blocks)
// Sat/Sun: $2/hr, Max $45 (3 blocks)
// PH: $3/hr, Max $50 (1 block)
const feeModels = [
  // Monday-Friday
  { vehicle_type: "Car/Van", day_of_week: "Mon-Fri", from_time: "00:00:00", to_time: "11:59:00", rate_type: "Hourly", every: 60, min_fee: 1, grace_time: 15, min_charge: 0, max_charge: 30 },
  { vehicle_type: "Car/Van", day_of_week: "Mon-Fri", from_time: "12:00:00", to_time: "18:00:00", rate_type: "Hourly", every: 60, min_fee: 1, grace_time: 15, min_charge: 0, max_charge: 30 },
  { vehicle_type: "Car/Van", day_of_week: "Mon-Fri", from_time: "18:01:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 1, grace_time: 15, min_charge: 0, max_charge: 30 },

  // Saturday
  { vehicle_type: "Car/Van", day_of_week: "Sat", from_time: "00:00:00", to_time: "07:59:00", rate_type: "Hourly", every: 60, min_fee: 2, grace_time: 15, min_charge: 0, max_charge: 45 },
  { vehicle_type: "Car/Van", day_of_week: "Sat", from_time: "08:00:00", to_time: "20:00:00", rate_type: "Hourly", every: 60, min_fee: 2, grace_time: 15, min_charge: 0, max_charge: 45 },
  { vehicle_type: "Car/Van", day_of_week: "Sat", from_time: "20:01:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 2, grace_time: 15, min_charge: 0, max_charge: 45 },

  // Sunday
  { vehicle_type: "Car/Van", day_of_week: "Sun", from_time: "00:00:00", to_time: "07:59:00", rate_type: "Hourly", every: 60, min_fee: 2, grace_time: 15, min_charge: 0, max_charge: 45 },
  { vehicle_type: "Car/Van", day_of_week: "Sun", from_time: "08:00:00", to_time: "20:00:00", rate_type: "Hourly", every: 60, min_fee: 2, grace_time: 15, min_charge: 0, max_charge: 45 },
  { vehicle_type: "Car/Van", day_of_week: "Sun", from_time: "20:01:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 2, grace_time: 15, min_charge: 0, max_charge: 45 },

  // Public Holiday
  { vehicle_type: "Car/Van", day_of_week: "PH", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 3, grace_time: 15, min_charge: 0, max_charge: 50 }
];

// Sample public holiday (Mon, Oct 20th, 2025)
const publicHolidays = ["2025-10-20T00:00:00"];


describe("ParkingFeeComputer - Comprehensive Hourly Tests", () => {
    
    // Mon, Oct 6th, 2025 is used for standard weekly tests ($1/hr, Max $30).

    // -------------------------------------------------------------------
    // --- 1. Basic Functionality & Grace Time ---
    // -------------------------------------------------------------------
    test("1.1 Parking within grace time returns zero fee (Mon)", () => {
        const pfc = new ParkingFeeComputer("2025-10-06T10:00:00", "2025-10-06T10:10:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        expect(fee).toBe(0);
    });

    test("1.2 Parking just over grace time results in 1-hour minimum fee (Mon)", () => {
        const pfc = new ParkingFeeComputer("2025-10-06T10:00:00", "2025-10-06T10:16:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        expect(fee).toBe(1); // 16 mins > 15 min grace. Rounds to 1h. Min Charge is $1.
    });

    test("1.3 Fractional-hour rounding up (1h 1m -> 2h charge) (Fri)", () => {
        const pfc = new ParkingFeeComputer("2025-10-03T14:00:00", "2025-10-03T15:01:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        expect(fee).toBe(2); // 1h 1m rounds to 2h @ $1/hr.
    });

    // -------------------------------------------------------------------
    // --- 2. Block Transitions & Multi-Day ---
    // -------------------------------------------------------------------
    test("2.1 Same-day parking spanning two blocks (Mon 17:45 to 19:45)", () => {
        const pfc = new ParkingFeeComputer("2025-10-06T17:45:00", "2025-10-06T19:45:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // Day is Mon: All rates $1/hr. Total 2 hours, rounded up in segments.
        // Seg 1 (17:45 - 18:00): 15 min. Rounds to 1h ($1).
        // Seg 2 (18:01 - 19:45): 1h 44m. Rounds to 2h ($2).
        // Total: $1 + $2 = $3
        expect(fee).toBe(3);
    });

    test("2.2 Overnight parking spanning Wed into Thu", () => {
        const pfc = new ParkingFeeComputer("2025-10-08T23:00:00", "2025-10-09T01:30:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // Wed: 23:00 - 23:59 (59 min). Rounds to 1h @ $1/hr. Fee: $1.
        // Thu: 00:00 - 01:30 (1h 30m). Rounds to 2h @ $1/hr. Fee: $2.
        // Total: $1 + $2 = $3
        expect(fee).toBe(3);
    });

    // -------------------------------------------------------------------
    // --- 3. Maximum Charge Enforcement ---
    // -------------------------------------------------------------------
    test("3.1 Long stay on a Public Holiday hits the PH daily maximum charge ($50)", () => {
        const pfc = new ParkingFeeComputer("2025-10-20T00:00:00", "2025-10-20T23:59:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // Calculated: 24h * $3 = $72. Capped at Max Charge: $50.
        expect(fee).toBe(50);
    });

    test("3.2 Long stay across multiple days hits both daily maximums (Sat/Sun)", () => {
        const pfc = new ParkingFeeComputer("2025-10-04T08:00:00", "2025-10-05T20:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // Sat: 16h * $2 = $32. 
        // Sun: 20h * $2 = $40. 
        // Total: $32 + $40 = $72. (Both days below their $45 cap)
        expect(fee).toBe(72);
    });

    // -------------------------------------------------------------------
    // --- 4. Public Holiday Logic ---
    // -------------------------------------------------------------------
    test("4.1 Public Holiday rate correctly overrides the standard day rate (Mon)", () => {
        const pfc = new ParkingFeeComputer("2025-10-20T10:00:00", "2025-10-20T13:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // 3h * $3/hr = $9.
        expect(fee).toBe(9);
    });

    // -------------------------------------------------------------------
    // --- 5. Edge Cases (Zero duration, invalid input, Unknown Vehicle) ---
    // -------------------------------------------------------------------
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
    
    test("5.3 Unknown vehicle type returns 0", () => {
        const pfc = new ParkingFeeComputer("2025-10-06T10:00:00", "2025-10-06T12:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Motorbike");
        expect(fee).toBe(0);
    });
    
    // -------------------------------------------------------------------
    // --- 6. Multi-Day and Daily Maximum Scenarios (Existing) ---
    // -------------------------------------------------------------------
    
    test("6.1 Full 24-hour stay (Mon) confirms calculated fee is under the daily max", () => {
        const pfc = new ParkingFeeComputer("2025-10-06T00:00:00", "2025-10-06T23:59:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        expect(fee).toBe(24); // 24 hours * $1 = $24. Max $30.
    });
    
    test("6.2 Multi-day stay: Friday (Max $30) into Saturday (Max $45)", () => {
        const pfc = new ParkingFeeComputer("2025-10-03T20:00:00", "2025-10-04T08:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // Fri: 4 hours @ $1/hr = $4. 
        // Sat: 8 hours @ $2/hr = $16. 
        // Total: $4 + $16 = $20.
        expect(fee).toBe(20);
    });

    test("6.4 Multi-day stay over a week: Wed 8th 20:00 → Thu 16th 10:00", () => {
      const pfc = new ParkingFeeComputer("2025-10-08T20:00:00", "2025-10-16T10:00:00", feeModels, publicHolidays);
      const fee = pfc.computeParkingFee("Car/Van");

      // Wed 8th (4h): $4
      // Thu 9th (24h): $24
      // Fri 10th (24h): $24
      // Sat 11th (24h): $45 (Capped from $48)
      // Sun 12th (24h): $45 (Capped from $48)
      // Mon 13th (24h): $24
      // Tue 14th (24h): $24
      // Wed 15th (24h): $24
      // Thu 16th (10h): $10
      // Total fee: $4 + $24*3 + $45*2 + $24*3 + $10 = $224.00
      expect(fee).toBe(224.00);
    });
    
    // -------------------------------------------------------------------
    // --- 7. Boundary and Rate Edge Cases (Existing) ---
    // -------------------------------------------------------------------
    test("7.1 Multi-day stay near maximum charge (Thu/Fri)", () => {
        const pfc = new ParkingFeeComputer("2025-10-02T10:00:00", "2025-10-03T10:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // Day 1 (Thu): 14 hours @ $1/hr = $14. 
        // Day 2 (Fri): 10 hours @ $1/hr = $10. 
        // Total: $24.
        expect(fee).toBe(24);
    });

    // -------------------------------------------------------------------
    // --- 9. Multi-Day Stress Tests (Existing) ---
    // -------------------------------------------------------------------
    test("9.1 Eight-day continuous parking (Mon to next Tue)", () => {
        const pfc = new ParkingFeeComputer("2025-10-06T08:00:00", "2025-10-14T08:00:00", feeModels, publicHolidays);
        const fee = pfc.computeParkingFee("Car/Van");
        // Total: $16 + (4 days * $24) + $45 + $45 + $24 + $8 = $234.00
        expect(fee).toBe(234.00);
    });

    // -------------------------------------------------------------------
    //     --- A. Daily Maximum Stress (NEW) ---
    // -------------------------------------------------------------------
    describe("A. Daily Maximum Stress Tests", () => {
        test("A.1 Mon Max Charge Hit (1 sec into next day)", () => {
            const pfc = new ParkingFeeComputer("2025-10-06T00:00:00", "2025-10-07T00:00:01", feeModels, publicHolidays);
            const fee = pfc.computeParkingFee("Car/Van");
            // Mon: 24h @ $1 = $24. (Max $30). Fee: $24.
            // Tue: 1 second (rounds to 1h) @ $1. Fee: $1.
            expect(fee).toBe(25.00);
        });

        test("A.2 Multi-Day Max Cap (Fri/Sat)", () => {
            const pfc = new ParkingFeeComputer("2025-10-03T00:00:00", "2025-10-04T23:00:00", feeModels, publicHolidays);
            const fee = pfc.computeParkingFee("Car/Van");
            // Fri: 24 hours @ $1/hr = $24. (Max $30).
            // Sat: 23 hours @ $2/hr = $46. Capped at $45.
            expect(fee).toBe(69.00); // $24 + $45
        });

        // --- NEW TEST A.3 ---
        test("A.3 Long stay on day with conflicting daily max blocks (Mon)", () => {
            // Create custom models for this specific test where a block imposes a lower max ($10)
            const customFeeModels = feeModels.concat([
                // NOTE: These blocks should take priority due to being more specific (single day Mon vs Mon-Fri range)
                // Block 1 (Lower Max)
                { vehicle_type: "Car/Van", day_of_week: "Mon", from_time: "00:00:00", to_time: "10:00:00", rate_type: "Hourly", every: 60, min_fee: 1, grace_time: 15, min_charge: 0, max_charge: 10 },
                // Block 2 (Higher Max)
                { vehicle_type: "Car/Van", day_of_week: "Mon", from_time: "10:01:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 1, grace_time: 15, min_charge: 0, max_charge: 30 },
            ]);
            
            // Stay: 24 hours on Monday, Oct 6th, 2025.
            const pfc = new ParkingFeeComputer("2025-10-06T00:00:00", "2025-10-06T23:59:00", customFeeModels, publicHolidays);
            const fee = pfc.computeParkingFee("Car/Van");
            
            // Calculated fee is $24.00. The *lowest* max charge active that day is $10.00.
            expect(fee).toBe(10.00); 
        });
    });

    // -------------------------------------------------------------------
    //     --- B. Time Block Transition Accuracy (NEW) ---
    // -------------------------------------------------------------------
    describe("B. Time Block Transition Accuracy Tests", () => {
        test("B.1 Exact End of Block 1 (Mon)", () => {
            const pfc = new ParkingFeeComputer("2025-10-06T11:00:00", "2025-10-06T11:59:00", feeModels, publicHolidays);
            const fee = pfc.computeParkingFee("Car/Van");
            expect(fee).toBe(1.00); // 59 minutes (rounds to 1 hr).
        });

        test("B.2 Crossing Exact 12:00:00 Boundary", () => {
            // Mon 11:59:00 (Block 1) to 12:00:01 (Block 2)
            const pfc = new ParkingFeeComputer("2025-10-06T11:59:00", "2025-10-06T12:00:01", feeModels, publicHolidays);
            const fee = pfc.computeParkingFee("Car/Van");
            // Grace period of 15 mins applies, total stay is 1 min → $0 fee.
            expect(fee).toBe(0);
        });

        test("B.3 Overnight Sat/Sun Boundary (00:00:00)", () => {
            const pfc = new ParkingFeeComputer("2025-10-04T23:55:00", "2025-10-05T00:05:00", feeModels, publicHolidays);
            const fee = pfc.computeParkingFee("Car/Van");
            // Grace period of 15 mins applies, total stay is 10 mins → $0 fee.
            expect(fee).toBe(0);
        });

        // --- NEW TEST B.4 ---
        test("B.4 Stay just over grace time crossing Sat/Sun midnight boundary", () => {
            // Stay: 16 minutes (23:55:00 Sat to 00:11:00 Sun)
            const pfc = new ParkingFeeComputer("2025-10-04T23:55:00", "2025-10-05T00:11:00", feeModels, publicHolidays);
            const fee = pfc.computeParkingFee("Car/Van");
            // Grace period (15m) exceeded. Billing must start.
            // Sat: 5 mins rounds to 1h @ $2 = $2.00
            // Sun: 11 mins rounds to 1h @ $2 = $2.00
            expect(fee).toBe(4.00);
        });
    });

    // -------------------------------------------------------------------
    //     --- C. Grace and Minimum Charge Interaction (NEW) ---
    // -------------------------------------------------------------------
    describe("C. Grace and Minimum Charge Tests", () => {
        test("C.1 Exact 1-hour stay (Mon)", () => {
            const pfc = new ParkingFeeComputer("2025-10-06T10:00:00", "2025-10-06T11:00:00", feeModels, publicHolidays);
            const fee = pfc.computeParkingFee("Car/Van");
            expect(fee).toBe(1.00);
        });

        test("C.2 Short stay (30 min) on Sat triggers $2 min charge", () => {
            const pfc = new ParkingFeeComputer("2025-10-04T10:00:00", "2025-10-04T10:30:00", feeModels, publicHolidays);
            const fee = pfc.computeParkingFee("Car/Van");
            expect(fee).toBe(2.00); // 30 min > 15 min grace. Min charge is $2.
        });

        test("C.3 Short stay (20 min) on PH triggers $3 min charge", () => {
            const pfc = new ParkingFeeComputer("2025-10-20T10:00:00", "2025-10-20T10:20:00", feeModels, publicHolidays);
            const fee = pfc.computeParkingFee("Car/Van");
            expect(fee).toBe(3.00); // 20 min > 15 min grace. Min charge is $3.
        });
    });

    // -------------------------------------------------------------------
    //     --- D. Effective Date Overrides (NEW) ---
    // -------------------------------------------------------------------
    describe("D. Effective Date Overrides", () => {
        test("D.1 Effective Date rate correctly overrides standard day rate (Tue)", () => {
            // Create custom models for this specific test
            const customFeeModels = feeModels.concat([
                // Special rate: $5/hr, Max $60, only for Oct 7th, 2025 (Tuesday)
                { 
                    vehicle_type: "Car/Van", day_of_week: "Tue", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Hourly", 
                    every: 60, min_fee: 5, grace_time: 15, min_charge: 0, max_charge: 60,
                    effective_start: "2025-10-07T00:00:00", effective_end: "2025-10-07T23:59:00"
                }
            ]);
            
            // Stay: 2 hours on Tuesday, Oct 7th, 2025.
            const pfc = new ParkingFeeComputer("2025-10-07T10:00:00", "2025-10-07T12:00:00", customFeeModels, publicHolidays);
            const fee = pfc.computeParkingFee("Car/Van");
            
            // Standard Tuesday rate is $1/hr. The special $5/hr rate should apply.
            expect(fee).toBe(10.00); // 2h * $5 = $10.00
        });
    });
});