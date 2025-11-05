import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Plus, Trash2 } from "lucide-react";
import { DateTime } from "luxon";

export default function TariffSetupURAStaff() {
  const navigate = useNavigate();
  
    const daysOfWeek = ["All day", "Mon-Fri", "Sat", "Sun", "PH"];
    const numericFields = ["every", "minFee", "graceTime", "firstMinFee", "min", "max"];
  
    const [rates, setRates] = useState(daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {}));
    const [rateTypeOptions, setRateTypeOptions] = useState([]);
    const [effectiveStart, setEffectiveStart] = useState("");
    const [effectiveEnd, setEffectiveEnd] = useState("");
    const [overlaps, setOverlaps] = useState({});
  
    // ---------- Helper functions ----------
    const parseTimeSG = (timeStr) => (timeStr ? DateTime.fromISO(timeStr, { zone: "Asia/Singapore" }).toFormat("HH:mm") : "");
  
    const hasOverlaps = (slots) => {
      // Normalize times to minutes first
      const normalizedSlots = slots.map((s, i) => {
        const fromMinutes = timeToMinutes(s.from);
        let toMinutes = timeToMinutes(s.to);
        if (toMinutes <= fromMinutes) toMinutes += 24 * 60; // handle overnight
        return { ...s, fromMinutes, toMinutes, index: i };
      });
  
      // Check pairwise overlaps for same vehicleType
      for (let i = 0; i < normalizedSlots.length; i++) {
        const s1 = normalizedSlots[i];
        for (let j = i + 1; j < normalizedSlots.length; j++) {
          const s2 = normalizedSlots[j];
          if (s1.vehicleType === s2.vehicleType) {
            // If s1 starts before s2 ends and s1 ends after s2 starts → overlap
            if (s1.fromMinutes < s2.toMinutes && s1.toMinutes > s2.fromMinutes) {
              return { overlap: true, slots: [s1.index, s2.index] };
            }
          }
        }
      }
  
      return { overlap: false };
    };
  
    // ---------- Helper for validating a single day's slots ----------
    const validateDaySlots = (day, slots) => {
      // Check required fields
      const invalid = slots.some(s => !s.from || !s.to || !s.vehicleType);
      if (invalid) {
        alert(`Please fill all required fields for ${day}`);
        return false;
      }
  
      // Normalize slots
      const normalizedSlots = slots.map(s => normalizeSlot(s));
  
      // Check 'From' < 'To'
      for (let i = 0; i < normalizedSlots.length; i++) {
        const s = normalizedSlots[i];
        if (s.toMinutes - s.fromMinutes <= 0) {
          alert(`For ${day}, '${s.vehicleType}', 'From' must be earlier than 'To'.`);
          return false;
        }
      }
  
      // Check overlaps
      const overlapResult = hasOverlaps(slots);
      if (overlapResult.overlap) {
        const [i, j] = overlapResult.slots;
        alert(`Overlap detected for ${day}, '${slots[i].vehicleType}' between slots ${i + 1} and ${j + 1}.`);
        return false;
      }
  
      return true;
    };
  
    // ---------- Fetch existing tariff ----------
    useEffect(() => {
      const fetchTariff = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/tariff/tariff-rates?rateType=URA Staff`, {
            headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
            credentials: "include",
          });
          if (!response.ok) throw new Error("Failed to fetch tariff");
          const result = await response.json();
          if (!result?.data?.length) return;
  
          const allRates = result.data;
  
          // Determine effective dates
          const startDates = allRates.map(r => r.effective_start).filter(Boolean);
          const endDates = allRates.map(r => r.effective_end).filter(Boolean);
          setEffectiveStart(startDates.length ? DateTime.fromISO(startDates.sort()[0], { zone: "Asia/Singapore" }).toISODate() : "");
          setEffectiveEnd(endDates.length ? DateTime.fromISO(endDates.sort().reverse()[0], { zone: "Asia/Singapore" }).toISODate() : "");
  
          // Extract rate type options from fetched data
          const dynamicRateTypes = Array.from(new Set(allRates.map(r => r.rate_type).filter(Boolean)));
          setRateTypeOptions(dynamicRateTypes);
  
          // Map rates to frontend
          const newRates = daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {});
          allRates.forEach(slot => {
            const mapped = {
              id: slot.id,                // <-- store DB primary key
              vehicleType: slot.vehicle_type || "Car/Van",
              from: parseTimeSG(slot.from_time),
              to: parseTimeSG(slot.to_time),
              rate_type: slot.rate_type || dynamicRateTypes[0] || "URA Staff",
              every: slot.every || 60,
              minFee: slot.min_fee || 0,
              graceTime: slot.grace_time || 0,
              firstMinFee: slot.first_min_fee || 0,
              min: slot.min_charge || 0,
              max: slot.max_charge || 0,
              contractClass: slot.rate_type || dynamicRateTypes[0] || "URA Staff",
            };
            const label = slot.day_of_week;
            if (!newRates[label]) newRates[label] = [];
            newRates[label].push(mapped);
          });
  
          setRates(newRates);
        } catch (err) {
          console.error(err);
          alert("Failed to load tariff data");
        }
      };
  
      fetchTariff();
    }, []);
  
    // ---------- Handlers ----------
    const handleInputChange = (day, index, field, value) => {
      setRates(prev => {
        const updatedDay = [...prev[day]];
        updatedDay[index][field] = numericFields.includes(field) ? Number(value) : value;
        return { ...prev, [day]: updatedDay };
      });
    };
  
    const addCarTimeSlot = (day, vehicleType = "Car/HGV", rateType = "URA Staff") => {
      const newSlot = {
        vehicleType,
        from: "08:00",
        to: "18:00",
        rate_type: rateType,
        contractClass: rateType,
        every: 60,
        minFee: 200,
        graceTime: 15,
        firstMinFee: 100,
        min: 200,
        max: 2000,
      };
  
      setRates(prev => ({
        ...prev,
        [day]: [...prev[day], newSlot],
      }));
    };
  
    const addMCycleTimeSlot = (day, vehicleType = "MC", rateType = "URA Staff") => {
      const newSlot = {
        vehicleType,
        from: "08:00",
        to: "18:00",
        rateType,          // <-- use consistent property
        contractClass: rateType,
        every: 60,
        minFee: 200,
        graceTime: 15,
        firstMinFee: 100,
        min: 200,
        max: 2000,
      };
  
      setRates(prev => ({
        ...prev,
        [day]: [...prev[day], newSlot],
      }));
    };

    const addAllTimeSlot = (day, vehicleType = "Car/HGV/MC", rateType = "URA Staff") => {
      const newSlot = {
        vehicleType,
        from: "08:00",
        to: "18:00",
        rateType,          // <-- use consistent property
        contractClass: rateType,
        every: 60,
        minFee: 200,
        graceTime: 15,
        firstMinFee: 100,
        min: 200,
        max: 2000,
      };
  
      setRates(prev => ({
        ...prev,
        [day]: [...prev[day], newSlot],
      }));
    };
    
    // ---------- Normalize time ----------
    const normalizeTime = (timeStr) => {
      if (!timeStr) return null;
      const dt = DateTime.fromFormat(timeStr, "HH:mm");
      return dt.toFormat("HH:mm");
    };
  
    // ---------- Normalize slot for calculations ----------
    const timeToMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };
  
    const normalizeSlot = (slot) => {
      let from = timeToMinutes(slot.from);
      let to = timeToMinutes(slot.to);
      if (to <= from) to += 24 * 60; // handle overnight slots
      return { ...slot, fromMinutes: from, toMinutes: to };
    };
  
    // Save the rates for a specific day
    const handleSaveDay = async (day) => {
      const slots = rates[day];
      if (!slots || slots.length === 0) {
        alert(`No slots to save for ${day}`);
        return;
      }
  
      // Call the validation helper
      if (!validateDaySlots(day, slots)) return;
  
      // Validate required fields
      const invalid = slots.some(s => !s.from || !s.to || !s.vehicleType);
      if (invalid) {
        alert(`Please fill all required fields for ${day}`);
        return;
      }
  
      // Normalize slots for sending
      const payloadSlots = slots.map(slot => ({
        id: slot.id || null, // <-- keep DB ID if exists
        vehicleType: slot.vehicleType,
        from: normalizeTime(slot.from),
        to: normalizeTime(slot.to),
        rateType: slot.rate_type || slot.rateType || "URA Staff",
        every: Number(slot.every),
        minFee: Number(slot.minFee),
        graceTime: Number(slot.graceTime),
        firstMinFee: Number(slot.firstMinFee),
        min: Number(slot.min),
        max: Number(slot.max),
      }));
  
      const payload = {
        effectiveStart: effectiveStart ? effectiveStart + "T00:00:00" : null,
        effectiveEnd: effectiveEnd ? effectiveEnd + "T23:59:59" : null,
        rates: {
          [day]: payloadSlots, // send all slots for that day
        },
      };
  
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/tariff/tariff-setup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert(`Rates for ${day} saved successfully!`);
          // Automatically refresh the page
          window.location.reload();
        } else {
          console.error(data);
          alert(`Error saving ${day}: ${data.error || "Unknown error"}`);
        }
      } catch (err) {
        console.error(err);
        alert(`Network error while saving ${day}`);
      }
    };
  
    const removeTimeSlot = async (day, index) => {
      const slot = rates[day][index];
      if (!slot) return;
  
      // If the slot hasn't been saved yet (no ID), just remove locally
      if (!slot.id) {
        setRates(prev => ({
          ...prev,
          [day]: prev[day].filter((_, i) => i !== index),
        }));
        return;
      }
  
      const payload = { id: slot.id }; // <--- only send the ID
  
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/tariff/tariff-slot`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
  
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to delete slot");
        }
  
        // Remove locally
        setRates(prev => ({
          ...prev,
          [day]: prev[day].filter((_, i) => i !== index),
        }));
  
        alert("Slot deleted successfully!");
      } catch (err) {
        console.error("Delete slot error:", err);
        alert("Failed to delete slot: " + err.message);
      }
    };
  
    const isSlotOverlapping = (day, index) => overlaps[day]?.some(([i, j]) => i === index || j === index);
  
    const toggleEditSlot = async (day, index) => {
      let slot = rates[day][index];
  
      // Generate a random 4-digit ID if it doesn't exist
      if (!slot.id) {
        slot.id = Math.floor(1000 + Math.random() * 9000);
        // Update state immediately so UI reflects new ID
        setRates(prev => {
          const updatedDay = [...prev[day]];
          updatedDay[index] = { ...slot };
          return { ...prev, [day]: updatedDay };
        });
      }
  
      // If we are exiting edit mode, save to backend
      if (slot.isEditing) {
        try {
          const payload = {
            id: slot.id,
            vehicleType: slot.vehicleType,
            dayOfWeek: day,
            fromTime: slot.from,
            toTime: slot.to,
            rateType: slot.rate_type || slot.rateType || "URA Staff",
            every: Number(slot.every) || 0,
            minFee: Number(slot.minFee) || 0,
            graceTime: Number(slot.graceTime) || 0,
            firstMinFee: Number(slot.firstMinFee) || 0,
            min: Number(slot.min) || 0,
            max: Number(slot.max) || 0,
            effectiveStart,
            effectiveEnd
          };
  
          const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/tariff/tariff-slot`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
  
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Failed to update slot");
  
          alert("Slot updated successfully!");
        } catch (err) {
          console.error("Edit slot error:", err);
          alert("Failed to update slot: " + err.message);
          return; // exit early without toggling edit mode
        }
      }
  
      // Toggle editing mode
      setRates(prev => {
        const updatedDay = [...prev[day]];
        updatedDay[index] = { ...slot, isEditing: !slot.isEditing };
        return { ...prev, [day]: updatedDay };
      });
    };
  
    // ---------- Render ----------
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-2xl font-bold mb-4">Tariff Setup for URA Staff Rates</h1>
  
        {/* Effective Dates */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label>Effective Start Date</label>
            <input type="date" className="border rounded p-2 w-full" value={effectiveStart} onChange={e => setEffectiveStart(e.target.value)} />
          </div>
          <div>
            <label>Effective End Date</label>
            <input type="date" className="border rounded p-2 w-full" value={effectiveEnd} onChange={e => setEffectiveEnd(e.target.value)} />
          </div>
        </div>
  
        {/* Time Slots */}
        {daysOfWeek.map(day => (
          <div key={day} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{day}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    {[
                      "ID",
                      "Vehicle Type",
                      "From",
                      "To",
                      "Rate Type",
                      "Charge Block (Every)",
                      "Min Fee",
                      "Grace Time",
                      "First Min Fee",
                      "Min",
                      "Max",
                      "Actions"
                    ].map(th => <th key={th} className="border px-2 py-1">{th}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rates[day].map((slot, index) => (
                    <tr key={index} className={`text-center ${isSlotOverlapping(day,index) ? "bg-red-100" : ""}`}>
                      <td className="border px-2 py-1">{slot.id || "-"}</td>
                      <td className="border px-2 py-1">
                        {slot.isEditing ? (
                          <select
                            value={slot.vehicleType}
                            onChange={e => handleInputChange(day, index, "vehicleType", e.target.value)}
                            className="border rounded p-1 w-full text-center"
                          >
                            <option value="Car/HGV">Car/HGV</option>
                            <option value="MC">MC</option>
                          </select>
                        ) : (
                          slot.vehicleType || "Car/HGV"
                        )}
                      </td>
                                          <td className="border px-2 py-1">
                        <input type="time" value={slot.from} onChange={e => handleInputChange(day,index,"from",e.target.value)} className="border rounded p-1 w-full text-center"/>
                      </td>
                      <td className="border px-2 py-1">
                        <input type="time" value={slot.to} onChange={e => handleInputChange(day,index,"to",e.target.value)} className="border rounded p-1 w-full text-center"/>
                      </td>
                      <td className="border px-2 py-1">
                        <select value={slot.rate_type} onChange={e => handleInputChange(day,index,"rate_type",e.target.value)} className="border rounded p-1 w-full text-center">
                          {rateTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </td>
                      {numericFields.map(field => (
                        <td key={field} className="border px-2 py-1">
                          <input type="number" value={slot[field]} onChange={e => handleInputChange(day,index,field,e.target.value)} className="border rounded p-1 w-full text-center"/>
                        </td>
                      ))}
                      <td className="border px-2 py-1 flex justify-center gap-1">
                        {/* Delete slot */}
                        <button
                          onClick={() => removeTimeSlot(day, index)}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
  
                        {/* Edit / Save toggle */}
                        <button
                          onClick={() => toggleEditSlot(day, index)}
                          className={`px-2 py-1 rounded text-white ${
                            rates[day][index].isEditing ? "bg-blue-500 hover:bg-blue-600" : "bg-yellow-500 hover:bg-yellow-600"
                          }`}
                        >
                          {rates[day][index].isEditing ? "Save" : "Edit"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => addCarTimeSlot(day)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Car/HGV Slot
                </button>
                <button
                  onClick={() => addMCycleTimeSlot(day)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add MCycle Slot
                </button>
                <button
                  onClick={() => addAllTimeSlot(day)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Car/HGV/MC Slot
                </button>
                <button
                  onClick={() => handleSaveDay(day)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save {day}
                </button>
              </div>
            </div>
          </div>
        ))}
  
        {/* Save / Home */}
        <div className="mt-6 flex justify-center gap-4">
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
  