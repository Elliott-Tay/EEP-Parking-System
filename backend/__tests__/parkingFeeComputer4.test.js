// FIX: Using destructuring to extract the class 'ParkingFeeComputer4'
// from the object exported by the required module.
const { ParkingFeeComputer4 } = require('../routes/parkingFeeCompute4'); 

// --- Actual Fee Model Data ---
const feeModel = [
    // Class 1 – Car/MC/HGV (All day, $0.60 / 30 mins, 60 mins grace)
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "07:00:00", rate_type: "Class1", every: 30, min_fee: 0.60, grace_time: 60, min_charge: 0.00, max_charge: 0.00 },
];

// --- Setup for the 5-argument constructor ---
const vehicleTypeString = "Car/MC/HGV"; 
const rateTypeString = "Class1"; 
const testDate = '2025-10-27'; 

// --- Test Suite ---

describe('Class 1 Rate Logic (60m Grace, 30m Block, $0.60/Block)', () => {

    const entry = `${testDate}T10:00:00Z`; 

    // Helper function to create the computer instance with 5 arguments
    const createComputer = (exit) => {
        return new ParkingFeeComputer4(
            feeModel,                 // 1. feeModels (the array)
            entry,                    // 2. entryDateTime
            exit,                     // 3. exitDateTime
            rateTypeString,           // 4. rateType
            vehicleTypeString         // 5. vehicleType
        );
    };

    // Note: computeParkingFee now takes NO arguments, relying on internal rate lookup.

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

    // 4. Duration: 61 minutes. Chargeable: 1 min. Billed: ceil(1/30) = 1 block. Fee: 1 * $0.60 = $0.60
    test('4. Stay of 61 minutes should cost $0.60 (1 minute over grace, 1 block)', () => {
        const exit = `${testDate}T11:01:00Z`;
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(0.60, 2);
    });

    // 5. Duration: 90 minutes. Chargeable: 30 mins. Billed: ceil(30/30) = 1 block. Fee: 1 * $0.60 = $0.60
    test('5. Stay of 90 minutes should cost $0.60 (30 mins over grace, exactly 1 block)', () => {
        const exit = `${testDate}T11:30:00Z`;
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(0.60, 2);
    });

    // 6. Duration: 91 minutes. Chargeable: 31 mins. Billed: ceil(31/30) = 2 blocks. Fee: 2 * $0.60 = $1.20
    test('6. Stay of 91 minutes should cost $1.20 (31 mins over grace, rounds up to 2 blocks)', () => {
        const exit = `${testDate}T11:31:00Z`;
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(1.20, 2);
    });

    // 7. Duration: 120 minutes (2 hours). Chargeable: 60 mins. Billed: ceil(60/30) = 2 blocks. Fee: 2 * $0.60 = $1.20
    test('7. Stay of 120 minutes (2 hours) should cost $1.20 (exactly 2 blocks)', () => {
        const exit = `${testDate}T12:00:00Z`;
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(1.20, 2);
    });

    // 8. Duration: 151 minutes. Chargeable: 91 mins. Billed: ceil(91/30) = 4 blocks. Fee: 4 * $0.60 = $2.40
    test('8. Stay of 151 minutes should cost $2.40 (91 mins over grace, rounds up to 4 blocks)', () => {
        const exit = `${testDate}T12:31:00Z`;
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(2.40, 2);
    });
    
    // 9. Duration: 1441 minutes (24 hours, 1 minute). Chargeable: 1381 mins. Billed: ceil(1381/30) = 47 blocks. Fee: 47 * $0.60 = $28.20
    test('9. Multi-day stay (24h 1m) should cost $28.20 (47 blocks total duration)', () => {
        const exit = `2025-10-28T10:01:00Z`; // Exits on the next day
        const computer = createComputer(exit);
        expect(computer.computeParkingFee()).toBeCloseTo(28.20, 2);
    });
});