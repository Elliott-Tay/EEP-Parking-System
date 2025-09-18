import React, { useState } from "react";

function UPOSCollectionFileReport() {
  const [reportDate, setReportDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    // TODO: Replace with API call to fetch UPOS Collection File data
    console.log("Fetching UPOS Collection File Report", { reportDate, startDate, endDate });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">UPOS Collection File Report</h1>

      {/* Date */}
      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium">Date (D/M/Y)</label>
        <input
          type="date"
          value={reportDate}
          onChange={(e) => setReportDate(e.target.value)}
          className="border rounded p-2 w-full max-w-xs"
        />
      </div>

      {/* Report Period */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Report Period From (DD/MM/YYYY)</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Report Period To (DD/MM/YYYY)</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>

      {/* Pagination / Table Placeholder */}
      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">No</th>
              <th className="border px-3 py-2 text-left">IU/Cashcard/Ticket No</th>
              <th className="border px-3 py-2 text-left">Entry Time</th>
              <th className="border px-3 py-2 text-left">Exit Time</th>
              <th className="border px-3 py-2 text-left">Parking Fee</th>
              <th className="border px-3 py-2 text-left">Card Type</th>
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

      {/* Pagination */}
      <div className="mt-4 flex justify-end gap-2">
        <button className="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
        <button className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
      </div>
    </div>
  );
}

export default UPOSCollectionFileReport;
