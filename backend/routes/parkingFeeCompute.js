class ParkingFeeComputer {
  constructor(entryDateTime, exitDateTime, feeModels, publicHolidays = []) {
    this.entryDateTime = new Date(entryDateTime);
    this.exitDateTime = new Date(exitDateTime);
    this.feeModels = feeModels;
    // Normalize public holidays to YYYY-MM-DD
    this.publicHolidays = publicHolidays.map(d => new Date(d).toISOString().split("T")[0]);
  }

  computeParkingFee(vehicleType) {
    const totalDurationMinutes = (this.exitDateTime - this.entryDateTime) / 60000;

    // 1. Determine Max Grace Time for the entire entry
    const entryDayStr = this.entryDateTime.toISOString().split("T")[0];
    const entryDayOfWeek = this.publicHolidays.includes(entryDayStr)
      ? "PH"
      : this.entryDateTime.toLocaleString("en-US", { weekday: "short" });

    const entryBlocks = this.feeModels.filter(
      (item) => item.vehicle_type === vehicleType && item.day_of_week === entryDayOfWeek
    );
    const maxGrace = entryBlocks.reduce((max, block) => Math.max(max, block.grace_time || 0), 0);

    // If total parking time is within the maximum applicable grace period, return 0.
    if (totalDurationMinutes <= maxGrace) {
      return 0;
    }

    let totalFee = 0;
    let currentDay = new Date(this.entryDateTime);
    currentDay.setHours(0, 0, 0, 0); // Start of the current day being processed

    // Iterate day by day
    while (currentDay.getTime() <= this.exitDateTime.getTime()) {
      const dayStart = new Date(currentDay);
      const dayEnd = new Date(currentDay);
      dayEnd.setHours(23, 59, 59, 999);

      // Determine the parking segment for this specific day
      const segmentStart = this.entryDateTime > dayStart ? this.entryDateTime : dayStart;
      const segmentEnd = this.exitDateTime < dayEnd ? this.exitDateTime : dayEnd;

      // If the segment start is after the segment end (e.g., if we skipped the entry date), move on.
      if (segmentStart.getTime() > segmentEnd.getTime()) {
        currentDay.setDate(currentDay.getDate() + 1);
        continue;
      }

      const dateStr = segmentStart.toISOString().split("T")[0];
      const isPublicHoliday = this.publicHolidays.includes(dateStr);
      const dayOfWeek = isPublicHoliday
        ? "PH"
        : segmentStart.toLocaleString("en-US", { weekday: "short" });

      // Filter blocks applicable for this vehicle and day, within the effective dates
      const dailyBlocks = this.feeModels.filter(
        (item) =>
          item.vehicle_type === vehicleType &&
          item.day_of_week === dayOfWeek &&
          (!item.effective_start || new Date(item.effective_start) <= segmentEnd) &&
          (!item.effective_end || new Date(item.effective_end) >= segmentStart)
      );

      // Find the daily max charge (lowest non-zero max_charge from applicable blocks)
      let dailyMaxCharge = dailyBlocks.reduce((max, block) => {
        return (block.max_charge > 0) ? Math.min(max, block.max_charge) : max;
      }, Infinity);

      // If no block defined a max charge, set to null (no cap)
      dailyMaxCharge = dailyMaxCharge === Infinity ? null : dailyMaxCharge;

      let dailyFee = 0; // accumulate fee per day

      for (const block of dailyBlocks) {
        const blockStart = this.addTime(currentDay, block.from_time);
        const blockEnd = this.addTime(currentDay, block.to_time);

        // Determine overlap with actual parking segment
        const start = segmentStart > blockStart ? segmentStart : blockStart;
        const end = segmentEnd < blockEnd ? segmentEnd : blockEnd;

        if (start >= end) continue; // no overlap

        let durationMinutes = (end - start) / 60000;

        // NOTE: Grace time is handled for the entire entry at the beginning,
        // so we assume any parking time here is billable.

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
      if (dailyMaxCharge !== null && dailyFee > dailyMaxCharge) {
        dailyFee = dailyMaxCharge;
      }

      totalFee += dailyFee;
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return totalFee;
  }

  addTime(date, timeStr) {
    const [hour, minute] = timeStr.split(":").map(Number);
    const newDate = new Date(date);
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
