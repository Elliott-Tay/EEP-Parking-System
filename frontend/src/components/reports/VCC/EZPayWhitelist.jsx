import React, { useState } from "react";

function EZPayWhitelistReport() {
  const [iuNo, setIuNo] = useState("");

  const handleSearch = () => {
    // TODO: Replace with API call to fetch EZPay Whitelist report
    console.log("Searching EZPay Whitelist Report for IU No:", iuNo);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">EZPay Whitelist Report</h1>

      {/* IU No Input */}
      <div className="flex gap-4 mb-6 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">IU No:</label>
          <input
            type="text"
            value={iuNo}
            onChange={(e) => setIuNo(e.target.value)}
            placeholder="Enter IU No..."
            className="border rounded p-2 w-full"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">IU No</th>
              <th className="border px-3 py-2 text-left">Vehicle No</th>
              <th className="border px-3 py-2 text-left">Valid From</th>
              <th className="border px-3 py-2 text-left">Valid To</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No record found!
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EZPayWhitelistReport;
