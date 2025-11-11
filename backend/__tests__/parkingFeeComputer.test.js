const { ParkingFeeComputer } = require('../routes/parkingFeeCompute'); 
// NOTE: Assuming 'parkingFeeCompute.js' is in the '../routes/' directory. 
// Change this path if needed for your environment.

// --- Test Data Setup ---
const feeModels = [
    // 0. Car/HGV – Daytime (7:00am - 10:30pm, $0.60 / 30 mins)
    { vehicle_type: "Car/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Hourly", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null },
    // 1. Car/HGV – Nighttime (10:30pm - 7:00am, $2.00 / 30 mins)
    { vehicle_type: "Car/HGV", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Hourly", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    // 2. MC – Daytime (7:00am - 10:30pm, $0.30 / 30 mins)
    { vehicle_type: "MC", day_of_week: "All day", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Hourly", every: 30, min_fee: 0.30, grace_time: 15, min_charge: null, max_charge: null },
    // 3. MC – Nighttime (10:30pm - 7:00am, $1.00 / 30 mins)
    { vehicle_type: "MC", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Hourly", every: 30, min_fee: 1.00, grace_time: 15, min_charge: null, max_charge: null },
    // 4. Public Holiday (Car/HGV, $3/hr) - Hourly Rule
    { vehicle_type: "Car/HGV", day_of_week: "PH", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 3.00, grace_time: 15, min_charge: null, max_charge: null },
    // 5. Seasonal Rule (Car/HGV/MC, Mon-Fri, FREE) - Rate Type: Season
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Season", every: 60, min_fee: 0.00, grace_time: 15, min_charge: 0, max_charge: 0 },
    // 6. Hourly Fallback Rule (Car/HGV/MC, Mon-Fri, $1.00/hr) - Rate Type: Hourly
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 1.00, grace_time: 15, min_charge: 0, max_charge: 0 },
    // 7. Day Season (Daytime: 7:00am - 10:30pm, Free) - Rate Type: Day Season
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Day Season", every: 1, min_fee: 0, grace_time: 15, min_charge: null, max_charge: null },
    // 8. Day Season (Nighttime: 10:30pm - 7:00am, $2) - Rate Type: Day Season
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Day Season", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    // 9. CSPT – MC (All day, Free) - Rate Type: CSPT
    { vehicle_type: "MC", day_of_week: "All day", from_time: "07:00:00", to_time: "07:00:00", rate_type: "CSPT", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    // 10. Block3 – Car/MC/HGV (All day, Free) - Rate Type: Block3
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "07:00:00", rate_type: "Block3", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
];

const publicHolidays = ["2025-10-20T00:00:00"]; // Monday, Oct 20th, 2025
const rateTypes = { hourly: "Hourly", season: "Season", CSPT: "CSPT", Block3: "Block3", daySeason: "Day Season" };
const standardVehicle = "Car/HGV";
const mcVehicle = "MC";
const comboVehicle = "Car/HGV/MC";

// ----------------------------------------------------------------------------------
// --- BLOCK 1: HOURLY, SEASON, AND CSPT TESTS (Your existing tests) ---
// ----------------------------------------------------------------------------------
describe('Block 1: Standard Hourly & Fixed Rate Logic (Hourly, Season, CSPT)', () => {

    // --- 1. Grace Period Tests ---
    test('1.1: Car/HGV should be free if duration is within 14 minute grace period (Daytime)', () => {
        const entry = "2025-10-27T10:00:00"; // Monday (Non-PH)
        const exit = "2025-10-27T10:14:00"; // 14 minutes duration
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays); 
        expect(computer.computeParkingFee(standardVehicle, 'Hourly')).toBe(0.00);
    });

    test('1.2: MC should be free if duration exactly meets 15 minute grace period', () => {
        const entry = "2025-10-27T10:00:00";
        const exit = "2025-10-27T10:15:00"; // Exactly 15 minutes, expected to be free
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        expect(computer.computeParkingFee(mcVehicle, 'Hourly')).toBe(0.00);
    });

    test('1.3: Car/HGV should be charged if duration exceeds grace period by 1 minute (Nighttime)', () => {
        const entry = "2025-10-27T23:00:00";
        const exit = "2025-10-27T23:16:00"; // 16 minutes duration (1 unit)
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Car/HGV Nighttime: $2.00 / 30 mins. 1 unit.
        expect(computer.computeParkingFee(standardVehicle, 'Hourly')).toBe(2.00);
    });

    // --- 2. Standard Billing & Rounding Tests ---
    test('2.1: Car/HGV Daytime - Duration requiring 4 units (91 minutes)', () => {
        const entry = "2025-10-27T09:00:00";
        const exit = "2025-10-27T10:31:00"; // 91 minutes. ceil(91/30) = 4 units.
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // 4 units * $0.60 = $2.40
        expect(computer.computeParkingFee(standardVehicle, 'Hourly')).toBe(2.40);
    });

    test('2.2: MC Nighttime - Duration requiring 3 units (61 minutes)', () => {
        const entry = "2025-10-27T23:00:00";
        const exit = "2025-10-28T00:01:00"; // 61 minutes. ceil(61/30) = 3 units.
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // 3 units * $1.00 = $3.00
        expect(computer.computeParkingFee(mcVehicle, 'Hourly')).toBe(3.00);
    });

    // --- 3. Transition Tests (Day/Night) ---
    test('3.1: Car/HGV - Transition Day to Night (22:15 -> 22:45)', () => {
        const entry = "2025-10-27T22:15:00";
        const exit = "2025-10-27T22:45:00"; // 30 minutes total (15m Day, 15m Night)
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Day (15m): 1 unit @ $0.60 = $0.60
        // Night (15m): 1 unit @ $2.00 = $2.00
        // Total: $2.60
        expect(computer.computeParkingFee(standardVehicle, 'Hourly')).toBe(2.60);
    });
    
    test('3.2: MC - Transition Night to Day (06:45 -> 07:15)', () => {
        const entry = "2025-10-28T06:45:00";
        const exit = "2025-10-28T07:15:00"; // 30 minutes total (15m Night, 15m Day)
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Night (15m): 1 unit @ $1.00 = $1.00
        // Day (15m): 1 unit @ $0.30 = $0.30
        // Total: $1.30
        expect(computer.computeParkingFee(mcVehicle, 'Hourly')).toBe(1.30);
    });

    // --- 4. Overnight & Multi-Day Tests ---
    test('4.1: Car/HGV - 3 Hour Overnight stay (entirely Night rate)', () => {
        const entry = "2025-10-27T23:00:00";
        const exit = "2025-10-28T02:00:00"; // 180 minutes. ceil(180/30) = 6 units
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Night rate: 6 units * $2.00 = $12.00
        expect(computer.computeParkingFee(standardVehicle, 'Hourly')).toBe(12.00);
    });

    test('4.2: MC - Long stay spanning 2 full Night periods and 1 full Day period (42.90)', () => {
        const entry = "2025-10-27T23:00:00"; // Night 1 start (Mon)
        const exit = "2025-10-29T08:00:00"; // Exit next day morning (Wed)
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Expected: $42.90
        expect(computer.computeParkingFee(mcVehicle, 'Hourly')).toBe(42.90);
    });

        test('4.3: MC - One Week Plus stay (7 days, 1 hour) spanning multiple day/night transitions (184.70)', () => {
        const entry = "2025-10-27T10:00:00"; // Monday 10:00 AM
        const exit = "2025-11-03T11:00:00"; // Monday 11:00 AM, 7 days later
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Breakdown:
        // 1. Initial partial day/night (Mon 10:00 - Tue 7:00): $7.50 + $17.00 = $24.50
        // 2. 6 full days (Tue 7:00 - Mon 7:00): 6 * ($9.30 + $17.00) = $157.80
        // 3. Final partial day (Mon 7:00 - Mon 11:00): 4 hours * ($0.30/30 mins * 2) = $2.40
        // Total: $24.50 + $157.80 + $2.40 = $184.70
        expect(computer.computeParkingFee(mcVehicle, 'Hourly')).toBe(184.70);
    });


    // --- 5. Public Holiday Override Test ---
    test('5.1: Car/HGV - Public Holiday Billing ($3.00/60m rate)', () => {
        const entry = "2025-10-20T10:00:00"; // Public Holiday (Monday)
        const exit = "2025-10-20T12:45:00"; // 165 minutes
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // PH Rate: $3.00 / 60 mins. ceil(165/60) = 3 units. Total: 3 units * $3.00 = $9.00
        expect(computer.computeParkingFee(standardVehicle, 'Hourly')).toBe(9.00);
    });

    // --- 6. Interaction with other rates (Seasonal/Fallback) ---
    test('6.1: Car/HGV/MC should use the Fallback Hourly rate ($1.00/hr) outside of the free season/CSPT periods', () => {
        // This vehicle type doesn't have a direct CSPT rule match, so it should fall back to $0.00
        const entry = "2026-01-13T10:00:00"; 
        const exit = "2026-01-13T11:30:00"; // 1.5 hours
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);

        // Since the 'CSPT' call doesn't match an Hourly rule for comboVehicle, it should result in 0.00
        // (This behavior depends heavily on how your 'Fallback Hourly' rule is applied vs. standard 'Hourly' rules).
        expect(computer.computeParkingFee(comboVehicle, 'CSPT')).toBe(0.00);
    });

    // --- 7. CSPT Tests (Applied to MC) ---
    test('7.1: MC should be FREE when parking, due to the CSPT $0.00 rule overriding standard hourly rate', () => {
        const entry = "2026-01-13T10:00:00"; 
        const exit = "2026-01-13T11:30:00";
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);

        // CSPT rule for MC is $0.00 fixed fee.
        expect(computer.computeParkingFee(mcVehicle, 'CSPT')).toBe(0.00);
    });

    // --- 8. Season Rate Fixed Fee Tests ---
    test('8.1: Car/HGV/MC should be FREE ($0.00) for Season rate on a Monday (Mon-Fri match)', () => {
        const entry = "2025-10-27T10:00:00"; // Monday
        const exit = "2025-10-27T11:00:00"; // 60 minutes
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        expect(computer.computeParkingFee(comboVehicle, 'Season')).toBe(0.00);
    });

    test('8.2: Car/HGV/MC should be FREE ($0.00) for Season rate even for a long overnight stay (Entry on Mon-Fri)', () => {
        const entry = "2025-10-28T23:00:00"; // Tuesday night
        const exit = "2025-10-29T07:00:00"; // Wednesday morning (8 hours)
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        expect(computer.computeParkingFee(comboVehicle, 'Season')).toBe(0.00);
    });

    test('8.3: Car/HGV/MC should be FREE (0.00) for Season rate on a Saturday (outside Mon-Fri rule)', () => {
        const entry = "2025-10-25T10:00:00"; // Saturday
        const exit = "2025-10-25T11:00:00"; // 60 minutes
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Since no 'Season' rule matches Saturday, the fee should still resolve to $0.00 based on the fixed rate model not applying.
        expect(computer.computeParkingFee(comboVehicle, 'Season')).toBe(0.00);
    });

    test('8.4: Car/HGV/MC should be FREE (0.00) for Season rate if stay is within grace period (Mon-Fri)', () => {
        const entry = "2025-10-27T10:00:00"; // Monday
        const exit = "2025-10-27T10:14:00"; // 14 minutes
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        expect(computer.computeParkingFee(comboVehicle, 'Season')).toBe(0.00);
    });
});

// ----------------------------------------------------------------------------------
// --- BLOCK 2: NEW TESTS FOR BLOCK3 AND DAY SEASON RATE TYPES ---
// ----------------------------------------------------------------------------------

describe('Block 2: Block3 Rate Logic', () => {

    // --- 9. Block3 Tests (Fixed Free Rate) ---

    test('9.1: Car/HGV should be FREE (0.00) for Block3 rate on a short weekday stay', () => {
        const entry = "2025-10-27T10:00:00";
        const exit = "2025-10-27T11:30:00"; // 90 minutes
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Block3 rule is an all-day, fixed $0.00 fee.
        expect(computer.computeParkingFee(standardVehicle, 'Block3')).toBe(0.00);
    });

    test('9.2: MC should be FREE (0.00) for Block3 rate on a Public Holiday stay', () => {
        const entry = "2025-10-20T10:00:00"; // Public Holiday
        const exit = "2025-10-20T12:00:00"; // 120 minutes
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Fixed rate rules should apply regardless of PH/DOW if they are "All day".
        expect(computer.computeParkingFee(mcVehicle, 'Block3')).toBe(0.00);
    });
  });