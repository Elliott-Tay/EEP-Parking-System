// FIX: Using destructuring to extract the class 'ParkingFeeComputer4'
// from the object exported by the required module.
const { ParkingFeeComputer4 } = require('../routes/parkingFeeCompute4'); 

// --- Actual Fee Model Data ---
const feeModel = [
    // Class 1 – Car/MC/HGV (All day, $0.60 / 30 mins, 60 mins grace)
    // Linear rate: $0.60 / 30 minutes = $0.02 per minute
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "07:00:00", rate_type: "Class1", every: 30, min_fee: 0.60, grace_time: 60, min_charge: 0.00, max_charge: 0.00 },
];

// --- Setup for the 5-argument constructor ---
const vehicleTypeString = "Car/MC/HGV"; 
const rateTypeString = "Class1"; 
const testDate = '2025-10-27'; 

// --- Test Suite ---

describe('Class 1 Rate Logic (60m Grace, $0.02/min Linear Billing)', () => {

    const entry = `${testDate}T10:00:00Z`; 
    const RPM = 0.02; // Rate Per Minute ($0.60 / 30 mins)

    // Helper function to create the computer instance with 5 arguments
    const createComputer = (exit) => {
        return new ParkingFeeComputer4(
            feeModel,                 // 1. feeModels (the array)
            entry,                    // 2. entryDateTime
            exit,                     // 3. exitDateTime
            rateTypeString,           // 4. rateType
            vehicleTypeString         // 5. vehicleType
        );
    };

    // 1. Duration: 0 minutes. Expected: $0.00
    test('1. Zero duration stay should cost $0.00', () => {
        const exit = `${testDate}T10:00:00Z`;
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(0.00, 2);
    });

    // 2. Duration: 59 minutes. Expected: $0.00 (Within Grace)
    test('2. Stay of 59 minutes should cost $0.00 (within grace)', () => {
        const exit = `${testDate}T10:59:00Z`;
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(0.00, 2);
    });

    // 3. Duration: 60 minutes. Expected: $0.00 (Exactly Grace)
    test('3. Stay of 60 minutes should cost $0.00 (exact grace period)', () => {
        const exit = `${testDate}T11:00:00Z`;
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(0.00, 2);
    });

    // 4. Duration: 61 minutes. Chargeable: 1 min. Fee: 1 * $0.02 = $0.02
    test('4. Stay of 61 minutes should cost $0.02 (1 minute over grace, linear)', () => {
        const exit = `${testDate}T11:01:00Z`;
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(RPM * 1, 2);
    });

    // 5. Duration: 90 minutes. Chargeable: 30 mins. Fee: 30 * $0.02 = $0.60
    test('5. Stay of 90 minutes should cost $0.60 (30 mins over grace, exact linear block price)', () => {
        const exit = `${testDate}T11:30:00Z`;
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(RPM * 30, 2);
    });

    // 6. Duration: 91 minutes. Chargeable: 31 mins. Fee: 31 * $0.02 = $0.62
    test('6. Stay of 91 minutes should cost $0.62 (31 mins over grace, linear rate)', () => {
        const exit = `${testDate}T11:31:00Z`;
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(RPM * 31, 2);
    });

    // 7. Duration: 120 minutes (2 hours). Chargeable: 60 mins. Fee: 60 * $0.02 = $1.20
    test('7. Stay of 120 minutes (2 hours) should cost $1.20 (exactly 60 chargeable minutes)', () => {
        const exit = `${testDate}T12:00:00Z`;
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(RPM * 60, 2);
    });

    // 8. Duration: 151 minutes. Chargeable: 91 mins. Fee: 91 * $0.02 = $1.82
    test('8. Stay of 151 minutes should cost $1.82 (91 mins over grace, linear rate)', () => {
        const exit = `${testDate}T12:31:00Z`;
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(RPM * 91, 2);
    });
    
    // 9. Duration: 1441 minutes (24 hours, 1 minute). Chargeable: 1381 mins. Fee: 1381 * $0.02 = $27.62
    test('9. Multi-day stay (24h 1m) should cost $27.62 (1381 chargeable minutes)', () => {
        const exit = `2025-10-28T10:01:00Z`; // Exits on the next day
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(RPM * 1381, 2);
    });
    
    // 10. Duration: 60m 30s = 60.5 minutes. Chargeable: 0.5 minutes. Fee: 0.5 * $0.02 = $0.01
    test('10. Stay of 60.5 minutes should cost $0.01 (linear, fractional minute billing)', () => {
        const exit = `${testDate}T11:00:30Z`; // 30 seconds over grace
        const computer = createComputer(exit);
        // Fee: 0.5 * 0.02 = 0.01
        expect(computer.computeParkingFee()).toBeCloseTo(0.01, 2);
    });

    // 11. Duration: 150m 15s = 150.25 minutes. Chargeable: 90.25 minutes. Fee: 90.25 * $0.02 = $1.805 -> $1.81
    test('11. Stay of 150 minutes 15 seconds should cost $1.81 (90.25 chargeable minutes)', () => {
        const exit = `${testDate}T12:30:15Z`;
        const computer = createComputer(exit);
        // Fee: 90.25 * 0.02 = 1.805 -> 1.81
        expect(computer.computeParkingFee()).toBeCloseTo(1.81, 2);
    });

    // 12. Duration: 7 days (10080 minutes). Chargeable: 10020 minutes. Fee: 10020 * $0.02 = $200.40
    test('12. Stay of exactly 7 days should cost $200.40 (10020 chargeable minutes)', () => {
        const exit = `2025-11-03T10:00:00Z`; // Exactly 7 days later
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(RPM * 10020, 2);
    });

    // 13. Duration: 7 days and 1 minute (10081 minutes). Chargeable: 10021 minutes. Fee: 10021 * $0.02 = $200.42
    test('13. Stay of 7 days and 1 minute should cost $200.42 (10021 chargeable minutes)', () => {
        const exit = `2025-11-03T10:01:00Z`; // 7 days and 1 minute later
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(RPM * 10021, 2);
    });

    // --- EXISTING NEW TEST CASES ---

    // 14. Duration: Just under grace (59m 59s 999ms). Expected: $0.00 (Should apply grace period)
    test('14. Stay just under 60 minutes (59m 59s 999ms) should cost $0.00', () => {
        // Entry is 10:00:00Z
        // Exit is 10:59:59.999Z (59 minutes, 59 seconds, 999 milliseconds)
        const exit = `${testDate}T10:59:59.999Z`; 
        const computer = createComputer(exit);
        // Duration < 60 minutes, so grace period applies.
        expect(computer.computeParkingFee()).toBeCloseTo(0.00, 2);
    });
    
    // 15. Duration: Just over grace (60m 0s 1ms). Chargeable: 0.0000166... min. Fee: $0.00
    test('15. Stay just over 60 minutes (60m 0s 1ms) should cost $0.00 (precise rounding to 2dp)', () => {
        // Entry is 10:00:00Z. Exit is 11:00:00.001Z
        const exit = `${testDate}T11:00:00.001Z`; 
        // Fee: (1/60000) * 0.02 = 0.00000033... -> rounds to $0.00
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(0.00, 2); 
    });

    // 16. Duration: Exact time for $100.00 fee. Fee: 100.00. Chargeable: 5000 mins. Total: 5060 mins.
    test('16. Stay resulting in exactly $100.00 fee (5060 minutes total duration)', () => {
        // Exit is 3 days, 12 hours, 20 minutes later (2025-10-30T22:20:00Z)
        const exit = `2025-10-30T22:20:00Z`; 
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(100.00, 2);
    });
    
    // 17. Duration: Just over $100.00 fee (5000.5 chargeable minutes). Fee: $100.01
    test('17. Stay resulting in $100.01 fee (5060 minutes 30 seconds total duration)', () => {
        // Exit is 5060m 30s later (2025-10-30T22:20:30Z)
        const exit = `2025-10-30T22:20:30Z`; 
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(100.01, 2);
    });
    
    // --- MORE EXISTING NEW TEST CASES ---

    // 18. Invalid Duration: Exit before entry (Negative Duration). Expected: $0.00
    test('18. Exit time before entry time should cost $0.00', () => {
        const exit = `${testDate}T09:00:00Z`; // 1 hour before entry (10:00:00Z)
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(0.00, 2);
    });
    
    // 19. Crossing Midnight (Exactly Grace). Duration: 60 minutes. Expected: $0.00
    test('19. Stay of 60 minutes crossing midnight should cost $0.00 (exact grace)', () => {
        const entryMid = `2025-10-27T23:30:00Z`;
        const exitMid = `2025-10-28T00:30:00Z`; // Exactly 60 minutes later
        const computer = new ParkingFeeComputer4(
            feeModel,                 
            entryMid,                 
            exitMid,                   
            rateTypeString,           
            vehicleTypeString         
        );
        expect(computer.computeParkingFee()).toBeCloseTo(0.00, 2);
    });
    
    // 20. Crossing Midnight (Chargeable). Duration: 61 minutes. Chargeable: 1 min. Fee: $0.02
    test('20. Stay of 61 minutes crossing midnight should cost $0.02 (1 minute chargeable)', () => {
        const entryMid = `2025-10-27T23:30:00Z`;
        const exitMid = `2025-10-28T00:31:00Z`; // Exactly 61 minutes later
        const computer = new ParkingFeeComputer4(
            feeModel,                 
            entryMid,                 
            exitMid,                   
            rateTypeString,           
            vehicleTypeString         
        );
        expect(computer.computeParkingFee()).toBeCloseTo(0.02, 2);
    });
    
    // 21. Very Long Stay (30 days + 1 min). Chargeable: 43141 mins. Fee: 43141 * $0.02 = $862.82
    test('21. Stay of 30 days and 1 minute should cost $862.82 (long term precision)', () => {
        // Entry is 2025-10-27T10:00:00Z
        const exit = `2025-11-26T10:01:00Z`; // 30 days and 1 minute later
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(RPM * 43141, 2); // $862.82
    });

    // 22. Just Under 30-min Block: Duration 89 minutes. Chargeable: 29 mins. Fee: 29 * $0.02 = $0.58
    test('22. Stay of 89 minutes should cost $0.58 (just under 30-min block over grace)', () => {
        const exit = `${testDate}T11:29:00Z`;
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(RPM * 29, 2);
    });

    // 23. Fractional Billing - Round Down: Duration 61 minutes 5 seconds. Chargeable: 1.0833... mins. Fee: $0.0216... -> $0.02
    test('23. Stay of 61m 5s should cost $0.02 (fractional minute, rounds down)', () => {
        const exit = `${testDate}T11:01:05Z`;
        const computer = createComputer(exit);
        // Chargeable minutes = 1 + (5 / 60) ≈ 1.0833 minutes. Fee = 1.0833 * 0.02 ≈ 0.02166 -> 0.02
        expect(computer.computeParkingFee()).toBeCloseTo(0.02, 2);
    });

    // 24. Fractional Billing - Round Up Threshold: Duration 61 minutes 30 seconds. Chargeable: 1.5 mins. Fee: 1.5 * $0.02 = $0.03
    test('24. Stay of 61m 30s should cost $0.03 (fractional minute, exact mid-point calculation)', () => {
        const exit = `${testDate}T11:01:30Z`;
        const computer = createComputer(exit);
        // Chargeable minutes = 1.5 minutes. Fee = 1.5 * 0.02 = 0.03
        expect(computer.computeParkingFee()).toBeCloseTo(0.03, 2);
    });

    // --- NEW TEST CASES ---

    // 25. Fractional Billing - Round Up: Duration 61 minutes 45 seconds. Chargeable: 1.75 mins. Fee: 1.75 * $0.02 = $0.035 -> $0.04
    test('25. Stay of 61m 45s should cost $0.04 (fractional minute, rounds up)', () => {
        const exit = `${testDate}T11:01:45Z`;
        const computer = createComputer(exit);
        // Chargeable minutes = 1 + (45/60) = 1.75 minutes. Fee = 1.75 * 0.02 = 0.035 -> 0.04
        expect(computer.computeParkingFee()).toBeCloseTo(0.04, 2);
    });

    // 26. Invalid Exit Time: Null exit date. Expected: $0.00
    // Assumes the compute function handles null/invalid dates gracefully by returning 0 or throwing an error that is caught and results in 0.
    test('26. Null exit time should result in $0.00 fee', () => {
        const exit = null; 
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(0.00, 2);
    });

    // 27. Entry and Exit are identical (separate calls). Duration: 0 minutes. Expected: $0.00
    test('27. Identical entry and exit datetime strings should cost $0.00', () => {
        const entrySame = `2025-10-27T10:00:00Z`;
        const exitSame = `2025-10-27T10:00:00Z`;
        const computer = new ParkingFeeComputer4(
            feeModel,                 
            entrySame,                 
            exitSame,                   
            rateTypeString,           
            vehicleTypeString         
        );
        expect(computer.computeParkingFee()).toBeCloseTo(0.00, 2);
    });

    // 28. Minimum Chargeable Stay: Duration 60 minutes 30 seconds. Chargeable: 0.5 mins. Fee: $0.01 (Minimum positive fee)
    test('28. Stay of 60m 30s should cost $0.01 (minimum positive fee amount)', () => {
        const exit = `${testDate}T11:00:30Z`; 
        const computer = createComputer(exit);
        // Chargeable minutes: 0.5. Fee: 0.5 * 0.02 = 0.01
        expect(computer.computeParkingFee()).toBeCloseTo(0.01, 2);
    });

})