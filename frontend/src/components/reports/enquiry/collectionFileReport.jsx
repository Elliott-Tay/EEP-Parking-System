import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CepasCollectionFileReport() {
  const [reportDate, setReportDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const handleSearch = () => {
    // Normally call API to fetch data
    alert(`Fetching CEPAS Collection from ${startDate} to ${endDate} for report date ${reportDate}`);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">CEPAS Collection File Report</h1>

      <div className="w-full max-w-3xl bg-white border rounded-lg shadow p-6">
        {/* Report Date */}
        <div className="mb-4 flex items-center gap-4">
          <label className="text-gray-700 font-medium">Date:</label>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Report Period */}
        <div className="mb-4 flex items-center gap-2">
          <label className="text-gray-700 font-medium">Report Period:</label>
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
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handlePrevPage}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={handleNextPage}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Next
          </button>
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
