// FIX: Using destructuring to extract the class 'ParkingFeeComputer4'
// from the object exported by the required module.
const { ParkingFeeComputer4 } = require('../routes/parkingFeeCompute4'); 

// --- Actual Fee Model Data ---
const feeModel = [
    // Class 1 – Car/MC/HGV (All day, $0.60 / 30 mins, 60 mins grace)
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "07:00:00", rate_type: "Class1", every: 30, min_fee: 0.60, grace_time: 60, min_charge: 0.00, max_charge: 0.00 },
];

// --- Mock Data Setup & Transformation ---
const class1ModelEntry = feeModel.find(model => model.rate_type === 'Class1');

const transformedRateType = {
    gracePeriod: class1ModelEntry.grace_time,
    blockDuration: class1ModelEntry.every,
    rate: class1ModelEntry.min_fee
};

const rateTypes = { Class1: transformedRateType }; 
const publicHolidays = [];
const comboVehicle = { type: 'COMBO_VEHICLE' }; 

const testDate = '2025-10-27'; 

// --- Test Suite ---

describe('Class 1 Rate Logic (60m Grace, 30m Block, $0.60/Block)', () => {

    const entry = `${testDate}T10:00:00Z`; 

    // 1. Duration: 0 minutes. Expected: $0.00
    test('1. Zero duration stay should cost $0.00', () => {
        const exit = `${testDate}T10:00:00Z`;
        const computer = new ParkingFeeComputer4(entry, exit, feeModel, rateTypes, publicHolidays);
        expect(computer.computeParkingFee(comboVehicle, transformedRateType)).toBe(0.00);
    });

    // 2. Duration: 59 minutes. Expected: $0.00 (Within Grace)
    test('2. Stay of 59 minutes should cost $0.00 (within grace)', () => {
        const exit = `${testDate}T10:59:00Z`;
        const computer = new ParkingFeeComputer4(entry, exit, feeModel, rateTypes, publicHolidays);
        expect(computer.computeParkingFee(comboVehicle, transformedRateType)).toBe(0.00);
    });

    // 3. Duration: 60 minutes. Expected: $0.00 (Exactly Grace)
    test('3. Stay of 60 minutes should cost $0.00 (exact grace period)', () => {
        const exit = `${testDate}T11:00:00Z`;
        const computer = new ParkingFeeComputer4(entry, exit, feeModel, rateTypes, publicHolidays);
        expect(computer.computeParkingFee(comboVehicle, transformedRateType)).toBe(0.00);
    });

    // 4. Duration: 61 minutes. Chargeable: 1 min. Billed: ceil(1/30) = 1 block. Fee: 1 * $0.60 = $0.60
    test('4. Stay of 61 minutes should cost $0.60 (1 minute over grace, 1 block)', () => {
        const exit = `${testDate}T11:01:00Z`;
        const computer = new ParkingFeeComputer4(entry, exit, feeModel, rateTypes, publicHolidays);
        expect(computer.computeParkingFee(comboVehicle, transformedRateType)).toBe(0.60);
    });

    // 5. Duration: 90 minutes. Chargeable: 30 mins. Billed: ceil(30/30) = 1 block. Fee: 1 * $0.60 = $0.60
    test('5. Stay of 90 minutes should cost $0.60 (30 mins over grace, exactly 1 block)', () => {
        const exit = `${testDate}T11:30:00Z`;
        const computer = new ParkingFeeComputer4(entry, exit, feeModel, rateTypes, publicHolidays);
        expect(computer.computeParkingFee(comboVehicle, transformedRateType)).toBe(0.60);
    });

    // 6. Duration: 91 minutes. Chargeable: 31 mins. Billed: ceil(31/30) = 2 blocks. Fee: 2 * $0.60 = $1.20
    test('6. Stay of 91 minutes should cost $1.20 (31 mins over grace, rounds up to 2 blocks)', () => {
        const exit = `${testDate}T11:31:00Z`;
        const computer = new ParkingFeeComputer4(entry, exit, feeModel, rateTypes, publicHolidays);
        expect(computer.computeParkingFee(comboVehicle, transformedRateType)).toBe(1.20);
    });

    // 7. Duration: 120 minutes (2 hours). Chargeable: 60 mins. Billed: ceil(60/30) = 2 blocks. Fee: 2 * $0.60 = $1.20
    test('7. Stay of 120 minutes (2 hours) should cost $1.20 (exactly 2 blocks)', () => {
        const exit = `${testDate}T12:00:00Z`;
        const computer = new ParkingFeeComputer4(entry, exit, feeModel, rateTypes, publicHolidays);
        expect(computer.computeParkingFee(comboVehicle, transformedRateType)).toBe(1.20);
    });

    // 8. Duration: 151 minutes. Chargeable: 91 mins. Billed: ceil(91/30) = 4 blocks. Fee: 4 * $0.60 = $2.40
    test('8. Stay of 151 minutes should cost $2.40 (91 mins over grace, rounds up to 4 blocks)', () => {
        const exit = `${testDate}T12:31:00Z`;
        const computer = new ParkingFeeComputer4(entry, exit, feeModel, rateTypes, publicHolidays);
        expect(computer.computeParkingFee(comboVehicle, transformedRateType)).toBe(2.40);
    });
});