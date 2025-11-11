class ParkingFeeComputer {
    constructor(entryDateTime, exitDateTime, feeModels, rate_types, publicHolidays = []) {
        this.entryDateTime = new Date(entryDateTime);
        this.exitDateTime = new Date(exitDateTime);

        // Store and normalize the rate type map (minimal use here, but kept for robustness)
        this.rateTypes = {};
        if (rate_types && typeof rate_types === 'object') {
            for (const key in rate_types) {
                // Ensure rate_types (e.g., "hourly") are mapped to the correct value (e.g., "Hourly")
                this.rateTypes[key] = String(rate_types[key]).toLowerCase();
            }
        }
        
        // Expand day ranges ('All day') into individual days
        this.feeModels = this.expandFeeModels(feeModels);
        
        // Normalize public holidays to LOCAL YYYY-MM-DD string for consistent lookup.
        this.publicHolidays = publicHolidays.map(d => this.getLocalISODate(new Date(d)));
    }

    /**
     * Expands fee models with day ranges (like "All day" or "Mon-Fri") into individual day models.
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
                        endIndex += 7; 
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
     */
    getLocalISODate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Creates a new Date object at the start of a day and sets its time.
     */
    addTime(date, timeStr) {
        const [hour, minute] = timeStr.split(":").map(Number);
        // Start from the beginning of the day of the provided date
        const newDate = new Date(date);
        newDate.setHours(hour, minute, 0, 0);
        return newDate;
    }

    /**
     * Checks if a model's rate_type matches a semantic name (simplified for hourly focus).
     */
    isRateType(rateType, semanticName) {
        if (!rateType || !semanticName) return false;
        // In this hourly focus, we only care if it's "Hourly" (case-insensitive)
        return rateType.toLowerCase().replace(/[\s_]/g, '') === semanticName;
    }


    computeParkingFee(vehicleType) {
        const totalDurationMinutes = (this.exitDateTime.getTime() - this.entryDateTime.getTime()) / 60000;
        
        if (totalDurationMinutes <= 0) return 0.00;

        let totalFee = 0;
        let currentDay = new Date(this.entryDateTime);
        currentDay.setHours(0, 0, 0, 0);

        // --- Helper for Hourly Calculation ---
        const calculateHourlyFee = (block, durationMinutes) => {
            const billedUnitMinutes = block.every;
            // CRITICAL: Use Math.ceil to round up to the next full unit
            const billedUnits = Math.ceil(durationMinutes / billedUnitMinutes);
            
            if (billedUnits > 0) {
                let fee = billedUnits * block.min_fee;
                
                // For simplified hourly models, min_charge is mostly redundant if min_fee is the unit rate.
                // We keep the logic for standard unit billing:
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
        const entryDayOfWeek = this.publicHolidays.includes(entryDayStr) ? "PH" : entryDate.toLocaleString("en-US", { weekday: "short" });
        const entryTime = entryDate.getTime();

        let maxGrace = 0;
        
        for (const item of this.feeModels) {
            if (item.vehicle_type === vehicleType && item.day_of_week === entryDayOfWeek && item.grace_time > 0) {
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
        
        // --- 2. Day-by-Day Iteration & Time Segmentation ---
        while (currentDay.getTime() < this.exitDateTime.getTime()) {
            const dayStart = new Date(currentDay);
            const nextDay = new Date(currentDay);
            nextDay.setDate(nextDay.getDate() + 1);
            nextDay.setHours(0, 0, 0, 0);
            
            const segmentStart = this.entryDateTime.getTime() > dayStart.getTime() ? this.entryDateTime : dayStart;
            const segmentEnd = this.exitDateTime.getTime() < nextDay.getTime() ? this.exitDateTime : nextDay;

            if (segmentStart.getTime() >= segmentEnd.getTime()) {
                currentDay = nextDay;
                continue;
            }

            const dateStr = this.getLocalISODate(currentDay);
            const isPublicHoliday = this.publicHolidays.includes(dateStr);
            const dayOfWeek = isPublicHoliday ? "PH" : currentDay.toLocaleString("en-US", { weekday: "short" });

            // Filter blocks for the correct vehicle and day (PH or Mon/Tue/etc)
            let dailyBlocks = this.feeModels.filter(
                (item) => item.vehicle_type === vehicleType && item.day_of_week === dayOfWeek
            );
            
            // Public Holiday blocks always override.
            if (!isPublicHoliday) {
                dailyBlocks = dailyBlocks.filter(block => block.day_of_week !== "PH");
            } else {
                 dailyBlocks = dailyBlocks.filter(block => block.day_of_week === "PH");
            }
            
            // 3. Collect all unique boundary times (Day/Night transition times)
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
                const checkDate = new Date(segStartT); // Use the segment's actual date
                
                // Find the rate block that applies to the segment
                for (const block of dailyBlocks) {
                    // Determine the block's actual start and end time in context of the segment's date
                    let blockStart = this.addTime(checkDate, block.from_time);
                    let blockEnd = this.addTime(checkDate, block.to_time);
                    
                    // CRITICAL OVERNIGHT FIX: Map the block's boundaries based on the segment time
                    if (blockEnd.getTime() <= blockStart.getTime() && block.to_time !== block.from_time) {
                        if (checkDate.getHours() < blockEnd.getHours()) {
                            // Morning segment (e.g., 01:00 AM) -> block started yesterday.
                            blockStart.setDate(blockStart.getDate() - 1); 
                        } else { 
                            // Evening segment (e.g., 23:00 PM) -> block ends tomorrow.
                            blockEnd.setDate(blockEnd.getDate() + 1); 
                        }
                    }
                    
                    // If the segment starts within the block's time range
                    if (segStartT >= blockStart.getTime() && segStartT < blockEnd.getTime()) {
                        bestBlock = block;
                        // Since all rates are "Hourly" in this focus, the first matching block is the one.
                        break; 
                    }
                }
                
                if (bestBlock) {
                    const rateTypeName = bestBlock.rate_type ? String(bestBlock.rate_type).toLowerCase() : '';

                    // Check for "Season" or "Seasonal" rate type to apply $0 fee
                    if (rateTypeName === 'season' || rateTypeName === 'seasonal') {
                        // Fee is $0 for this segment
                    } else {
                        // Standard hourly calculation for other rate types
                        dailyFee += calculateHourlyFee(bestBlock, segDurationMinutes);
                    }
                }
            }

            totalFee += dailyFee;
            currentDay = nextDay;
        }

        return parseFloat(totalFee.toFixed(2));
    }
}

module.exports = { ParkingFeeComputer };