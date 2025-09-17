import React, { useState, useEffect } from "react";
import { Search, Download } from "lucide-react";

function DailySettlementReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);

  // Simulate fetching data
  useEffect(() => {
    const dummyData = [
      { id: 1, date: "2025-09-17", totalTransactions: 120, totalAmount: 4500 },
      { id: 2, date: "2025-09-16", totalTransactions: 98, totalAmount: 3800 },
      { id: 3, date: "2025-09-15", totalTransactions: 110, totalAmount: 4100 },
    ];
    setRecords(dummyData);
  }, []);

  const filteredRecords = records.filter(
    (r) =>
      r.date.includes(searchTerm) ||
      r.totalTransactions.toString().includes(searchTerm) ||
      r.totalAmount.toString().includes(searchTerm)
  );

  const handleDownload = (record) => {
    // Placeholder: implement CSV/Excel download here
    console.log("Downloading settlement file for:", record.date);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Daily Settlement File</h1>
      <p className="text-gray-600 mb-6">
        View and download daily settlement records for all transactions.
      </p>

      {/* Search bar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by date, transactions or amount..."
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Transactions</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Amount (SGD)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{record.date}</td>
                  <td className="px-6 py-4 text-sm">{record.totalTransactions}</td>
                  <td className="px-6 py-4 text-sm">{record.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDownload(record)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DailySettlementReport;
