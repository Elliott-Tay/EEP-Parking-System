import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Plus, Trash2 } from "lucide-react";

export default function TariffSetupLorryB() {
  const navigate = useNavigate();

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "PH"];

  const initialSlot = {
    from: "",
    to: "",
    rateType: "Hourly",
    every: "",
    minFee: "",
    graceTime: "",
    firstMinFee: "",
    min: "",
    max: "",
  };

  const [rates, setRates] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = [{ ...initialSlot }];
      return acc;
    }, {})
  );

  const handleInputChange = (day, index, field, value) => {
    setRates((prev) => {
      const updatedDay = [...prev[day]];
      updatedDay[index][field] = value;
      return { ...prev, [day]: updatedDay };
    });
  };

  const addTimeSlot = (day) => {
    setRates((prev) => ({
      ...prev,
      [day]: [...prev[day], { ...initialSlot }],
    }));
  };

  const removeTimeSlot = (day, index) => {
    setRates((prev) => {
      const updatedDay = prev[day].filter((_, i) => i !== index);
      return { ...prev, [day]: updatedDay.length ? updatedDay : [{ ...initialSlot }] };
    });
  };

  const handleSave = () => {
    console.log("Lorry(B) rates to save:", rates);
    alert("Lorry(B) rates saved!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">
        Tariff Setup for Lorry(B)
      </h1>

      {/* Effective Date/Time */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label>Effective Start Date (dd/mm/yyyy)</label>
          <input type="text" className="border rounded p-2 w-full" placeholder="Required" />
        </div>
        <div>
          <label>Effective Start Time (HH:MM)</label>
          <input type="text" className="border rounded p-2 w-full" placeholder="Leave empty if 00:00" />
        </div>
        <div>
          <label>Effective End Date (dd/mm/yyyy)</label>
          <input type="text" className="border rounded p-2 w-full" placeholder="Required" />
        </div>
        <div>
          <label>Effective End Time (HH:MM)</label>
          <input type="text" className="border rounded p-2 w-full" placeholder="Leave empty if 00:00" />
        </div>
      </div>

      {/* Table per day */}
      {daysOfWeek.map((day) => (
        <div key={day} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{day}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-2 py-1">From</th>
                  <th className="border px-2 py-1">To</th>
                  <th className="border px-2 py-1">Rate Type</th>
                  <th className="border px-2 py-1">Every</th>
                  <th className="border px-2 py-1">Min Fee (¢)</th>
                  <th className="border px-2 py-1">Grace Time (Min)</th>
                  <th className="border px-2 py-1">First Min Fee (¢)</th>
                  <th className="border px-2 py-1">Min (¢)</th>
                  <th className="border px-2 py-1">Max (¢)</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rates[day].map((slot, index) => (
                  <tr key={index} className="text-center">
                    {Object.entries(slot).map(([field, value]) => (
                      <td key={field} className="border px-2 py-1">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleInputChange(day, index, field, e.target.value)}
                          className="border rounded p-1 w-full text-center"
                        />
                      </td>
                    ))}
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
          </div>
        </div>
      ))}

      {/* Buttons */}
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
          <Home className="w-5 h-5 inline mr-2" />
          Home
        </button>
      </div>
    </div>
  );
}
