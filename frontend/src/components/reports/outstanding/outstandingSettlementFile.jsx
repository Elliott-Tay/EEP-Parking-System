import React, { useState } from "react";

function OutstandingSettlementFile() {
  const [fileDate, setFileDate] = useState("2025-09-18"); // Default date or can be removed

  const handleSearch = () => {
    // TODO: Replace with API call to fetch Outstanding Settlement Files
    console.log("Searching Outstanding Settlement File:", { fileDate });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Outstanding Settlement File</h1>

      {/* Optional: File Date */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">File Date (D/M/Y):</label>
        <input
          type="date"
          value={fileDate}
          onChange={(e) => setFileDate(e.target.value)}
          className="border rounded p-2"
        />
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
              <th className="border px-3 py-2 text-left">File Name</th>
              <th className="border px-3 py-2 text-left">Total Transaction</th>
              <th className="border px-3 py-2 text-left">Total Amount</th>
              <th className="border px-3 py-2 text-left">Create Date/Time</th>
              <th className="border px-3 py-2 text-left">Status</th>
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
}

export default OutstandingSettlementFile;
