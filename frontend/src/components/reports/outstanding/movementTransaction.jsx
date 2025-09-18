import React, { useState } from "react";

function OutstandingMovementTransaction() {
  const [reportDate, setReportDate] = useState("2025-09-18");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    // TODO: Replace with API call to fetch movement transactions
    console.log("Searching Outstanding Movement Transaction:", {
      reportDate,
      startDate,
      endDate,
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Outstanding Movement Transaction</h1>

      {/* Report Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Date (D/M/Y):</label>
        <input
          type="date"
          value={reportDate}
          onChange={(e) => setReportDate(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      {/* Report Period */}
      <div className="mb-4 flex gap-2">
        <div>
          <label className="block text-sm font-medium mb-1">Report Period Start:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Report Period End:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
      >
        Search
      </button>

      {/* Table placeholder */}
      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">IU/Ticket No</th>
              <th className="border px-3 py-2 text-left">Type</th>
              <th className="border px-3 py-2 text-left">Entry Time</th>
              <th className="border px-3 py-2 text-left">Exit Time</th>
              <th className="border px-3 py-2 text-left">Parked Time</th>
              <th className="border px-3 py-2 text-left">Parking Fee</th>
              <th className="border px-3 py-2 text-left">Card Type</th>
              <th className="border px-3 py-2 text-left">Card No</th>
              <th className="border px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={9} className="text-center py-4 text-gray-500">
                No record found!
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OutstandingMovementTransaction;
