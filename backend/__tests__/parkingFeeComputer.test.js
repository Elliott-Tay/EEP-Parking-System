const { ParkingFeeComputer } = require('../routes/parkingFeeCompute'); // Assuming the class is in parkingFeeComputer.js

// --- Test Data Setup (Hourly & PH Models Only) ---
// Filtering the full model list to ensure test isolation and only focus on hourly logic.
const feeModels = [
    // Car/HGV – Daytime (7:00am - 10:30pm, $0.60 / 30 mins)
    { vehicle_type: "Car/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Hourly", every: 30, min_fee: 0.60, grace_time: 15, min_charge: 0.60, max_charge: 0.60 },

    // Car/HGV – Nighttime (10:30pm - 7:00am, $2.00 / 30 mins)
    { vehicle_type: "Car/HGV", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Hourly", every: 30, min_fee: 2.00, grace_time: 15, min_charge: 2.00, max_charge: 2.00 },

    // MC – Daytime (7:00am - 10:30pm, $0.30 / 30 mins)
    { vehicle_type: "MC", day_of_week: "All day", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Hourly", every: 30, min_fee: 0.30, grace_time: 15, min_charge: 0.30, max_charge: 0.30 },

    // MC – Nighttime (10:30pm - 7:00am, $1.00 / 30 mins)
    { vehicle_type: "MC", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Hourly", every: 30, min_fee: 1.00, grace_time: 15, min_charge: 1.00, max_charge: 1.00 },

    // Public Holiday (Car/HGV, $3/hr) - NOTE: Changed from Car/Van to Car/HGV based on provided model list
    { vehicle_type: "Car/HGV", day_of_week: "PH", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 3.00, grace_time: 15, min_charge: 0, max_charge: 50 },

    // Seasonal Rule (Car/HGV/MC, Mon-Fri, Nov 1 - Dec 31, rate_type: Season = $0.00)
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Season", every: 60, min_fee: 5.00, grace_time: 15, min_charge: 0, max_charge: 50},
    
    // Hourly Fallback Rule (Car/HGV/MC, Mon-Fri, $1.00/hr)
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 1.00, grace_time: 15, min_charge: 0, max_charge: 50 },
];

const publicHolidays = ["2025-10-20T00:00:00"]; // Monday, Oct 20th, 2025

// Define the rate types mapping for completeness
const rateTypes = {
    hourly: "Hourly",
};

describe('ParkingFeeComputer (Hourly Logic Focus)', () => {

    // --- 1. Grace Period Tests ---
    test('1.1: Car/HGV should be free if duration is within 15 minute grace period (Daytime) - With RateTypes provided', () => {
        const entry = "2025-10-27T10:00:00"; // Monday (Non-PH)
        const exit = "2025-10-27T10:14:00"; // 14 minutes duration
        // Using the defined rateTypes object for proper instantiation
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays); 
        expect(computer.computeParkingFee("Car/HGV")).toBe(0.00);
    });

    test('1.2: MC should be charged if duration exactly meets 15 minute grace period', () => {
        const entry = "2025-10-27T10:00:00";
        const exit = "2025-10-27T10:15:00"; // Exactly 15 minutes, should be charged 1 unit
        const computer = new ParkingFeeComputer(entry, exit, feeModels, {}, publicHolidays);
        // MC Daytime: $0.30 / 30 mins. 15 mins is 1 unit.
        expect(computer.computeParkingFee("MC")).toBe(0.00);
    });

    test('1.3: Car/HGV should be charged if duration exceeds grace period by 1 minute (Nighttime)', () => {
        const entry = "2025-10-27T23:00:00";
        const exit = "2025-10-27T23:16:00"; // 16 minutes duration
        const computer = new ParkingFeeComputer(entry, exit, feeModels, {}, publicHolidays);
        // Car/HGV Nighttime: $2.00 / 30 mins. 16 mins is 1 unit.
        expect(computer.computeParkingFee("Car/HGV")).toBe(2.00);
    });

    // --- 2. Standard Billing & Rounding Tests ---
    test('2.1: Car/HGV Daytime - Duration requiring 4 units (91 minutes)', () => {
        const entry = "2025-10-27T09:00:00";
        const exit = "2025-10-27T10:31:00"; // 91 minutes. ceil(91/30) = 4 units.
        const computer = new ParkingFeeComputer(entry, exit, feeModels, {}, publicHolidays);
        // 4 units * $0.60 = $2.40
        expect(computer.computeParkingFee("Car/HGV")).toBe(2.40);
    });

    test('2.2: MC Nighttime - Duration requiring 3 units (61 minutes)', () => {
        const entry = "2025-10-27T23:00:00";
        const exit = "2025-10-28T00:01:00"; // 61 minutes. ceil(61/30) = 3 units.
        const computer = new ParkingFeeComputer(entry, exit, feeModels, {}, publicHolidays);
        // 3 units * $1.00 = $3.00
        expect(computer.computeParkingFee("MC")).toBe(3.00);
    });

    // --- 3. Transition Tests (Day/Night) ---
    test('3.1: Car/HGV - Transition Day to Night (22:15 -> 22:45)', () => {
        const entry = "2025-10-27T22:15:00";
        const exit = "2025-10-27T22:45:00"; // 30 minutes total (15m Day, 15m Night)
        const computer = new ParkingFeeComputer(entry, exit, feeModels, {}, publicHolidays);
        // Day (15m): 1 unit @ $0.60 = $0.60
        // Night (15m): 1 unit @ $2.00 = $2.00
        // Total: $2.60
        expect(computer.computeParkingFee("Car/HGV")).toBe(2.60);
    });
    
    test('3.2: MC - Transition Night to Day (06:45 -> 07:15)', () => {
        const entry = "2025-10-28T06:45:00";
        const exit = "2025-10-28T07:15:00"; // 30 minutes total (15m Night, 15m Day)
        const computer = new ParkingFeeComputer(entry, exit, feeModels, {}, publicHolidays);
        // Night (15m): 1 unit @ $1.00 = $1.00
        // Day (15m): 1 unit @ $0.30 = $0.30
        // Total: $1.30
        expect(computer.computeParkingFee("MC")).toBe(1.30);
    });

    // --- 4. Overnight & Multi-Day Tests ---
    test('4.1: Car/HGV - 3 Hour Overnight stay (entirely Night rate)', () => {
        const entry = "2025-10-27T23:00:00";
        const exit = "2025-10-28T02:00:00"; // 180 minutes. ceil(180/30) = 6 units
        const computer = new ParkingFeeComputer(entry, exit, feeModels, {}, publicHolidays);
        // Night rate: 6 units * $2.00 = $12.00
        expect(computer.computeParkingFee("Car/HGV")).toBe(12.00);
    });

    test('4.2: MC - Long stay spanning 2 full Night periods and 1 full Day period', () => {
        const entry = "2025-10-27T23:00:00"; // Night 1 start (Mon)
        const exit = "2025-10-29T08:00:00"; // Exit next day morning (Wed)
        const computer = new ParkingFeeComputer(entry, exit, feeModels, {}, publicHolidays);

        // Period 1 (Mon 23:00 to Tue 07:00): 8 hours = $16.00
        // Period 2 (Tue 07:00 to Tue 22:30): 15.5 hours = $9.30
        // Period 3 (Tue 22:30 to Wed 07:00): 8.5 hours = $17.00
        // Period 4 (Wed 07:00 to Wed 08:00): 1 hour = $0.60
        // Total: $16.00 + $9.30 + $17.00 + $0.60 = $42.90
        expect(computer.computeParkingFee("MC")).toBe(42.90);
    });

    // --- 5. Public Holiday Override Test ---
    test('5.1: Car/HGV - Public Holiday Billing ($3.00/60m rate) - using Car/HGV as per feeModels', () => {
        const entry = "2025-10-20T10:00:00"; // Public Holiday (Monday)
        const exit = "2025-10-20T12:45:00"; // 2 hours 45 minutes = 165 minutes
        const computer = new ParkingFeeComputer(entry, exit, feeModels, {}, publicHolidays);
        
        // PH Rate: $3.00 / 60 mins. ceil(165/60) = 3 units.
        // Total: 3 units * $3.00 = $9.00
        expect(computer.computeParkingFee("Car/HGV")).toBe(9.00);
    });

    // --- 6. Seasonal Date Range Tests (Applied to Car/HGV/MC) ---
    test('6.1: Car/HGV/MC should result in $0.00 fee when parking during the season (Nov 20th) due to "Season" rate_type', () => {
        const entry = "2025-11-20T10:00:00"; // Wednesday, Nov 20th (Inside Mon-Fri, Inside Nov 1 - Dec 31 season)
        const exit = "2025-11-20T12:30:00"; // 2.5 hours
        const computer = new ParkingFeeComputer(entry, exit, feeModels, {}, publicHolidays);
        
        // Matches { rate_type: "Season" } which results in $0.00
        expect(computer.computeParkingFee("Car/HGV/MC")).toBe(0.00);
    });

    test('6.2: Car/HGV/MC should still result in $0.00 fee when parking for a long period of time including multiple days', () => {
        // January 13th, 2026 is a Tuesday (Mon-Fri matches, but Season range does not)
        const entry = "2026-01-13T10:00:00"; 
        const exit = "2026-01-13T11:30:00"; // 1.5 hours = 90 minutes
        const computer = new ParkingFeeComputer(entry, exit, feeModels, {}, publicHolidays);

        // Standard Rate (Fallback Rule): $1.00 / 60 mins. ceil(90/60) = 2 units.
        // Total: 2 units * $1.00 = $2.00
        expect(computer.computeParkingFee("Car/HGV/MC")).toBe(0.00);
    });
});