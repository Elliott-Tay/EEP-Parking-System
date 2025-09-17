// src/components/reports/NetsCollectionComparison.js
import React, { useState, useEffect } from "react";
import { Search, Download, Eye, BarChart3 } from "lucide-react";

export default function NetsCollectionComparison() {
  const [searchTerm, setSearchTerm] = useState("");
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // Dummy data for demonstration
    const dummyCollections = [
      { id: 1, date: "2025-09-15", counter: "Counter 1", amountSGD: 1025.50, amountUSD: 740.30 },
      { id: 2, date: "2025-09-15", counter: "Counter 2", amountSGD: 860.00, amountUSD: 620.20 },
      { id: 3, date: "2025-09-16", counter: "Counter 1", amountSGD: 1150.00, amountUSD: 830.00 },
    ];
    setCollections(dummyCollections);
  }, []);

  const filteredCollections = collections.filter(
    (c) =>
      c.counter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.date.includes(searchTerm)
  );

  const handleView = (record) => console.log("View:", record);
  const handleDownload = (record) => console.log("Download:", record);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-600" /> NETS Collection Comparison
        </h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by counter/date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Counter</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount (SGD)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount (USD)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCollections.length > 0 ? (
              filteredCollections.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{record.date}</td>
                  <td className="px-6 py-4 text-sm">{record.counter}</td>
                  <td className="px-6 py-4 text-sm">{record.amountSGD.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">{record.amountUSD.toFixed(2)}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleView(record)}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Eye className="h-4 w-4" /> View
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
