class ParkingFeeComputer {
  constructor(entryDateTime, exitDateTime, feeModels, publicHolidays = []) {
    this.entryDateTime = new Date(entryDateTime);
    this.exitDateTime = new Date(exitDateTime);
    this.feeModels = feeModels;
    // Normalize public holidays to LOCAL YYYY-MM-DD string for consistent lookup.
    this.publicHolidays = publicHolidays.map(d => this.getLocalISODate(new Date(d)));
  }
  
  // Helper to format date object into YYYY-MM-DD string using LOCAL time.
  getLocalISODate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  computeParkingFee(vehicleType) {
    const totalDurationMinutes = (this.exitDateTime.getTime() - this.entryDateTime.getTime()) / 60000;

    // 1. Determine Max Grace Time for the entire entry (based on entry day)
    const entryDate = new Date(this.entryDateTime);
    
    // Use local date string for PH check (consistent with the new constructor normalization)
    const entryDayStr = this.getLocalISODate(entryDate);
    
    const entryDayOfWeek = this.publicHolidays.includes(entryDayStr)
      ? "PH"
      : entryDate.toLocaleString("en-US", { weekday: "short" });

    const entryBlocks = this.feeModels.filter(
      (item) => item.vehicle_type === vehicleType && item.day_of_week === entryDayOfWeek
    );
    const maxGrace = entryBlocks.reduce((max, block) => Math.max(max, block.grace_time || 0), 0);

    // If total parking time is within the maximum applicable grace period, return 0.
    if (totalDurationMinutes <= maxGrace) {
      return 0;
    }

    let totalFee = 0;
    
    // Initialize currentDay to the LOCAL start of the entry day (midnight).
    let currentDay = new Date(this.entryDateTime);
    currentDay.setHours(0, 0, 0, 0);

    // Determine if the entire stay is a multi-day stay (exit is after midnight of entry day)
    const entryDayMidnight = new Date(this.entryDateTime);
    entryDayMidnight.setDate(entryDayMidnight.getDate() + 1);
    entryDayMidnight.setHours(0, 0, 0, 0);
    const isMultiDayStay = this.exitDateTime.getTime() > entryDayMidnight.getTime();

    // Iterate day by day until the start of the current day is after the exit time
    while (currentDay.getTime() < this.exitDateTime.getTime()) {
      
        const dayStart = new Date(currentDay);
        
        // Calculate the midnight of the next day (exclusive boundary for the current day)
        const nextDay = new Date(currentDay);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0); // Explicitly ensure nextDay is exactly midnight
        const dayEnd = nextDay; 

      // Determine the parking segment for this specific day
      // Segment starts at entry time (if on the first day) or midnight (otherwise)
      const segmentStart = this.entryDateTime.getTime() > dayStart.getTime() ? this.entryDateTime : dayStart;
      // Segment ends at exit time (if on the last day) or midnight (otherwise)
      const segmentEnd = this.exitDateTime.getTime() < dayEnd.getTime() ? this.exitDateTime : dayEnd;

      // If the segment start is after or equal to the segment end, move on.
      if (segmentStart.getTime() >= segmentEnd.getTime()) {
        // Advance to the next day
        currentDay = nextDay;
        continue;
      }

      // Use local date string for PH check and effective date comparison
      const dateStr = this.getLocalISODate(currentDay);

      // Check if the current segment being processed falls on the entry day's calendar date
      const isCurrentDayTheEntryDay = this.getLocalISODate(segmentStart) === entryDayStr;

      const isPublicHoliday = this.publicHolidays.includes(dateStr);
      
      // Get the day of week. If it's a PH, use "PH", otherwise use the local weekday abbreviation.
      const dayOfWeek = isPublicHoliday
        ? "PH"
        : currentDay.toLocaleString("en-US", { weekday: "short" });

      // Filter blocks applicable for this vehicle and day, within the effective dates
      const dailyBlocks = this.feeModels.filter(
        (item) => {
            // Use local date string for effective dates for consistent calendar day checking.
            const effectiveStartStr = item.effective_start ? this.getLocalISODate(new Date(item.effective_start)) : null;
            const effectiveEndStr = item.effective_end ? this.getLocalISODate(new Date(item.effective_end)) : null;

            return item.vehicle_type === vehicleType &&
              item.day_of_week === dayOfWeek &&
                // Compare YYYY-MM-DD strings for effective dates to be inclusive of the entire day
              (!effectiveStartStr || dateStr >= effectiveStartStr) &&
              (!effectiveEndStr || dateStr <= effectiveEndStr);
          }
      );

      // Find the daily max charge (lowest non-zero max_charge from applicable blocks)
      let dailyMaxCharge = dailyBlocks.reduce((max, block) => {
        return (block.max_charge > 0) ? Math.min(max, block.max_charge) : max;
      }, Infinity);

      // If no block defined a max charge, set to null (no cap)
      dailyMaxCharge = dailyMaxCharge === Infinity ? null : dailyMaxCharge;

      let dailyFee = 0; // accumulate fee per day

      for (const block of dailyBlocks) {
        // Construct block boundaries using the currentDay (local midnight) and block times
        const blockStart = this.addTime(currentDay, block.from_time);
        let blockEnd = this.addTime(currentDay, block.to_time); // Use 'let' to allow modification

        // FIX for Midnight Crossover: Advance blockEnd if it's logically on the next day
        if (blockEnd.getTime() <= blockStart.getTime() && block.to_time !== block.from_time) {
            blockEnd.setDate(blockEnd.getDate() + 1);
        }

        // Determine overlap with actual parking segment
        const start = segmentStart.getTime() > blockStart.getTime() ? segmentStart : blockStart;
        const end = segmentEnd.getTime() < blockEnd.getTime() ? segmentEnd : blockEnd;

        if (start.getTime() >= end.getTime()) continue; // no overlap

        let durationMinutes = (end.getTime() - start.getTime()) / 60000;

        let fee = 0;

        // Hourly calculation based on rounding up to 'every' minutes
        if (this.isHourlyRate(block.rate_type)) {
          // Calculate billed units (e.g., minutes / 60, rounded up)
          const billedUnits = Math.ceil(durationMinutes / block.every);
          fee = billedUnits * block.min_fee;
        } 
        
        // Apply block minimum charge (before daily max)
        if (block.min_charge > 0 && fee < block.min_charge) {
          fee = block.min_charge;
        }
        
        dailyFee += fee;
      }

      // 2. Apply Daily Max Charge
      if (dailyMaxCharge !== null) {
        
        // This logic ensures the daily max is only applied as a CAP when calculated charges 
        // (dailyFee) meet or exceed it, as requested. The minimum floor enforcement 
        // for Day 1 of a multi-day stay has been removed.
        if (dailyFee > dailyMaxCharge) {
          dailyFee = dailyMaxCharge;
        }
      }

      totalFee += dailyFee;
      // Advance to the next day
      currentDay = nextDay;
    }

    return totalFee;
  }

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

  isPerEntryRate(rateType) {
    return rateType?.toLowerCase() === "perentry";
  }

  isHourlyOverlap(rateType) {
    return rateType?.toLowerCase() === "hourlyoverlap";
  }

  isPerEntryOverlap(rateType) {
    return rateType?.toLowerCase() === "perentryoverlap";
  }
}

module.exports = { ParkingFeeComputer };
