import React, { useState } from "react";

function HourlyMaxOccupancyReport() {
  const [zone, setZone] = useState("Main");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    // TODO: call API here with { zone, startDate, endDate }
    console.log("Searching Hourly Max Occupancy Report", {
      zone,
      startDate,
      endDate,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Counter Daily Statistic with Hourly/Season Maximum Occupancy
      </h1>

      {/* Date Display */}
      <div className="mb-4 text-gray-600">
        Date: <span className="font-medium">18/09/2025 (D/M/Y)</span>
      </div>

      {/* Form Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Carpark Zone</label>
          <input
            type="text"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Report Period (From)</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Report Period (To)</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>

      {/* Table Results */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Hour</th>
              <th className="border px-3 py-2 text-left">Zone</th>
              <th className="border px-3 py-2 text-left">Occupancy</th>
              <th className="border px-3 py-2 text-left">Season Max</th>
              <th className="border px-3 py-2 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No record found!
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HourlyMaxOccupancyReport;
