import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchCheckSeason() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    alert(`Searching for: ${searchTerm}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
      <h1 className="text-2xl font-bold mb-6">Search / Check Season</h1>

      <div className="w-full max-w-xl bg-white border rounded-lg shadow p-6">
        <label className="block text-gray-700 font-medium mb-2">
          Please Key In Season (IU) / Vehicle No / Holder / Company Name (Partial Match)
        </label>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter season, vehicle no, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Centered Home Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
