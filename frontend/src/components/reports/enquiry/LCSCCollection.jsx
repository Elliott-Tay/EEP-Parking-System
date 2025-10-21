import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LcscCashcardComparison() {
  const [reportDate, setReportDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const backend = process.env.REACT_APP_BACKEND_API_URL;

  const fetchData = async () => {
    if (!startDate || !endDate) {
      alert("Please select a start and end date");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams({
        startDate,
        endDate,
        page: currentPage,
        pageSize,
      });

      const res = await fetch(
        `${backend}/api/outstanding/lcsc_cashcard_collection?${query.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch data");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => prev + 1);

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        LCSC Cashcard Collection Comparison
      </h1>

      {/* Search Panel */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Date</label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2 md:mt-0">
            <label className="text-gray-700 font-medium">Report Period</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="mx-2 font-bold">~</span>
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
        </div>
      </div>

      {/* Data Table */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-6">
        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500 text-center">No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  {[
                    "S/N",
                    "Date",
                    "Consolidated",
                    "Settlement",
                    "Acknowledge",
                    "Settlement - Consolidated",
                    "Acknowledge - Settlement",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {data.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2 text-sm text-gray-700">{row.S_N}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {new Date(row.Date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {row.Consolidated}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">{row.Settlement}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{row.Acknowledge_Settlement}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{row.Consolidated_Acknowledge}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{row.Acknowledge_Settlement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handlePrevPage}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">Page {currentPage}</span>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
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
