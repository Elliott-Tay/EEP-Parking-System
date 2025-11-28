/**
 * ParkingFeeComputer Class
 * Calculates parking fees based on entry/exit times, rate types, and fee models.
 * This version implements strictly linear minute-based billing (rate per minute)
 * and includes a fix for JavaScript floating-point rounding errors.
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
        this.feeModels = feeModels; 
        this.entryDateTime = new Date(entryDateTime);
        this.exitDateTime = new Date(exitDateTime);
        this.rateType = rateType;
        this.vehicleType = vehicleType;
    }

    /**
     * Helper to reliably calculate the duration between two Date objects in minutes.
     * @returns {number} The duration in minutes (precise float).
     */
    getDurationInMinutes() {
        const diffInMilliseconds = this.exitDateTime.getTime() - this.entryDateTime.getTime();
        return diffInMilliseconds / (1000 * 60); 
    }

    /**
     * Helper to find the matching rate object from the fee models array.
     * @returns {object | null} The matching rate object or null if not found.
     */
    findMatchingRate() {
        const ratesArray = this.feeModels;

        if (!Array.isArray(ratesArray) || ratesArray.length === 0) {
            console.error("Fee models array is not valid or is empty.");
            return null;
        }

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
     * Computes the parking fee using strictly linear (rate per minute) billing.
     * @returns {number | null} The calculated parking fee, accurately rounded to two decimal places, or null if no rate is found.
     */
    computeParkingFee() {
        const totalDurationMinutes = this.getDurationInMinutes();

        const rateObject = this.findMatchingRate();
        if (rateObject === null) {
            return null;
        }

        const { grace_time, every, min_fee } = rateObject;

        if (typeof grace_time === 'undefined' || typeof every === 'undefined' || typeof min_fee === 'undefined') {
            console.error("Rate structure is incomplete or missing necessary keys (grace_time, every, min_fee).");
            return null; 
        }

        const chargeableMinutes = totalDurationMinutes - grace_time;

        if (chargeableMinutes <= 0) {
            return 0.00;
        }

        // Linear Billing Logic (Rate per Minute)
        // min_fee is the price for 'every' minutes.
        const ratePerMinute = min_fee / every; 
        
        // Calculate the raw fee
        const rawFee = chargeableMinutes * ratePerMinute;
        
        // --- Floating Point Rounding Fix ---
        // 1. Multiply by 100 (shifts decimal to the right by 2 places)
        // 2. Use Math.round() for accurate rounding (e.g., 180.5 rounds up to 181)
        // 3. Divide by 100 to shift the decimal back
        const fee = Math.round(rawFee * 100) / 100;
        // --- End Rounding Fix ---

        return parseFloat(fee.toFixed(2));
    }
}

module.exports = { ParkingFeeComputer4 };