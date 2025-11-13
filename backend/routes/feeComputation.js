const express = require("express");
const router = express.Router();
const { ParkingFeeComputer } = require('../routes/parkingFeeCompute1'); 
const { ParkingFeeComputer2 } = require('../routes/parkingFeeCompute2'); 
const { ParkingFeeComputer3 } = require('../routes/parkingFeeCompute3'); 
const { ParkingFeeComputer4 } = require('../routes/parkingFeeCompute4'); // Imported

// 1. Model Set 1: COMPREHENSIVE_RATES
const feeModels_Comprehensive = [
    { vehicle_type: "Car/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Hourly", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Hourly", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "All day", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Hourly", every: 30, min_fee: 0.30, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Hourly", every: 30, min_fee: 1.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "PH", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 3.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Season", every: 60, min_fee: 0.00, grace_time: 15, min_charge: 0, max_charge: 0 },
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "00:00:00", to_time: "23:59:00", rate_type: "Hourly", every: 60, min_fee: 1.00, grace_time: 15, min_charge: 0, max_charge: 0 },
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Day Season", every: 1, min_fee: 0, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Day Season", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "All day", from_time: "07:00:00", to_time: "07:00:00", rate_type: "CSPT", every: 1, min_fee: 0.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "07:00:00", rate_type: "Block3", every: 1, min_fee: 0.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "07:00:00", rate_type: "Authorized", every: 1, min_fee: 0.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Night Season", every: 30, min_fee: 0.60, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Night Season", every: 30, min_fee: 0.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "23:00:00", rate_type: "Block2", every: 1, min_fee: 0.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "23:00:00", to_time: "07:00:00", rate_type: "Block2", every: 30, min_fee: 2.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },
];

// 2. Model Set 2: BLOCK2_SPECIAL_RATES
const feeModels_Block2Special = [
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "23:00:00", rate_type: "Special", every: 1, min_fee: 0.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "23:00:00", to_time: "07:00:00", rate_type: "Special", every: 30, min_fee: 2.00, grace_time: 15, min_charge: 2.00, max_charge: 2.00 },
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "23:00:00", rate_type: "Block2", every: 1, min_fee: 0.00, grace_time: 15, min_charge: 0.00, max_charge: 0.00 },
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "23:00:00", to_time: "07:00:00", rate_type: "Block2", every: 30, min_fee: 2.00, grace_time: 15, min_charge: 2.00, max_charge: 2.00 },
];

// 3. Model Set 3: STAFF_ESTATE_RATES
const feeModels_StaffEstate = [
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "19:00:00", rate_type: "Block1", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "19:00:00", to_time: "22:30:00", rate_type: "Block1", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Block1", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "Mon-Fri", from_time: "07:00:00", to_time: "19:30:00", rate_type: "Staff Estate A", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "Mon-Fri", from_time: "19:30:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "Mon-Fri", from_time: "22:30:00", to_time: "07:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "Sat", from_time: "07:00:00", to_time: "15:00:00", rate_type: "Staff Estate A", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "Sat", from_time: "15:00:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "Sat", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Staff Estate A", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "Sun", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "Sun", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Staff Estate A", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "Mon-Fri", from_time: "07:00:00", to_time: "19:30:00", rate_type: "Staff Estate A", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "Mon-Fri", from_time: "19:30:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.30, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "Mon-Fri", from_time: "22:30:00", to_time: "07:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 1.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "Sat", from_time: "07:00:00", to_time: "15:00:00", rate_type: "Staff Estate A", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "Sat", from_time: "15:00:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.30, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "Sat", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Staff Estate A", every: 30, min_fee: 1.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "Sun", from_time: "07:00:00", to_time: "22:30:00", rate_type: "Staff Estate A", every: 30, min_fee: 0.30, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "Sun", from_time: "22:30:00", to_time: "07:00:00", rate_type: "Staff Estate A", every: 30, min_fee: 1.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "23:00:00", rate_type: "Staff Estate B", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV", day_of_week: "All day", from_time: "23:00:00", to_time: "07:00:00", rate_type: "Staff Estate B", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "All day", from_time: "07:00:00", to_time: "23:00:00", rate_type: "Staff Estate B", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "MC", day_of_week: "All day", from_time: "23:00:00", to_time: "07:00:00", rate_type: "Staff Estate B", every: 30, min_fee: 1.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "07:00:00", to_time: "19:30:00", rate_type: "URA Staff", every: 1, min_fee: 0.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "19:30:00", to_time: "22:30:00", rate_type: "URA Staff", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV/MC", day_of_week: "Mon-Fri", from_time: "22:30:00", to_time: "07:30:00", rate_type: "URA Staff", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV/MC", day_of_week: "Sat-Sun", from_time: "07:00:00", to_time: "22:30:00", rate_type: "URA Staff", every: 30, min_fee: 0.60, grace_time: 15, min_charge: null, max_charge: null },
    { vehicle_type: "Car/HGV/MC", day_of_week: "Sat-Sun", from_time: "22:30:00", to_time: "07:00:00", rate_type: "URA Staff", every: 30, min_fee: 2.00, grace_time: 15, min_charge: null, max_charge: null }
];

// 3. Model Set 4: CLASS1_RATES
const feeModels_Class1 = [
    { vehicle_type: "Car/MC/HGV", day_of_week: "All day", from_time: "07:00:00", to_time: "07:00:00", rate_type: "Class1", every: 30, min_fee: 0.60, grace_time: 60, min_charge: 0.00, max_charge: 0.00 },
]

const FeeModelCatalog = {
    COMPREHENSIVE_RATES: feeModels_Comprehensive,
    BLOCK2_SPECIAL_RATES: feeModels_Block2Special,
    STAFF_ESTATE_RATES: feeModels_StaffEstate,
    CLASS1_RATES: feeModels_Class1,
};

function createFeeCalculator(entryDateTime, exitDateTime, rateType, vehicleType, modelCatalogKey) {
    const selectedFeeModels = FeeModelCatalog[modelCatalogKey];
    const requestedRateType = rateType; // Alias for clarity

    if (!selectedFeeModels) {
        console.error(`Invalid modelCatalogKey: ${modelCatalogKey}. Cannot create calculator.`);
        return "Invalid modelCatalogKey. Cannot calculate fee. Please select a valid fee model.";
    }

    // Arguments for ALL constructors must match the expected signature:
    // (entry, exit, feeModels, rate_types_map (null), publicHolidays (default: []))

    // Note: The specific rate type ('rateType') and vehicle type ('vehicleType') 
    // must be passed to the .calculate() method in the route handler.

    if (requestedRateType === "Special" || requestedRateType === "Block2") {
        // ParkingFeeComputer2 constructor signature: (feeModels, entry, exit, rateType, vehicleType)
        return new ParkingFeeComputer2(
            selectedFeeModels, // 1st arg: feeModels (The Array)
            entryDateTime,     // 2nd arg: entryDateTime
            exitDateTime,      // 3rd arg: exitDateTime
            requestedRateType, // 4th arg: rateType
            vehicleType        // 5th arg: vehicleType
        );
    } else if (["Block1", "Staff Estate A", "Staff Estate B", "URA Staff"].includes(requestedRateType)) {
        // Assuming ParkingFeeComputer3 uses the SAME custom constructor as PC2:
        // Signature: (feeModels, entry, exit, rateType, vehicleType)
        return new ParkingFeeComputer3(
            selectedFeeModels, // 1st arg: feeModels (The Array)
            entryDateTime,     // 2nd arg: entryDateTime
            exitDateTime,      // 3rd arg: exitDateTime
            requestedRateType, // 4th arg: rateType (was null placeholder)
            vehicleType        // 5th arg: vehicleType (was [] placeholder)
        );
    } else if (requestedRateType === "Class1") {
        // Use ParkingFeeComputer4 for the flat-rate Class1 logic
        // Signature MUST MATCH PC4: (feeModels, entry, exit, rateType, vehicleType, modelCatalogKey)
        return new ParkingFeeComputer4(
            selectedFeeModels,     // 1st arg: The ENTIRE catalog object is required by PC4's findMatchingRate()
            entryDateTime,       // 2nd arg: entryDateTime
            exitDateTime,        // 3rd arg: exitDateTime
            requestedRateType,   // 4th arg: rateType (Class1)
            vehicleType,         // 5th arg: vehicleType
            modelCatalogKey      // 6th arg: modelCatalogKey (CLASS1_RATES)
        );
    } 
    else {
        // Default calculator (ParkingFeeComputer)
        return new ParkingFeeComputer(
            entryDateTime, 
            exitDateTime, 
            selectedFeeModels, 
            null, // rate_types_map
            []    // publicHolidays
        );
    }
}

// Helper function to validate if a string can be reliably parsed as a date
const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    // Check if parsing succeeded (not "Invalid Date") and if the timestamp is not NaN
    return date.toString() !== 'Invalid Date' && !isNaN(date.getTime());
};

// --- ROUTE HANDLER WITH ADDED VALIDATION ---

// route to compute parking fee
// route to compute parking fee
router.post("/calculate-fee", async (req, res) => {
    // 1. Extract required parameters from the request body
    const { 
        entryDateTime, 
        exitDateTime, 
        rateType, 
        vehicleType, 
        modelCatalogKey 
    } = req.body;

    // 2. Input Validation (Ensure all necessary fields are present)
    if (!entryDateTime || !exitDateTime || !rateType || !vehicleType || !modelCatalogKey) {
        return res.status(400).json({ 
            error: "Missing parameters.",
            required: ["entryDateTime", "exitDateTime", "rateType", "vehicleType", "modelCatalogKey"]
        });
    }

    // --- START: Date Validation Added ---

    // 2.1. Validate date formats
    if (!isValidDate(entryDateTime)) {
        return res.status(400).json({ error: "Invalid date format for entryDateTime." });
    }
    if (!isValidDate(exitDateTime)) {
        return res.status(400).json({ error: "Invalid date format for exitDateTime." });
    }

    // 2.2. Validate date order (Entry must be strictly before Exit)
    const entryTime = new Date(entryDateTime).getTime();
    const exitTime = new Date(exitDateTime).getTime();

    if (entryTime >= exitTime) {
        return res.status(400).json({ error: "exitDateTime must be after entryDateTime." });
    }
    
    // --- END: Date Validation Added ---

    try {
        // 3. Create the appropriate fee calculator instance
        const calculator = createFeeCalculator(
            entryDateTime,
            exitDateTime,
            rateType,
            vehicleType,
            modelCatalogKey
        );

        // Check if createFeeCalculator returned an error string
        if (typeof calculator === 'string') {
            return res.status(400).json({ error: calculator });
        }

        // 4. Calculate the fee
        const totalFee = calculator.computeParkingFee(vehicleType, rateType); 

        // 5. Send the result back to the client
        res.status(200).json({
            status: "success",
            entry: entryDateTime,
            exit: exitDateTime,
            rate_type: rateType,
            fee_model: modelCatalogKey,
            // FIX: Use parseFloat() to convert the fixed string back into a number.
            // This ensures the fee is a number with two decimal places of precision.
            total_fee: parseFloat(Number(totalFee).toFixed(2))
        });

    } catch (err) {
        console.error("Fee calculation error:", err);
        res.status(500).json({ error: "Internal server error during fee calculation.", details: err.message });
    }
});

module.exports = router;