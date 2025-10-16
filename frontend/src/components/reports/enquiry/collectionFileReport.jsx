import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CepasCollectionFileReport() {
  const [reportDate, setReportDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reportData, setReportData] = useState([]);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      alert("Please select a start and end date.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/outstanding/cepas_collection?startDate=${startDate}&endDate=${endDate}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching report: " + error.message);
    }
  };

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => prev + 1);

  const inputClass =
    "px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">CEPAS Collection File Report</h1>

      {/* Filter Section */}
      <div className="w-full max-w-4xl bg-white border rounded-xl shadow-lg p-6 mb-6">
        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Report Date</label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col sm:col-span-2">
            <label className="text-gray-700 font-medium">Report Period</label>
            <div className="flex gap-2 items-center mt-1">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
              <span>~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
              <button
                onClick={handleSearch}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Cards */}
      <div className="w-full max-w-4xl grid gap-4">
        {reportData.length > 0 ? (
          reportData.map((row) => (
            <div
              key={row.id}
              className="bg-white border rounded-lg shadow p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <p className="text-gray-600 text-sm">
                  <strong>Send Date/Time:</strong>{" "}
                  {new Date(row.send_datetime).toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>File Name:</strong> {row.file_name}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center flex-1">
                <div>
                  <p className="text-gray-500 text-xs">Total No</p>
                  <p className="font-medium">{row.total_trans_no}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Total Amount</p>
                  <p className="font-medium">${row.total_trans_amount}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Fail No</p>
                  <p className="font-medium">{row.fail_trans_no}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Fail Amount</p>
                  <p className="font-medium">${row.fail_trans_amount}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">OK No</p>
                  <p className="font-medium">{row.ok_trans_no}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">OK Amount</p>
                  <p className="font-medium">${row.ok_trans_amount}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No data available for selected period.</p>
        )}
      </div>

      {/* Pagination */}
      {reportData.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handlePrevPage}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Next
          </button>
        </div>
      )}

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
  );
}
