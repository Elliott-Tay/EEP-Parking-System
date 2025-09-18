import React, { useState } from "react";

function SystemFunctionAudit() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    if (!startDate || !endDate) {
      alert("Please select a report period.");
      return;
    }

    // TODO: Call API to fetch audit data
    console.log({ startDate, endDate });
    alert(`Fetching audit data from ${startDate} to ${endDate}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">System Function Audit</h1>

      <div className="w-full max-w-xl bg-white border rounded-lg shadow p-6">
        <div className="mb-4 flex gap-4 items-center">
          <label className="text-gray-700 font-medium">Report Period:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span>~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        <div className="mt-6">
          <p className="text-gray-500 text-center">No record found!</p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default SystemFunctionAudit;
