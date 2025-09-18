import React, { useState } from "react";

function VCCCollectionComparison() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    // TODO: Replace with API call to fetch VCC Collection Comparison report
    console.log("Fetching VCC Collection Comparison Report:", { startDate, endDate });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">VCC Collection Comparison</h1>

      {/* Date Display */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Date: <span className="font-medium">{new Date().toLocaleDateString("en-GB")}</span> (D/M/Y)
        </p>
      </div>

      {/* Report Period */}
      <div className="flex gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Report Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Report End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Table Placeholder */}
      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Column 1</th>
              <th className="border px-3 py-2 text-left">Column 2</th>
              <th className="border px-3 py-2 text-left">Column 3</th>
              <th className="border px-3 py-2 text-left">Column 4</th>
              <th className="border px-3 py-2 text-left">Column 5</th>
              {/* Add more columns as needed */}
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

export default VCCCollectionComparison;
