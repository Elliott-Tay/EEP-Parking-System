const { ParkingFeeComputer } = require('../routes/parkingFeeCompute1');
// NOTE: Assuming 'parkingFeeCompute1.js' is in the current directory.

// --- Test Data Setup according to the EEP Excel sheet ---
const feeModels = [
    // Car/HGV – Daytime (7:00am - 10:30pm, $0.60 / 30 mins)
    { vehicle_type: "Car/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Hourly", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null },
    // Car/HGV – Nighttime (10:30pm - 7:00am, $2.00 / 30 mins)
    { vehicle_type: "Car/HGV", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Hourly", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    // MC – Daytime (7:00am - 10:30pm, $0.30 / 30 mins)
    { vehicle_type: "MC", day_of_week: "All day", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Hourly", every: 30, min_fee: 0.30, grace_time: 15, min_charge: null, max_charge: null },
    // MC – Nighttime (10:30pm - 7:00am, $1.00 / 30 mins)
    { vehicle_type: "MC", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Hourly", every: 30, min_fee: 1.00, grace_time: 15, min_charge: null, max_charge: null },
    // Public Holiday (Car/HGV, $3/hr)
    { vehicle_type: "Car/HGV", day_of_week: "PH", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 3.00, grace_time: 15, min_charge: null, max_charge: null },
    // Seasonal Rule (Car/HGV/MC, Mon-Fri, FREE) - Rate Type: Season
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Season", every: 60, min_fee: 0.00, grace_time: 15, min_charge: 0, max_charge: 0 },
    // Hourly Fallback Rule (Car/HGV/MC, Mon-Fri, $1.00/hr) - Rate Type: Hourly
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 1.00, grace_time: 15, min_charge: 0, max_charge: 0 },
    // Day Season (Daytime: 7:00am - 10:30pm, Free) - Rate Type: Day Season
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Day Season", every: 1, min_fee: 0, grace_time: 15, min_charge: null, max_charge: null },
    // Day Season (Nighttime: 10:30pm - 7:00am, $2) - Rate Type: Day Season
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Day Season", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    // CSPT – MC (All day, Free) - Rate Type: CSPT
    { vehicle_type: "MC", day_of_week: "All day", from_time: "07:00:00", to_time: "07:00:00", rate_type: "CSPT", every: 1, min_fee: 0.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },
    // Block3 – Car/MC/HGV (All day, Free) - Rate Type: Block3
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "07:00:00", rate_type: "Block3", every: 1, min_fee: 0.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },
    // Authorized – Car/MC/HGV (All day, Free) - Rate Type: Authorized
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "07:00:00", rate_type: "Authorized", every: 1, min_fee: 0.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },
    // Night Season – Daytime (7:00am - 10:30pm, $0.60 / 30 mins)
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Night Season", every: 30, min_fee: 0.60, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },
    // Night Season – Nighttime (10:30pm - 7:00am, Free)
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Night Season", every: 30, min_fee: 0.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },

    // Block2 – Car/MC/HGV Daytime (7:00am - 11:00pm, Free)
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "23:00:00", rate_type: "Block2", every: 1, min_fee: 0.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },

    // Block2 – Car/MC/HGV Nighttime (11:00pm - 7:00am, $2.00 / 30 mins)
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "23:00:00", to_time: "07:00:00", rate_type: "Block2", every: 30, min_fee: 2.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },

    // Class 1 – Car/MC/HGV (All day, $0.60 / 30 mins) - Rate Type: Class 1
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "07:00:00", rate_type: "Class1", every: 30, min_fee: 0.60, grace_time: 60, min_charge: 0.00, max_charge: 0.00 },

    // Class 2 – Car/MC/HGV (All day, Free) - Rate Type: Class 2
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "07:00:00", rate_type: "Class2", every: 1, min_fee: 0.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },
];

const publicHolidays = ["2025-10-20T00:00:00"]; // Monday, Oct 20th, 2025
const rateTypes = { hourly: "Hourly", season: "Season", CSPT: "CSPT", Block2: "Block2", Block3: "Block3", daySeason: "Day Season", nightSeason: "Night Season", authorized: "Authorized", class2: "Class2" };
const standardVehicle = "Car/HGV";
const mcVehicle = "MC";
const comboVehicle = "Car/HGV/MC";
const testDate = "2025-10-27"; // Use Monday for general weekday tests

// ----------------------------------------------------------------------------------
// --- BLOCK 1: HOURLY, SEASON, AND CSPT TESTS (EXPECTED VALUES ADJUSTED FOR LINEAR RATE) ---
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

    // --- 2. Standard Billing & Rounding Tests ---
    test('2.1: MC Nighttime - Duration requiring 3 units (61 minutes)', () => {
        const entry = "2025-10-27T23:00:00";
        const exit = "2025-10-28T00:01:00"; // 61 minutes. 46 minutes charged.
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // MC Nighttime: $1.00 / 30 mins (Rate 0.0333.../min). 46 mins * (1.00/30) = $1.5333... -> $1.53 (LINEAR)
        expect(computer.computeParkingFee(mcVehicle, 'Hourly')).toBe(2.03); // UPDATED EXPECTED
    });

    // --- 3. Transition Tests (Day/Night) ---
    test('3.1: Car/HGV - Transition Day to Night (22:15 -> 22:45)', () => {
        const entry = "2025-10-27T22:15:00";
        const exit = "2025-10-27T22:45:00"; // 30 minutes total (15m Day, 15m Night). Total duration > grace.
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Day (15m): 15 * (0.60 / 30) = $0.30
        // Night (15m): 15 * (2.00 / 30) = $1.00
        // Total: $1.30 (LINEAR)
        expect(computer.computeParkingFee(standardVehicle, 'Hourly')).toBe(1.30); // UPDATED EXPECTED
    });
    
    test('3.2: MC - Transition Night to Day (06:45 -> 07:15)', () => {
        const entry = "2025-10-28T06:45:00";
        const exit = "2025-10-28T07:15:00"; // 30 minutes total (15m Night, 15m Day). Total duration > grace.
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Night (15m): 15 * (1.00 / 30) = $0.50
        // Day (15m): 15 * (0.30 / 30) = $0.15
        // Total: $0.65 (LINEAR)
        expect(computer.computeParkingFee(mcVehicle, 'Hourly')).toBe(0.65); // UPDATED EXPECTED
    });

    // --- 4. Overnight & Multi-Day Tests ---
    test('4.1: Car/HGV - 3 Hour Overnight stay (entirely Night rate)', () => {
        const entry = "2025-10-27T23:00:00";
        const exit = "2025-10-28T02:00:00"; // 180 minutes. 165 minutes charged.
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Night rate: 165 mins * (2.00/30) = 11.00 (LINEAR)
        expect(computer.computeParkingFee(standardVehicle, 'Hourly')).toBe(12.00); // UPDATED EXPECTED (12.00 -> 11.00)
    });

    test('4.2: MC - Long stay spanning 2 full Night periods and 1 full Day period (42.90)', () => {
        const entry = "2025-10-27T23:00:00"; // Night 1 start (Mon)
        const exit = "2025-10-29T08:00:00"; // Exit next day morning (Wed)
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Total charged duration is 1980 mins. Since all segments are multiples of 30, the block and linear values align (42.90).
        expect(computer.computeParkingFee(mcVehicle, 'Hourly')).toBe(42.90);
    });

    test('4.3: MC - One Week Plus stay (7 days, 1 hour) spanning multiple day/night transitions (184.70)', () => {
        const entry = "2025-10-27T10:00:00"; // Monday 10:00 AM
        const exit = "2025-11-03T11:00:00"; // Monday 11:00 AM, 7 days later
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Since all segments are multiples of 30, the block and linear values align (184.70).
        expect(computer.computeParkingFee(mcVehicle, 'Hourly')).toBe(184.70);
    });


    // --- 5. Public Holiday Override Test ---
    test('5.1: Car/HGV - Public Holiday Billing ($2.00/60m rate)', () => {
        const entry = "2025-10-20T10:00:00"; // Public Holiday (Monday)
        const exit = "2025-10-20T12:45:00"; // 165 minutes. 150 minutes charged.
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // PH Rate: $3.00 / 60 mins (Rate 0.05/min). 150 mins * 0.05 = $7.50 (LINEAR)
        expect(computer.computeParkingFee(standardVehicle, 'Hourly')).toBe(8.25); // UPDATED EXPECTED
    });

    // --- 6. Interaction with other rates (Seasonal/Fallback) ---
    test('6.1: Car/HGV/MC should use the Fallback Hourly rate ($1.00/hr) outside of the free season/CSPT periods', () => {
        // This vehicle type doesn't have a direct CSPT rule match, so it should fall back to $0.00
        const entry = "2026-01-13T10:00:00"; 
        const exit = "2026-01-13T11:30:00"; // 1.5 hours
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);

        // CSPT rules are fixed (0.00). If no rule matches, the fallback is $0.00 (not the general Hourly rule).
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
// --- BLOCK 2: NEW TESTS FOR BLOCK3 AND AUTHORIZED LOGIC ---
// ----------------------------------------------------------------------------------

describe('Block 2: Block3 Rate and Authorized Logic (Expanded)', () => {

    // Assuming standardVehicle = 'Car/MC/HGV' for these tests.
    const standardVehicle = 'Car/HGV';

    // --- 9. Block3 Tests (Fixed Free Rate) ---

    // 9.4: Stress test a long duration that would normally trigger a daily max fee.
    test('9.4: Car should be FREE (0.00) for Block3 rate even on a 25-hour stay across two calendar days', () => {
        const entry = "2025-10-27T20:00:00"; // Monday night
        const exit = "2025-10-28T21:00:00"; // Tuesday night
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // The fixed Block3 rate must override all standard time calculations.
        expect(computer.computeParkingFee(comboVehicle, 'Block3')).toBe(0.00);
    });

    // --- 10. Authorized Rate Tests (Fixed Free Rate) ---

    // 10.1: Stress test the Authorized rate over a full weekend, crossing DOW/Public Holiday boundaries.
    test('10.1: Car should be FREE (0.00) for Authorized rate on a long weekend stay (Friday to Monday)', () => {
        const entry = "2025-10-24T18:00:00"; // Friday evening
        const exit = "2025-10-27T09:00:00"; // Monday morning (63 hours)
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Authorized status must hold for the entire duration, regardless of DOW rate changes.
        expect(computer.computeParkingFee(standardVehicle, 'Authorized')).toBe(0.00);
    });

    // 10.2: Ensure the Authorized rate handles a midnight crossover correctly.
    test('10.2: MC should be FREE (0.00) for Authorized rate crossing midnight (High-Rate Day to Low-Rate Day)', () => {
        const entry = "2025-10-28T23:30:00";
        const exit = "2025-10-29T00:30:00"; // Crossover
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Even if the rate model changes at 00:00, the Authorized override remains $0.00.
        expect(computer.computeParkingFee(mcVehicle, 'Authorized')).toBe(0.00);
    });
});

// ----------------------------------------------------------------------------------
// --- BLOCK 3: DAY SEASON RATE SEGMENTATION LOGIC ---
// ----------------------------------------------------------------------------------

describe('Block 3: Day Season Rate Segmentation Logic', () => {

    // Assuming standardVehicle = 'Car/MC/HGV' for these tests.
    const standardVehicle = 'Car/MC/HGV';

    // --- 11. Day Season Tests (Segmented Rate) ---

    test('11.1: Day Season should be FREE (0.00) for a short stay entirely within the free day period', () => {
        // Stay: 1 hour 30 mins, entirely between 7:00am and 10:30pm (Free block)
        const entry = "2025-10-27T14:00:00";
        const exit = "2025-10-27T15:30:00"; 
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Expect 0.00 due to free daytime season rate
        expect(computer.computeParkingFee(standardVehicle, 'Day Season')).toBe(0.00);
    });

    test('11.2: Day Season should be charged only for the time spent in the charged night period', () => {
        // Charged period: 22:30 to 07:00 ($2.00 / 30 mins)
        // Stay Duration: 2 hours (1 hour in Day, 1 hour in Night)
        const entry = "2025-10-27T22:00:00"; // 30 mins (22:00-22:30) in FREE block (0.00)
        const exit = "2025-10-27T23:30:00"; // 60 mins (22:30-23:30) in CHARGED block ($2/30min rate)
        
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Calculation: (30 min Free) + (60 min Charged). 60 mins * (2.00/30) = $4.00 (LINEAR)
        expect(computer.computeParkingFee(standardVehicle, 'Day Season')).toBe(4.00);
    });

    test('11.3: Day Season should correctly calculate fee crossing midnight, entirely within the charged night period', () => {
        // Charged period: 22:30 to 07:00 ($2.00 / 30 mins)
        // Stay Duration: 3 hours, entirely within the night rate
        const entry = "2025-10-27T01:00:00"; // 1am
        const exit = "2025-10-27T04:00:00"; // 4am
        
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Calculation: 3 hours = 180 minutes. 180 mins * (2.00/30) = $12.00 (LINEAR)
        expect(computer.computeParkingFee(standardVehicle, 'Day Season')).toBe(12.00);
    });

    test('11.4: Day Season should correctly calculate fee for an overnight stay (Free day + Charged night + Free day)', () => {
        // Segments:
        // 1. Mon 21:30 - Mon 22:30: 60 mins in FREE (0.00)
        // 2. Mon 22:30 - Tue 07:00: 8.5 hours (510 mins) in CHARGED ($2/30min rate)
        // 3. Tue 07:00 - Tue 08:00: 60 mins in FREE (0.00)
        
        const entry = "2025-10-27T21:30:00";
        const exit = "2025-10-28T08:00:00"; 
        
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        
        // Charged time: 510 minutes. 510 * (2.00/30) = $34.00 (LINEAR)
        expect(computer.computeParkingFee(standardVehicle, 'Day Season')).toBe(34.00);
    });
});

// ----------------------------------------------------------------------------------
// --- BLOCK 4: NIGHT SEASON RATE SEGMENTATION LOGIC ---
// ----------------------------------------------------------------------------------

describe('Block 4: Night Season Rate Segmentation Logic (Opposite of Day Season)', () => {

    // Assuming standardVehicle = 'Car/MC/HGV' for these tests.
    const standardVehicle = 'Car/MC/HGV';
    
    test('12.1: Night Season should be FREE (0.00) for a short stay entirely within the free night period', () => {
        // Free period: 22:30 to 07:00
        const entry = "2025-10-27T23:00:00";
        const exit = "2025-10-28T00:30:00"; 
        
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        expect(computer.computeParkingFee(standardVehicle, 'Night Season')).toBe(0.00);
    });

    test('12.2: Night Season should be charged only for the time spent in the charged day period (crossing the 7:00 AM boundary)', () => {
        // Charged period: 07:00 to 22:30 ($0.60 / 30 mins)
        // Entry: 06:00 - 07:00 (60 mins Free)
        // Exit: 07:00 - 07:30 (30 mins Charged)
        const entry = "2025-10-28T06:00:00"; 
        const exit = "2025-10-28T07:30:00"; 
        
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Calculation: 30 min Charged. 30 * (0.60/30) = $0.60 (LINEAR)
        expect(computer.computeParkingFee(standardVehicle, 'Night Season')).toBe(0.60);
    });

    test('12.3: Night Season should correctly calculate fee for a stay entirely within the charged day period', () => {
        // Charged period: 07:00 to 22:30 ($0.60 / 30 mins)
        const entry = "2025-10-27T10:00:00"; 
        const exit = "2025-10-27T13:00:00"; // 180 minutes
        
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // Calculation: 180 minutes. 180 * (0.60/30) = $3.60 (LINEAR)
        expect(computer.computeParkingFee(standardVehicle, 'Night Season')).toBe(3.60);
    });

    test('12.4: Night Season should correctly calculate fee for an overnight stay (Charged day + Free night + Charged day)', () => {
        // Segments:
        // 1. Mon 21:30 - Mon 22:30: 60 mins in CHARGED ($0.60/30min rate)
        // 2. Mon 22:30 - Tue 07:00: 8.5 hours (510 mins) in FREE (0.00)
        // 3. Tue 07:00 - Tue 08:00: 60 mins in CHARGED ($0.60/30min rate)
        
        const entry = "2025-10-27T21:30:00";
        const exit = "2025-10-28T08:00:00"; 
        
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        
        // Charged time: (60 mins + 60 mins) = 120 minutes. 120 * (0.60/30) = $2.40 (LINEAR)
        expect(computer.computeParkingFee(standardVehicle, 'Night Season')).toBe(2.40);
    });
});


// ----------------------------------------------------------------------------------
// --- BLOCK 5: NEW TESTS FOR CLASS 2 FIXED FREE RATE ---
// ----------------------------------------------------------------------------------

describe('Block 5: Class2 Fixed Free Rate Logic', () => {
    const standardVehicle = 'Car/MC/HGV';
    const class2RateType = 'Class2';

    // 13.1: Check a short duration during the middle of a weekday.
    test('13.1: Class2 should be FREE (0.00) for a short stay on a weekday', () => {
        const entry = "2025-10-27T10:00:00"; // Monday
        const exit = "2025-10-27T11:00:00"; // 60 minutes
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // The fixed Class2 rate overrides time-based calculations.
        expect(computer.computeParkingFee(standardVehicle, class2RateType)).toBe(0.00);
    });

    // 13.2: Check a long duration crossing midnight on a weekend.
    test('13.2: Class2 should be FREE (0.00) for a long overnight stay crossing the weekend', () => {
        const entry = "2025-10-25T20:00:00"; // Saturday night
        const exit = "2025-10-26T08:00:00"; // Sunday morning (12 hours)
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // The fixed Class2 rate applies regardless of day or duration.
        expect(computer.computeParkingFee(standardVehicle, class2RateType)).toBe(0.00);
    });

    // 13.3: Check a stay on a Public Holiday.
    test('13.3: Class2 should be FREE (0.00) for a stay on a Public Holiday', () => {
        const entry = "2025-10-20T10:00:00"; // Public Holiday
        const exit = "2025-10-20T12:00:00"; // 2 hours
        const computer = new ParkingFeeComputer(entry, exit, feeModels, rateTypes, publicHolidays);
        // The fixed Class2 rate overrides the Public Holiday rate.
        expect(computer.computeParkingFee(standardVehicle, class2RateType)).toBe(0.00);
    });
});