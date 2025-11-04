import React, { useState, useEffect } from "react";
import { Search, Eye, Calendar, X, Download, TrendingUp, Users, DollarSign, FileText, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function CounterMonthlyStatistics() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // YYYY-MM
  const [loading, setLoading] = useState(false);

  const env_backend = process.env.REACT_APP_BACKEND_API_URL;

  useEffect(() => {
    if (!selectedMonth) return;

    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${env_backend}/api/movements/monthly/${selectedMonth}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": token ? `Bearer ${token}` : "",
            },
          }
        );
        const data = await res.json();
        setRecords(data.data || []);
        toast.success("Monthly statistics loaded successfully");
      } catch (err) {
        console.error("Error fetching monthly records:", err);
        setRecords([]);
        toast.error("Failed to load monthly statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, env_backend]);

  const filteredRecords = records.filter((r) =>
    Object.values(r).some((val) =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handlePreview = (record) => setSelectedRecord(record);
  const closeModal = () => setSelectedRecord(null);

  // Compute stats
  const totalRecords = filteredRecords.length;
  const totalVehicles = new Set(filteredRecords.map(r => r.vehicle_number)).size;
  const totalPaidAmount = filteredRecords.reduce((sum, r) => sum + (r.paid_amount || 0), 0);
  const totalParkingCharges = filteredRecords.reduce((sum, r) => sum + (r.parking_charges || 0), 0);

  const [year, month] = selectedMonth.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const avgDailyVehicles = daysInMonth ? totalVehicles / daysInMonth : 0;

  // --- CSV Download ---
  const handleDownloadCSV = () => {
    if (!filteredRecords.length) {
      toast.error("No records to download");
      return;
    }

    try {
      const headers = Object.keys(filteredRecords[0]);
      const csvContent = [
        headers.join(","),
        ...filteredRecords.map(r =>
          headers.map(h => r[h] ?? "").join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `counter_monthly_${selectedMonth}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV downloaded successfully");
    } catch (err) {
      toast.error("Failed to download CSV");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl tracking-tight text-gray-900">Counter Monthly Statistics</h1>
            <p className="text-sm text-gray-600 mt-1">Track and analyze monthly parking counter performance</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-xl shadow-gray-900/5 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Month Picker */}
          <div className="relative flex-shrink-0">
            <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500 pointer-events-none z-10" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="h-12 pl-11 pr-4 rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm 
                       focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 
                       transition-all duration-200 w-full lg:w-auto"
            />
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search all fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 w-full h-12 rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm 
                       focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 
                       transition-all duration-200 placeholder:text-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Download Button */}
          {filteredRecords.length > 0 && (
            <button
              onClick={handleDownloadCSV}
              className="flex items-center justify-center gap-2 px-6 h-12 bg-gradient-to-r from-red-500 to-red-600 
                       text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 
                       shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 flex-shrink-0"
            >
              <Download className="h-5 w-5" />
              <span className="hidden sm:inline">Download CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {selectedMonth && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard 
            label="Total Records" 
            value={totalRecords.toLocaleString()} 
            icon={FileText}
            color="blue" 
          />
          <StatCard 
            label="Total Vehicles" 
            value={totalVehicles.toLocaleString()} 
            icon={Users}
            color="green" 
          />
          <StatCard 
            label="Avg Daily Vehicles" 
            value={avgDailyVehicles.toFixed(1)} 
            icon={TrendingUp}
            color="purple" 
          />
          <StatCard 
            label="Total Paid Amount" 
            value={`$${totalPaidAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} 
            icon={DollarSign}
            color="yellow" 
          />
          <StatCard 
            label="Total Parking Charges" 
            value={`$${totalParkingCharges.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} 
            icon={DollarSign}
            color="red" 
          />
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-xl shadow-gray-900/5 p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
            <p className="text-gray-600">Loading monthly statistics...</p>
          </div>
        </div>
      ) : !selectedMonth ? (
        <div className="backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-xl shadow-gray-900/5 p-12">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg text-gray-900 mb-1">Select a Month</h3>
              <p className="text-sm text-gray-600">Please select a month to view statistics</p>
            </div>
          </div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-xl shadow-gray-900/5 p-12">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg text-gray-900 mb-1">No Records Found</h3>
              <p className="text-sm text-gray-600">
                {searchTerm ? "Try adjusting your search terms" : "No statistics available for this month"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-xl shadow-gray-900/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-red-50/30">
                    {Object.keys(records[0] || {}).map((col) => (
                      <th 
                        key={col} 
                        className="px-6 py-4 text-left text-xs tracking-wider text-gray-700 uppercase"
                      >
                        {col.replace(/_/g, ' ')}
                      </th>
                    ))}
                    <th className="px-6 py-4 text-left text-xs tracking-wider text-gray-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRecords.map((r, idx) => (
                    <tr 
                      key={r.log_id || idx} 
                      className="hover:bg-red-50/30 transition-colors duration-150"
                    >
                      {Object.values(r).map((val, i) => (
                        <td key={i} className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                          {val || "-"}
                        </td>
                      ))}
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handlePreview(r)} 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 
                                   text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 
                                   shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/40"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredRecords.map((r, idx) => (
              <div 
                key={r.log_id || idx}
                className="backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-lg shadow-gray-900/5 p-6 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {Object.entries(r).slice(0, 6).map(([key, val]) => (
                    <div key={key}>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-gray-900">{val || "-"}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => handlePreview(r)} 
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 
                           text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 
                           shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </button>
              </div>
            ))}
          </div>

          {/* Results Count */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredRecords.length} of {records.length} records
          </div>
        </>
      )}

      {/* Preview Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-red-50/30">
              <div>
                <h2 className="text-xl text-gray-900">Record Details</h2>
                <p className="text-sm text-gray-600 mt-1">Log ID: {selectedRecord.log_id}</p>
              </div>
              <button 
                onClick={closeModal} 
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(selectedRecord).map(([key, val]) => (
                  <div 
                    key={key} 
                    className="backdrop-blur-xl bg-gradient-to-br from-white/80 to-red-50/20 border border-gray-200/50 
                             rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-900 break-words">{val || "-"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50/50">
              <button 
                onClick={closeModal}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl 
                         hover:from-red-600 hover:to-red-700 transition-all duration-200 
                         shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
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

// Enhanced StatCard component
function StatCard({ label, value, icon: Icon, color }) {
  const colorStyles = {
    blue: {
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      light: "bg-blue-50",
      text: "text-blue-600",
      shadow: "shadow-blue-500/30"
    },
    green: {
      bg: "bg-gradient-to-br from-green-500 to-green-600",
      light: "bg-green-50",
      text: "text-green-600",
      shadow: "shadow-green-500/30"
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-500 to-purple-600",
      light: "bg-purple-50",
      text: "text-purple-600",
      shadow: "shadow-purple-500/30"
    },
    yellow: {
      bg: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      light: "bg-yellow-50",
      text: "text-yellow-600",
      shadow: "shadow-yellow-500/30"
    },
    red: {
      bg: "bg-gradient-to-br from-red-500 to-red-600",
      light: "bg-red-50",
      text: "text-red-600",
      shadow: "shadow-red-500/30"
    },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className="backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-lg shadow-gray-900/5 p-6 hover:shadow-xl transition-all duration-200 group">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${style.bg} ${style.shadow} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">
            {label}
          </p>
          <p className="text-2xl text-gray-900 truncate">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}