// src/components/reports/StationErrorHistory.js
import React, { useState, useEffect } from "react";
import { Search, RefreshCw, Eye, AlertTriangle } from "lucide-react";

export default function StationErrorHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState([]);

  // Dummy data for illustration
  useEffect(() => {
    const dummyLogs = [
      { id: 1, timestamp: "2025-09-15 08:45:12", station: "Barrier 1", error: "Sensor Malfunction", severity: "High", resolved: false },
      { id: 2, timestamp: "2025-09-15 09:15:47", station: "Payment Terminal 3", error: "Card Reader Error", severity: "Medium", resolved: true },
      { id: 3, timestamp: "2025-09-15 10:22:03", station: "Barrier 2", error: "Motor Jam", severity: "High", resolved: false },
    ];
    setLogs(dummyLogs);
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.error.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.severity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (log) => console.log("View details:", log);
  const handleRefresh = () => console.log("Refreshing logs...");

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-600" /> Station Error History
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by station, error, or severity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Timestamp</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Station</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Error</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Severity</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Resolved</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{log.timestamp}</td>
                  <td className="px-6 py-4 text-sm">{log.station}</td>
                  <td className="px-6 py-4 text-sm">{log.error}</td>
                  <td className="px-6 py-4 text-sm">{log.severity}</td>
                  <td className="px-6 py-4 text-sm">
                    {log.resolved ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Yes</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => handleViewDetails(log)}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Eye className="h-4 w-4" /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
