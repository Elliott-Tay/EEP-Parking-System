import React, { useState, useEffect } from "react";
import { Search, RefreshCw, Eye, AlertTriangle, Download, X } from "lucide-react";

export default function StationErrorHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null); // For modal

  // Fetch station error history
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/movements/station-error-history`, 
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLogs(data.errors.map(err => ({
        id: err.id,
        timestamp: new Date(err.error_timestamp).toLocaleString("en-SG", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }),
        station: err.station_name,
        error: err.error_description,
        resolved: err.resolved,
        severity: err.severity || "N/A",
      })));
    } catch (err) {
      console.error("Failed to fetch station errors:", err);
      setError("Failed to load station error history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    log =>
      log.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.error.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.severity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (log) => setSelectedLog(log);
  const handleRefresh = () => fetchLogs();

  // CSV download
  const downloadCSV = () => {
    if (!logs.length) return;

    const headers = ["Timestamp", "Station", "Error", "Severity", "Resolved"];
    const rows = filteredLogs.map(log => [
      log.timestamp,
      log.station,
      log.error,
      log.severity,
      log.resolved ? "Yes" : "No",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map(e => e.map(cell => `"${cell}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `station_error_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
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
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Download className="h-4 w-4" /> Download CSV
          </button>
        </div>
      </div>

      {/* Table */}
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
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Station</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Error</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Severity</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Resolved</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
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
      )}

      {/* Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Error Details</h2>
            <p><strong>Timestamp:</strong> {selectedLog.timestamp}</p>
            <p><strong>Station:</strong> {selectedLog.station}</p>
            <p><strong>Error:</strong> {selectedLog.error}</p>
            <p><strong>Severity:</strong> {selectedLog.severity}</p>
            <p><strong>Resolved:</strong> {selectedLog.resolved ? "Yes" : "No"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
