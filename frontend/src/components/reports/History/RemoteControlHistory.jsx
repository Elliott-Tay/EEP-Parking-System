// src/components/reports/RemoteControlHistory.js
import React, { useState, useEffect } from "react";
import { Search, RefreshCw, Eye } from "lucide-react";

export default function RemoteControlHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState([]);

  // Dummy data for illustration
  useEffect(() => {
    const dummyLogs = [
      { id: 1, timestamp: "2025-09-15 08:30:12", action: "Gate Open", user: "Admin", device: "Barrier 1", status: "Success" },
      { id: 2, timestamp: "2025-09-15 09:05:47", action: "Gate Close", user: "Security1", device: "Barrier 2", status: "Success" },
      { id: 3, timestamp: "2025-09-15 10:12:03", action: "Gate Open", user: "Admin", device: "Barrier 3", status: "Failed" },
    ];
    setLogs(dummyLogs);
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.device.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (log) => console.log("View details:", log);
  const handleRefresh = () => console.log("Refreshing logs...");

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <RefreshCw className="h-6 w-6 text-blue-600" /> Remote Control History
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by action, user, or device..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">User</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Device</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{log.timestamp}</td>
                  <td className="px-6 py-4 text-sm">{log.action}</td>
                  <td className="px-6 py-4 text-sm">{log.user}</td>
                  <td className="px-6 py-4 text-sm">{log.device}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === "Success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {log.status}
                    </span>
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
