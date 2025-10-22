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
  const [tariffImageUrl, setTariffImageUrl] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/tariff/tariff-rates`)
      .then((res) => {
        if (res.data.success) setTariffs(res.data.data);
      })
      .catch((err) => console.error(err));

    setTariffImageUrl(`${backendUrl}/api/image/tariff-image`);
  }, [backendUrl]);

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
            (t.first_min_fee || 0) + (units > 1 ? (units - 1) * (t.min_fee || 0) : 0);

          if (t.min_charge !== undefined && feeForInterval < t.min_charge)
            feeForInterval = t.min_charge;
          if (t.max_charge !== undefined && feeForInterval > t.max_charge)
            feeForInterval = t.max_charge;

          dailyFee += feeForInterval;
        }
      }

      const maxCharges = dayTariffs.map((t) => t.max_charge).filter((v) => v !== undefined);
      if (maxCharges.length > 0) {
        const dailyMax = Math.max(...maxCharges);
        if (dailyFee > dailyMax) dailyFee = dailyMax;
      }

      totalFee += dailyFee;
      daySummaries.push({
        day: current.toDateString(),
        fee: dailyFee.toFixed(2),
      });

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
    <div className="min-h-screen w-full flex items-start justify-center p-12 bg-gray-100">
      <div className="w-full max-w-7xl p-12 bg-white rounded-3xl shadow-2xl font-sans">
        <h2 className="text-5xl font-bold mb-10 text-center text-gray-800">Parking Fee Calculator</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
          <div className="space-y-8">
            <input
              type="datetime-local"
              value={entryTime}
              onChange={(e) => setEntryTime(e.target.value)}
              className="w-full px-8 py-5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-400 text-xl"
            />
            <input
              type="datetime-local"
              value={exitTime}
              onChange={(e) => setExitTime(e.target.value)}
              className="w-full px-8 py-5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-400 text-xl"
            />
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-8 py-5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-400 text-xl"
            >
              <option>Car/Van</option>
              <option>Lorry</option>
              <option>M/cycle</option>
              <option>Bus</option>
            </select>
            <input
              type="number"
              min={1}
              value={billingInterval}
              onChange={(e) => setBillingInterval(Number(e.target.value))}
              placeholder="Billing interval in minutes"
              className="w-full px-8 py-5 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-400 text-xl"
            />
          </div>

          {/* Tariff Image Preview */}
          <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-3xl shadow-lg">
            <h3 className="text-3xl font-semibold mb-8 text-gray-700">Current Tariff Image</h3>
            {tariffImageUrl ? (
              <img
                src={tariffImageUrl}
                alt="Tariff"
                className="w-full max-w-9xl max-h-[1000px] object-contain rounded-3xl border border-gray-300 shadow-xl"
              />
            ) : (
              <p className="text-gray-500 text-xl">No tariff image available</p>
            )}
          </div>
        </div>

        <button
          onClick={calculateFee}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl text-xl font-bold transition duration-200"
        >
          Calculate
        </button>

        {fee !== null && (
          <div className="mt-10 p-10 bg-gray-50 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left">
              <div className="text-2xl font-semibold text-gray-700">
                Total Time Parked: {hoursParked.toFixed(2)} hours
              </div>
              <div className="text-2xl font-semibold text-gray-700">
                Billing Interval: {billingInterval} minutes
              </div>
              <div className="text-5xl font-bold text-blue-600 mt-6">Total Fee: ${fee}</div>
            </div>

            {tariffImageUrl && (
              <div className="flex-shrink-0">
                <img
                  src={tariffImageUrl}
                  alt="Tariff"
                  className="w-96 max-h-96 object-contain rounded-2xl border border-gray-300 shadow-md"
                />
              </div>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-14">
            <h3 className="text-4xl font-semibold mb-8 text-gray-800">Parking Fee History</h3>
            <div className="space-y-6">
              {history.map((h, idx) => (
                <div
                  key={idx}
                  className="p-8 bg-white border-l-4 border-blue-500 rounded-3xl shadow-md hover:shadow-lg transition duration-300"
                >
                  <div className="flex justify-between text-gray-700 font-semibold text-lg">
                    <span>Entry:</span> <span>{h.entryTime}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 font-semibold text-lg">
                    <span>Exit:</span> <span>{h.exitTime}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 font-semibold text-lg">
                    <span>Vehicle:</span> <span>{h.vehicleType}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 font-semibold text-lg">
                    <span>Hours:</span> <span>{h.hours}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 font-semibold text-lg">
                    <span>Fee:</span> <span className="text-blue-600 font-bold">${h.fee}</span>
                  </div>
                  <div className="mt-6 text-base text-gray-500">
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
    </div>
  );
}
