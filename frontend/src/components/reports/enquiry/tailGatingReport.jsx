import React, { useState } from "react";

function TailgatingReport() {
  const [iuNo, setIuNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    // TODO: Call backend API here, e.g. `${process.env.REACT_APP_BACKEND_API_URL}/api/tailgating`
    console.log("Searching Tailgating Report", {
      iuNo,
      startDate,
      endDate,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tailgating Report</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Report Period (From)
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">
            Report Period (To)
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">IU No</label>
          <input
            type="text"
            value={iuNo}
            onChange={(e) => setIuNo(e.target.value)}
            placeholder="Enter IU Number"
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">IU No</th>
              <th className="border px-3 py-2 text-left">Cashcard No</th>
              <th className="border px-3 py-2 text-left">Exit ID</th>
              <th className="border px-3 py-2 text-left">Date/Time of Entry</th>
              <th className="border px-3 py-2 text-left">Date/Time of Occurrence</th>
              <th className="border px-3 py-2 text-left">Evaded Parking Fees</th>
              <th className="border px-3 py-2 text-left">Card Balance</th>
              <th className="border px-3 py-2 text-left">Video 1</th>
              <th className="border px-3 py-2 text-left">Video 2</th>
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
};

export default TailgatingReport;
