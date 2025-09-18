import React, { useState } from "react";

function EZPayExitTransaction() {
  const [reportPeriodStart, setReportPeriodStart] = useState("");
  const [reportPeriodEnd, setReportPeriodEnd] = useState("");
  const [iuNo, setIuNo] = useState("");

  const handleSearch = () => {
    // TODO: Replace with API call to fetch EZPay Exit Transactions
    console.log("Searching EZPay Exit Transaction Report:", {
      reportPeriodStart,
      reportPeriodEnd,
      iuNo,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">EZPay Exit Transaction Enquiry</h1>

      {/* Filters */}
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

        <div>
          <label className="block text-sm font-medium mb-1">IU No:</label>
          <input
            type="text"
            value={iuNo}
            onChange={(e) => setIuNo(e.target.value)}
            placeholder="Enter IU No..."
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

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">IU/Ticket No</th>
              <th className="border px-3 py-2 text-left">Type</th>
              <th className="border px-3 py-2 text-left">Exit Time</th>
              <th className="border px-3 py-2 text-left">Parked Time</th>
              <th className="border px-3 py-2 text-left">Parking Fee</th>
              <th className="border px-3 py-2 text-left">Card Type</th>
              <th className="border px-3 py-2 text-left">Ticket No</th>
              <th className="border px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8} className="text-center py-4 text-gray-500">
                No record found!
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EZPayExitTransaction;
