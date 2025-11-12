const { ParkingFeeComputer2 } = require('../routes/parkingFeeCompute2'); // Assuming the class is exported from feeComputer.js

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

// Define a base date for consistency. Using Monday, November 10th, 2025.
const BASE_DATE = '2025-11-10T'; 

describe.each(["Special", "Block2"])(
    'Parking Fee Calculations for Rate Type: %s (Free 7:00-23:00, $2/30min 23:00-7:00)',
    (rateType) => {

    // Test Case 1: Within Grace Period (15 minutes or less)
    test(`[TC1] Should return $0.00 due to 15-minute grace period`, () => {
        const entry = `${BASE_DATE}10:00:00.000Z`; // 10:00 AM
        const exit = `${BASE_DATE}10:14:00.000Z`;   // 10:14 AM (14 minutes)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(0.00);
    });

    // Test Case 2: Daytime Parking (Exceeds grace, but within free period)
    test(`[TC2] Should return $0.00 for daytime parking (1 hour) in the free period`, () => {
        const entry = `${BASE_DATE}12:30:00.000Z`; // 12:30 PM
        const exit = `${BASE_DATE}13:30:00.000Z`;   // 1:30 PM (60 minutes)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(0.00);
    });

    // Test Case 3: Nighttime - Exactly 30 minutes (1 unit)
    test(`[TC3] Should charge $2.00 for exactly 30 minutes in the nighttime rate`, () => {
        const entry = `${BASE_DATE}23:00:00.000Z`; // 11:00 PM
        const exit = `${BASE_DATE}23:30:00.000Z`;   // 11:30 PM (30 minutes)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        // Exceeds grace (30m), 30m / 30m unit = 1 unit. 1 * $2.00 = $2.00
        expect(computer.computeParkingFee()).toBe(2.00); 
    });

    // Test Case 4: Nighttime - Short duration, rounds up (1 unit)
    test(`[TC4] Should charge $2.00 for 16 minutes in the nighttime rate (rounds up)`, () => {
        const entry = `${BASE_DATE}02:00:00.000Z`; // 2:00 AM
        const exit = `${BASE_DATE}02:16:00.000Z`;   // 2:16 AM (16 minutes)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        // Exceeds grace (16m), 16m / 30m unit -> Math.ceil(0.53) = 1 unit. 1 * $2.00 = $2.00
        expect(computer.computeParkingFee()).toBe(2.00);
    });

    // Test Case 5: Nighttime - Over 30 minutes (rounds up to 2 units)
    test(`[TC5] Should charge $4.00 for 31 minutes in the nighttime rate (rounds up to 2 units)`, () => {
        const entry = `${BASE_DATE}03:00:00.000Z`; // 3:00 AM
        const exit = `${BASE_DATE}03:31:00.000Z`;   // 3:31 AM (31 minutes)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        // 31m / 30m unit -> Math.ceil(1.03) = 2 units. 2 * $2.00 = $4.00
        expect(computer.computeParkingFee()).toBe(4.00); 
    });

    // Test Case 6: Crossover Day-to-Night (Charge starts at 23:00)
    test(`[TC6] Should calculate charge correctly when crossing from free day rate to paid night rate`, () => {
        const entry = `${BASE_DATE}22:45:00.000Z`; // 10:45 PM (Free)
        const exit = `${BASE_DATE}23:30:00.000Z`;   // 11:30 PM (Paid)
        // Free: 22:45 to 23:00 (15m)
        // Paid: 23:00 to 23:30 (30m) -> 1 unit ($2.00)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(2.00);
    });

    // Test Case 7: Crossover Night-to-Day (Charge stops at 7:00)
    test(`[TC7] Should stop charging at 7:00 AM when crossing back to the free day rate`, () => {
        const entry = `${BASE_DATE}06:30:00.000Z`; // 6:30 AM (Paid)
        const exit = `${BASE_DATE}07:15:00.000Z`;   // 7:15 AM (Free)
        // Paid: 06:30 to 07:00 (30m) -> 1 unit ($2.00)
        // Free: 07:00 to 07:15 (15m)
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(2.00);
    });

    // Test Case 8: Full Overnight Stay (23:00 to 7:00 is 8 hours / 480 minutes)
    test(`[TC8] Should correctly calculate a full overnight charge (16 units)`, () => {
        // Tuesday 10:00 PM entry
        const entry = '2025-11-11T22:00:00.000Z'; 
        // Wednesday 9:00 AM exit
        const exit = '2025-11-12T09:00:00.000Z'; 
        
        // Chargeable time: 23:00 (Tue) to 07:00 (Wed) = 8 hours = 480 minutes
        // 480 minutes / 30 min unit = 16 units. 16 * $2.00 = $32.00
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(32.00);
    });

    // --- NEW MULTI-DAY TEST CASES ---

    // Test Case 9: Multi-Night Charge Validation (32 nights)
    // Entry (Nov 10, 10:00 AM) to Exit (Dec 12, 11:00 AM) spans 32 full overnight periods.
    // Each overnight (23:00 to 07:00) costs $32.00. Total = 32 * $32.00 = $1024.00
    test(`[TC9] Should charge $1024.00 for parking across 32 charged nights`, () => {
        const entry = '2025-11-10T10:00:00.000Z'; 
        const exit = '2025-12-12T11:00:00.000Z'; 
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(1024.00);
    });

    // Test Case 10: Multi-Night Stay (23:00 to 07:30 over two nights)
    test(`[TC10] Should correctly calculate 2 full nights plus 30 minutes charge on the second night`, () => {
        // Monday 11:00 PM (Start of Night 1 charge)
        const entry = '2025-11-10T23:00:00.000Z'; 
        // Wednesday 7:30 AM (End of Night 2 charge + 30 mins free)
        const exit = '2025-11-12T07:30:00.000Z'; 
        
        // Night 1 (Mon 23:00 to Tue 07:00): $32.00
        // Night 2 (Tue 23:00 to Wed 07:00): $32.00
        // Total charge: $32.00 + $32.00 = $64.00
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(64.00);
    });

    // Test Case 11: Multi-Night with partial charge periods and rounding
    test(`[TC11] Should calculate total fees accurately when combining fractional charge periods over multiple days`, () => {
        // Monday 6:00 AM (Paid)
        const entry = '2025-11-10T06:00:00.000Z'; 
        // Wednesday 8:15 AM (Free)
        const exit = '2025-11-12T08:15:00.000Z'; 
        
        // Calculation Breakdown:
        // Mon 06:00 - 07:00: $4.00
        // Mon 07:00 - 23:00: $0.00
        // Mon 23:00 - Tue 07:00: $32.00
        // Tue 07:00 - 23:00: $0.00
        // Tue 23:00 - Wed 07:00: $32.00
        // Wed 07:00 - 08:15: $0.00
        // Total: $4.00 + $32.00 + $32.00 = $68.00
        
        const computer = new ParkingFeeComputer2(feeModels, entry, exit, rateType);
        expect(computer.computeParkingFee()).toBe(68.00);
    });
});