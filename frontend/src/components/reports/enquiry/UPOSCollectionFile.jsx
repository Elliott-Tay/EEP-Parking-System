import React, { useState } from "react";
import { Search, AlertCircle, Loader2, FileText, Calendar, Activity, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { toast } from "react-toastify";

export default function UPOSCollectionFileReport() {
  const [reportDate, setReportDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageSize = 10;

  // Calculate statistics from reportData
  const statistics = {
    totalRecords: reportData.length,
    totalTransactions: reportData.reduce((sum, row) => sum + (parseInt(row.total_trans) || 0), 0),
    totalLastTrans: reportData.reduce((sum, row) => sum + (parseInt(row.last_total_trans) || 0), 0),
    avgTransactions: reportData.length > 0 
      ? Math.round(reportData.reduce((sum, row) => sum + (parseInt(row.total_trans) || 0), 0) / reportData.length)
      : 0,
  };

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select a start and end date.");
      toast.error("Missing Date Range", {
        description: "Please select both start and end dates",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/outstanding/upos_collection_file?startDate=${startDate}&endDate=${endDate}&page=${currentPage}&pageSize=${pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setReportData(data);
      
      if (data.length === 0) {
        toast.info("No Records Found", {
          description: "No UPOS collection files found for the selected date range",
        });
      } else {
        toast.success("Data Loaded Successfully", {
          description: `Retrieved ${data.length} collection file${data.length !== 1 ? 's' : ''}`,
        });
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching UPOS report: " + error.message);
      toast.error("Error Fetching Report", {
        description: error.message || "Failed to retrieve UPOS collection data",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            UPOS Collection File Report
          </h1>
          <p className="text-gray-600">
            Monitor and analyze UPOS collection file transactions
          </p>
        </div>

        {/* Statistics Dashboard */}
        {reportData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Files
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{statistics.totalRecords}</p>
                <p className="text-sm text-gray-600">Total Collection Files</p>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 text-green-600" />
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Total
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {statistics.totalTransactions.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Transactions</p>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    Last Total
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {statistics.totalLastTrans.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Last Total Trans</p>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 text-orange-600" />
                  <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    Average
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {statistics.avgTransactions.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Avg Transactions</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Panel */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Search Criteria</h2>
          </div>

          <div className="space-y-6">
            {/* Report Date */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 w-36">
                <Calendar className="w-4 h-4 text-red-600" />
                Report Date
              </label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:bg-white/80"
              />
            </div>

            {/* Report Period */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 w-36">
                <Calendar className="w-4 h-4 text-red-600" />
                Report Period
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full sm:w-auto px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:bg-white/80"
                />
                <span className="text-gray-500 font-medium">~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full sm:w-auto px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:bg-white/80"
                />
                <button
                  onClick={fetchReport}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Collection Files</h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {reportData.length > 0 ? `Showing ${reportData.length} file${reportData.length !== 1 ? 's' : ''}` : 'No files to display'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    {[
                      { label: "Send Date/Time", icon: Calendar },
                      { label: "File Name", icon: FileText },
                      { label: "Total Trans", icon: Activity },
                      { label: "Last Total Trans", icon: TrendingUp },
                    ].map((col) => (
                      <th
                        key={col.label}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-2">
                          <col.icon className="w-4 h-4 text-gray-500" />
                          {col.label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-16">
                        <div className="flex flex-col items-center justify-center">
                          <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                          <p className="text-gray-600 font-medium">Loading collection files...</p>
                          <p className="text-sm text-gray-500 mt-1">Please wait</p>
                        </div>
                      </td>
                    </tr>
                  ) : reportData.length > 0 ? (
                    reportData.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 text-sm text-gray-700">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            {new Date(row.send_datetime).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm">
                            <FileText className="w-4 h-4" />
                            {row.file_name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg font-medium text-sm">
                            <Activity className="w-4 h-4" />
                            {row.total_trans}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg font-medium text-sm">
                            <TrendingUp className="w-4 h-4" />
                            {row.last_total_trans}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-16">
                        <div className="flex flex-col items-center justify-center">
                          <div className="p-4 bg-gray-100 rounded-full mb-4">
                            <AlertCircle className="w-12 h-12 text-gray-400" />
                          </div>
                          <p className="text-gray-600 font-medium">No records found</p>
                          <p className="text-sm text-gray-500 mt-1">Try selecting a different date range</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {reportData.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Page <span className="font-semibold text-gray-900">{currentPage}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={reportData.length < pageSize}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
