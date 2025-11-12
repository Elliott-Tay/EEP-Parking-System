/**
 * ParkingFeeComputer2
 * Computes parking fees using a set of rules (feeModels) provided at initialization.
 * The calculation logic remains the same, but the rate data is external.
 */
class ParkingFeeComputer2 {

    /**
     * @param {Array<Object>} feeModels - The complete array of all rate models (e.g., Special, Block2).
     * @param {string} entryDateTime - ISO string or date representation of entry.
     * @param {string} exitDateTime - ISO string or date representation of exit.
     * @param {string} rateType - The identifier for the rate model to use (e.g., "Special" or "Block2").
     * @param {string} [vehicleType="Car/MC/HGV"] - The vehicle type for filtering rules.
     */
    constructor(feeModels, entryDateTime, exitDateTime, rateType, vehicleType = "Car/MC/HGV") {
        // Note: For consistency, we rely on the Date objects handling the ISO string input.
        this.feeModels = feeModels;
        this.entryDateTime = new Date(entryDateTime);
        this.exitDateTime = new Date(exitDateTime);
        this.rateType = rateType;
        this.vehicleType = vehicleType;
    }

    /**
     * Returns the local date string (YYYY-MM-DD) for a Date object.
     * Note: Not modified, as this is for display/debugging purposes.
     */
    getLocalISODate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Creates a new Date object at the start of a day (UTC midnight) and sets its time based on a string (HH:MM).
     * IMPORTANT: Uses UTC setters for time to maintain consistency across time zone changes, 
     * aligning with how block times (like 23:00) are typically defined universally.
     */
    addTime(date, timeStr) {
        const [hour, minute] = timeStr.split(":").map(Number);
        const newDate = new Date(date);
        // Reset to UTC midnight of the current day before setting time
        newDate.setUTCHours(0, 0, 0, 0); 
        // Set the time of the block using UTC methods
        newDate.setUTCHours(hour, minute, 0, 0);
        return newDate;
    }

    /**
     * Core logic for calculating fees across time segments and days.
     */
    _calculateFee() {
        let totalFee = 0;
        let currentDay = new Date(this.entryDateTime);
        // Reset currentDay to UTC midnight for consistent daily iteration
        currentDay.setUTCHours(0, 0, 0, 0);

        // --- Filter the models based on the constructor parameters ---
        const applicableModels = this.feeModels.filter(model =>
            model.rate_type === this.rateType &&
            model.vehicle_type === this.vehicleType
        );

        if (applicableModels.length === 0) {
            console.error(`No fee models found for rateType: ${this.rateType} and vehicleType: ${this.vehicleType}`);
            return 0.00;
        }
        // --- End Filtering ---

        // Helper for single segment fee calculation
        const calculateSegmentFee = (block, durationMinutes) => {
            if (block.min_fee === 0.00) return 0.00;

            const billedUnitMinutes = block.every;
            // CRITICAL: Use Math.ceil to round up to the next full unit
            const billedUnits = Math.ceil(durationMinutes / billedUnitMinutes);

            if (billedUnits > 0) {
                let fee = billedUnits * block.min_fee;
                // Ensure segment fee is rounded to 2 decimal places to prevent float errors
                return parseFloat(fee.toFixed(2)); 
            }
            return 0;
        };

        // Iterate through each day of the parking duration
        while (currentDay.getTime() < this.exitDateTime.getTime()) {
            const dayStart = new Date(currentDay);
            const nextDay = new Date(currentDay);
            // Use UTC setters for robust day increment
            nextDay.setUTCDate(nextDay.getUTCDate() + 1);
            nextDay.setUTCHours(0, 0, 0, 0);

            // Determine the segment boundaries for the current day
            const segmentStart = this.entryDateTime.getTime() > dayStart.getTime() ? this.entryDateTime : dayStart;
            const segmentEnd = this.exitDateTime.getTime() < nextDay.getTime() ? this.exitDateTime : nextDay;

            if (segmentStart.getTime() >= segmentEnd.getTime()) {
                currentDay = nextDay;
                continue;
            }

            // Get day of week using UTC (1=Mon, 2=Tue, ..., 0=Sun)
            const dayOfWeekIndex = currentDay.getUTCDay();
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const dayOfWeek = days[dayOfWeekIndex]; 
            
            // Filter models applicable for this day (All day rules apply to every day)
            let dailyBlocks = applicableModels.filter(
                (item) => item.day_of_week === dayOfWeek || item.day_of_week === "All day"
            );

            let boundaries = new Set();
            boundaries.add(segmentStart.getTime());
            boundaries.add(segmentEnd.getTime());

            // Add boundaries defined by the rate blocks (e.g., 7:00, 23:00)
            for (const block of dailyBlocks) {
                const blockStart = this.addTime(currentDay, block.from_time);
                
                // Add block start time if it falls within the current parking segment
                if (blockStart.getTime() > segmentStart.getTime() && blockStart.getTime() < segmentEnd.getTime()) {
                    boundaries.add(blockStart.getTime());
                }
            }

            const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);
            let dailyFee = 0;

            // Iterate through the generated time segments
            for (let i = 0; i < sortedBoundaries.length - 1; i++) {
                const segStartT = sortedBoundaries[i];
                const segEndT = sortedBoundaries[i + 1];

                const segDurationMinutes = (segEndT - segStartT) / 60000;
                if (segDurationMinutes <= 0) continue;

                let bestBlock = null;
                const checkDate = new Date(segStartT); // Use the segment start time to determine the current rate

                // Find the rate block that applies to the segment
                for (const block of dailyBlocks) {
                    let blockStart = this.addTime(checkDate, block.from_time);
                    let blockEnd = this.addTime(checkDate, block.to_time);

                    // Handle overnight blocks (e.g., 23:00 to 07:00)
                    if (blockEnd.getTime() <= blockStart.getTime()) {
                        
                        // If the segment starts in the morning part of the rule (e.g., 00:00 to 07:00)
                        if (checkDate.getUTCHours() < blockEnd.getUTCHours()) {
                            // The rule must have started yesterday, so shift blockStart back 1 day.
                            blockStart.setUTCDate(blockStart.getUTCDate() - 1);
                        } else {
                            // If the segment starts in the evening part (e.g., 23:00 to 00:00)
                            // The rule ends tomorrow, so shift blockEnd forward 1 day.
                            blockEnd.setUTCDate(blockEnd.getUTCDate() + 1);
                        }
                    } 
                    
                    // Check if the segment starts within the block's time range
                    if (segStartT >= blockStart.getTime() && segStartT < blockEnd.getTime()) {
                        bestBlock = block;
                        break;
                    }
                }

                if (bestBlock) {
                    dailyFee += calculateSegmentFee(bestBlock, segDurationMinutes);
                }
            }
            
            totalFee += dailyFee;
            currentDay = nextDay; // Move to the next day's UTC midnight
        }
        
        // --- Apply Global Grace Period (15 minutes) ---
        const maxGraceMinutes = 15; 
        const totalDurationMinutes = (this.exitDateTime.getTime() - this.entryDateTime.getTime()) / 60000;
        
        // If total duration is <= 15 minutes AND a fee was computed (totalFee > 0), 
        // the fee is waived to $0.00.
        if (totalDurationMinutes <= maxGraceMinutes && totalFee > 0) {
            return 0.00;
        }

        // Final return ensures the total is rounded to exactly two decimal places and returned as a number
        return parseFloat(totalFee.toFixed(2));
    }


    /**
     * Computes the final parking fee.
     * @returns {number} The total parking fee, rounded to two decimal places.
     */
    computeParkingFee() {
        return this._calculateFee();
    }
}

module.exports = { ParkingFeeComputer2 };