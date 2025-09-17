// src/components/reports/DailyParkingDuration.js
import React, { useState, useEffect } from "react";
import { Search, Download, Eye } from "lucide-react";

export default function DailyParkingDuration() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);

  // Dummy data
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        date: "2025-09-16",
        counter: "A1",
        avgDuration: 75, // minutes
        maxDuration: 180,
        minDuration: 15,
        totalVehicles: 50,
      },
      {
        id: 2,
        date: "2025-09-16",
        counter: "B2",
        avgDuration: 90,
        maxDuration: 200,
        minDuration: 20,
        totalVehicles: 40,
      },
      {
        id: 3,
        date: "2025-09-15",
        counter: "A1",
        avgDuration: 60,
        maxDuration: 120,
        minDuration: 10,
        totalVehicles: 45,
      },
    ];
    setRecords(dummyData);
  }, []);

  const filteredRecords = records.filter(
    (r) =>
      r.date.includes(searchTerm) ||
      r.counter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (record) => {
    console.log("Downloading record:", record);
  };

  const handlePreview = (record) => {
    console.log("Previewing record:", record);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Daily Parking Duration</h1>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by date or counter..."
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Counter</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Avg Duration (min)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Max Duration (min)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Min Duration (min)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Vehicles</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{record.date}</td>
                  <td className="px-6 py-4 text-sm">{record.counter}</td>
                  <td className="px-6 py-4 text-sm">{record.avgDuration}</td>
                  <td className="px-6 py-4 text-sm">{record.maxDuration}</td>
                  <td className="px-6 py-4 text-sm">{record.minDuration}</td>
                  <td className="px-6 py-4 text-sm">{record.totalVehicles}</td>
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
                <td colSpan={7} className="text-center py-4 text-gray-500">
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
