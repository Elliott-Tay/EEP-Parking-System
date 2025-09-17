// src/components/reports/DailyCashcardCollection.js
import React, { useState, useEffect } from "react";
import { Search, Download, Eye } from "lucide-react";

export default function DailyCashcardCollection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);

  // Dummy data for demonstration
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        date: "2025-09-17",
        totalCollection: 8500,
        transactions: 95,
        failedTransactions: 1,
      },
      {
        id: 2,
        date: "2025-09-16",
        totalCollection: 9200,
        transactions: 100,
        failedTransactions: 0,
      },
      {
        id: 3,
        date: "2025-09-15",
        totalCollection: 7800,
        transactions: 90,
        failedTransactions: 2,
      },
    ];
    setRecords(dummyData);
  }, []);

  const filteredRecords = records.filter(
    (r) =>
      r.date.includes(searchTerm) ||
      r.totalCollection.toString().includes(searchTerm) ||
      r.transactions.toString().includes(searchTerm) ||
      r.failedTransactions.toString().includes(searchTerm)
  );

  const handleDownload = (record) => {
    console.log("Downloading Daily Cashcard Collection for:", record.date);
  };

  const handlePreview = (record) => {
    console.log("Previewing Daily Cashcard Collection for:", record.date);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Daily Cashcard Collection</h1>

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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Collection</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Transactions</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Failed Transactions</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{record.date}</td>
                  <td className="px-6 py-4 text-sm">${record.totalCollection.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">{record.transactions}</td>
                  <td
                    className={`px-6 py-4 text-sm ${
                      record.failedTransactions > 0 ? "text-red-600 font-semibold" : "text-green-600"
                    }`}
                  >
                    {record.failedTransactions}
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
    </div>
  );
}
