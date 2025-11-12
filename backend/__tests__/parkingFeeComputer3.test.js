const { ParkingFeeComputer3 } = require('../routes/parkingFeeCompute3'); // Assuming the class is exported

// The complete fee models including Block1, Staff Estate A/B, and URA Staff
const feeModels = [
    // --- Block1 – Daytime (7:00am - 7:00pm, Free) ---
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "19:00:00", rate_type: "Block1", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    // --- Block1 – Evening (7:00pm - 10:30pm, $0.60 / 30 mins) ---
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "19:00:00", to_time: "22:30:00", rate_type: "Block1", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null },
    // --- Block1 – Night (10:30pm - 7:00am, $2.00 / 30 mins) ---
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Block1", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },

    // --- Staff Estate (Type A) – Car/HGV Weekdays ---
    { vehicle_type: "Car/HGV", day_of_week: "Mon-Fri", from_time: "07:00:00", to_time: "19:30:00", rate_type: "Staff Estate A", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "Mon-Fri", from_time: "19:30:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "Mon-Fri", from_time: "22:30:00", to_time: "07:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    // --- Staff Estate (Type A) – Car/HGV Saturday ---
    { vehicle_type: "Car/HGV", day_of_week: "Sat", from_time: "07:00:00", to_time: "15:00:00", rate_type: "Staff Estate A", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "Sat", from_time: "15:00:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "Sat", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Staff Estate A", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    // --- Staff Estate (Type A) – Car/HGV Sunday ---
    { vehicle_type: "Car/HGV", day_of_week: "Sun", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "Sun", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Staff Estate A", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },

    // --- Staff Estate (Type A) – MC Weekdays ---
    { vehicle_type: "MC", day_of_week: "Mon-Fri", from_time: "07:00:00", to_time: "19:30:00", rate_type: "Staff Estate A", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "Mon-Fri", from_time: "19:30:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.30, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "Mon-Fri", from_time: "22:30:00", to_time: "07:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 1.00, grace_time: 15, min_charge: null, max_charge: null },
    // --- Staff Estate (Type A) – MC Saturday ---
    { vehicle_type: "MC", day_of_week: "Sat", from_time: "07:00:00", to_time: "15:00:00", rate_type: "Staff Estate A", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "Sat", from_time: "15:00:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.30, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "Sat", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Staff Estate A", every: 30, min_fee: 1.00, grace_time: 15, min_charge: null, max_charge: null },
    // --- Staff Estate (Type A) – MC Sunday ---
    { vehicle_type: "MC", day_of_week: "Sun", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.30, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "Sun", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Staff Estate A", every: 30, min_fee: 1.00, grace_time: 15, min_charge: null, max_charge: null },

    // --- Staff Estate (Type B) – Car/HGV ---
    { vehicle_type: "Car/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "23:00:00", rate_type: "Staff Estate B", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "All day", from_time: "23:00:00", to_time: "07:00:00", rate_type: "Staff Estate B", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    // --- Staff Estate (Type B) – MC ---
    { vehicle_type: "MC", day_of_week: "All day", from_time: "07:00:00", to_time: "23:00:00", rate_type: "Staff Estate B", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "All day", from_time: "23:00:00", to_time: "07:00:00", rate_type: "Staff Estate B", every: 30, min_fee: 1.00, grace_time: 15, min_charge: null, max_charge: null },

    // --- URA Staff – Weekdays ---
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "07:00:00", to_time: "19:30:00", rate_type: "URA Staff", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "19:30:00", to_time: "22:30:00", rate_type: "URA Staff", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "22:30:00", to_time: "07:30:00", rate_type: "URA Staff", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    // --- URA Staff – Weekends ---
    { vehicle_type: "Car/HGV/MC", day_of_week: "Sat-Sun", from_time: "07:00:00", to_time: "22:30:00", rate_type: "URA Staff", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV/MC", day_of_week: "Sat-Sun", from_time: "22:30:00", to_time: "07:00:00", rate_type: "URA Staff", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null }
];

// Reference dates (using UTC):
// Mon: '2025-11-10T'
// Sat: '2025-11-15T'
// Sun: '2025-11-16T'
const MON_DATE = '2025-11-10T'; 
const SAT_DATE = '2025-11-15T'; 
const SUN_DATE = '2025-11-16T'; 
const MON_DATE_NEXT = '2025-11-11T'; // Tuesday

describe('Parking Fee Calculations for Rate Type: Block1 (3-Tier All Day)', () => {
    const rateType = "Block1";
    const vehicleType = "Car"; // Applies to Car/MC/HGV

    // Test Case 1: Daytime Free (7:00 to 19:00)
    test('[B1-TC1] Should return $0.00 for parking entirely within the daytime free period', () => {
        const entry = `${MON_DATE}10:00:00.000Z`; // 10:00 AM
        const exit = `${MON_DATE}18:00:00.000Z`;    // 6:00 PM (8 hours free)
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(0.00);
    });

    // Test Case 2: Evening Charge ($0.60/30 min from 19:00 to 22:30)
    test('[B1-TC2] Should charge $1.20 for 1 hour in the evening rate (2 units)', () => {
        const entry = `${MON_DATE}19:00:00.000Z`; // 7:00 PM
        const exit = `${MON_DATE}20:00:00.000Z`;    // 8:00 PM (60 minutes)
        // 60 minutes / 30 min unit = 2 units. 2 * $0.60 = $1.20
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(1.20); 
    });
    
    // Test Case 3: Night Charge ($2.00/30 min from 22:30 to 07:00)
    test('[B1-TC3] Should charge $4.00 for 1 hour in the night rate (2 units)', () => {
        const entry = `${MON_DATE}22:30:00.000Z`; // 10:30 PM
        const exit = `${MON_DATE}23:30:00.000Z`;    // 11:30 PM (60 minutes)
        // 60 minutes / 30 min unit = 2 units. 2 * $2.00 = $4.00
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(4.00); 
    });

    // Test Case 4: Crossover from Evening to Night (22:00 to 23:00)
    test('[B1-TC4] Should correctly combine $0.60 and $2.00 rates', () => {
        const entry = `${MON_DATE}22:00:00.000Z`; // 10:00 PM (Evening rate starts)
        const exit = `${MON_DATE}23:00:00.000Z`;    // 11:00 PM (Night rate ends)
        
        // 22:00 - 22:30 (30m) @ $0.60 = $0.60
        // 22:30 - 23:00 (30m) @ $2.00 = $2.00
        // Total: $2.60
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(2.60);
    });
    
    // Test Case 19: Edge Case - Exit exactly at Boundary (Night Crossover)
    test('[B1-TC19] Should correctly calculate fee up to the 07:00:00 crossover boundary', () => {
        const entry = `${MON_DATE}22:00:00.000Z`; // 10:00 PM
        const exit = `${MON_DATE_NEXT}07:00:00.000Z`;    // 7:00 AM (Next Day)
        
        // 22:00 - 22:30 (30m) @ $0.60 = $0.60
        // 22:30 - 07:00 (8.5 hours = 510m) @ $2.00/30m. 510/30 = 17 units. 17 * $2.00 = $34.00
        // Total: $34.60
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(34.60);
    });
    
    // New Test Case 33: Block1 - Paid Night to Free Day Crossover
    test('[B1-TC33] Block1: Paid Night to Free Day Crossover (06:00 to 07:30)', () => {
        const entry = `${MON_DATE}06:00:00.000Z`; // Night rate active
        const exit = `${MON_DATE}07:30:00.000Z`;    // Daytime free rate starts at 07:00
        
        // 06:00-07:00 (60m) @ $2.00/30m (2 units) = $4.00
        // 07:00-07:30 (30m) @ Free = $0.00
        // Total: $4.00
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(4.00); 
    });
});

describe('Parking Fee Calculations for Rate Type: Staff Estate A (Day/Vehicle/Crossover Logic)', () => {
    
    // --- CAR/HGV TESTS ---
    describe('Vehicle Type: Car/HGV', () => {
        const rateType = "Staff Estate A";
        const vehicleType = "Car";
        
        // Test Case 5: Weekday Evening Charge (Car)
        // Mon-Fri: 19:30-22:30 @ $0.60/30 min
        test('[SA-TC5] Should charge $1.20 for 1 hour on a weekday evening (Car)', () => {
            const entry = `${MON_DATE}20:00:00.000Z`; // 8:00 PM (Weekday)
            const exit = `${MON_DATE}21:00:00.000Z`;    // 9:00 PM
            // 60 minutes / 30 min unit = 2 units. 2 * $0.60 = $1.20
            
            const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
            expect(computer.computeParkingFee()).toBe(1.20); 
        });

        // Test Case 6: Saturday Evening Charge (Car) - Different Free Window
        // Sat: 07:00-15:00 Free | 15:00-22:30 @ $0.60/30 min
        test('[SA-TC6] Should charge $2.40 for 2 hours on a Saturday evening (Car)', () => {
            const entry = `${SAT_DATE}15:00:00.000Z`; // 3:00 PM (Saturday - Paid starts)
            const exit = `${SAT_DATE}17:00:00.000Z`;    // 5:00 PM
            // 120 minutes / 30 min unit = 4 units. 4 * $0.60 = $2.40
            
            const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
            expect(computer.computeParkingFee()).toBe(2.40); 
        });

        // Test Case 7: Sunday Charge (Car) - No Free Window (07:00-22:30 @ $0.60/30 min)
        test('[SA-TC7] Should charge $6.00 for 5 hours on a Sunday (Car)', () => {
            const entry = `${SUN_DATE}10:00:00.000Z`; // 10:00 AM (Sunday - Paid starts)
            const exit = `${SUN_DATE}15:00:00.000Z`;    // 3:00 PM (5 hours = 300 minutes)
            // 300 minutes / 30 min unit = 10 units. 10 * $0.60 = $6.00
            
            const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
            expect(computer.computeParkingFee()).toBe(6.00); 
        });
        
        // Test Case 8: Multi-Day Crossover (Fri evening to Sat morning) - Existing Complex Case
        test('[SA-TC8] Multi-Day: Fri Evening to Sat Morning (Car)', () => {
            // Friday (Mon-Fri rule): 22:00-22:30 (0.60) + 22:30-24:00 (2.00 * 3) = 0.60 + 6.00 = 6.60
            // Saturday (Sat rule): 00:00-07:00 (2.00 * 14) + 07:00-08:00 (Free) = 28.00 + 0.00 = 28.00
            // Total: 6.60 + 28.00 = $34.60
            const entry = '2025-11-14T22:00:00.000Z'; // 10:00 PM Fri
            const exit = '2025-11-15T08:00:00.000Z';    // 8:00 AM Sat
            
            const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
            expect(computer.computeParkingFee()).toBe(34.60); 
        });
        
        // Test Case 14: Grace Period Check (10 mins, should be $0.00)
        test('[SA-TC14] Grace Period: Should return $0.00 if parking is 10 minutes (Sun Car)', () => {
            const entry = `${SUN_DATE}10:00:00.000Z`; // 10:00 AM Sun
            const exit = `${SUN_DATE}10:10:00.000Z`;    // 10:10 AM (10 minutes)
            
            const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
            expect(computer.computeParkingFee()).toBe(0.00); 
        });
        
        // Test Case 15: Rounding Check (31 mins, should charge 2 units)
        test('[SA-TC15] Rounding: Should charge 2 units ($1.20) for 31 minutes parking (Sun Car)', () => {
            const entry = `${SUN_DATE}10:00:00.000Z`; // 10:00 AM Sun
            const exit = `${SUN_DATE}10:31:00.000Z`;    // 10:31 AM (31 minutes)
            // 31 minutes > 15m grace. Rounds up to 2 units. 2 * $0.60 = $1.20
            
            const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
            expect(computer.computeParkingFee()).toBe(1.20); 
        });

        // New Test Case 34: Staff A Car Sat - Paid Evening to Paid Night Crossover
        // Sat: 15:00-22:30 @ $0.60/30m | 22:30-07:00 @ $2.00/30m
        test('[SA-TC34] Staff A Car Sat: Paid Evening to Paid Night Crossover (22:00 to 23:00)', () => {
            const entry = `${SAT_DATE}22:00:00.000Z`; 
            const exit = `${SAT_DATE}23:00:00.000Z`;    
            
            // 22:00-22:30 (30m) @ $0.60/30m = $0.60
            // 22:30-23:00 (30m) @ $2.00/30m = $2.00
            // Total: $2.60
            
            const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
            expect(computer.computeParkingFee()).toBe(2.60); 
        });
    });

    // --- MC TESTS ---
    describe('Vehicle Type: MC (Motorcycle)', () => {
        const rateType = "Staff Estate A";
        const vehicleType = "MC";
        
        // Test Case 9: Weekday Night Charge (MC) - Different Rate & End Time
        // Mon-Fri: 22:30-07:30 @ $1.00/30 min
        test('[SA-TC9] Should charge $2.00 for 1 hour on a weekday night (MC)', () => {
            const entry = `${MON_DATE}23:00:00.000Z`; // 11:00 PM Mon
            const exit = `${MON_DATE_NEXT}00:00:00.000Z`;    // 12:00 AM Tue (60 mins)
            // 60 minutes / 30 min unit = 2 units. 2 * $1.00 = $2.00
            
            const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
            expect(computer.computeParkingFee()).toBe(2.00); 
        });

        // Test Case 10: Sunday Evening Charge (MC) - No Free Window, Different Rate
        // Sun: 07:00-22:30 @ $0.30/30 min
        test('[SA-TC10] Should charge $1.20 for 2 hours on a Sunday (MC)', () => {
            const entry = `${SUN_DATE}18:00:00.000Z`; // 6:00 PM Sun
            const exit = `${SUN_DATE}20:00:00.000Z`;    // 8:00 PM (120 minutes)
            // 120 minutes / 30 min unit = 4 units. 4 * $0.30 = $1.20
            
            const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
            expect(computer.computeParkingFee()).toBe(1.20); 
        });
    });
});

describe('Parking Fee Calculations for Rate Type: Staff Estate B (New Rate Type)', () => {
    const rateType = "Staff Estate B";
    
    // Test Case 16: Daytime Free (Car/HGV)
    // Car/HGV: 07:00-23:00 Free
    test('[SB-TC16] Should return $0.00 for Car/HGV parking during the long free daytime period', () => {
        const vehicleType = "Car";
        const entry = `${MON_DATE}08:00:00.000Z`; 
        const exit = `${MON_DATE}22:00:00.000Z`;    // 14 hours free
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(0.00);
    });
    
    // Test Case 17: Overnight Charge (MC)
    // MC: 23:00-07:00 @ $1.00/30m
    test('[SB-TC17] Should charge $2.00 for 1 hour overnight (MC)', () => {
        const vehicleType = "MC";
        const entry = `${MON_DATE}23:00:00.000Z`; // 11:00 PM Mon
        const exit = `${MON_DATE_NEXT}00:00:00.000Z`;    // 12:00 AM Tue (60 mins)
        // 2 units * $1.00 = $2.00
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(2.00); 
    });
    
    // Test Case 18: Overnight Charge (HGV) - Vehicle Type Validation
    // Car/HGV: 23:00-07:00 @ $2.00/30m
    test('[SB-TC18] Should charge $4.00 for 1 hour overnight (HGV)', () => {
        const vehicleType = "HGV";
        const entry = `${MON_DATE}23:00:00.000Z`; // 11:00 PM Mon
        const exit = `${MON_DATE_NEXT}00:00:00.000Z`;    // 12:00 AM Tue (60 mins)
        // 2 units * $2.00 = $4.00
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(4.00); 
    });
});

describe('Parking Fee Calculations for Rate Type: URA Staff (Combined Vehicle/Day Rule)', () => {
    const rateType = "URA Staff";
    const vehicleType = "Car"; // Applies to Car/HGV/MC

    // Test Case 12: Weekday Evening Charge (Mon-Fri)
    // Mon-Fri: 19:30-22:30 @ $0.60/30 min
    test('[URA-TC12] Should charge $1.80 for 1.5 hours on a weekday evening', () => {
        const entry = `${MON_DATE}20:00:00.000Z`; // 8:00 PM Mon
        const exit = `${MON_DATE}21:30:00.000Z`;    // 9:30 PM (90 minutes)
        // 90 minutes / 30 min unit = 3 units. 3 * $0.60 = $1.80
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(1.80); 
    });
    
    // Test Case 13: Weekend Day Charge (Sat-Sun)
    // Sat-Sun: 07:00-22:30 @ $0.60/30 min
    test('[URA-TC13] Should charge $3.00 for 2.5 hours on a Saturday afternoon', () => {
        const entry = `${SAT_DATE}12:00:00.000Z`; // 12:00 PM Sat
        const exit = `${SAT_DATE}14:30:00.000Z`;    // 2:30 PM (150 minutes)
        // 150 minutes / 30 min unit = 5 units. 5 * $0.60 = $3.00
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(3.00); 
    });

    // New Test Case 35: URA Staff Sat - Paid Evening to Paid Night Crossover
    // Sat-Sun: 07:00-22:30 @ $0.60/30m | 22:30-07:00 @ $2.00/30m
    test('[URA-TC35] URA Staff Sat: Paid Evening to Paid Night Crossover (22:00 to 23:00)', () => {
        const entry = `${SAT_DATE}22:00:00.000Z`; 
        const exit = `${SAT_DATE}23:00:00.000Z`;    
        
        // 22:00-22:30 (30m) @ $0.60/30m = $0.60
        // 22:30-23:00 (30m) @ $2.00/30m = $2.00
        // Total: $2.60
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(2.60); 
    });
});

// --- CRITICAL EDGE CASE TESTS ---

describe('Critical Edge Case Calculations (Grace Period & Time Boundaries)', () => {
    const rateType = "Staff Estate A";
    const vehicleType = "Car"; // Uses Sun rate for TC20-22: 07:00-22:30 @ $0.60/30 min, 15m grace

    // Test Case 20: Zero Duration
    test('[EC-TC20] Zero Duration: Should return $0.00 if entry and exit are identical', () => {
        const entry = `${SUN_DATE}10:00:00.000Z`; 
        const exit = `${SUN_DATE}10:00:00.000Z`;    
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(0.00); 
    });

    // Test Case 21: Exact Grace Period Boundary
    test('[EC-TC21] Exact Grace: Should return $0.00 if parking is exactly 15 minutes', () => {
        const entry = `${SUN_DATE}10:00:00.000Z`; 
        const exit = `${SUN_DATE}10:15:00.000Z`;    // 15 minutes
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(0.00); 
    });
    
    // Test Case 22: Exceeding Grace Period by 1 minute
    test('[EC-TC22] Grace Exceeded: Should charge 1 unit ($0.60) for 16 minutes parking', () => {
        const entry = `${SUN_DATE}10:00:00.000Z`; 
        const exit = `${SUN_DATE}10:16:00.000Z`;    // 16 minutes
        // 16 minutes > 15m grace. Rounds up to 1 unit. 1 * $0.60 = $0.60
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(0.60); 
    });
    
    // Test Case 23: Staff A Weekday Boundary (Free to Paid)
    test('[EC-TC23] Staff A Mon-Fri Boundary: Should only charge for the 19:30-20:00 portion', () => {
        const rateType = "Staff Estate A";
        const vehicleType = "Car";
        const entry = `${MON_DATE}19:20:00.000Z`; // 10 minutes *before* 19:30 free cut-off
        const exit = `${MON_DATE}20:00:00.000Z`;    // 30 minutes *after* 19:30 paid cut-off
        
        // 19:20-19:30 (10m) @ Free = $0.00
        // 19:30-20:00 (30m) @ $0.60/30m = $0.60 (1 unit)
        // Total: $0.60
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(0.60); 
    });
    
    // Test Case 24: Staff B Night Boundary (Free to Paid)
    test('[EC-TC24] Staff B Night Boundary: Should only charge for the portion after 23:00', () => {
        const rateType = "Staff Estate B";
        const vehicleType = "Car";
        const entry = `${MON_DATE}22:45:00.000Z`; // 15 minutes *before* 23:00 free cut-off
        const exit = `${MON_DATE}23:45:00.000Z`;    // 45 minutes *after* 23:00 paid cut-off
        
        // 22:45-23:00 (15m) @ Free = $0.00
        // 23:00-23:45 (45m) @ $2.00/30m = $4.00 (2 units)
        // Total: $4.00
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(4.00); 
    });

    // New Test Case 36: Grace Period Override on Crossover
    test('[EC-TC36] Grace Override: Total parking (14 mins) within grace, even if part of it is in a paid rate zone', () => {
        const rateType = "Staff Estate A";
        const vehicleType = "Car";
        const entry = `${MON_DATE}19:20:00.000Z`; // 10 minutes in Free period
        const exit = `${MON_DATE}19:34:00.000Z`;    // 4 minutes in Paid period (Total duration: 14 mins)
        
        // Total duration is 14 minutes, which is <= 15 minutes grace time.
        // The total fee should be $0.00 regardless of the underlying rate structure.
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(0.00); 
    });
});

// New Multi-Day Crossover Tests

describe('Complex Multi-Day Crossover Tests', () => {
    
    // Test Case 25: Staff Estate A - Full Weekend Crossover (Sat Afternoon to Mon Morning)
    test('[MD-TC25] Staff A Car: Sat Afternoon (Paid) > Sun (All Paid) > Mon Morning (Night/Free)', () => {
        const rateType = "Staff Estate A";
        const vehicleType = "Car";
        const entry = `${SAT_DATE}16:00:00.000Z`; // Sat 4:00 PM 
        const exit = '2025-11-17T08:00:00.000Z';    // Mon 8:00 AM 
        
        // Sat (16:00-22:30 @ 0.60): 6.5h = 13 units = $7.80
        // Sat (22:30-24:00 @ 2.00): 1.5h = 3 units = $6.00. Total Sat: $13.80
        
        // Sun (00:00-07:00 @ 2.00): 7h = 14 units = $28.00
        // Sun (07:00-22:30 @ 0.60): 15.5h = 31 units = $18.60
        // Sun (22:30-24:00 @ 2.00): 1.5h = 3 units = $6.00. Total Sun: $52.60
        
        // Mon (00:00-07:30 @ 2.00): 7.5h = 15 units = $30.00
        // Mon (07:30-08:00 @ Free): 0.5h = $0.00. Total Mon: $30.00
        
        // Total: $13.80 + $52.60 + $30.00 = $96.40
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(94.40); 
    });

    // Test Case 26: Block1 - Long Paid Duration (Mon Night > Wed Morning)
    test('[MD-TC26] Block1 Car: Multi-Night Stay (Mon Night > Tue Night > Wed Morning)', () => {
        const rateType = "Block1";
        const vehicleType = "Car";
        const entry = `${MON_DATE}20:00:00.000Z`; // Mon 8:00 PM 
        const exit = '2025-11-12T08:00:00.000Z';    // Wed 8:00 AM (Next day after Tue)
        
        // Mon (20:00-22:30 @ 0.60): 2.5h = 5 units = $3.00
        // Mon (22:30-24:00 @ 2.00): 1.5h = 3 units = $6.00. Total Mon: $9.00
        
        // Tue (00:00-07:00 @ 2.00): 7h = 14 units = $28.00
        // Tue (07:00-19:00 @ Free): 12h = $0.00
        // Tue (19:00-22:30 @ 0.60): 3.5h = 7 units = $4.20
        // Tue (22:30-24:00 @ 2.00): 1.5h = 3 units = $6.00. Total Tue: $38.20
        
        // Wed (00:00-07:00 @ 2.00): 7h = 14 units = $28.00
        // Wed (07:00-08:00 @ Free): 1h = $0.00. Total Wed: $28.00
        
        // Total: $9.00 + $38.20 + $28.00 = $75.20
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(75.20); 
    });
});

describe('Additional Edge Case and Boundary Tests', () => {
    
    // New Test Case 27: Block1 - 1 minute past free/paid boundary, checking grace period interaction
    test('[B1-TC27] Block1: Crossover Free-to-Paid (18:50 to 19:16) - Should charge 1 unit ($0.60)', () => {
        const rateType = "Block1";
        const vehicleType = "Car";
        const entry = `${MON_DATE}18:50:00.000Z`; // 10 minutes in Free period
        const exit = `${MON_DATE}19:16:00.000Z`;    // 16 minutes in $0.60/30m period
        
        // 18:50-19:00 (10m) @ Free = $0.00
        // 19:00-19:16 (16m) @ $0.60/30m. 16 > 15m grace. Rounds up to 1 unit. 1 * $0.60 = $0.60
        // Total: $0.60
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(0.60); 
    });

    // New Test Case 28: Block1 - Multi-Day spanning two free daytime periods
    test('[B1-TC28] Block1: Multi-Day with Free Slots (Mon 10am to Tue 8pm)', () => {
        const rateType = "Block1";
        const vehicleType = "Car";
        const entry = `${MON_DATE}10:00:00.000Z`; // Mon 10:00 AM 
        const exit = `${MON_DATE_NEXT}20:00:00.000Z`;    // Tue 8:00 PM 
        
        // Mon (10:00-24:00): 10:00-19:00 (Free) + 19:00-22:30 ($4.20) + 22:30-24:00 ($6.00) = $10.20
        // Tue (00:00-20:00): 00:00-07:00 ($28.00) + 07:00-19:00 (Free) + 19:00-20:00 ($1.20) = $29.20
        // Total: $10.20 + $29.20 = $39.40
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(39.40); 
    });
    
    
    // New Test Case 30: Staff Estate A MC - Paid Night to Lower Paid Day Crossover (Sunday)
    test('[SA-TC30] Staff A MC: Paid Night to Lower Paid Day Crossover (Sun 06:30 to 07:30)', () => {
        const rateType = "Staff Estate A";
        const vehicleType = "MC";
        const entry = `${SUN_DATE}06:30:00.000Z`; // Night rate ($1.00/30m) active until 07:00
        const exit = `${SUN_DATE}07:30:00.000Z`;    // Day rate ($0.30/30m) starts at 07:00
        
        // 06:30-07:00 (30m) @ $1.00/30m = $1.00
        // 07:00-07:30 (30m) @ $0.30/30m = $0.30
        // Total: $1.30
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(1.30); 
    });

    // New Test Case 31: URA Staff - Grace Check in Free Period (16 mins)
    test('[URA-TC31] URA Staff: Parking 16 mins entirely within Free Mon-Fri Period (07:00-19:30)', () => {
        const rateType = "URA Staff";
        const vehicleType = "Car";
        const entry = `${MON_DATE}10:00:00.000Z`; 
        const exit = `${MON_DATE}10:16:00.000Z`;    // 16 minutes
        
        // Rate is $0.00/1 minute, so fee is 0.00 regardless of duration or grace.
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(0.00); 
    });
    
    // New Test Case 32: Staff Estate B Car/HGV - Entry during long free period, exit into night charge
    test('[SB-TC32] Staff B Car: Mid-Evening Entry to Next Day Night (20:00 to 01:00)', () => {
        const rateType = "Staff Estate B";
        const vehicleType = "Car";
        const entry = `${MON_DATE}20:00:00.000Z`; 
        const exit = `${MON_DATE_NEXT}01:00:00.000Z`;    // Tue 1:00 AM 
        
        // Mon 20:00-23:00 (3h) @ Free = $0.00
        // Mon 23:00-24:00 (1h) @ $2.00/30m (2 units) = $4.00
        // Tue 00:00-01:00 (1h) @ $2.00/30m (2 units) = $4.00
        // Total: $8.00
        
        const computer = new ParkingFeeComputer3(feeModels, entry, exit, rateType, vehicleType);
        expect(computer.computeParkingFee()).toBe(8.00); 
    });
});