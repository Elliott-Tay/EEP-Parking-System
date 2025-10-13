// src/utils/calculateFee.js

export function calculateParkingFee(entryTime, exitTime, vehicleType, tariffs) {
  if (!entryTime || !exitTime) {
    throw new Error("Missing entry or exit time");
  }

  const entryDate = new Date(entryTime);
  const exitDate = new Date(exitTime);

  if (exitDate < entryDate) {
    throw new Error("Exit time cannot be before entry time");
  }

  let totalFee = 0;
  const totalMinutes = (exitDate - entryDate) / (1000 * 60);
  const totalHours = totalMinutes / 60;
  const daySummaries = [];

  let current = new Date(entryDate);

  while (current <= exitDate) {
    const dayStr = current.toLocaleString("en-US", { weekday: "short" });

    const dayTariffs = tariffs.filter(
      (t) =>
        t.vehicle_type === vehicleType &&
        (t.day_of_week === dayStr || t.day_of_week === "PH")
    );

    if (dayTariffs.length === 0) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }

    let dailyFee = 0;

    for (let t of dayTariffs) {
      let startH, startM;
      if (t.from_time.includes("T")) {
        [startH, startM] = t.from_time.split("T")[1].split(":").map(Number);
      } else {
        [startH, startM] = t.from_time.split(":").map(Number);
      }

      let endH, endM;
      if (t.to_time.includes("T")) {
          [endH, endM] = t.to_time.split("T")[1].split(":").map(Number);
      } else {
          [endH, endM] = t.to_time.split(":").map(Number);
      }

      const dayStart = new Date(current);
      dayStart.setHours(0, 0, 0, 0);

      const intervalStart = new Date(dayStart);
      intervalStart.setHours(startH, startM, 0, 0);
      const intervalEnd = new Date(dayStart);
      intervalEnd.setHours(endH, endM, 0, 0);

      const overlapStart = entryDate > intervalStart ? entryDate : intervalStart;
      const overlapEnd = exitDate < intervalEnd ? exitDate : intervalEnd;
      const overlapMinutes = Math.max(0, (overlapEnd - overlapStart) / (1000 * 60));

      if (overlapMinutes > 0) {
        const billingUnits = Math.ceil(overlapMinutes / t.every);
        let feeForInterval =
          (t.first_min_fee || 0) +
          (billingUnits > 1 ? (billingUnits - 1) * (t.min_fee || 0) : 0);

        if (feeForInterval < t.min_charge) feeForInterval = t.min_charge;
        if (feeForInterval > t.max_charge) feeForInterval = t.max_charge;

        dailyFee += feeForInterval;
      }
    }

    totalFee += dailyFee;

    daySummaries.push({
      day: current.toDateString(),
      fee: dailyFee.toFixed(2),
    });

    current.setDate(current.getDate() + 1);
    current.setHours(0, 0, 0, 0);
  }

  return {
    totalFee: parseFloat(totalFee.toFixed(2)),
    totalHours: parseFloat(totalHours.toFixed(2)),
    daySummaries,
  };
}
