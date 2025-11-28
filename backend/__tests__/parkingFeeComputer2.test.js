const { ParkingFeeComputer2 } = require('../routes/parkingFeeCompute2'); // Assuming the class is exported from ParkingFeeComputer2.js
const assert = require('assert');

// The fee models provided by the user
const feeModels = [
    // --- Special – Daytime (7:00am - 11:00pm, Free) ---
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "23:00:00", rate_type: "Special", every: 1, min_fee: 0.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },
    // --- Special – Nighttime (11:00pm - 7:00am, $2.00 / 30 mins) ---
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "23:00:00", to_time: "07:00:00", rate_type: "Special", every: 30, min_fee: 2.00, grace_time: 15, min_charge: 2.00, max_charge: 2.00 },
    // --- Block 2 – Daytime (7:00am - 11:00pm, Free) ---
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "23:00:00", rate_type: "Block2", every: 1, min_fee: 0.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 }, 
    // --- Block2 – Nighttime (11:00pm - 7:00am, $2.00 / 30 mins) --- 
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "23:00:00", to_time: "07:00:00", rate_type: "Block2", every: 30, min_fee: 2.00, grace_time: 15, min_charge: 2.00, max_charge: 2.00 }, 
];

// Define a base date for consistency. Using Monday, November 10th, 2025 (UTC).
const MON_DATE = '2025-11-10T'; 
const TUE_DATE = '2025-11-11T'; 
const WED_DATE = '2025-11-12T'; 


// Helper function for deep comparison of numbers (since floats can be tricky)
function closeTo(actual, expected, tolerance = 0.01) {
    return Math.abs(actual - expected) < tolerance;
}

describe.each(["Special", "Block2"])(
    'Parking Fee Calculations for Rate Type: %s (Linear Minute Rate)',
    (rateType) => {
    
    // Rate per minute = $2.00 / 30 minutes = $0.066666... per minute

    // Test Case 1: Within Grace Period (15 minutes or less)
    test(`[TC1] Should return $0.00 due to 15-minute grace period (14 minutes)`, () => {
        const entry = `${MON_DATE}10:00:00.000Z`; // 10:00 AM
        const exit = `${MON_DATE}10:14:00.000Z`;   // 10:14 AM (14 minutes)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(0.00);
    });

    // Test Case 2: Daytime Parking (Exceeds grace, but within free period)
    test(`[TC2] Should return $0.00 for daytime parking (1 hour) in the free period`, () => {
        const entry = `${MON_DATE}12:30:00.000Z`; // 12:30 PM
        const exit = `${MON_DATE}13:30:00.000Z`;   // 1:30 PM (60 minutes)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(0.00);
    });

    // Test Case 3: Nighttime - Exactly 30 minutes (1 unit's worth)
    test(`[TC3] Should charge $2.00 for exactly 30 minutes in the nighttime rate`, () => {
        const entry = `${MON_DATE}23:00:00.000Z`; // 11:00 PM
        const exit = `${MON_DATE}23:30:00.000Z`;   // 11:30 PM (30 minutes)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        // Calculation: (30 min * $2.00/30 min) = $2.00
        expect(computer.computeParkingFee()).toBe(2.00); 
    });

    // Test Case 4: Nighttime - Short duration, linear charge (16 minutes)
    test(`[TC4] Should charge $1.07 for 16 minutes in the nighttime rate (linear minute charge)`, () => {
        const entry = `${MON_DATE}02:00:00.000Z`; // 2:00 AM
        const exit = `${MON_DATE}02:16:00.000Z`;   // 2:16 AM (16 minutes)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        // Calculation: (16 min * $2.00/30 min) = $1.0666... -> $1.07
        assert.ok(closeTo(computer.computeParkingFee(), 1.07));
    });

    // Test Case 5: Nighttime - Over 30 minutes, linear charge (31 minutes)
    test(`[TC5] Should charge $2.07 for 31 minutes in the nighttime rate (linear minute charge)`, () => {
        const entry = `${MON_DATE}03:00:00.000Z`; // 3:00 AM
        const exit = `${MON_DATE}03:31:00.000Z`;   // 3:31 AM (31 minutes)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        // Calculation: (31 min * $2.00/30 min) = $2.0666... -> $2.07
        assert.ok(closeTo(computer.computeParkingFee(), 2.07));
    });

    // Test Case 6: Crossover Day-to-Night (Charge starts at 23:00)
    test(`[TC6] Should calculate charge correctly when crossing from free day rate to paid night rate`, () => {
        const entry = `${MON_DATE}22:45:00.000Z`; // 10:45 PM (Free)
        const exit = `${MON_DATE}23:30:00.000Z`;   // 11:30 PM (Paid)
        // Paid: 23:00 to 23:30 (30m) -> $2.00
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(2.00);
    });

    // Test Case 7: Crossover Night-to-Day (Charge stops at 7:00)
    test(`[TC7] Should stop charging at 7:00 AM when crossing back to the free day rate`, () => {
        const entry = `${MON_DATE}06:30:00.000Z`; // 6:30 AM (Paid)
        const exit = `${MON_DATE}07:15:00.000Z`;   // 7:15 AM (Free)
        // Paid: 06:30 to 07:00 (30m) -> $2.00
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(2.00);
    });

    // Test Case 8: Full Overnight Stay (23:00 to 7:00 is 8 hours / 480 minutes)
    test(`[TC8] Should correctly calculate a full overnight charge (480 minutes linear)`, () => {
        // Tuesday 10:00 PM entry
        const entry = `${TUE_DATE}22:00:00.000Z`; 
        // Wednesday 9:00 AM exit (Next Day)
        const exit = WED_DATE + '09:00:00.000Z'; 
        
        // Chargeable time: 23:00 (Tue) to 07:00 (Wed) = 480 minutes
        // Calculation: (480 min * $2.00/30 min) = $32.00
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(32.00);
    });

    // Test Case 9: Multi-Night Charge Validation (32 nights)
    test(`[TC9] Should charge $1024.00 for parking across 32 charged nights`, () => {
        const entry = '2025-11-10T10:00:00.000Z'; 
        const exit = '2025-12-12T11:00:00.000Z'; 
        
        // Total chargeable minutes: 32 nights * 480 min/night = 15360 minutes
        // Calculation: (15360 min * $2.00/30 min) = $1024.00
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(1024.00);
    });

    // Test Case 10: Multi-Night Stay (23:00 to 07:30 over two nights)
    test(`[TC10] Should correctly calculate 2 full nights charge`, () => {
        // Monday 11:00 PM (Start of Night 1 charge)
        const entry = MON_DATE + '23:00:00.000Z'; 
        // Wednesday 7:30 AM (End of Night 2 charge + 30 mins free)
        const exit = WED_DATE + '07:30:00.000Z'; 
        
        // Night 1 (Mon 23:00 to Tue 07:00): $32.00
        // Night 2 (Tue 23:00 to Wed 07:00): $32.00
        // Total charge: $64.00
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(64.00);
    });

    // Test Case 11: Multi-Night with partial charge periods
    test(`[TC11] Should calculate total fees accurately when combining charge periods over multiple days`, () => {
        // Monday 6:00 AM (Paid)
        const entry = MON_DATE + '06:00:00.000Z'; 
        // Wednesday 8:15 AM (Free)
        const exit = WED_DATE + '08:15:00.000Z'; 
        
        // Mon 06:00 - 07:00: 60 min -> $4.00
        // Mon 07:00 - 23:00: $0.00
        // Mon 23:00 - Tue 07:00: $32.00
        // Tue 07:00 - 23:00: $0.00
        // Tue 23:00 - Wed 07:00: $32.00
        // Total: $4.00 + $32.00 + $32.00 = $68.00
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(68.00);
    });

    // Test Case 12: Exceeding Grace Period by exactly 1 second (Daytime Free)
    test(`[TC12] Should return $0.00 when duration exceeds grace period in a free block (15m 1ms)`, () => {
        const entry = `${MON_DATE}10:00:00.000Z`;
        const exit = `${MON_DATE}10:15:00.001Z`; // 15 minutes, 1 millisecond total duration
        
        // The calculated fee is $0.00, so grace period application has no effect.
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(0.00);
    });
    
    // Test Case 13: Grace Period Boundary in Paid Block
    test(`[TC13] Should return $0.00 when parking is exactly 15 minutes in a paid block (Grace period applies)`, () => {
        const entry = `${MON_DATE}04:00:00.000Z`;
        const exit = `${MON_DATE}04:15:00.000Z`; // Exactly 15 minutes
        
        // Calculated fee is ~$1.00, but total duration (15m) <= grace_time (15m), so fee is $0.00.
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(0.00);
    });
    
    // --- New Test Cases (NTC) ---
    
    // NTC 1: Exact 1 Hour Nighttime Stay
    test(`[NTC1] Should charge exactly $4.00 for 1 hour in the nighttime rate`, () => {
        const entry = `${MON_DATE}01:00:00.000Z`; 
        const exit = `${MON_DATE}02:00:00.000Z`; 
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(4.00);
    });

    // NTC 2: Parking Spanning Midnight, within Grace (Paid Block)
    test(`[NTC2] Should return $0.00 when crossing midnight but duration is within grace period (10 minutes)`, () => {
        const entry = `${MON_DATE}23:55:00.000Z`; // Mon 23:55
        const exit = `${TUE_DATE}00:05:00.000Z`;   // Tue 00:05 (10 minutes total)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        // Duration is 10 minutes, which is <= 15m grace, so fee is 0.00.
        expect(computer.computeParkingFee()).toBe(0.00);
    });
    
    // NTC 3: Parking Spanning Midnight, just over Grace (Paid Block)
    test(`[NTC3] Should charge $1.07 for 16 minutes when crossing midnight and exceeding grace`, () => {
        const entry = `${MON_DATE}23:50:00.000Z`; // Mon 23:50
        const exit = `${TUE_DATE}00:06:00.000Z`;   // Tue 00:06 (16 minutes total)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        // Calculation: 16 min * ($2.00/30 min) = $1.0666... -> $1.07
        assert.ok(closeTo(computer.computeParkingFee(), 1.07));
    });

    // NTC 4: Exit exactly at the rate boundary (7:00:00.000Z)
    test(`[NTC4] Should charge exactly $2.00 when exiting precisely at the 07:00 AM boundary (30 minutes)`, () => {
        const entry = `${MON_DATE}06:30:00.000Z`; // 6:30 AM (Paid)
        const exit = `${MON_DATE}07:00:00.000Z`;   // 7:00 AM (Boundary)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        // Paid time is 30 minutes -> $2.00
        expect(computer.computeParkingFee()).toBe(2.00);
    });
    
    // NTC 5: Entry exactly at the rate boundary (23:00:00.000Z), within grace
    test(`[NTC5] Should return $0.00 when entering at 23:00:00 and exiting within grace (10 minutes)`, () => {
        const entry = `${MON_DATE}23:00:00.000Z`; // 11:00 PM (Boundary/Paid starts)
        const exit = `${MON_DATE}23:10:00.000Z`;   // 11:10 PM (10 minutes)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        // Duration is 10 minutes, which is <= 15m grace, so fee is 0.00.
        expect(computer.computeParkingFee()).toBe(0.00);
    });

    // NTC 6: Short charged duration just exceeding grace in paid block
    test(`[NTC6] Should charge $1.03 for 15 minutes and 30 seconds, exceeding grace time`, () => {
        const entry = `${MON_DATE}05:00:00.000Z`; 
        const exit = `${MON_DATE}05:15:30.000Z`;   // 15.5 minutes
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        // Calculation: 15.5 min * ($2.00/30 min) = $1.0333... -> $1.03
        assert.ok(closeTo(computer.computeParkingFee(), 1.03));
    });

});