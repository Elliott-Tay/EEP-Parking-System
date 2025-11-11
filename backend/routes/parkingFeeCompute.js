/**
 * ParkingFeeComputer
 * * Computes parking fees based on entry/exit times and a detailed set of fee models,
 * filtering rates by vehicle type and the requested rate type (e.g., "Hourly", "Day Season", "Night Season").
 * * NOTE: Fee models must include 'rate_type', 'vehicle_type', 'day_of_week', 
 * 'from_time', 'to_time', 'every' (billing unit in minutes), 'min_fee' (rate per unit), 
 * and optional 'grace_time'.
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
     * Computes the parking fee based on the duration, vehicle type, and specified rate type.
     * @param {string} vehicleType - The type of vehicle (e.g., 'Car', 'Truck').
     * @param {string} rate_type - The specific rate type to use (e.g., 'Hourly', 'Day Season', 'Night Season').
     * @returns {number} The total parking fee.
     */
    computeParkingFee(vehicleType, rate_type) {
        const totalDurationMinutes = (this.exitDateTime.getTime() - this.entryDateTime.getTime()) / 60000;
        
        if (totalDurationMinutes <= 0) return 0.00;

        let totalFee = 0;
        
        // Normalize rate type for comparison
        const requestedRateType = String(rate_type || '').toLowerCase();
        
        // --- Helper for Hourly Calculation ---
        const calculateHourlyFee = (block, durationMinutes) => {
            const billedUnitMinutes = block.every;
            // CRITICAL: Use Math.ceil to round up to the next full unit
            const billedUnits = Math.ceil(durationMinutes / billedUnitMinutes);
            
            if (billedUnits > 0) {
                let fee = billedUnits * block.min_fee;
                
                // Apply minimum charge if specified and fee is less
                if (block.min_charge > 0 && fee < block.min_charge) {
                    fee = block.min_charge;
                }
                return fee;
            }
            return 0;
        };
        
        // --- 1. Initial Grace Time Check ---
        const entryDate = new Date(this.entryDateTime);
        const entryDayStr = this.getLocalISODate(entryDate);
        // Determine day type for entry
        const entryDayOfWeek = this.publicHolidays.includes(entryDayStr) ? "PH" : entryDate.toLocaleString("en-US", { weekday: "short" });
        const entryTime = entryDate.getTime();

        let maxGrace = 0;
        
        // Find maximum grace time that applies to the entry time, vehicle, day, and rate type
        for (const item of this.feeModels) {
            if (item.vehicle_type === vehicleType 
                && item.day_of_week === entryDayOfWeek 
                && item.grace_time > 0
                // Match the requested rate type for the grace period check
                && String(item.rate_type || '').toLowerCase() === requestedRateType
            ) {
                let blockStart = this.addTime(entryDate, item.from_time);
                let blockEnd = this.addTime(entryDate, item.to_time);

                // Handle overnight block matching for grace period
                if (blockEnd.getTime() <= blockStart.getTime() && item.to_time !== item.from_time) {
                    if (entryDate.getHours() < blockEnd.getHours()) {
                        blockStart.setDate(blockStart.getDate() - 1); // Started yesterday
                    } else {
                        blockEnd.setDate(blockEnd.getDate() + 1); // Ends tomorrow
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
        
        // --- 2. Fixed/Flat Rate Override Check (Applies to single-charge rates like 'Season', 'CSPT', 'Block3', 'Authorized') ---
        // Note: 'Day Season' and 'Night Season' are calculated hourly in Step 3.
        const fixedRateTypes = ['season', 'cspt', 'block3', 'authorized']; 
        
        if (fixedRateTypes.includes(requestedRateType)) {
            // Find the fixed rate model matching the vehicle, day, and rate type.
            const fixedRateModel = this.feeModels.find(
                (item) => item.vehicle_type === vehicleType
                    && String(item.rate_type || '').toLowerCase() === requestedRateType
                    // Match day of week or PH status
                    && item.day_of_week === entryDayOfWeek
            );
            
            if (fixedRateModel) {
                // Return the fixed fee defined in the model's min_fee 
                return parseFloat(fixedRateModel.min_fee.toFixed(2));
            }
            
            // If a fixed rate was requested but no model matched for the current day, return 0.00.
            return 0.00;
        }

        // --- 3. Default: Hourly/Segmented Calculation (Handles 'Hourly', 'Day Season', and 'Night Season') ---
        // These rates are calculated minute-by-minute/unit-by-unit based on which time blocks apply during the stay.
        let currentDay = new Date(this.entryDateTime);
        currentDay.setHours(0, 0, 0, 0);
        
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

            // CRITICAL STEP: Filter blocks for the correct vehicle, day, AND requested rate type 
            // (e.g., 'Hourly', 'Day Season', or 'Night Season')
            let dailyBlocks = this.feeModels.filter(
                (item) => item.vehicle_type === vehicleType 
                && item.day_of_week === dayOfWeek
                && String(item.rate_type || '').toLowerCase() === requestedRateType
            );
            
            // Filter blocks to match Public Holiday status
            if (!isPublicHoliday) {
                dailyBlocks = dailyBlocks.filter(block => block.day_of_week !== "PH");
            } else {
                dailyBlocks = dailyBlocks.filter(block => block.day_of_week === "PH");
            }
            
            // 3. Collect all unique boundary times (start/end of segment and rate block times)
            let boundaries = new Set();
            boundaries.add(segmentStart.getTime());
            boundaries.add(segmentEnd.getTime());

            for (const block of dailyBlocks) {
                const blockStart = this.addTime(currentDay, block.from_time);
                let blockEnd = this.addTime(currentDay, block.to_time);

                // Adjust blockEnd if it's an overnight block
                if (blockEnd.getTime() <= blockStart.getTime() && block.to_time !== block.from_time) {
                    blockEnd.setDate(blockEnd.getDate() + 1);
                }

                // Add start/end times if they fall within the segment
                if (blockStart.getTime() > segmentStart.getTime() && blockStart.getTime() < segmentEnd.getTime()) {
                    boundaries.add(blockStart.getTime());
                }
                if (blockEnd.getTime() > segmentStart.getTime() && blockEnd.getTime() < segmentEnd.getTime()) {
                    boundaries.add(blockEnd.getTime());
                }
            }
            
            const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);
            let dailyFee = 0;

            // 4. Iterate through the generated time segments
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
                    
                    // CRITICAL OVERNIGHT FIX: Map the block's boundaries based on the segment time
                    if (blockEnd.getTime() <= blockStart.getTime() && block.to_time !== block.from_time) {
                        if (checkDate.getHours() < blockEnd.getHours()) {
                            // Morning segment -> block started yesterday.
                            blockStart.setDate(blockStart.getDate() - 1); 
                        } else { 
                            // Evening segment -> block ends tomorrow.
                            blockEnd.setDate(blockEnd.getDate() + 1); 
                        }
                    }
                    
                    // If the segment starts within the block's time range
                    if (segStartT >= blockStart.getTime() && segStartT < blockEnd.getTime()) {
                        bestBlock = block;
                        break; 
                    }
                }
                
                if (bestBlock) {
                    // Apply the hourly calculation using the unit fee from the best block
                    dailyFee += calculateHourlyFee(bestBlock, segDurationMinutes);
                }
            }

            totalFee += dailyFee;
            currentDay = nextDay;
        }

        // Return the total fee, formatted to two decimal places.
        return parseFloat(totalFee.toFixed(2));
    }
}

// Export the class for use in other files
module.exports = { ParkingFeeComputer };