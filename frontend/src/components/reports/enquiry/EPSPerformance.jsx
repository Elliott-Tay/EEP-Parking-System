import React, { useState } from "react";

function EPSPerformanceReport() {
  const [reportDate, setReportDate] = useState("");
  const [stationName, setStationName] = useState("");

  const handleSearch = () => {
    // TODO: Replace with API call to fetch EPS performance data
    console.log("Fetching EPS Performance Report", { reportDate, stationName });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">EPS Performance Report</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Report Date</label>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Station Name</label>
          <input
            type="text"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            placeholder="Entry 1 / Exit 1"
            className="w-full border rounded p-2"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Time</th>
              <th className="border px-3 py-2 text-left">Hourly No of Cases</th>
              <th className="border px-3 py-2 text-left">Hourly Percentage</th>
              <th className="border px-3 py-2 text-left">Season Total No of Cases</th>
              <th className="border px-3 py-2 text-left">Season Total Percentage</th>
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

export default EPSPerformanceReport;
