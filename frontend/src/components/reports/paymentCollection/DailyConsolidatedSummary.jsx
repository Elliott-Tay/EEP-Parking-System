import React, { useState, useEffect } from "react";
import { Search, Download, Eye, X } from "lucide-react";

function DailyConsolidatedSummary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewRecord, setPreviewRecord] = useState(null);

  // Fetch data from backend API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/daily-consolidated-summary`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": token ? `Bearer ${token}` : "",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        const formatted = data.map((d, index) => ({
          id: index + 1,
          date: d.log_date.split("T")[0], // Keep only YYYY-MM-DD
          totalPayments: d.totalPayments,
          totalTransactions: d.totalTransactions,
          discrepancies: d.discrepancies,
        }));

        setRecords(formatted);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRecords = records.filter(
    (r) =>
      r.date.includes(searchTerm) ||
      r.totalPayments.toString().includes(searchTerm) ||
      r.totalTransactions.toString().includes(searchTerm) ||
      r.discrepancies.toString().includes(searchTerm)
  );

  const handleDownload = (record) => {
    // Convert the record to CSV
    const headers = Object.keys(record).filter((k) => k !== "id");
    const csvContent = [
      headers.join(","), // header
      headers.map((h) => `"${record[h]}"`).join(","), // row
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `daily_summary_${record.date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePreview = (record) => {
    setPreviewRecord(record);
  };

  const closeModal = () => setPreviewRecord(null);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Daily Consolidated Summary</h1>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by date or totals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Payments</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Transactions</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Number of transactions</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{record.date}</td>
                  <td className="px-6 py-4 text-sm">${record.totalPayments.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">{record.totalTransactions}</td>
                  <td
                    className={`px-6 py-4 text-sm ${
                      record.discrepancies !== 0 ? "text-red-600 font-semibold" : "text-green-600"
                    }`}
                  >
                    {record.discrepancies}
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => handlePreview(record)}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Eye className="h-4 w-4" /> Preview
                    </button>
                    <button
                      onClick={() => handleDownload(record)}
                      className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <Download className="h-4 w-4" /> Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {previewRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Preview: {previewRecord.date}</h2>
            <ul className="space-y-2">
              <li>Total Payments: ${previewRecord.totalPayments.toLocaleString()}</li>
              <li>Total Transactions: {previewRecord.totalTransactions}</li>
              <li>Discrepancies: {previewRecord.discrepancies}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyConsolidatedSummary;
