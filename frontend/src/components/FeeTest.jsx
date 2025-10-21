import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FeeCalculator() {
  const [entryTime, setEntryTime] = useState("");
  const [exitTime, setExitTime] = useState("");
  const [vehicleType, setVehicleType] = useState("Car/Van");
  const [billingInterval, setBillingInterval] = useState(60); // in minutes
  const [fee, setFee] = useState(null);
  const [hoursParked, setHoursParked] = useState(null);
  const [tariffs, setTariffs] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_API_URL}/api/tariff/tariff-rates`)
      .then((res) => {
        if (res.data.success) setTariffs(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const calculateFee = () => {
    if (!entryTime || !exitTime) {
      alert("Please enter both entry and exit times");
      return;
    }

    const entryDate = new Date(entryTime);
    const exitDate = new Date(exitTime);

    if (exitDate < entryDate) {
      alert("Exit time cannot be before entry time");
      return;
    }

    let totalFee = 0;
    const totalMinutes = (exitDate - entryDate) / (1000 * 60);
    const totalHours = totalMinutes / 60;

    const daySummaries = [];
    let current = new Date(entryDate);

    // Normalize start to midnight for consistent day iteration
    current.setHours(0, 0, 0, 0);

    while (current <= exitDate) {
      const dayStr = current.toLocaleString("en-US", { weekday: "short" });

      const dayTariffs = tariffs.filter(
        (t) =>
          t.vehicle_type === vehicleType &&
          (t.day_of_week === dayStr || t.day_of_week === "PH")
      );

      if (dayTariffs.length === 0) {
        current.setDate(current.getDate() + 1);
        continue;
      }

      let dailyFee = 0;

      for (let t of dayTariffs) {
        const [startH, startM] = t.from_time.split("T")[1].split(":").map(Number);
        const [endH, endM] = t.to_time.split("T")[1].split(":").map(Number);

        const dayStart = new Date(current);
        const intervalStart = new Date(dayStart);
        intervalStart.setHours(startH, startM, 0, 0);

        const intervalEnd = new Date(dayStart);
        intervalEnd.setHours(endH, endM, 0, 0);

        const overlapStart = entryDate > intervalStart ? entryDate : intervalStart;
        const overlapEnd = exitDate < intervalEnd ? exitDate : intervalEnd;
        const overlapMinutes = Math.max(0, (overlapEnd - overlapStart) / (1000 * 60));

        if (overlapMinutes > 0) {
          const units = Math.ceil(overlapMinutes / billingInterval);
          let feeForInterval =
            (t.first_min_fee || 0) +
            (units > 1 ? (units - 1) * (t.min_fee || 0) : 0);

          if (feeForInterval < t.min_charge) feeForInterval = t.min_charge;
          if (feeForInterval > t.max_charge) feeForInterval = t.max_charge;

          dailyFee += feeForInterval;
        }
      }

      // ✅ Enforce daily max cap (important fix)
      const dailyMax = Math.max(...dayTariffs.map((t) => t.max_charge || Infinity));
      if (dailyFee > dailyMax) dailyFee = dailyMax;

      totalFee += dailyFee;

      daySummaries.push({
        day: current.toDateString(),
        fee: dailyFee.toFixed(2),
      });

      // Move to next day
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
    }

    setFee(totalFee);
    setHoursParked(totalHours);

    setHistory((prev) => [
      {
        entryTime: entryDate.toLocaleString(),
        exitTime: exitDate.toLocaleString(),
        vehicleType,
        billingInterval,
        hours: totalHours.toFixed(2),
        fee: totalFee.toFixed(2),
        tariffSummary: daySummaries,
      },
      ...prev,
    ]);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-50 rounded-xl shadow-lg font-sans">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Parking Fee Calculator</h2>

     <div className="space-y-4 mb-6">
        <input
            type="datetime-local"
            value={entryTime}
            onChange={(e) => setEntryTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
            type="datetime-local"
            value={exitTime}
            onChange={(e) => setExitTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
            <option>Car/Van</option>
            <option>Lorry</option>
            <option>M/cycle</option>
            <option>Bus</option>
        </select>

        {/* Editable billing interval */}
        <input
            type="number"
            min={1}
            value={billingInterval}
            onChange={(e) => setBillingInterval(Number(e.target.value))}
            placeholder="Billing interval in minutes"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        </div>

      <button
        onClick={calculateFee}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition duration-200"
      >
        Calculate
      </button>

      {fee !== null && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md text-center">
          <div className="text-lg font-semibold text-gray-700">
            Total Time Parked: {hoursParked.toFixed(2)} hours
          </div>
          <div className="text-lg font-semibold text-gray-700">
            Billing Interval: {billingInterval} minutes
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-2">Total Fee: ${fee}</div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Parking Fee History</h3>
          <div className="space-y-3">
            {history.map((h, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border-l-4 border-blue-500 rounded-lg shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="flex justify-between text-gray-700 font-medium">
                  <span>Entry:</span> <span>{h.entryTime}</span>
                </div>
                <div className="flex justify-between text-gray-700 font-medium">
                  <span>Exit:</span> <span>{h.exitTime}</span>
                </div>
                <div className="flex justify-between text-gray-700 font-medium">
                  <span>Vehicle:</span> <span>{h.vehicleType}</span>
                </div>
                <div className="flex justify-between text-gray-700 font-medium">
                  <span>Hours:</span> <span>{h.hours}</span>
                </div>
                <div className="flex justify-between text-gray-700 font-medium">
                  <span>Fee:</span> <span className="text-blue-600 font-bold">${h.fee}</span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {h.tariffSummary.map((t, i) => (
                    <div key={i}>
                      {t.day}: ${t.fee}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
