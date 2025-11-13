/**
 * ParkingFeeComputer Class
 * Calculates parking fees based on entry/exit times, rate types, and fee models.
 * This version is specifically optimized to demonstrate Class 1 logic.
 */
class ParkingFeeComputer4 {
    /**
     * @param {string} entry ISO date string for entry time.
     * @param {string} exit ISO date string for exit time.
     * @param {Array} feeModels The full list of fee models (not strictly used here but kept for API compatibility).
     * @param {object} rateTypes The specific rate structure to apply (e.g., Class 1).
     * @param {Array} publicHolidays List of public holidays (not strictly used here but kept for API compatibility).
     */
    constructor(entry, exit, feeModels, rateTypes, publicHolidays) {
        // Convert ISO date strings to Date objects
        this.entryTime = new Date(entry);
        this.exitTime = new Date(exit);

        // Retain other properties for completeness
        this.feeModels = feeModels;
        this.rateTypes = rateTypes;
        this.publicHolidays = publicHolidays;
    }

    /**
     * Helper to reliably calculate the duration between two Date objects in minutes.
     * @returns {number} The duration in minutes.
     */
    getDurationInMinutes() {
        const diffInMilliseconds = this.exitTime.getTime() - this.entryTime.getTime();
        // Convert milliseconds to minutes and round to the nearest whole minute
        return Math.round(diffInMilliseconds / (1000 * 60));
    }

    /**
     * Computes the parking fee based on the Class 1 fee model:
     * - First 60 minutes are free (grace period).
     * - Chargeable duration is rounded UP to the next 30-minute block.
     * - Fee is $0.60 per 30-minute block.
     *
     * @param {object} vehicle The vehicle object (unused, but kept for interface compatibility).
     * @param {object} rateType The Class 1 rate structure containing { gracePeriod: 60, blockDuration: 30, rate: 0.60 }.
     * @returns {number} The calculated parking fee, formatted to two decimal places.
     */
    computeParkingFee(vehicle, rateType) {
        // 1. Get total duration
        const totalDurationMinutes = this.getDurationInMinutes();

        // Destructure necessary parameters for Class 1:
        // gracePeriod should be 60 (minutes free)
        // blockDuration should be 30 (minutes per block)
        // rate should be 0.60 (fee per block)
        const { gracePeriod, blockDuration, rate } = rateType;

        // 2. Determine chargeable duration
        // This calculates the duration AFTER the first 60 free minutes.
        const chargeableMinutes = totalDurationMinutes - gracePeriod;

        // 3. Handle grace period and free stays (first hour)
        if (chargeableMinutes <= 0) {
            // Stay is within the 60-minute grace period or zero/negative duration
            return 0.00;
        }

        // 4. Calculate billing blocks
        // The chargeable time is rounded up to the nearest block duration (e.g., 31 chargeable mins -> 2 blocks).
        const numberOfBlocks = Math.ceil(chargeableMinutes / blockDuration);

        // 5. Calculate final fee
        const fee = numberOfBlocks * rate;

        // Ensure the fee is formatted to two decimal places for currency comparison
        return parseFloat(fee.toFixed(2));
    }
}


module.exports = { ParkingFeeComputer4 };