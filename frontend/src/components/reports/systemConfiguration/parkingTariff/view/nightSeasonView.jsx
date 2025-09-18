import React from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export default function TariffSetupNightSeasonView({ rates }) {
  const navigate = useNavigate();
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "PH"];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">
        Tariff Setup for Night Season (View Only)
      </h1>

      {/* Effective Date/Time */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label>Effective Start Date (dd/mm/yyyy)</label>
          <div className="border rounded p-2 w-full bg-gray-100">
            {rates?.effectiveStartDate || "-"}
          </div>
        </div>
        <div>
          <label>Effective Start Time (HH:MM)</label>
          <div className="border rounded p-2 w-full bg-gray-100">
            {rates?.effectiveStartTime || "-"}
          </div>
        </div>
        <div>
          <label>Effective End Date (dd/mm/yyyy)</label>
          <div className="border rounded p-2 w-full bg-gray-100">
            {rates?.effectiveEndDate || "-"}
          </div>
        </div>
        <div>
          <label>Effective End Time (HH:MM)</label>
          <div className="border rounded p-2 w-full bg-gray-100">
            {rates?.effectiveEndTime || "-"}
          </div>
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
                </tr>
              </thead>
              <tbody>
                {rates?.[day]?.length > 0 ? (
                  rates[day].map((slot, index) => (
                    <tr key={index} className="text-center bg-white">
                      <td className="border px-2 py-1">{slot.from || "-"}</td>
                      <td className="border px-2 py-1">{slot.to || "-"}</td>
                      <td className="border px-2 py-1">{slot.rateType || "-"}</td>
                      <td className="border px-2 py-1">{slot.every || "-"}</td>
                      <td className="border px-2 py-1">{slot.minFee || "-"}</td>
                      <td className="border px-2 py-1">{slot.graceTime || "-"}</td>
                      <td className="border px-2 py-1">{slot.firstMinFee || "-"}</td>
                      <td className="border px-2 py-1">{slot.min || "-"}</td>
                      <td className="border px-2 py-1">{slot.max || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-2">
                      No rates available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Home button */}
      <div className="mt-6 flex justify-center">
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
