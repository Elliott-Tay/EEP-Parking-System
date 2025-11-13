/**
 * ParkingFeeComputer Class
 * Calculates parking fees based on entry/exit times, rate types, and fee models.
 * This version implements the Class 1 fee logic and handles rate lookup by searching
 * directly within the provided array of fee models.
 */
class ParkingFeeComputer4 {
    /**
     * @param {Array<object>} feeModels The array containing the specific rate objects (e.g., the CLASS1_RATES array).
     * @param {string} entryDateTime ISO date string for entry time.
     * @param {string} exitDateTime ISO date string for exit time.
     * @param {string} rateType The string identifier for the rate (e.g., "Class1").
     * @param {string} vehicleType The type of vehicle (defaults to "Car/MC/HGV").
     */
    constructor(feeModels, entryDateTime, exitDateTime, rateType, vehicleType = "Car/MC/HGV") {
        // Now expecting the specific rate array as the first argument
        this.feeModels = feeModels; 
        this.entryDateTime = new Date(entryDateTime);
        this.exitDateTime = new Date(exitDateTime);
        this.rateType = rateType;
        this.vehicleType = vehicleType;
        // modelCatalogKey has been removed to meet the 5-argument requirement
    }

    /**
     * Helper to reliably calculate the duration between two Date objects in minutes.
     * @returns {number} The duration in minutes (rounded to nearest minute).
     */
    getDurationInMinutes() {
        const diffInMilliseconds = this.exitDateTime.getTime() - this.entryDateTime.getTime();
        return Math.round(diffInMilliseconds / (1000 * 60));
    }

    /**
     * Helper to find the matching rate object from the fee models array.
     * Searches directly within the feeModels array (which is now expected to be the specific rates array).
     * @returns {object | null} The matching rate object or null if not found.
     */
    findMatchingRate() {
        const ratesArray = this.feeModels;

        if (!Array.isArray(ratesArray) || ratesArray.length === 0) {
            console.error("Fee models array is not valid or is empty.");
            return null;
        }

        // Search directly within the ratesArray
        const rateObject = ratesArray.find(rate => 
            rate.vehicle_type === this.vehicleType &&
            rate.rate_type === this.rateType
        );

        if (!rateObject) {
            console.warn(`No matching rate found for type ${this.rateType} and vehicle ${this.vehicleType}.`);
            return null;
        }
        return rateObject;
    }

    /**
     * Computes the parking fee based on the Class 1 fee model.
     * @returns {number | null} The calculated parking fee, formatted to two decimal places, or null if no rate is found.
     */
    computeParkingFee() {
        const totalDurationMinutes = this.getDurationInMinutes();

        // 1. Find the necessary rate object internally
        const rateObject = this.findMatchingRate();
        if (rateObject === null) {
            return null;
        }

        // 2. Destructure using the correct data model keys
        const { grace_time, every, min_fee } = rateObject;

        // Validation against the data model keys
        if (typeof grace_time === 'undefined' || typeof every === 'undefined' || typeof min_fee === 'undefined') {
            console.error("Rate structure is incomplete or missing necessary keys (grace_time, every, min_fee).");
            return null; 
        }

        // 3. Determine chargeable duration
        const chargeableMinutes = totalDurationMinutes - grace_time;

        // 4. Handle grace period (first hour free)
        if (chargeableMinutes <= 0) {
            return 0.00;
        }

        // 5. Calculate billing blocks
        const numberOfBlocks = Math.ceil(chargeableMinutes / every);

        // 6. Calculate final fee
        const fee = numberOfBlocks * min_fee;

        // Ensure the fee is formatted to two decimal places for currency comparison
        return parseFloat(fee.toFixed(2));
    }
}

module.exports = { ParkingFeeComputer4 };