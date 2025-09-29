import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Plus, Trash2 } from "lucide-react";

export default function TariffSetupCarVan() {
  const navigate = useNavigate();

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "PH"];

  const defaultSlot = {
    from: "08:00",
    to: "18:00",
    rateType: "Hourly",
    every: 60,
    minFee: 200,
    graceTime: 15,
    firstMinFee: 100,
    min: 200,
    max: 2000,
  };

  const numericFields = ["every", "minFee", "graceTime", "firstMinFee", "min", "max"];

  const [rates, setRates] = useState(() =>
    daysOfWeek.reduce((acc, day) => {
      acc[day] = [{ ...defaultSlot }]; // ensure each day starts with one slot
      return acc;
    }, {})
  );

  const [effectiveStart, setEffectiveStart] = useState("");
  const [effectiveEnd, setEffectiveEnd] = useState("");
  const [overlaps, setOverlaps] = useState({}); // { day: [[i,j], ...] }

  // Fetch existing tariff data (if needed)
  useEffect(() => {
    const fetchTariff = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/tariff/tariff-setup?vehicleType=Car/Van`
        );
        if (!response.ok) throw new Error("Failed to fetch tariff");
        const data = await response.json();
        if (!data || Object.keys(data).length === 0) return;

        setEffectiveStart(data.effectiveStartDate || "");
        setEffectiveEnd(data.effectiveEndDate || "");

        const newRates = {};
        daysOfWeek.forEach(day => {
          newRates[day] = data[day]?.length ? data[day] : [{ ...defaultSlot }];
        });
        setRates(newRates);
      } catch (err) {
        console.error(err);
        alert("Failed to load existing tariff data");
      }
    };

    fetchTariff();
  }, []);

  // Overlap detection
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

  // Input change
  const handleInputChange = (day, index, field, value) => {
    setRates(prev => {
      const updatedDay = [...prev[day]];
      updatedDay[index][field] = numericFields.includes(field) ? Number(value) : value;
      return { ...prev, [day]: updatedDay };
    });
  };

  const addTimeSlot = (day) => {
    setRates(prev => ({
      ...prev,
      [day]: [...prev[day], { ...defaultSlot }],
    }));
  };

  const removeTimeSlot = (day, index) => {
    setRates(prev => {
      const updatedDay = prev[day].filter((_, i) => i !== index);
      return { ...prev, [day]: updatedDay.length ? updatedDay : [{ ...defaultSlot }] };
    });
  };

  // Validate payload before saving
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

  const handleSave = async () => {
    if (!validatePayload()) return;

    const payload = {
      vehicleType: "Car/Van",
      effectiveStart: effectiveStart + "T00:00:00",
      effectiveEnd: effectiveEnd + "T23:59:59",
      rates,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/tariff/tariff-setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

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

  const isSlotOverlapping = (day, index) => {
    if (!overlaps[day]) return false;
    return overlaps[day].some(([i, j]) => i === index || j === index);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Tariff Setup for Car/Van(B)</h1>

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

      {/* Time slots per day */}
      {daysOfWeek.map(day => (
        <div key={day} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{day}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  {["From", "To", "Rate Type", "Every", "Min Fee", "Grace Time", "First Min Fee", "Min", "Max", "Actions"].map(th => (
                    <th key={th} className="border px-2 py-1">{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rates[day].map((slot, index) => (
                  <tr key={index} className={`text-center ${isSlotOverlapping(day, index) ? 'bg-red-100' : ''}`}>
                    {Object.entries(slot).map(([field, value]) => (
                      <td key={field} className="border px-2 py-1">
                        <input
                          type={field === "from" || field === "to" ? "time" : "text"}
                          value={value}
                          onChange={(e) => handleInputChange(day, index, field, e.target.value)}
                          className="border rounded p-1 w-full text-center"
                        />
                      </td>
                    ))}
                    <td className="border px-2 py-1 flex justify-center gap-1">
                      <button onClick={() => addTimeSlot(day)} className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeTimeSlot(day, index)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">
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
        <button onClick={handleSave} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Save
        </button>
        <button onClick={() => navigate("/")} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Home className="w-5 h-5 inline mr-2" /> Home
        </button>
      </div>
    </div>
  );
}
