/**
 * ParkingFeeComputer3
 * Computes parking fees using a set of rules (feeModels) provided at initialization.
 * This version handles complex filtering based on Rate Type, Vehicle Type (e.g., Car/HGV), 
 * and Day of Week (e.g., Mon-Fri, Sat-Sun).
 * * IMPORTANT NOTE: All internal date/time calculations use UTC methods 
 * (e.g., getUTCHours, setUTCDate) to ensure fee blocks are calculated 
 * independently of the server's local time zone.
 */
class ParkingFeeComputer3 {

    /**
     * @param {Array<Object>} feeModels - The complete array of all rate models.
     * @param {string} entryDateTime - ISO string or date representation of entry.
     * @param {string} exitDateTime - ISO string or date representation of exit.
     * @param {string} rateType - The identifier for the rate model to use (e.g., "Block1", "Staff Estate A").
     * @param {string} vehicleType - The specific vehicle type being parked ('Car', 'MC', or 'HGV').
     */
    constructor(feeModels, entryDateTime, exitDateTime, rateType, vehicleType) {
        this.feeModels = feeModels;
        
        // IMPORTANT: The Date constructor will parse ISO strings correctly.
        // It is assumed that the rate blocks (e.g., 07:00-19:30) are defined 
        // in UTC time relative to the date objects created here.
        this.entryDateTime = new Date(entryDateTime);
        this.exitDateTime = new Date(exitDateTime);
        
        this.rateType = rateType;
        this.vehicleType = vehicleType; // Must be a specific type: 'Car', 'MC', or 'HGV'
    }

    /**
     * Creates a new Date object at the start of a day (UTC midnight) and sets its time based on a string (HH:MM).
     * This ensures the time is set relative to the UTC day of the input date, ignoring any time component it might have.
     */
    addTime(date, timeStr) {
        const [hour, minute] = timeStr.split(":").map(Number);
        const newDate = new Date(date);
        
        // Normalize to UTC midnight of the current day
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
        
        // Initialize iteration start date to UTC midnight of the entry day.
        let currentDay = new Date(this.entryDateTime);
        currentDay.setUTCHours(0, 0, 0, 0);

        // --- Filter the models based on Rate Type and Vehicle Type ---
        // A model applies if the specific vehicle is included in the model's vehicle_type string.
        const applicableModels = this.feeModels.filter(model =>
            model.rate_type === this.rateType &&
            model.vehicle_type.split('/').includes(this.vehicleType)
        );

        if (applicableModels.length === 0) {
            console.error(`No fee models found for rateType: ${this.rateType} and vehicleType: ${this.vehicleType}`);
            return 0.00;
        }
        // --- End Filtering ---

        // Helper for single segment fee calculation
        const calculateSegmentFee = (block, durationMinutes) => {
            if (block.min_fee === 0.00) return 0.00; // Free blocks are trivial

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
        
        // Helper function to check if a day rule applies to the current day
        const isDayRuleApplicable = (ruleDay, dayOfWeekIndex) => {
            // dayOfWeekIndex: 0=Sun, 1=Mon, ..., 6=Sat (UTC standard)
            switch (ruleDay) {
                case "All day":
                    return true;
                case "Mon-Fri":
                    return dayOfWeekIndex >= 1 && dayOfWeekIndex <= 5;
                case "Sat":
                    return dayOfWeekIndex === 6;
                case "Sun":
                    return dayOfWeekIndex === 0;
                case "Sat-Sun":
                    return dayOfWeekIndex === 0 || dayOfWeekIndex === 6;
                default:
                    // Fallback for explicitly named days, though not needed by current models
                    return false; 
            }
        };

        // Iterate through each day of the parking duration
        while (currentDay.getTime() < this.exitDateTime.getTime()) {
            const dayStart = new Date(currentDay);
            const nextDay = new Date(currentDay);
            
            // Set nextDay to UTC midnight of the following day
            nextDay.setUTCDate(nextDay.getUTCDate() + 1);
            nextDay.setUTCHours(0, 0, 0, 0);

            // Determine the segment boundaries for the current day
            // segmentStart is the later of (Entry Time) or (Current Day's Midnight)
            const segmentStart = this.entryDateTime.getTime() > dayStart.getTime() ? this.entryDateTime : dayStart;
            // segmentEnd is the earlier of (Exit Time) or (Next Day's Midnight)
            const segmentEnd = this.exitDateTime.getTime() < nextDay.getTime() ? this.exitDateTime : nextDay;

            if (segmentStart.getTime() >= segmentEnd.getTime()) {
                currentDay = nextDay;
                continue;
            }

            // Get day of week using UTC (0=Sun, 1=Mon, ..., 6=Sat)
            const dayOfWeekIndex = currentDay.getUTCDay();
            
            // Filter models applicable for this day
            let dailyBlocks = applicableModels.filter(
                (item) => isDayRuleApplicable(item.day_of_week, dayOfWeekIndex)
            );

            let boundaries = new Set();
            boundaries.add(segmentStart.getTime());
            boundaries.add(segmentEnd.getTime());

            // Add boundaries defined by the rate blocks (e.g., 7:00, 19:00, 22:30)
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
                const checkDate = new Date(segStartT); // The segment start time determines the rate

                // Find the rate block that applies to the segment
                for (const block of dailyBlocks) {
                    let blockStart = this.addTime(checkDate, block.from_time);
                    let blockEnd = this.addTime(checkDate, block.to_time);

                    // Handle overnight blocks (e.g., 22:30 to 07:00)
                    if (blockEnd.getTime() <= blockStart.getTime()) {
                        
                        // Scenario 1: Segment is in the morning part of the overnight rule (00:00 to 07:00)
                        if (checkDate.getUTCHours() < blockEnd.getUTCHours()) {
                            // The block rule must have started yesterday, so shift blockStart back 1 day.
                            blockStart.setUTCDate(blockStart.getUTCDate() - 1);
                        } else {
                            // Scenario 2: Segment is in the evening part of the overnight rule (22:30 to 24:00)
                            // The block rule ends tomorrow, so shift blockEnd forward 1 day.
                            blockEnd.setUTCDate(blockEnd.getUTCDate() + 1);
                        }
                    } 
                    
                    // Check if the segment starts within the block's time range
                    if (segStartT >= blockStart.getTime() && segStartT < blockEnd.getTime()) {
                        bestBlock = block;
                        // IMPORTANT: Rate blocks must be sorted by priority (most specific first) 
                        // as the first match is used to apply the fee.
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
        // Prevent calculation if entry is after exit
        if (this.entryDateTime.getTime() >= this.exitDateTime.getTime()) {
            return 0.00;
        }
        return this._calculateFee();
    }
}

module.exports = { ParkingFeeComputer3 };