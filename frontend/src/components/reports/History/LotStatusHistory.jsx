import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Eye,
  X,
  Home,
  Info,
  Clock,
  User,
  Activity,
  CheckCircle2,
  XCircle,
  Filter,
  Download,
  Monitor
} from "lucide-react";
import { toast } from "react-toastify";

export default function LotStatusHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const navigate = useNavigate();

  // Fetch logs
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/remote-control/lot-status-history`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLogs(data);
      toast.success(`Loaded ${data.length} lot status records`);
    } catch (err) {
      console.error("Failed to fetch lot status logs:", err);
      setError("Failed to load lot status history");
      toast.error("Failed to load lot status history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    log =>
      log.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.users.toLowerCase?.().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = log => setSelectedLog(log);
  const handleCloseModal = () => setSelectedLog(null);
  const handleRefresh = () => {
    toast.info("Refreshing lot status history...");
    fetchLogs();
  };

  const downloadCSV = () => {
    if (!filteredLogs.length) {
      toast.warning("No logs to download");
      return;
    }

    const headers = ["Timestamp", "Zone", "Type", "Allocated", "Occupied", "User"];
    const rows = filteredLogs.map(log => [
      new Date(log.updated_at).toLocaleString(),
      log.zone,
      log.type,
      log.allocated,
      log.occupied,
      log.users
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map(e => e.map(cell => `"${cell}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lot_status_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Downloaded ${filteredLogs.length} lot status records`);
  };

  const totalLogs = filteredLogs.length;
  const totalAllocated = filteredLogs.reduce((sum, log) => sum + log.allocated, 0);
  const totalOccupied = filteredLogs.reduce((sum, log) => sum + log.occupied, 0);
  const uniqueZones = [...new Set(filteredLogs.map(log => log.zone))].length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-green-100/20"></div>
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.15) 1px, transparent 0)`,
        backgroundSize: '20px 20px'
      }}></div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center shadow-lg shadow-green-500/25">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lot Status History</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track all parking lot updates with allocation and occupancy details
            </p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg mb-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100/50 border-b px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-green-600" />
                <h2 className="font-semibold text-gray-900">Search & Actions</h2>
              </div>
            </div>
            <p className="text-sm text-green-700 mt-1">Filter lot history and perform operations</p>
          </div>
          <div className="p-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by zone, type, or user..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                disabled={loading}
                className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-green-500/25 transition-all duration-200 font-semibold"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={downloadCSV}
              disabled={loading || !logs.length}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25 transition-all duration-200 font-semibold"
            >
              <Download className="w-5 h-5" />
              Download CSV
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold"
            >
              <Home className="w-5 h-5" />
              Home
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{totalLogs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Allocated</p>
                <p className="text-2xl font-bold text-gray-900">{totalAllocated}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Occupied</p>
                <p className="text-2xl font-bold text-gray-900">{totalOccupied}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Zones</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueZones}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table and Cards */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
          <div className="bg-gradient-to-r from-green-50 to-green-100/50 border-b px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Lot Status Records</h3>
              </div>
              <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-medium">
                {filteredLogs.length} record{filteredLogs.length !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              {searchTerm ? `Filtered by "${searchTerm}"` : 'All lot status records'}
            </p>
          </div>

          <div className="p-6 overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full hidden lg:table">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" /> Timestamp
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                    Zone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                    Allocated
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                    Occupied
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-green-50/50 transition-colors duration-150">
                      <td className="px-4 py-3 text-sm font-mono text-gray-700">{new Date(log.updated_at).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{log.zone}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{log.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{log.allocated}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{log.occupied}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{log.users}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleViewDetails(log)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors duration-150"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Info className="w-8 h-8 text-gray-400" />
                        <p>{searchTerm ? `No records match "${searchTerm}"` : "No records found"}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {selectedLog && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <div
              className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Lot Status Details</h2>
                    <p className="text-sm text-gray-600">Detailed lot update information</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-gray-600" /><span className="text-xs text-gray-600 uppercase font-medium">Timestamp</span></div>
                  <p className="text-base font-mono font-bold text-gray-900">{new Date(selectedLog.updated_at).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2"><Monitor className="w-4 h-4 text-gray-600" /><span className="text-xs text-gray-600 uppercase font-medium">Zone</span></div>
                  <p className="text-base font-bold text-gray-900">{selectedLog.zone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-gray-600" /><span className="text-xs text-gray-600 uppercase font-medium">Type</span></div>
                  <p className="text-base font-bold text-gray-900">{selectedLog.type}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2"><User className="w-4 h-4 text-gray-600" /><span className="text-xs text-gray-600 uppercase font-medium">User</span></div>
                  <p className="text-base font-bold text-gray-900">{selectedLog.users}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-gray-600" /><span className="text-xs text-gray-600 uppercase font-medium">Allocated</span></div>
                  <p className="text-base font-bold text-gray-900">{selectedLog.allocated}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2"><XCircle className="w-4 h-4 text-gray-600" /><span className="text-xs text-gray-600 uppercase font-medium">Occupied</span></div>
                  <p className="text-base font-bold text-gray-900">{selectedLog.occupied}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-lg transition-all duration-200 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
