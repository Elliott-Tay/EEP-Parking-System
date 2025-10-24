import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Plus, Trash2 } from "lucide-react";
import { DateTime } from "luxon";

export default function TariffSetupCarVan() {
  const navigate = useNavigate();

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "PH"];
  const numericFields = ["every", "minFee", "graceTime", "firstMinFee", "min", "max"];

  const [rates, setRates] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );
  const [effectiveStart, setEffectiveStart] = useState("");
  const [effectiveEnd, setEffectiveEnd] = useState("");
  const [overlaps, setOverlaps] = useState({});

  // ---------- Helper functions ----------
  const formatTimeSG = (timeStr) => {
    if (!timeStr) return null;
    return DateTime.fromFormat(timeStr, "HH:mm", { zone: "Asia/Singapore" }).toFormat("HH:mm:ss");
  };

  const parseTimeSG = (timeStr) => {
    if (!timeStr) return "";
    return DateTime.fromISO(timeStr, { zone: "Asia/Singapore" }).toFormat("HH:mm");
  };

  const formatDateSG = (dateStr, startOfDay = true) => {
    if (!dateStr) return null;
    const dt = DateTime.fromISO(dateStr, { zone: "Asia/Singapore" });
    return startOfDay ? dt.startOf("day").toISO() : dt.endOf("day").toISO();
  };

  const getOverlaps = (slots) => {
    const result = [];
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        if (slots[i].from < slots[j].to && slots[i].to > slots[j].from) {
          result.push([i, j]);
        }
      }
    }
    return result;
  };

  const checkAllOverlaps = () => {
    const allOverlaps = {};
    let hasOverlap = false;

    for (const [day, slots] of Object.entries(rates)) {
      const dayOverlaps = getOverlaps(slots);
      if (dayOverlaps.length) {
        allOverlaps[day] = dayOverlaps;
        hasOverlap = true;
      }
    }

    setOverlaps(allOverlaps);
    return hasOverlap;
  };

  // ---------- Fetch existing tariff ----------
  useEffect(() => {
    const fetchTariff = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/tariff/tariff-setup?vehicleType=Car/Van`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch tariff");

        const data = await response.json();
        if (!data || Object.keys(data).length === 0) return;

        setEffectiveStart(
          data.effectiveStartDate
            ? DateTime.fromISO(data.effectiveStartDate, { zone: "Asia/Singapore" }).toISODate()
            : ""
        );
        setEffectiveEnd(
          data.effectiveEndDate
            ? DateTime.fromISO(data.effectiveEndDate, { zone: "Asia/Singapore" }).toISODate()
            : ""
        );

        const newRates = {};
        daysOfWeek.forEach((day) => {
          newRates[day] = (data[day] || []).map((slot) => ({
            ...slot,
            from: parseTimeSG(slot.from),
            to: parseTimeSG(slot.to),
          }));
        });
        setRates(newRates);
      } catch (err) {
        console.error(err);
        alert("Failed to load existing tariff data");
      }
    };

    fetchTariff();
  }, []);

  // ---------- Input handlers ----------
  const handleInputChange = (day, index, field, value) => {
    setRates((prev) => {
      const updatedDay = [...prev[day]];
      updatedDay[index][field] = numericFields.includes(field) ? Number(value) : value;
      return { ...prev, [day]: updatedDay };
    });
  };

  const addTimeSlot = (day) => {
    setRates((prev) => ({
      ...prev,
      [day]: [
        ...prev[day],
        {
          from: "08:00",
          to: "18:00",
          rateType: "Hourly",
          contractClass: "Hourly", // 🆕 added
          every: 60,
          minFee: 200,
          graceTime: 15,
          firstMinFee: 100,
          min: 200,
          max: 2000,
        },
      ],
    }));
  };

  const removeTimeSlot = async (day, index) => {
    const slot = rates[day][index];
    if (!slot) return;

    console.log(formatTimeSG(slot.from));
    console.log(formatTimeSG(slot.to));
    console.log(formatDateSG(slot.effectiveStart || effectiveStart, true));
    console.log(formatDateSG(slot.effectiveEnd || effectiveEnd, false));

    try {
      const payload = {
        vehicleType: "Car/Van",
        dayOfWeek: day,
        fromTime: formatTimeSG(slot.from),
        toTime: formatTimeSG(slot.to),
        effectiveStart: formatDateSG(slot.effectiveStart || effectiveStart, true),
        effectiveEnd: formatDateSG(slot.effectiveEnd || effectiveEnd, false),
      };

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/tariff/tariff-slot`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw await response.json();

      setRates((prev) => {
        const updatedDay = prev[day].filter((_, i) => i !== index);
        return { ...prev, [day]: updatedDay };
      });

      alert("Slot deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete slot: " + (err?.error || err.message));
    }
  };

  // ---------- Validation ----------
  const validatePayload = () => {
    if (!effectiveStart || !effectiveEnd) {
      alert("Please select both effective start and end dates.");
      return false;
    }
    if (effectiveStart > effectiveEnd) {
      alert("Effective start date cannot be after effective end date.");
      return false;
    }

    for (const [day, slots] of Object.entries(rates)) {
      for (const slot of slots) {
        if (!slot.from || !slot.to) {
          alert(`Please provide both 'from' and 'to' times for ${day}.`);
          return false;
        }
        if (slot.from >= slot.to) {
          alert(`For ${day}, the 'From' time must be earlier than the 'To' time.`);
          return false;
        }
      }
    }

    if (checkAllOverlaps()) {
      alert("Some slots are overlapping! Please fix them before saving.");
      return false;
    }

    return true;
  };

  // ---------- Save handler ----------
  const handleSave = async () => {
    if (!validatePayload()) return;

    const payload = {
      vehicleType: "Car/Van",
      effectiveStart: formatDateSG(effectiveStart, true),
      effectiveEnd: formatDateSG(effectiveEnd, false),
      rates: Object.fromEntries(
        Object.entries(rates).map(([day, slots]) => [
          day,
          slots.map((slot) => ({
            ...slot,
            from: formatTimeSG(slot.from),
            to: formatTimeSG(slot.to),
            contractClass: slot.contractClass || "Hourly",
          })),
        ])
      ),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/tariff/tariff-setup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Rates saved successfully!");
      } else {
        console.error(data);
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  const isSlotOverlapping = (day, index) =>
    overlaps[day]?.some(([i, j]) => i === index || j === index);

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Tariff Setup for Car/Van</h1>

      {/* Effective Dates */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label>Effective Start Date</label>
          <input
            type="date"
            className="border rounded p-2 w-full"
            value={effectiveStart}
            onChange={(e) => setEffectiveStart(e.target.value)}
          />
        </div>
        <div>
          <label>Effective End Date</label>
          <input
            type="date"
            className="border rounded p-2 w-full"
            value={effectiveEnd}
            onChange={(e) => setEffectiveEnd(e.target.value)}
          />
        </div>
      </div>

      {/* Time slots */}
      {daysOfWeek.map((day) => (
        <div key={day} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{day}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  {[
                    "From", 
                    "To", 
                    "Contract Class (Rate Type)", 
                    "Charge Block (Every)", 
                    "Min Fee", 
                    "Grace Time", 
                    "First Min Fee", 
                    "Min", 
                    "Max", 
                    "Actions"].map((th) => (
                    <th key={th} className="border px-2 py-1">
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
             <tbody>
                {rates[day].map((slot, index) => (
                  <tr
                    key={index}
                    className={`text-center ${isSlotOverlapping(day, index) ? "bg-red-100" : ""}`}
                  >
                    <td className="border px-2 py-1">
                      <input
                        type="time"
                        value={slot.from}
                        onChange={(e) => handleInputChange(day, index, "from", e.target.value)}
                        className="border rounded p-1 w-full text-center"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="time"
                        value={slot.to}
                        onChange={(e) => handleInputChange(day, index, "to", e.target.value)}
                        className="border rounded p-1 w-full text-center"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="text"
                        value={slot.rateType}
                        onChange={(e) => handleInputChange(day, index, "rateType", e.target.value)}
                        className="border rounded p-1 w-full text-center"
                      />
                    </td>
                    {/* Continue the other fields */}
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={slot.every}
                        onChange={(e) => handleInputChange(day, index, "every", e.target.value)}
                        className="border rounded p-1 w-full text-center"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={slot.minFee}
                        onChange={(e) => handleInputChange(day, index, "minFee", e.target.value)}
                        className="border rounded p-1 w-full text-center"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={slot.graceTime}
                        onChange={(e) => handleInputChange(day, index, "graceTime", e.target.value)}
                        className="border rounded p-1 w-full text-center"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={slot.firstMinFee}
                        onChange={(e) => handleInputChange(day, index, "firstMinFee", e.target.value)}
                        className="border rounded p-1 w-full text-center"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={slot.min}
                        onChange={(e) => handleInputChange(day, index, "min", e.target.value)}
                        className="border rounded p-1 w-full text-center"
                      />
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        value={slot.max}
                        onChange={(e) => handleInputChange(day, index, "max", e.target.value)}
                        className="border rounded p-1 w-full text-center"
                      />
                    </td>
                    <td className="border px-2 py-1 flex justify-center gap-1">
                      <button
                        onClick={() => addTimeSlot(day)}
                        className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeTimeSlot(day, index)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => addTimeSlot(day)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Slot
            </button>
          </div>
        </div>
      ))}

      {/* Save / Home */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Save
        </button>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="w-5 h-5 inline mr-2" /> Home
        </button>
      </div>
    </div>
  );
}
