// src/components/reports/CounterMonthlyStatistics.js
import React, { useState, useEffect } from "react";
import { Search, Download, Eye, Calendar } from "lucide-react";

export default function CounterMonthlyStatistics() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);

  // Dummy monthly data
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        month: "September 2025",
        counter: "A1",
        totalVehicles: 9500,
        avgDailyVehicles: 317,
        peakHourVehicles: 50,
        downtimeMinutes: 12,
      },
      {
        id: 2,
        month: "September 2025",
        counter: "B2",
        totalVehicles: 8800,
        avgDailyVehicles: 293,
        peakHourVehicles: 45,
        downtimeMinutes: 15,
      },
      {
        id: 3,
        month: "August 2025",
        counter: "A1",
        totalVehicles: 9200,
        avgDailyVehicles: 306,
        peakHourVehicles: 48,
        downtimeMinutes: 10,
      },
    ];
    setRecords(dummyData);
  }, []);

  const filteredRecords = records.filter(
    (r) =>
      r.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.counter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (record) => {
    console.log("Downloading Counter Monthly Statistics for:", record.month, record.counter);
  };

  const handlePreview = (record) => {
    console.log("Previewing Counter Monthly Statistics for:", record.month, record.counter);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Counter Monthly Statistics</h1>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by month or counter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border bg-white p-4 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Counters</p>
            <p className="text-lg font-semibold">{new Set(records.map(r => r.counter)).size}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Vehicles This Month</p>
            <p className="text-lg font-semibold">
              {records.reduce((sum, r) => sum + r.totalVehicles, 0)}
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-100">
            <Calendar className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Downtime (min)</p>
            <p className="text-lg font-semibold">
              {records.reduce((sum, r) => sum + r.downtimeMinutes, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Month</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Counter</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Vehicles</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Avg Daily Vehicles</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Peak Hour Vehicles</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Downtime (min)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{record.month}</td>
                  <td className="px-6 py-4 text-sm">{record.counter}</td>
                  <td className="px-6 py-4 text-sm">{record.totalVehicles}</td>
                  <td className="px-6 py-4 text-sm">{record.avgDailyVehicles}</td>
                  <td className="px-6 py-4 text-sm">{record.peakHourVehicles}</td>
                  <td className="px-6 py-4 text-sm">{record.downtimeMinutes}</td>
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
