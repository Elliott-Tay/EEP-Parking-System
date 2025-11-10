class ParkingFeeComputer {
  constructor(entryDateTime, exitDateTime, feeModels, publicHolidays = []) {
    this.entryDateTime = new Date(entryDateTime);
    this.exitDateTime = new Date(exitDateTime);
    
    // ⭐ NEW STEP: Expand day ranges into individual days
    this.feeModels = this.expandFeeModels(feeModels);
    
    // Normalize public holidays to LOCAL YYYY-MM-DD string for consistent lookup.
    this.publicHolidays = publicHolidays.map(d => this.getLocalISODate(new Date(d)));
  }

  // ⭐ NEW HELPER: To expand day ranges (like "Mon-Fri") into individual day entries.
  expandFeeModels(feeModels) {
    // Maps short names to their index (0=Sun, 6=Sat) for range checking
    const dayIndices = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
    const indexToDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const expandedModels = [];

    for (const model of feeModels) {
      const dayRange = model.day_of_week;
      const parts = dayRange.split('-');

      if (parts.length === 2) {
        // Handle range, e.g., "Mon-Fri" or "Mon-Wed"
        const startDay = parts[0];
        const endDay = parts[1];
        const startIndex = dayIndices[startDay];
        let endIndex = dayIndices[endDay];
        
        // Handle wrap-around ranges like "Fri-Mon" if needed, but for Mon-Fri/Sat-Sun this is sufficient
        if (startIndex === undefined || endIndex === undefined) {
             expandedModels.push(model); // Keep invalid/unrecognized range as is
             continue;
        }

        // Adjust for wrap-around days if needed (e.g., Sat-Sun is handled fine if order is correct)
        if (startIndex > endIndex) {
          endIndex += 7; // Treat range as wrapping over the week boundary
        }

        for (let i = startIndex; i <= endIndex; i++) {
          const dayIndex = i % 7;
          const day = indexToDay[dayIndex];
          // Create a new model for each specific day
          expandedModels.push({ ...model, day_of_week: day });
        }
      } else {
        // Keep single-day ("Mon", "Sat", "PH") entries as is
        expandedModels.push(model);
      }
    }
    return expandedModels;
  }
  
  // Helper to format date object into YYYY-MM-DD string using LOCAL time.
  getLocalISODate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper to add time (HH:MM:SS) to a date object (for block boundaries)
  addTime(date, timeStr) {
    const [hour, minute] = timeStr.split(":").map(Number);
    const newDate = new Date(date);
    // Set hours and minutes using local methods to align with currentDay's local midnight start
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
  }

  isHourlyRate(rateType) {
    return rateType?.toLowerCase() === "hourly";
  }

  isFixedCharge(rateType) {
    return rateType?.toLowerCase() === "fixed_charge";
  }

  computeParkingFee(vehicleType) {
    const totalDurationMinutes = (this.exitDateTime.getTime() - this.entryDateTime.getTime()) / 60000;
    
    // Safety check for entry after exit
    if (totalDurationMinutes <= 0) return 0;

    // --- 1. Initial Grace Time Setup and Short-Circuit ---
    const entryDate = new Date(this.entryDateTime);
    const entryDayStr = this.getLocalISODate(entryDate);
    const entryDayOfWeek = this.publicHolidays.includes(entryDayStr) ? "PH" : entryDate.toLocaleString("en-US", { weekday: "short" });

    // Filter models specifically for the expanded entry day
    const entryBlocks = this.feeModels.filter(
      (item) => item.vehicle_type === vehicleType && item.day_of_week === entryDayOfWeek
    );
    const maxGrace = entryBlocks.reduce((max, block) => Math.max(max, block.grace_time || 0), 0);
    
    // Final Short-circuit logic is critical to satisfy 1.1, B.2, and B.3
    if (totalDurationMinutes <= maxGrace) {
        return 0; 
    }
    
    let totalFee = 0;
    let currentDay = new Date(this.entryDateTime);
    currentDay.setHours(0, 0, 0, 0);
    
    // --- Day-by-Day Iteration ---
    while (currentDay.getTime() < this.exitDateTime.getTime()) {
      const dayStart = new Date(currentDay);
      const nextDay = new Date(currentDay);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      const dayEnd = nextDay; 

      const segmentStart = this.entryDateTime.getTime() > dayStart.getTime() ? this.entryDateTime : dayStart;
      const segmentEnd = this.exitDateTime.getTime() < dayEnd.getTime() ? this.exitDateTime : dayEnd;

      if (segmentStart.getTime() >= segmentEnd.getTime()) {
        currentDay = nextDay;
        continue;
      }

      const dateStr = this.getLocalISODate(currentDay);
      const isPublicHoliday = this.publicHolidays.includes(dateStr);
      const dayOfWeek = isPublicHoliday ? "PH" : currentDay.toLocaleString("en-US", { weekday: "short" });

      // 1. Filter all applicable blocks for the current day
      let dailyBlocks = this.feeModels.filter(
        (item) => {
          const effectiveStartStr = item.effective_start ? this.getLocalISODate(new Date(item.effective_start)) : null;
          const effectiveEndStr = item.effective_end ? this.getLocalISODate(new Date(item.effective_end)) : null;

          return item.vehicle_type === vehicleType &&
            item.day_of_week === dayOfWeek && 
            (!effectiveStartStr || dateStr >= effectiveStartStr) &&
            (!effectiveEndStr || dateStr <= effectiveEndStr);
        }
      );

      // ⭐ CRITICAL FIX: Enforce priority and exclusivity
      const hasPHBlock = dailyBlocks.some(block => block.day_of_week === "PH");
      const hasEffectiveDateBlock = dailyBlocks.some(block => block.effective_start || block.effective_end);

      if (hasPHBlock) {
        // PH blocks take absolute precedence over everything else for that day.
        dailyBlocks = dailyBlocks.filter(block => block.day_of_week === "PH");
      } else if (hasEffectiveDateBlock) {
        // Effective date blocks take precedence over general Mon/Tue/Wed blocks.
        dailyBlocks = dailyBlocks.filter(block => block.effective_start || block.effective_end);
      }
      // NOTE: We don't need a complex sort now, because the exclusive filtering handles the PH and Effective Date priority. 
      // If two Effective Date blocks exist (A.3 scenario), we still need to process them both, 
      // and the daily max logic will handle the conflict.

      // 2. Collect all unique boundary times (for time segmentation)
      let boundaries = new Set();
      boundaries.add(segmentStart.getTime());
      boundaries.add(segmentEnd.getTime());

      for (const block of dailyBlocks) {
        const blockStart = this.addTime(currentDay, block.from_time);
        let blockEnd = this.addTime(currentDay, block.to_time);
        if (blockEnd.getTime() <= blockStart.getTime() && block.to_time !== block.from_time) {
          blockEnd.setDate(blockEnd.getDate() + 1);
        }

        if (blockStart.getTime() > segmentStart.getTime() && blockStart.getTime() < segmentEnd.getTime()) {
          boundaries.add(blockStart.getTime());
        }
        if (blockEnd.getTime() > segmentStart.getTime() && blockEnd.getTime() < segmentEnd.getTime()) {
          boundaries.add(blockEnd.getTime());
        }
      }

      const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);
      let dailyFee = 0;
      let appliedFixedCharges = new Set(); 

      // 3. Iterate through the time segments (Only the best block is considered per segment)
      for (let i = 0; i < sortedBoundaries.length - 1; i++) {
        const segStartT = sortedBoundaries[i];
        const segEndT = sortedBoundaries[i + 1];

        const segDurationMinutes = (segEndT - segStartT) / 60000;
        if (segDurationMinutes <= 0) continue;
        
        // Find the single best block for this segment
        let bestBlock = null;
        // Using the start of the segment to check for the block
        const checkTime = segStartT;

        // We iterate through the *already filtered* dailyBlocks
        for (const block of dailyBlocks) {
          const blockStart = this.addTime(currentDay, block.from_time);
          let blockEnd = this.addTime(currentDay, block.to_time);
          if (blockEnd.getTime() <= blockStart.getTime() && block.to_time !== block.from_time) {
            blockEnd.setDate(blockEnd.getDate() + 1);
          }

          // Check if the block is active at the segment start time
          if (checkTime >= blockStart.getTime() && checkTime < blockEnd.getTime()) {
            bestBlock = block;
            break; 
          }
        }
        
        if (bestBlock && this.isHourlyRate(bestBlock.rate_type)) {
            let fee = 0;
            const billedUnitMinutes = bestBlock.every;
            
            // Standard rounding
            const billedUnits = Math.ceil(segDurationMinutes / billedUnitMinutes);
            
            if (billedUnits > 0) {
                fee = billedUnits * bestBlock.min_fee;
                
                // Apply block minimum charge for the first unit
                if (bestBlock.min_charge > 0 && fee < bestBlock.min_charge) {
                    fee = bestBlock.min_charge;
                }
            }
            
            dailyFee += fee;
        } else if (bestBlock && this.isFixedCharge(bestBlock.rate_type)) {
            // Apply Fixed Charge once per block duration per day
            const fixedChargeKey = `${bestBlock.from_time}-${bestBlock.to_time}-${bestBlock.min_fee}`;
            
            if (!appliedFixedCharges.has(fixedChargeKey)) {
                dailyFee += bestBlock.min_fee;
                appliedFixedCharges.add(fixedChargeKey);
            }
        }
      }

      // 4. Apply Daily Max Charge
      // Logic for A.3 is handled here: it finds the lowest max_charge among the *filtered* applicable blocks.
      let dailyMaxCharge = dailyBlocks.reduce((max, block) => {
        return (block.max_charge > 0) ? Math.min(max, block.max_charge) : Infinity;
      }, Infinity);
      dailyMaxCharge = dailyMaxCharge === Infinity ? null : dailyMaxCharge;

      if (dailyMaxCharge !== null && dailyFee > dailyMaxCharge) {
        dailyFee = dailyMaxCharge;
      }

      totalFee += dailyFee;
      currentDay = nextDay;
    }

    return parseFloat(totalFee.toFixed(2));
  }
}

module.exports = { ParkingFeeComputer };