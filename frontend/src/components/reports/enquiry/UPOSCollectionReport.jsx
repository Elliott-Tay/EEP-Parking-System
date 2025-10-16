import React, { useState, useEffect } from "react";

export default function UPOSCollectionReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const fetchReport = async (page = currentPage) => {
    if (!startDate || !endDate) {
      alert("Please select a start and end date.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/outstanding/upos_collection_report?startDate=${startDate}&endDate=${endDate}&page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching UPOS report: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (reportData.length === pageSize) setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (startDate && endDate) fetchReport();
    // eslint-disable-next-line
  }, [currentPage]);

  const inputClass =
    "px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">UPOS Collection Report</h1>

      {/* Filter Card */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="text-gray-700 font-medium">Report Period:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
          />
          <span className="mx-2 text-gray-500">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClass}
          />
          <button
            onClick={() => {
              setCurrentPage(1);
              fetchReport(1);
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Report Table */}
      <div className="w-full max-w-6xl overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">S/N</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Consolidated</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : reportData.length > 0 ? (
              reportData.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1 + (currentPage - 1) * pageSize}</td>
                  <td className="px-4 py-2">{new Date(row.report_date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{row.consolidated}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-400 italic">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={handlePrevPage}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="font-medium text-gray-700">Page {currentPage}</span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
          disabled={reportData.length < pageSize}
        >
          Next
        </button>
      </div>
    </div>
  );
}
