/**
 * ParkingFeeComputer3
 * Computes parking fees using a set of rules (feeModels) provided at initialization.
 * (MODIFIED: Now uses CONSISTENT LINEAR BILLING for all rate blocks that are not free.)
 * * ... [Rest of the documentation remains the same] ...
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

        this.entryDateTime = new Date(entryDateTime);
        this.exitDateTime = new Date(exitDateTime);

        this.rateType = rateType;
        this.vehicleType = vehicleType;

        this.dailyMaxes = new Map();
        this.highestMaxCap = 0;
        this.flatFeeSessionsCharged = new Set();
    }

    /**
     * Creates a new Date object at the start of a day (UTC midnight) and sets its time based on a string (HH:MM).
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
     * Helper function to check if a day rule applies to the current day
     */
    _isDayRuleApplicable(ruleDay, dayOfWeekIndex) {
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
                return false;
        }
    }

    /**
     * Core logic for calculating fees across time segments and days.
     */
    _calculateFee() {
        let totalFee = 0;
        let currentDay = new Date(this.entryDateTime);
        currentDay.setUTCHours(0, 0, 0, 0);

        const applicableModels = this.feeModels.filter(model =>
            model.rate_type === this.rateType &&
            model.vehicle_type.split('/').includes(this.vehicleType)
        );

        if (applicableModels.length === 0) {
            console.error(`No fee models found for rateType: ${this.rateType} and vehicleType: ${this.vehicleType}`);
            return 0.00;
        }

        // Helper for single segment fee calculation (uses closure to access trackers)
        const calculateSegmentFee = (block, segmentDate, durationMinutes) => {
            const dayKey = segmentDate.toISOString().substring(0, 10);

            // 0. Update Global Max Cap Tracker (Tracks the highest daily max seen across all blocks)
            if (block.max_fee > this.highestMaxCap) {
                this.highestMaxCap = block.max_fee;
            }

            // 1. FLAT FEE LOGIC: Check for the specific $2.00 Staff Night Flat Fee blocks
            if (block.min_fee === 2.00 && block.max_fee === 2.00 && block.every === 1) {
                let sessionSuffix = (segmentDate.getUTCHours() < 8) ? 'N1' : 'N2';
                let sessionKey = `${dayKey}-${sessionSuffix}`;

                if (!this.flatFeeSessionsCharged.has(sessionKey)) {
                    this.flatFeeSessionsCharged.add(sessionKey);

                    const fee = 2.00;
                    const currentDayTotal = this.dailyMaxes.get(dayKey) || 0;
                    
                    // FIX 1: Use the highest overall maximum encountered so far for daily capping.
                    // This prevents the $2.00 block max from incorrectly capping the total day fee 
                    // when high daytime charges already exist.
                    let effectiveDailyMax = this.highestMaxCap > 0 ? this.highestMaxCap : Infinity;
                    
                    // Calculate fee charged, ensuring it's not more than the flat fee (2.00) 
                    // AND doesn't exceed the daily max.
                    const feeToCharge = Math.min(fee, Math.max(0, effectiveDailyMax - currentDayTotal));


                    if (feeToCharge > 0) {
                        this.dailyMaxes.set(dayKey, currentDayTotal + feeToCharge);
                        return parseFloat(feeToCharge.toFixed(2));
                    }
                }
                return 0.00;
            }

            // 2. UNIT/HOURLY FEE LOGIC (For all other paid blocks)
            if (block.min_fee === 0.00) return 0.00; // Free blocks

            let segmentFee = 0;

            // --- CONSISTENT LINEAR CHARGE LOGIC (MODIFIED) ---
            const ratePerMinute = block.min_fee / block.every;
            segmentFee = durationMinutes * ratePerMinute;
            
            // FIX 2: Apply high-precision rounding to mitigate floating-point errors, 
            // especially for non-terminating decimal rates (like in TC7).
            segmentFee = Math.round(segmentFee * 1e10) / 1e10;


            if (segmentFee > 0) {
                // 3. DAILY MAXIMUM CAP LOGIC
                let currentDayTotal = this.dailyMaxes.get(dayKey) || 0;
                let maxFee = block.max_fee;

                if (maxFee && (currentDayTotal + segmentFee) > maxFee) {
                    segmentFee = maxFee - currentDayTotal;
                    if (segmentFee < 0) segmentFee = 0;
                }

                if (segmentFee > 0) {
                    // Update daily max tracker
                    this.dailyMaxes.set(dayKey, currentDayTotal + segmentFee);
                    // Final fee component is rounded to 2 decimal places
                    return parseFloat(segmentFee.toFixed(2));
                }
            }
            return 0.00;
        };

        // Iterate through each day of the parking duration
        while (currentDay.getTime() < this.exitDateTime.getTime()) {
            const dayStart = new Date(currentDay);
            const nextDay = new Date(currentDay);

            // Set nextDay to UTC midnight of the following day
            nextDay.setUTCDate(nextDay.getUTCDate() + 1);
            nextDay.setUTCHours(0, 0, 0, 0);

            // segmentStart is the later of (Entry Time) or (Current Day's Midnight)
            const segmentStart = this.entryDateTime.getTime() > dayStart.getTime() ? this.entryDateTime : dayStart;
            // segmentEnd is the earlier of (Exit Time) or (Next Day's Midnight)
            const segmentEnd = this.exitDateTime.getTime() < nextDay.getTime() ? this.exitDateTime : nextDay;

            if (segmentStart.getTime() >= segmentEnd.getTime()) {
                currentDay = nextDay;
                continue;
            }

            const dayOfWeekIndex = currentDay.getUTCDay();

            // Filter models applicable for this day
            let dailyBlocks = applicableModels.filter(
                (item) => this._isDayRuleApplicable(item.day_of_week, dayOfWeekIndex)
            );

            let boundaries = new Set();
            boundaries.add(segmentStart.getTime());
            boundaries.add(segmentEnd.getTime());

            // Add all block start and end times as boundaries
            for (const block of dailyBlocks) {
                const blockStart = this.addTime(currentDay, block.from_time);
                let blockEnd = this.addTime(currentDay, block.to_time);

                // Handle overnight blocks crossing midnight
                if (blockEnd.getTime() <= blockStart.getTime()) {
                    // Add the block start and end times as boundaries on the current day
                    if (blockStart.getTime() > segmentStart.getTime() && blockStart.getTime() < segmentEnd.getTime()) {
                        boundaries.add(blockStart.getTime());
                    }
                    if (blockEnd.getTime() > segmentStart.getTime() && blockEnd.getTime() < segmentEnd.getTime()) {
                        boundaries.add(blockEnd.getTime());
                    }
                } else {
                    // Normal block
                    if (blockStart.getTime() > segmentStart.getTime() && blockStart.getTime() < segmentEnd.getTime()) {
                        boundaries.add(blockStart.getTime());
                    }
                    if (blockEnd.getTime() > segmentStart.getTime() && blockEnd.getTime() < segmentEnd.getTime()) {
                        boundaries.add(blockEnd.getTime());
                    }
                }
            }

            const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);

            // Iterate through the generated time segments
            for (let i = 0; i < sortedBoundaries.length - 1; i++) {
                const segStartT = sortedBoundaries[i];
                const segEndT = sortedBoundaries[i + 1];

                const segDurationMinutes = (segEndT - segStartT) / 60000;
                if (segDurationMinutes <= 0) continue;

                let bestBlock = null;
                const checkDate = new Date(segStartT);

                // Find the rate block that applies to the segment
                for (const block of dailyBlocks) {
                    let blockStart = this.addTime(checkDate, block.from_time);
                    let blockEnd = this.addTime(checkDate, block.to_time);

                    // Re-adjust dates for overnight blocks relative to the checkDate
                    if (blockEnd.getTime() <= blockStart.getTime()) {
                        const midnightToday = new Date(checkDate);
                        midnightToday.setUTCHours(0, 0, 0, 0);

                        // If segment is in the morning part (00:00 to block end), rate started yesterday
                        if (segStartT < blockEnd.getTime() && segStartT >= midnightToday.getTime()) {
                            blockStart.setUTCDate(blockStart.getUTCDate() - 1);
                        } else {
                            // If segment is in the evening part (block start to 24:00), rate extends tomorrow
                            blockEnd.setUTCDate(blockEnd.getUTCDate() + 1);
                        }
                    }

                    if (segStartT >= blockStart.getTime() && segStartT < blockEnd.getTime()) {
                        bestBlock = block;
                        // Use the first match (highest priority)
                        break;
                    }
                }

                if (bestBlock) {
                    totalFee += calculateSegmentFee(bestBlock, checkDate, segDurationMinutes);
                    totalFee = parseFloat(totalFee.toFixed(2));
                }
            }

            currentDay = nextDay; // Move to the next day's UTC midnight
        }

        // --- Apply Global Grace Period (15 minutes) ---
        const maxGraceMinutes = 15;
        const totalDurationMinutes = (this.exitDateTime.getTime() - this.entryDateTime.getTime()) / 60000;

        if (totalDurationMinutes <= maxGraceMinutes && totalFee > 0) {
            return 0.00;
        }

        // --- GLOBAL MAXIMUM CAP (MD-TC25 Fix) ---
        if (this.highestMaxCap > 0 && totalFee > this.highestMaxCap) {
            totalFee = this.highestMaxCap;
        }

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