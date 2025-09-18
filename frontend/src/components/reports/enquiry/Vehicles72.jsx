import React, { useState } from "react";

function VehiclesParked72HoursReport() {
  const [reportMonth, setReportMonth] = useState("");

  const handleSearch = () => {
    // TODO: Replace with actual API call, e.g. `${process.env.REACT_APP_BACKEND_API_URL}/api/parked-72hours`
    console.log("Fetching Vehicles Parked >72 Hours", { reportMonth });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Vehicles Parked More Than 72 Hours Report
      </h1>

      {/* Report Month Selector */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">Report Month</label>
          <input
            type="month"
            value={reportMonth}
            onChange={(e) => setReportMonth(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">IU / Ticket No</th>
              <th className="border px-3 py-2 text-left">Entry Time</th>
              <th className="border px-3 py-2 text-left">Exit Time</th>
              <th className="border px-3 py-2 text-left">Parked Time (HH:MM)</th>
              <th className="border px-3 py-2 text-left">Paid Amt (S$)</th>
              <th className="border px-3 py-2 text-left">Vehicle No</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No record found!
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehiclesParked72HoursReport;
