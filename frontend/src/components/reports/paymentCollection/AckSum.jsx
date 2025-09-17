// src/components/reports/AckSumAnalysis.js
import React, { useState, useEffect } from "react";
import { Search, Download, Eye } from "lucide-react";

function AckSumAnalysis() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);

  // Dummy data for now
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        date: "2025-09-17",
        ackReceived: 120,
        sumExpected: 118,
        discrepancy: 2,
      },
      {
        id: 2,
        date: "2025-09-16",
        ackReceived: 100,
        sumExpected: 100,
        discrepancy: 0,
      },
      {
        id: 3,
        date: "2025-09-15",
        ackReceived: 105,
        sumExpected: 107,
        discrepancy: -2,
      },
    ];
    setRecords(dummyData);
  }, []);

  const filteredRecords = records.filter(
    (r) =>
      r.date.includes(searchTerm) ||
      r.ackReceived.toString().includes(searchTerm) ||
      r.sumExpected.toString().includes(searchTerm) ||
      r.discrepancy.toString().includes(searchTerm)
  );

  const handleDownload = (record) => {
    console.log("Downloading Ack/Sum report for:", record.date);
  };

  const handlePreview = (record) => {
    console.log("Previewing Ack/Sum report for:", record.date);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Analysis of Ack/Sum File</h1>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by date or counts..."
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Ack Received</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Sum Expected</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Discrepancy</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{record.date}</td>
                  <td className="px-6 py-4 text-sm">{record.ackReceived}</td>
                  <td className="px-6 py-4 text-sm">{record.sumExpected}</td>
                  <td
                    className={`px-6 py-4 text-sm ${
                      record.discrepancy !== 0 ? "text-red-600 font-semibold" : "text-green-600"
                    }`}
                  >
                    {record.discrepancy}
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

export default AckSumAnalysis;