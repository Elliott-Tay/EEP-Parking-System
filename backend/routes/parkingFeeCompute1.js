/**
 * ParkingFeeComputer
 * Computes parking fees based on entry/exit times and a detailed set of fee models,
 * filtering rates by vehicle type and the requested rate type (e.g., "Hourly", "Day Season", "Night Season").
 */
class ParkingFeeComputer {
    
    /**
     * @param {string} entryDateTime - ISO string or date representation of entry.
     * @param {string} exitDateTime - ISO string or date representation of exit.
     * @param {Array<Object>} feeModels - The detailed rate blocks, must include rate_type.
     * @param {Object} rate_types - A map for rate type normalization (unused in main logic, but kept for future).
     * @param {Array<string>} publicHolidays - Array of ISO date strings for public holidays (e.g., 'YYYY-MM-DD').
     */
    constructor(entryDateTime, exitDateTime, feeModels, rate_types, publicHolidays = []) {
        this.entryDateTime = new Date(entryDateTime);
        this.exitDateTime = new Date(exitDateTime);

        // Store and normalize the rate type map
        this.rateTypes = {};
        if (rate_types && typeof rate_types === 'object') {
            for (const key in rate_types) {
                this.rateTypes[key] = String(rate_types[key]).toLowerCase();
            }
        }
        
        // Expand day ranges ('All day', 'Mon-Fri') into individual day models
        this.feeModels = this.expandFeeModels(feeModels);
        
        // Normalize public holidays to LOCAL YYYY-MM-DD string for consistent lookup.
        this.publicHolidays = publicHolidays.map(d => this.getLocalISODate(new Date(d)));
    }

    /**
     * Expands fee models with day ranges (like "All day" or "Mon-Fri") into individual day models.
     * @param {Array<Object>} feeModels - The original rate blocks.
     * @returns {Array<Object>} The expanded rate blocks.
     */
    expandFeeModels(feeModels) {
        const dayIndices = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
        const indexToDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const expandedModels = [];

        for (const model of feeModels) {
            const dayRange = model.day_of_week;

            if (dayRange === "All day") {
                // Expand "All day" to Mon-Sun
                for (let i = 0; i < 7; i++) {
                    const day = indexToDay[i];
                    expandedModels.push({ ...model, day_of_week: day });
                }
            } else if (dayRange.includes('-')) {
                // Handle complex day ranges (e.g., Mon-Fri)
                const parts = dayRange.split('-');
                const startIndex = dayIndices[parts[0]];
                let endIndex = dayIndices[parts[1]];

                if (startIndex !== undefined && endIndex !== undefined) {
                    if (startIndex > endIndex) {
                        endIndex += 7; // Handle wrapping (e.g., Sat-Mon)
                    }
                    for (let i = startIndex; i <= endIndex; i++) {
                        const dayIndex = i % 7;
                        const day = indexToDay[dayIndex];
                        expandedModels.push({ ...model, day_of_week: day });
                    }
                } else {
                    expandedModels.push(model); 
                }
            } else {
                // Add single day or "PH" models directly
                expandedModels.push(model);
            }
        }
        return expandedModels;
    }
    
    /**
     * Returns the local date string (YYYY-MM-DD) for a Date object.
     * @param {Date} date - The Date object.
     * @returns {string} The local ISO date string.
     */
    getLocalISODate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Creates a new Date object at the start of a day and sets its time based on a string (HH:MM).
     * @param {Date} date - The base date for the day.
     * @param {string} timeStr - The time string (e.g., "14:30").
     * @returns {Date} The new Date object with time set.
     */
    addTime(date, timeStr) {
        const [hour, minute] = timeStr.split(":").map(Number);
        // Start from the beginning of the day of the provided date
        const newDate = new Date(date);
        newDate.setHours(hour, minute, 0, 0);
        return newDate;
    }

    /**
     * Helper to calculate fees for blocks that use a fixed rate regardless of duration (e.g., Authorized, Season).
     * @param {string} vehicleType 
     * @param {string} requestedRateType 
     * @returns {number} The fixed fee, or 0.00 if no matching model is found.
     */
    _calculateFixedFee(vehicleType, requestedRateType) {
        const entryDate = this.entryDateTime;
        const entryDayStr = this.getLocalISODate(entryDate);
        const entryDayOfWeek = this.publicHolidays.includes(entryDayStr) ? "PH" : entryDate.toLocaleString("en-US", { weekday: "short" });

        // Find the fixed rate model matching the vehicle, day, and rate type.
        const fixedRateModel = this.feeModels.find(
            (item) => item.vehicle_type === vehicleType
                && String(item.rate_type || '').toLowerCase() === requestedRateType
                // Match day of week or PH status
                && (item.day_of_week === entryDayOfWeek || item.day_of_week === entryDate.toLocaleString("en-US", { weekday: "short" }))
        );
        
        if (fixedRateModel) {
            // Return the fixed fee defined in the model's min_fee 
            return parseFloat(fixedRateModel.min_fee.toFixed(2));
        }
        
        // If a fixed rate was requested but no model matched for the current day, return 0.00.
        return 0.00;
    }

    /**
     * Helper for Hourly/Segmented Rate Calculation.
     * This handles multi-day, multi-segment calculation with daily maximums.
     */
    _calculateSegmentedHourlyFee(vehicleType, requestedRateType) {
        let totalFee = 0;
        let currentDay = new Date(this.entryDateTime);
        currentDay.setHours(0, 0, 0, 0);
        
        // Helper for single segment fee calculation
        const calculateSegmentFee = (block, durationMinutes) => {
            // If the rate is explicitly 0, return 0 immediately.
            if (block.min_fee === 0.00) return 0.00; 

            const billedUnitMinutes = block.every;
            // CRITICAL: Use Math.ceil to round up to the next full unit
            const billedUnits = Math.ceil(durationMinutes / billedUnitMinutes);
            
            if (billedUnits > 0) {
                let fee = billedUnits * block.min_fee;
                
                // Apply minimum charge if specified
                if (block.min_charge > 0 && fee < block.min_charge) {
                    fee = block.min_charge;
                }
                
                // Max charge is applied *daily*, not per segment, so we omit the max_charge check here.
                return fee;
            }
            return 0;
        };
        
        while (currentDay.getTime() < this.exitDateTime.getTime()) {
            const dayStart = new Date(currentDay);
            const nextDay = new Date(currentDay);
            nextDay.setDate(nextDay.getDate() + 1);
            nextDay.setHours(0, 0, 0, 0);
            
            // Determine the segment boundaries for the current day
            const segmentStart = this.entryDateTime.getTime() > dayStart.getTime() ? this.entryDateTime : dayStart;
            const segmentEnd = this.exitDateTime.getTime() < nextDay.getTime() ? this.exitDateTime : nextDay;

            if (segmentStart.getTime() >= segmentEnd.getTime()) {
                currentDay = nextDay;
                continue;
            }

            const dateStr = this.getLocalISODate(currentDay);
            const isPublicHoliday = this.publicHolidays.includes(dateStr);
            const dayOfWeek = isPublicHoliday ? "PH" : currentDay.toLocaleString("en-US", { weekday: "short" });

            // Filter blocks for the correct vehicle, day, AND requested rate type 
            let dailyBlocks = this.feeModels.filter(
                (item) => item.vehicle_type === vehicleType 
                && item.day_of_week === dayOfWeek
                && String(item.rate_type || '').toLowerCase() === requestedRateType
            );
            
            // Adjust filtering for actual day name vs. PH block definitions
            if (!isPublicHoliday) {
                dailyBlocks = dailyBlocks.filter(block => block.day_of_week !== "PH");
            } else {
                dailyBlocks = dailyBlocks.filter(block => block.day_of_week === "PH");
            }
            
            let boundaries = new Set();
            boundaries.add(segmentStart.getTime());
            boundaries.add(segmentEnd.getTime());
            
            let maxDailyCharge = 0;

            for (const block of dailyBlocks) {
                maxDailyCharge = Math.max(maxDailyCharge, block.max_charge || 0);

                const blockStart = this.addTime(currentDay, block.from_time);
                let blockEnd = this.addTime(currentDay, block.to_time);

                if (blockEnd.getTime() <= blockStart.getTime() && block.to_time !== block.from_time) {
                    blockEnd.setDate(blockEnd.getDate() + 1);
                }

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
                const checkDate = new Date(segStartT);
                
                // Find the rate block that applies to the segment
                for (const block of dailyBlocks) {
                    let blockStart = this.addTime(checkDate, block.from_time);
                    let blockEnd = this.addTime(checkDate, block.to_time);
                    
                    // Adjust for overnight blocks
                    if (blockEnd.getTime() <= blockStart.getTime() && block.to_time !== block.from_time) {
                        // Check if the current segment falls within the overnight block's wrap
                        let effectiveBlockStart = new Date(blockStart);
                        let effectiveBlockEnd = new Date(blockEnd);
                        
                        if (checkDate.getHours() >= blockStart.getHours()) {
                            effectiveBlockEnd.setDate(effectiveBlockEnd.getDate() + 1);
                        } else if (checkDate.getHours() < blockEnd.getHours()) {
                            effectiveBlockStart.setDate(effectiveBlockStart.getDate() - 1);
                        }

                        if (segStartT >= effectiveBlockStart.getTime() && segStartT < effectiveBlockEnd.getTime()) {
                            bestBlock = block;
                            break; 
                        }
                    } else if (segStartT >= blockStart.getTime() && segStartT < blockEnd.getTime()) {
                        bestBlock = block;
                        break; 
                    }
                }
                
                if (bestBlock) {
                    dailyFee += calculateSegmentFee(bestBlock, segDurationMinutes);
                }
            }

            // Apply daily maximum charge if defined
            if (maxDailyCharge > 0 && dailyFee > maxDailyCharge) {
                dailyFee = maxDailyCharge;
            }

            totalFee += dailyFee;
            currentDay = nextDay;
        }

        return parseFloat(totalFee.toFixed(2));
    }


    /**
     * Computes the parking fee based on the duration, vehicle type, and specified rate type.
     * @param {string} vehicleType - The type of vehicle (e.g., 'Car', 'Truck').
     * @param {string} rate_type - The specific rate type to use (e.g., 'Hourly', 'Day Season', 'Night Season').
     * @returns {number} The total parking fee.
     */
    computeParkingFee(vehicleType, rate_type) {
        
        const totalDurationMinutes = (this.exitDateTime.getTime() - this.entryDateTime.getTime()) / 60000;
        
        if (totalDurationMinutes <= 0) return 0.00;

        const requestedRateType = String(rate_type || '').toLowerCase();
        const entryDate = this.entryDateTime;
        const entryDayStr = this.getLocalISODate(entryDate);
        const entryTime = entryDate.getTime();
        const entryDayOfWeek = this.publicHolidays.includes(entryDayStr) ? "PH" : entryDate.toLocaleString("en-US", { weekday: "short" });
        
        // --- 1. Initial Grace Time Check (Applies to all rate types) ---
        let maxGrace = 0;
        
        for (const item of this.feeModels) {
            if (item.vehicle_type === vehicleType 
                && (item.day_of_week === entryDayOfWeek || item.day_of_week === entryDate.toLocaleString("en-US", { weekday: "short" }))
                && item.grace_time > 0
                && String(item.rate_type || '').toLowerCase() === requestedRateType
            ) {
                let blockStart = this.addTime(entryDate, item.from_time);
                let blockEnd = this.addTime(entryDate, item.to_time);

                // Handle overnight block matching for grace period
                if (blockEnd.getTime() <= blockStart.getTime() && item.to_time !== item.from_time) {
                    if (entryDate.getHours() < blockEnd.getHours()) {
                        blockStart.setDate(blockStart.getDate() - 1); 
                    } else {
                        blockEnd.setDate(blockEnd.getDate() + 1); 
                    }
                }

                if (entryTime >= blockStart.getTime() && entryTime < blockEnd.getTime()) {
                    maxGrace = Math.max(maxGrace, item.grace_time);
                }
            }
        }

        if (totalDurationMinutes <= maxGrace) {
            return 0.00; 
        }
        
        // --- 2. Rate Type Dispatcher ---
        const fixedRateTypes = ['season', 'cspt', 'block3', 'authorized'];
        const segmentedRateTypes = ['hourly', 'day season', 'night season']; 
        
        if (fixedRateTypes.includes(requestedRateType)) {
            // Category 1: Fixed/Flat Rate Calculation
            return this._calculateFixedFee(vehicleType, requestedRateType);
        } else if (segmentedRateTypes.includes(requestedRateType)) {
            // Category 2: Standard Segmented Hourly Rate (Hourly, Day Season, Night Season, etc.)
            return this._calculateSegmentedHourlyFee(vehicleType, requestedRateType);
        } else {
            // Fallback or unhandled rates
            console.error(`Unhandled rate type: ${requestedRateType}`);
            return 0.00;
        }
    }
}

module.exports = { ParkingFeeComputer };