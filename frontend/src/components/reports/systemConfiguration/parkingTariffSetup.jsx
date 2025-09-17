import React from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export default function ParkingTariffConfiguration() {
  const navigate = useNavigate();

  const viewOnlyTariffs = [
    "Tariff setup for Car/Van",
    "Tariff setup for Lorry",
    "Tariff setup for M/Cycle",
    "Tariff setup for Day Season",
    "Tariff setup for Night Season",
    "Tariff setup for Car/Van (B)",
    "Tariff setup for Lorry (B)",
    "Tariff setup for M/Cycle (B)",
    "Tariff setup for Day Season (B)",
    "Tariff setup for Night Season (B)",
  ];

  const editableTariffs = [
    "Tariff setup for Car/Van",
    "Tariff setup for Lorry",
    "Tariff setup for M/Cycle",
    "Tariff setup for Day Season",
    "Tariff setup for Night Season",
    "Tariff setup for Car/Van (B)",
    "Tariff setup for Lorry (B)",
    "Tariff setup for M/Cycle (B)",
    "Tariff setup for Day Season (B)",
    "Tariff setup for Night Season (B)",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Parking Tariff Configuration</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* View Only Tariff Setup */}
        <div className="flex-1 bg-white border rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Tariff Setup (View Only)</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {viewOnlyTariffs.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Editable Tariff Setup */}
        <div className="flex-1 bg-white border rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Tariff Setup</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {editableTariffs.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Home Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="h-5 w-5" />
          Home
        </button>
      </div>
    </div>
  );
}
