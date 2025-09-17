import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SeasonMasterHistoryEnquiry() {
  const [seasonSearch, setSeasonSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    // Normally call API to fetch data
    alert(`Searching for Season/Vehicle No: ${seasonSearch} from ${startDate} to ${endDate}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Season Master History Enquiry</h1>

      <div className="w-full max-w-4xl bg-white border rounded-lg shadow p-6">
        {/* Report Period */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4">
          <label className="text-gray-700 font-medium mb-1 md:mb-0">Report Period:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="mx-2">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Season / Vehicle Search */}
        <div className="mb-6 flex gap-2 items-center">
          <label className="text-gray-700 font-medium">Season / Vehicle No:</label>
          <input
            type="text"
            placeholder="Enter Season or Vehicle No..."
            value={seasonSearch}
            onChange={(e) => setSeasonSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border">No</th>
                <th className="px-3 py-2 border">Zone</th>
                <th className="px-3 py-2 border">Season No</th>
                <th className="px-3 py-2 border">Operator</th>
                <th className="px-3 py-2 border">Update Time</th>
                <th className="px-3 py-2 border">Status</th>
                <th className="px-3 py-2 border">Valid From</th>
                <th className="px-3 py-2 border">Valid To</th>
                <th className="px-3 py-2 border">Vehicle No</th>
                <th className="px-3 py-2 border">Holder Name</th>
                <th className="px-3 py-2 border">Holder Type</th>
                <th className="px-3 py-2 border">Unit No</th>
                <th className="px-3 py-2 border">Company</th>
                <th className="px-3 py-2 border">Tel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="14" className="text-center py-4 text-gray-500">
                  No record found!
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Home Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
