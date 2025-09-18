import React, { useState } from "react";

function VCCWhitelistReport() {
  const [iuNo, setIuNo] = useState("");

  const handleSearch = () => {
    // TODO: Replace with API call to fetch VCC Whitelist Report
    console.log("Searching VCC Whitelist for IU No:", iuNo);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">VCC Whitelist Report</h1>

      {/* IU No Input */}
      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium">IU No:</label>
        <input
          type="text"
          placeholder="Enter IU No"
          value={iuNo}
          onChange={(e) => setIuNo(e.target.value)}
          className="border rounded p-2 w-full max-w-xs"
        />
      </div>

      <button
        onClick={handleSearch}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>

      {/* Table Placeholder */}
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

export default VCCWhitelistReport;
