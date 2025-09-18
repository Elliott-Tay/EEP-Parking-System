import React, { useState } from "react";

function VCCExitTransaction() {
  const [iuNo, setIuNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    // TODO: Replace with API call to fetch VCC Exit Transactions
    console.log("Searching VCC Exit Transactions:", { iuNo, startDate, endDate });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">VCC Exit Transaction Enquiry</h1>

      {/* Report Period */}
      <div className="flex gap-4 mb-4 items-end">
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
        <div>
          <label className="block text-sm font-medium mb-1">IU No:</label>
          <input
            type="text"
            placeholder="Enter IU No"
            value={iuNo}
            onChange={(e) => setIuNo(e.target.value)}
            className="border rounded p-2 w-48"
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
              <th className="border px-3 py-2 text-left">Vehicle No</th>
              <th className="border px-3 py-2 text-left">Ticket No</th>
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

export default VCCExitTransaction;
