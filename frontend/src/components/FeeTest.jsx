import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FeeCalculator() {
  const [entryTime, setEntryTime] = useState("");
  const [exitTime, setExitTime] = useState("");
  const [vehicleType, setVehicleType] = useState("Car/Van");
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
    let totalMinutes = (exitDate - entryDate) / (1000 * 60);
    const summary = [];

    let current = new Date(entryDate);

    while (current <= exitDate) {
        const dayStr = current.toLocaleString("en-US", { weekday: "short" });
        const dayTariffs = tariffs.filter(
        (t) => t.vehicle_type === vehicleType && (t.day_of_week === dayStr || t.day_of_week === "PH")
        );

        // Determine the start and end for this day
        const dayStart = new Date(current);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const startTime = current > dayStart ? current : dayStart;
        const endTime = exitDate < dayEnd ? exitDate : dayEnd;

        let dailyFee = 0;

        for (let t of dayTariffs) {
        const [startHour, startMinute] = t.from_time.split("T")[1].split(":").map(Number);
        const [endHour, endMinute] = t.to_time.split("T")[1].split(":").map(Number);

        const intervalStart = new Date(dayStart);
        intervalStart.setHours(startHour, startMinute, 0, 0);

        const intervalEnd = new Date(dayStart);
        intervalEnd.setHours(endHour, endMinute, 0, 0);

        // Calculate overlap with this interval
        const overlapStart = startTime > intervalStart ? startTime : intervalStart;
        const overlapEnd = endTime < intervalEnd ? endTime : intervalEnd;
        const overlapMinutes = Math.max(0, (overlapEnd - overlapStart) / (1000 * 60));

        if (overlapMinutes > 0) {
            const billingUnits = Math.ceil(overlapMinutes / t.every);
            let feeForInterval =
            (t.first_min_fee || 0) + (billingUnits > 1 ? (billingUnits - 1) * (t.min_fee || 0) : 0);

            if (feeForInterval < t.min_charge) feeForInterval = t.min_charge;
            if (feeForInterval > t.max_charge) feeForInterval = t.max_charge;

            dailyFee += feeForInterval;
            summary.push(`${current.toDateString()} ${t.from_time.split("T")[1]}-${t.to_time.split("T")[1]}: $${feeForInterval}`);
        }
        }

        totalFee += dailyFee;

        // Move to next day
        current.setDate(current.getDate() + 1);
        current.setHours(0, 0, 0, 0);
    }

    setFee(totalFee);
    setHoursParked(totalMinutes / 60);

    setHistory((prev) => [
        {
        entryTime: entryDate.toLocaleString(),
        exitTime: exitDate.toLocaleString(),
        vehicleType,
        hours: (totalMinutes / 60).toFixed(2),
        fee: totalFee,
        tariffSummary: summary.length ? summary.join(", ") : "No tariffs applied",
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
                <div className="mt-2 text-sm text-gray-500">{h.tariffSummary}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
