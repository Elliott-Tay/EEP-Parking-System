import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Eye,
  AlertTriangle,
  Download,
  X,
  Home,
  Info,
  Loader2,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Filter,
  XCircle
} from "lucide-react";
import { toast } from "react-toastify";

export default function StationErrorHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null); // For modal
  const navigate = useNavigate();

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
      
      toast.success(`Loaded ${data.errors.length} error log${data.errors.length !== 1 ? 's' : ''}`);
    } catch (err) {
      console.error("Failed to fetch station errors:", err);
      setError("Failed to load station error history");
      toast.error("Failed to load station error history");
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
  const handleRefresh = () => {
    toast.info("Refreshing error logs...");
    fetchLogs();
  };

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
    
    toast.success(`Downloaded ${filteredLogs.length} error records`);
  };

  // Calculate statistics
  const totalErrors = filteredLogs.length;
  const resolvedErrors = filteredLogs.filter(log => log.resolved).length;
  const unresolvedErrors = filteredLogs.filter(log => !log.resolved).length;
  const criticalErrors = filteredLogs.filter(log => log.severity?.toLowerCase() === 'critical' || log.severity?.toLowerCase() === 'high').length;

  const getSeverityColor = (severity) => {
    const severityLower = severity?.toLowerCase() || 'n/a';
    switch (severityLower) {
      case 'critical':
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
      case 'moderate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    const severityLower = severity?.toLowerCase() || 'n/a';
    switch (severityLower) {
      case 'critical':
      case 'high':
        return <XCircle className="w-3 h-3" />;
      case 'medium':
      case 'moderate':
        return <AlertTriangle className="w-3 h-3" />;
      case 'low':
        return <Info className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-red-100/20"></div>
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(239, 68, 68, 0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      ></div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/25">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Station Error History</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Monitor and track station errors and system issues
                </p>
              </div>
            </div>
          </div>

          {/* Search and Actions Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-900">Search & Actions</h2>
                </div>
              </div>
              <p className="text-sm text-blue-700 mt-1">Filter errors and perform operations</p>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search by station, error, or severity..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    disabled={loading}
                    className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>

                {/* Download CSV Button */}
                <button
                  onClick={downloadCSV}
                  disabled={loading || !logs.length}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
                >
                  <Download className="w-5 h-5" />
                  Download CSV
                </button>

                {/* Home Button */}
                <button
                  onClick={() => navigate("/")}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
                >
                  <Home className="w-5 h-5" />
                  Home
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading error history...</p>
                <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Error Loading Data</h3>
                <p className="text-sm text-red-600 max-w-md">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg transition-all duration-200 font-semibold"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Errors</p>
                      <p className="text-2xl font-bold text-gray-900">{totalErrors}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Resolved</p>
                      <p className="text-2xl font-bold text-gray-900">{resolvedErrors}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Unresolved</p>
                      <p className="text-2xl font-bold text-gray-900">{unresolvedErrors}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Critical/High</p>
                      <p className="text-2xl font-bold text-gray-900">{criticalErrors}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-b px-6 py-4 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-gray-900">Error Log Records</h3>
                    </div>
                    <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full font-medium">
                      {filteredLogs.length} error{filteredLogs.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    {searchTerm ? `Filtered by "${searchTerm}"` : 'All station error logs'}
                  </p>
                </div>

                <div className="p-6">
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              Timestamp
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              Station
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-gray-400" />
                              Error
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Info className="w-4 h-4 text-gray-400" />
                              Severity
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-gray-400" />
                              Resolved
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredLogs.length > 0 ? (
                          filteredLogs.map(log => (
                            <tr key={log.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                              <td className="px-4 py-3 text-sm font-mono text-gray-700">{log.timestamp}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.station}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{log.error}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getSeverityColor(log.severity)}`}>
                                  {getSeverityIcon(log.severity)}
                                  <span className="ml-1">{log.severity}</span>
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {log.resolved ? (
                                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Yes
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    No
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <button
                                  onClick={() => handleViewDetails(log)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors duration-150"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-gray-500">
                              <div className="flex flex-col items-center gap-2">
                                <Info className="w-8 h-8 text-gray-400" />
                                <p>{searchTerm ? `No errors match "${searchTerm}"` : "No logs found"}</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile/Tablet Card View */}
                  <div className="lg:hidden space-y-4">
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map(log => (
                        <div 
                          key={log.id}
                          className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="font-semibold text-gray-900">{log.station}</span>
                              </div>
                              {log.resolved ? (
                                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Resolved
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Unresolved
                                </span>
                              )}
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-1 gap-3">
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">Timestamp</span>
                                </div>
                                <p className="text-sm font-mono text-gray-900">{log.timestamp}</p>
                              </div>

                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <AlertTriangle className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">Error Description</span>
                                </div>
                                <p className="text-sm text-gray-900">{log.error}</p>
                              </div>

                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <Info className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">Severity</span>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${getSeverityColor(log.severity)}`}>
                                  {getSeverityIcon(log.severity)}
                                  <span className="ml-1">{log.severity}</span>
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-3 border-t border-gray-200">
                              <button
                                onClick={() => handleViewDetails(log)}
                                className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Info className="w-8 h-8 text-gray-400" />
                          <p>{searchTerm ? `No errors match "${searchTerm}"` : "No logs found"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Help Card */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Station Error History Information</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Monitor all station errors and system issues with detailed timestamps and descriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Use the search box to filter errors by station name, error description, or severity level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Click "View" to see detailed information about a specific error in a modal dialog</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Download all error logs to CSV format for record-keeping and analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Summary cards show real-time statistics: total errors, resolved/unresolved counts, and critical errors</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedLog && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200"
          onClick={() => setSelectedLog(null)}
        >
          <div 
            className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-150"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Error Details</h2>
                  <p className="text-sm text-gray-600">Station error information</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Timestamp</span>
                  </div>
                  <p className="text-base font-mono font-bold text-gray-900">{selectedLog.timestamp}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Station</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">{selectedLog.station}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Severity</span>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${getSeverityColor(selectedLog.severity)}`}>
                    {getSeverityIcon(selectedLog.severity)}
                    <span className="ml-1">{selectedLog.severity}</span>
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Resolved</span>
                  </div>
                  <div>
                    {selectedLog.resolved ? (
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                        <XCircle className="w-4 h-4 mr-1" />
                        No
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Error Description</span>
                </div>
                <p className="text-base text-gray-900">{selectedLog.error}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedLog(null)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
