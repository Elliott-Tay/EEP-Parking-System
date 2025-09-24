import React, { useState, useEffect } from "react";
import { Search, RefreshCw, Eye, X } from "lucide-react";

export default function RemoteControlHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null); // For modal

  // Fetch logs from backend
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/remote-control/remote-control-logs`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Assuming your API returns an array of logs
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch remote control logs:", err);
      setError("Failed to load remote control logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.device.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (log) => setSelectedLog(log);
  const handleCloseModal = () => setSelectedLog(null);
  const handleRefresh = () => fetchLogs();

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

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-red-600 text-center py-8">{error}</div>
      ) : (
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
                    <td className="px-6 py-4 text-sm">{new Date(log.event_time).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">{log.action}</td>
                    <td className="px-6 py-4 text-sm">{log.user}</td>
                    <td className="px-6 py-4 text-sm">{log.device}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
      )}

      {/* Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Log Details</h2>
            <p><strong>Timestamp:</strong> {new Date(selectedLog.event_time).toLocaleString()}</p>
            <p><strong>Action:</strong> {selectedLog.action}</p>
            <p><strong>User:</strong> {selectedLog.user}</p>
            <p><strong>Device:</strong> {selectedLog.device}</p>
            <p><strong>Status:</strong> {selectedLog.status}</p>
          </div>
        </div>
      )}
    </div>
  );
}