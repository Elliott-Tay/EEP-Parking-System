import React, { useState } from "react";

export default function UPOSCollectionFileReport() {
  const [reportDate, setReportDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageSize = 10;
  const inputClass =
    "px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select a start and end date.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/outstanding/upos_collection_file?startDate=${startDate}&endDate=${endDate}&page=${currentPage}&pageSize=${pageSize}`,
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
    } catch (error) {
      console.error(error);
      alert("Error fetching UPOS report: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-center">UPOS Collection File Report</h1>

      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Date Selection */}
        <section className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="text-gray-700 font-medium w-36">Report Date:</label>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className={inputClass}
          />
        </section>

        {/* Report Period */}
        <section className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="text-gray-700 font-medium w-36">Report Period:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
          />
          <span className="mx-2 font-semibold text-gray-600">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClass}
          />
          <button
            onClick={fetchReport}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </section>

        {/* Report Table */}
        <section className="overflow-x-auto border border-gray-300 rounded">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Send Date/Time</th>
                <th className="px-4 py-2 text-left">File Name</th>
                <th className="px-4 py-2 text-left">Total Trans</th>
                <th className="px-4 py-2 text-left">Last Total Trans</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : reportData.length > 0 ? (
                reportData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2">{new Date(row.send_datetime).toLocaleString()}</td>
                    <td className="px-4 py-2">{row.file_name}</td>
                    <td className="px-4 py-2">{row.total_trans}</td>
                    <td className="px-4 py-2">{row.last_total_trans}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No records found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Pagination */}
        <section className="flex justify-end items-center gap-3 mt-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Previous
          </button>
          <span className="px-2 py-1">Page {currentPage}</span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Next
          </button>
        </section>
      </div>
    </div>
  );
}
