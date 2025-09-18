import React, { useState } from "react";

function EZPayCollectionComparison() {
  const [reportDate, setReportDate] = useState("2025-09-18");
  const [reportPeriodStart, setReportPeriodStart] = useState("");
  const [reportPeriodEnd, setReportPeriodEnd] = useState("");

  const handleSearch = () => {
    // TODO: Replace with API call to fetch EZPay Collection Comparison
    console.log("Searching EZPay Collection Comparison:", {
      reportDate,
      reportPeriodStart,
      reportPeriodEnd,
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">EZPay Collection Comparison</h1>

      {/* Report Date */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Date (D/M/Y):</label>
        <input
          type="date"
          value={reportDate}
          onChange={(e) => setReportDate(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      {/* Report Period */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Report Period:</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={reportPeriodStart}
              onChange={(e) => setReportPeriodStart(e.target.value)}
              className="border rounded p-2"
            />
            <span className="flex items-center">~</span>
            <input
              type="date"
              value={reportPeriodEnd}
              onChange={(e) => setReportPeriodEnd(e.target.value)}
              className="border rounded p-2"
            />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Table placeholder */}
      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Column 1</th>
              <th className="border px-3 py-2 text-left">Column 2</th>
              <th className="border px-3 py-2 text-left">Column 3</th>
              <th className="border px-3 py-2 text-left">Column 4</th>
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

export default EZPayCollectionComparison;
