const assert = require('assert');
// NOTE: Assuming ParkingFeeComputer3 is available in this file structure for testing
const { ParkingFeeComputer3 } = require('../routes/parkingFeeCompute3'); 

// The complete fee models provided by the user
const feeModels = [
    // --- Block1 – Daytime (7:00am - 7:00pm, Free) ---
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "19:00:00", rate_type: "Block1", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    // --- Block1 – Evening (7:00pm - 10:30pm, $0.60 / 30 mins) ---
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "19:00:00", to_time: "22:30:00", rate_type: "Block1", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null }, // $0.02 / min
    // --- Block1 – Night (10:30pm - 7:00am, $2.00 / 30 mins) ---
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Block1", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null }, // $0.066... / min

    // --- Staff Estate (Type A) – Car/HGV Weekdays ---
    { vehicle_type: "Car/HGV", day_of_week: "Mon-Fri", from_time: "07:00:00", to_time: "19:30:00", rate_type: "Staff Estate A", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "Mon-Fri", from_time: "19:30:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null }, // $0.02 / min
    { vehicle_type: "Car/HGV", day_of_week: "Mon-Fri", from_time: "22:30:00", to_time: "07:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null }, // $0.066... / min
    // --- Staff Estate (Type A) – Car/HGV Saturday ---
    { vehicle_type: "Car/HGV", day_of_week: "Sat", from_time: "07:00:00", to_time: "15:00:00", rate_type: "Staff Estate A", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "Sat", from_time: "15:00:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null }, // $0.02 / min
    { vehicle_type: "Car/HGV", day_of_week: "Sat", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Staff Estate A", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null }, // $0.066... / min
    // --- Staff Estate (Type A) – Car/HGV Sunday ---
    { vehicle_type: "Car/HGV", day_of_week: "Sun", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null }, // $0.02 / min
    { vehicle_type: "Car/HGV", day_of_week: "Sun", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Staff Estate A", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null }, // $0.066... / min

    // --- Staff Estate (Type A) – MC Weekdays ---
    { vehicle_type: "MC", day_of_week: "Mon-Fri", from_time: "07:00:00", to_time: "19:30:00", rate_type: "Staff Estate A", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "Mon-Fri", from_time: "19:30:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.30, grace_time: 15, min_charge: null, max_charge: null }, // $0.01 / min
    { vehicle_type: "MC", day_of_week: "Mon-Fri", from_time: "22:30:00", to_time: "07:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 1.00, grace_time: 15, min_charge: null, max_charge: null }, // $0.033... / min
    // --- Staff Estate (Type A) – MC Saturday ---
    { vehicle_type: "MC", day_of_week: "Sat", from_time: "07:00:00", to_time: "15:00:00", rate_type: "Staff Estate A", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "Sat", from_time: "15:00:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.30, grace_time: 15, min_charge: null, max_charge: null }, // $0.01 / min
    { vehicle_type: "MC", day_of_week: "Sat", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Staff Estate A", every: 30, min_fee: 1.00, grace_time: 15, min_charge: null, max_charge: null }, // $0.033... / min
    // --- Staff Estate (Type A) – MC Sunday ---
    { vehicle_type: "MC", day_of_week: "Sun", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.30, grace_time: 15, min_charge: null, max_charge: null }, // $0.01 / min
    { vehicle_type: "MC", day_of_week: "Sun", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Staff Estate A", every: 30, min_fee: 1.00, grace_time: 15, min_charge: null, max_charge: null }, // $0.033... / min

    // --- Staff Estate (Type B) – Car/HGV ---
    { vehicle_type: "Car/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "23:00:00", rate_type: "Staff Estate B", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "All day", from_time: "23:00:00", to_time: "07:00:00", rate_type: "Staff Estate B", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null }, // $0.066... / min
    // --- Staff Estate (Type B) – MC ---
    { vehicle_type: "MC", day_of_week: "All day", from_time: "07:00:00", to_time: "23:00:00", rate_type: "Staff Estate B", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "All day", from_time: "23:00:00", to_time: "07:00:00", rate_type: "Staff Estate B", every: 30, min_fee: 1.00, grace_time: 15, min_charge: null, max_charge: null }, // $0.033... / min

    // --- URA Staff – Weekdays ---
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "07:00:00", to_time: "19:30:00", rate_type: "URA Staff", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "19:30:00", to_time: "22:30:00", rate_type: "URA Staff", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null }, // $0.02 / min
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "22:30:00", to_time: "07:30:00", rate_type: "URA Staff", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null }, // $0.066... / min
    // --- URA Staff – Weekends ---
    { vehicle_type: "Car/HGV/MC", day_of_week: "Sat-Sun", from_time: "07:00:00", to_time: "22:30:00", rate_type: "URA Staff", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null }, // $0.02 / min
    { vehicle_type: "Car/HGV/MC", day_of_week: "Sat-Sun", from_time: "22:30:00", to_time: "07:00:00", rate_type: "URA Staff", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null } // $0.066... / min
];

// Reference dates (using UTC):
const MON_DATE = '2025-11-10T'; // Monday
const TUE_DATE = '2025-11-11T'; // Tuesday
const WED_DATE = '2025-11-12T'; // Wednesday
const SAT_DATE = '2025-11-15T'; // Saturday
const SUN_DATE = '2025-11-16T'; // Sunday
const MON_DATE_NEXT = '2025-11-17T'; // Next Monday

// Helper function for deep comparison of numbers (since floats can be tricky)
function closeTo(actual, expected, tolerance = 0.01) {
    return Math.abs(actual - expected) < tolerance;
}

describe('ParkingFeeComputer3 - Consistent Linear Billing', () => {

    /**
     * Test Case 1: Basic Linear Charge - Exact hour (Block1)
     * Rate: $0.60 / 30 mins -> $0.02 / min
     * Duration: 60 minutes
     * Expected: 60 * 0.02 = $1.20
     */
    it('TC1: Should calculate exact linear fee for 60 minutes in a $0.60/30 min block (Block1)', () => {
        const computer = new ParkingFeeComputer3(
            feeModels,
            MON_DATE + '19:00:00.000Z', // Mon 19:00 (Evening start)
            MON_DATE + '20:00:00.000Z', // Mon 20:00
            'Block1',
            'Car'
        );
        const fee = computer.computeParkingFee();
        assert.ok(closeTo(fee, 1.20), `Expected $1.20, but got $${fee}`);
    });

    /**
     * Test Case 2: Linear Charge with Uneven Minutes (Staff Estate A / Car)
     * Rate: $0.60 / 30 mins -> $0.02 / min
     * Duration: 77 minutes (19:30 to 20:47)
     * Expected: 77 * 0.02 = $1.54
     */
    it('TC2: Should calculate exact linear fee for 77 minutes in a $0.60/30 min block (Staff Estate A)', () => {
        const computer = new ParkingFeeComputer3(
            feeModels,
            MON_DATE + '19:30:00.000Z', // Mon 19:30 (Evening start)
            MON_DATE + '20:47:00.000Z', // Mon 20:47
            'Staff Estate A',
            'Car'
        );
        const fee = computer.computeParkingFee();
        assert.ok(closeTo(fee, 1.54), `Expected $1.54, but got $${fee}`);
    });

    /**
     * Test Case 3: Grace Period Check (Duration < 15 mins)
     * Duration: 14 minutes (19:00 to 19:14)
     * Expected: $0.00
     */
    it('TC3: Should apply 15-minute grace period and return $0.00', () => {
        const computer = new ParkingFeeComputer3(
            feeModels,
            MON_DATE + '19:00:00.000Z',
            MON_DATE + '19:14:00.000Z',
            'Block1',
            'Car'
        );
        const fee = computer.computeParkingFee();
        assert.ok(closeTo(fee, 0.00), `Expected $0.00, but got $${fee}`);
    });

    /**
     * Test Case 4: Boundary Transition (Free to Paid) (Block1)
     * Duration: 30 minutes total (18:50 - 19:20)
     * Seg 1 (18:50 - 19:00): 10 mins @ $0.00/min = $0.00
     * Seg 2 (19:00 - 19:20): 20 mins @ $0.02/min = $0.40
     * Expected Total: $0.40
     */
    it('TC4: Should correctly transition from a Free block to a Paid linear block', () => {
        const computer = new ParkingFeeComputer3(
            feeModels,
            MON_DATE + '18:50:00.000Z',
            MON_DATE + '19:20:00.000Z',
            'Block1',
            'Car'
        );
        const fee = computer.computeParkingFee();
        assert.ok(closeTo(fee, 0.40), `Expected $0.40, but got $${fee}`);
    });

    /**
     * Test Case 5: Overnight Charge - Multiple transitions (Staff Estate A / MC)
     * Duration: Sat 22:00 - Sun 01:00 (180 mins)
     * Rate: Staff Estate A (MC)
     * Sat Evening (22:00 - 22:30): 30 mins @ $0.01/min (0.30/30) = $0.30
     * Sat Night (22:30 - 24:00): 90 mins @ $0.033333/min (1.00/30) = $3.00
     * Sun Night (00:00 - 01:00): 60 mins @ $0.033333/min (1.00/30) = $2.00
     * Expected Total: 0.30 + 3.00 + 2.00 = $5.30
     */
    it('TC5: Should calculate fee over Sat-Sun midnight with multiple rate blocks (Staff Estate A / MC)', () => {
        const computer = new ParkingFeeComputer3(
            feeModels,
            SAT_DATE + '22:00:00.000Z',
            SUN_DATE + '01:00:00.000Z',
            'Staff Estate A',
            'MC'
        );
        const fee = computer.computeParkingFee();
        assert.ok(closeTo(fee, 5.30), `Expected $5.30, but got $${fee}`);
    });

    /**
     * Test Case 8: Barely Exceeding Grace Period (15 minutes + 1 second)
     * Duration: 16 minutes (19:00:00 to 19:16:00)
     * Rate: $0.60 / 30 mins -> $0.02 / min
     * Expected: 16 * 0.02 = $0.32
     */
    it('TC8: Should charge the linear fee when duration is exactly 1 minute over the grace period', () => {
        const computer = new ParkingFeeComputer3(
            feeModels,
            MON_DATE + '19:00:00.000Z',
            MON_DATE + '19:16:00.000Z',
            'Block1',
            'HGV'
        );
        const fee = computer.computeParkingFee();
        assert.ok(closeTo(fee, 0.32), `Expected $0.32, but got $${fee}`);
    });

    /**
     * Test Case 9: Complex Saturday Transition (Staff Estate A / Car)
     * Duration: Sat 14:30 - Sat 23:00 (510 mins total)
     * Seg 1 (14:30 - 15:00): 30 mins @ $0.00/min (Free) = $0.00
     * Seg 2 (15:00 - 22:30): 450 mins @ $0.02/min (0.60/30) = $9.00
     * Seg 3 (22:30 - 23:00): 30 mins @ $0.066666/min (2.00/30) = $2.00
     * Expected Total: $11.00
     */
    it('TC9: Should correctly calculate fee through a triple rate transition on a Saturday (Free -> Low Paid -> High Paid)', () => {
        const computer = new ParkingFeeComputer3(
            feeModels,
            SAT_DATE + '14:30:00.000Z',
            SAT_DATE + '23:00:00.000Z',
            'Staff Estate A',
            'Car'
        );
        const fee = computer.computeParkingFee();
        assert.ok(closeTo(fee, 11.00), `Expected $11.00, but got $${fee}`);
    });

    /**
     * Test Case 10: Multi-Day Parking (Mon night -> Wed morning, Staff Estate B / MC)
     * Total Duration: Mon 22:40 - Wed 07:20 (1960 minutes)
     * Paid duration (Night block: 1.00/30 min): 960 minutes
     * Expected Total: 960 * (1.00 / 30) = $32.00
     */
    it('TC10: Should correctly calculate linear fee across multiple days and overnight blocks (Staff Estate B / MC)', () => {
        const computer = new ParkingFeeComputer3(
            feeModels,
            MON_DATE + '22:40:00.000Z', // Mon 22:40
            WED_DATE + '07:20:00.000Z', // Wed 07:20
            'Staff Estate B',
            'MC'
        );
        const fee = computer.computeParkingFee();
        assert.ok(closeTo(fee, 32.00), `Expected $32.00, but got $${fee}`);
    });

    /**
     * Test Case 11: Vehicle Type Specificity (HGV) and Boundary Transition (Staff Estate A - Weekday)
     * Duration: Mon 19:00 - Mon 20:30 (90 mins total)
     * Rates (Car/HGV, Mon-Fri):
     * Seg 1 (19:00 - 19:30): 30 mins @ $0.00/min (Free) = $0.00
     * Seg 2 (19:30 - 20:30): 60 mins @ $0.02/min (0.60/30) = $1.20
     * Expected Total: $1.20
     */
    it('TC11: Should respect the HGV rate and transition from Free (Day) to Paid (Evening) on a weekday (Staff Estate A)', () => {
        const computer = new ParkingFeeComputer3(
            feeModels,
            MON_DATE + '19:00:00.000Z',
            MON_DATE + '20:30:00.000Z',
            'Staff Estate A',
            'HGV'
        );
        const fee = computer.computeParkingFee();
        assert.ok(closeTo(fee, 1.20), `Expected $1.20, but got $${fee}`);
    });

    /**
     * Test Case 13: Parking Entirely Within a Long Free Block (Block1)
     * Duration: Mon 08:00 - Mon 18:00 (600 minutes)
     * Rate: Block1 (7:00am - 7:00pm, Free)
     * Expected Total: $0.00
     */
    it('TC13: Should return $0.00 for parking entirely within a long daytime free block (Block1)', () => {
        const computer = new ParkingFeeComputer3(
            feeModels,
            MON_DATE + '08:00:00.000Z',
            MON_DATE + '18:00:00.000Z',
            'Block1',
            'Car'
        );
        const fee = computer.computeParkingFee();
        assert.ok(closeTo(fee, 0.00), `Expected $0.00, but got $${fee}`);
    });
    
    // --- NEW TEST CASES ---

    /**
     * Test Case 14: Boundary Transition (High Paid Night to Free Morning) (Block1)
     * Duration: 20 minutes total (06:50 - 07:10)
     * Rate: Block1 (2.00/30 min -> 0.066666/min)
     * Seg 1 (06:50 - 07:00): 10 mins @ $0.066666/min = $0.666666...
     * Seg 2 (07:00 - 07:10): 10 mins @ $0.00/min (Free) = $0.00
     * Expected Total: ~$0.67
     */
    it('TC14: Should correctly transition from a High Paid Night block to a Free Morning block (Block1)', () => {
        const computer = new ParkingFeeComputer3(
            feeModels,
            MON_DATE + '06:50:00.000Z',
            MON_DATE + '07:10:00.000Z',
            'Block1',
            'Car'
        );
        const fee = computer.computeParkingFee();
        assert.ok(closeTo(fee, 0.67), `Expected $0.67, but got $${fee}`);
    });

    /**
     * Test Case 15: Two Full Overnight Cycles (Staff Estate B / Car/HGV)
     * Duration: Mon 23:00 - Wed 07:00 (32 hours = 1920 mins)
     * Rate: Staff Estate B (23:00 - 07:00 Night rate: 2.00/30 min)
     * Paid Night 1 (Mon 23:00 - Tue 07:00): 480 mins * 0.066666/min = $32.00
     * Free Day (Tue 07:00 - Tue 23:00): 960 mins @ $0.00/min = $0.00
     * Paid Night 2 (Tue 23:00 - Wed 07:00): 480 mins * 0.066666/min = $32.00
     * Expected Total: $64.00
     */
    it('TC15: Should correctly calculate fee over two full overnight, high-rate cycles (Staff Estate B)', () => {
        const computer = new ParkingFeeComputer3(
            feeModels,
            MON_DATE + '23:00:00.000Z', // Mon 23:00
            WED_DATE + '07:00:00.000Z', // Wed 07:00
            'Staff Estate B',
            'Car'
        );
        const fee = computer.computeParkingFee();
        assert.ok(closeTo(fee, 64.00), `Expected $64.00, but got $${fee}`);
    });

    /**
     * Test Case 16: Short Duration (1 minute) in High Rate Block (URA Staff)
     * Duration: 1 minute (22:30:00 to 22:31:00)
     * Rate: URA Staff (Mon-Fri Night: 2.00/30 min -> 0.066666/min)
     * Expected Total: 1 min * 0.066666... = ~$0.07 (Since grace time is 15 minutes, but the duration is paid per minute after grace).
     * NOTE: Since 1 minute is < 15 minute grace period, the fee should be $0.00. However, for a minute-level test *outside* the grace period, let's test 16 minutes.
     */
     it('TC16: Should apply linear rate for 16 minutes just past the grace period in the highest rate block (URA Staff)', () => {
        // Duration: 16 minutes (22:30:00 to 22:46:00)
        // Rate: URA Staff (Mon-Fri Night: 2.00/30 min -> 0.066666/min)
        // Expected Total: 16 mins * 0.066666... = $1.066666...
        const computer = new ParkingFeeComputer3(
            feeModels,
            MON_DATE + '22:30:00.000Z',
            MON_DATE + '22:46:00.000Z',
            'URA Staff',
            'Car'
        );
        const fee = computer.computeParkingFee();
        // 16 * 2 / 30 = 1.066666...
        assert.ok(closeTo(fee, 1.07), `Expected $1.07, but got $${fee}`);
    });

    /**
     * New Test Case A: Day Exclusion - Sun (Staff Estate A / Car)
     * Duration: Sun 08:00 - Sun 09:00 (60 mins)
     * Rate: Staff Estate A (Sun rate: $0.60/30 min = $0.02/min)
     * Expected: 60 * 0.02 = $1.20
     */
    it('NTC-A: Should correctly ignore Mon-Fri rules and apply the explicit Sunday rate (Staff Estate A / Car)', () => {
        const computer = new ParkingFeeComputer3(
            feeModels,
            SUN_DATE + '08:00:00.000Z',
            SUN_DATE + '09:00:00.000Z',
            'Staff Estate A',
            'Car'
        );
        const fee = computer.computeParkingFee();
        assert.ok(closeTo(fee, 1.20), `Expected $1.20, but got $${fee}`);
    });

    /**
     * New Test Case C: Motorcycle (MC) Fractional Rate Precision Check
     * Duration: 40 minutes (22:30:00 to 23:10:00)
     * Rate: Staff Estate A (MC Night: 1.00/30 min = $0.033333/min)
     * Expected Total: 40 * (1.00 / 30) = $1.333333... ~= $1.33
     */
    it('NTC-B: Should correctly apply and round the fractional rate for MC for an uneven duration (Staff Estate A / MC)', () => {
        const computer = new ParkingFeeComputer3(
            feeModels,
            MON_DATE + '22:30:00.000Z',
            MON_DATE + '23:10:00.000Z',
            'Staff Estate A',
            'MC'
        );
        const fee = computer.computeParkingFee();
        assert.ok(closeTo(fee, 1.33), `Expected $1.33, but got $${fee}`);
    });

    describe('ParkingFeeComputer3 - Consistent Linear Billing', () => {

        // ... (Existing test cases TC1 - TC16, NTC-A, NTC-B would go here) ...

        /**
         * Test Case 17: Grace Period Ignored on Paid Duration > Grace
         * Scenario: Start in Free block, end in Paid block. Total duration > grace time.
         * Rate: Staff Estate A (Car/HGV, Mon)
         * Duration: 30 minutes total (19:20 - 19:50)
         * Seg 1 (19:20 - 19:30): 10 mins @ $0.00/min (Free)
         * Seg 2 (19:30 - 19:50): 20 mins @ $0.02/min = $0.40
         * Expected Total: $0.40 (Grace period applies to the total duration; since 30 mins > 15 mins, full fee is charged)
         */
        it('TC17: Should correctly charge the full linear fee when total duration (Free + Paid) exceeds grace period (Staff Estate A)', () => {
            const computer = new ParkingFeeComputer3(
                feeModels,
                MON_DATE + '19:20:00.000Z',
                MON_DATE + '19:50:00.000Z',
                'Staff Estate A',
                'Car'
            );
            const fee = computer.computeParkingFee();
            assert.ok(closeTo(fee, 0.40), `Expected $0.40, but got $${fee}`);
        });

        /**
         * Test Case 18: Overnight Parking Crossing High-Rate Night Block Boundary (Staff Estate A / Car)
         * Scenario: Mon night parking, ending after the night block shifts back to free day rate.
         * Duration: Mon 23:00 - Tue 08:00 (540 mins total)
         * Rates: Staff Estate A (Car/HGV, Mon-Fri)
         * Seg 1 (23:00 - 07:30): 510 mins @ $0.066666/min (2.00/30) = $34.00
         * Seg 2 (07:30 - 08:00): 30 mins @ $0.00/min (Free Day) = $0.00
         * Expected Total: $32.00
         */
        it('TC18: Should transition correctly from High Paid Night block to Free Day block (Staff Estate A / Car)', () => {
            const computer = new ParkingFeeComputer3(
                feeModels,
                MON_DATE + '23:00:00.000Z',
                TUE_DATE + '08:00:00.000Z',
                'Staff Estate A',
                'Car'
            );
            const fee = computer.computeParkingFee();
            assert.ok(closeTo(fee, 32.00), `Expected $32.00, but got $${fee}`);
        });

        /**
         * Test Case 19: Full Usage of Continuous Weekend Paid Block (URA Staff)
         * Scenario: Parking entirely within the main weekend paid period.
         * Duration: Sat 10:00 - Sat 12:30 (150 mins)
         * Rate: URA Staff (Sat-Sun, 07:00-22:30: $0.60/30 min = $0.02/min)
         * Expected Total: 150 mins * $0.02/min = $3.00
         */
        it('TC19: Should calculate fee entirely within the URA Staff weekend paid daytime block', () => {
            const computer = new ParkingFeeComputer3(
                feeModels,
                SAT_DATE + '10:00:00.000Z',
                SAT_DATE + '12:30:00.000Z',
                'URA Staff',
                'Car'
            );
            const fee = computer.computeParkingFee();
            assert.ok(closeTo(fee, 3.00), `Expected $3.00, but got $${fee}`);
        });

        /**
         * Test Case 20: Motorcycle (MC) Specific Saturday Transition (Free Day to Low Paid Evening)
         * Scenario: Transition from Saturday MC Free period to the lower-rate MC Paid period.
         * Duration: Sat 14:00 - Sat 16:00 (120 mins)
         * Rates (Staff Estate A / MC, Sat):
         * Seg 1 (14:00 - 15:00): 60 mins @ $0.00/min (Free) = $0.00
         * Seg 2 (15:00 - 16:00): 60 mins @ $0.01/min (0.30/30) = $0.60
         * Expected Total: $0.60
         */
        it('TC20: Should apply correct MC rate and transition from Free Day to Paid Evening on a Saturday (Staff Estate A / MC)', () => {
            const computer = new ParkingFeeComputer3(
                feeModels,
                SAT_DATE + '14:00:00.000Z',
                SAT_DATE + '16:00:00.000Z',
                'Staff Estate A',
                'MC'
            );
            const fee = computer.computeParkingFee();
            assert.ok(closeTo(fee, 0.60), `Expected $0.60, but got $${fee}`);
        });

        /**
         * Test Case 21: Complex Multi-Day Parking Crossing Weekend-to-Weekday (Block1)
         * Scenario: Parking from Sunday Evening to Monday Morning, crossing 4 different rate blocks.
         * Duration: Sun 22:00 - Mon 08:00 (600 mins total)
         * Rates (Block1, All Day):
         * Seg 1 (22:00 - 22:30): 30 mins @ $0.02/min (0.60/30) = $0.60
         * Seg 2 (22:30 - 24:00): 90 mins @ $0.066666/min (2.00/30) = $6.00
         * Seg 3 (00:00 - 07:00): 420 mins @ $0.066666/min (2.00/30) = $28.00
         * Seg 4 (07:00 - 08:00): 60 mins @ $0.00/min (Free Day) = $0.00
         * Expected Total: 0.60 + 6.00 + 28.00 + 0.00 = $34.60
         */
        it('TC21: Should calculate complex multi-day fee crossing Sun night, midnight, Mon night, and Mon day (Block1)', () => {
            const computer = new ParkingFeeComputer3(
                feeModels,
                SUN_DATE + '22:00:00.000Z', // Sun 22:00
                MON_DATE_NEXT + '08:00:00.000Z', // Mon 08:00
                'Block1',
                'HGV'
            );
            const fee = computer.computeParkingFee();
            assert.ok(closeTo(fee, 34.60), `Expected $34.60, but got $${fee}`);
        });
    });

});