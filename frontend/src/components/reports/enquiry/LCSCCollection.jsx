import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Search, Home, Download, FileText, TrendingUp, DollarSign, FileCheck, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function LcscCashcardComparison() {
  const [reportDate, setReportDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const backend = process.env.REACT_APP_BACKEND_API_URL;

  // Calculate statistics from data
  const statistics = {
    totalRecords: data.length,
    totalConsolidated: data.reduce((sum, row) => sum + (parseFloat(row.Consolidated) || 0), 0),
    totalSettlement: data.reduce((sum, row) => sum + (parseFloat(row.Settlement) || 0), 0),
    totalAcknowledge: data.reduce((sum, row) => sum + (parseFloat(row.Acknowledge_Settlement) || 0), 0),
  };

  const fetchData = async () => {
    if (!startDate || !endDate) {
      toast.error("Missing Date Range", {
        description: "Please select both start and end dates",
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams({
        startDate,
        endDate,
        page: currentPage,
        pageSize,
      });

      const res = await fetch(
        `${backend}/api/outstanding/lcsc_cashcard_collection?${query.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch data");
      const result = await res.json();
      setData(result);
      
      if (result.length === 0) {
        toast.info("No Records Found", {
          description: "No data available for the selected date range",
        });
      } else {
        toast.success("Data Loaded Successfully", {
          description: `Retrieved ${result.length} record${result.length !== 1 ? 's' : ''}`,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error Fetching Data", {
        description: err.message || "Failed to retrieve cashcard comparison data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => prev + 1);

  const downloadCSV = () => {
    if (data.length === 0) {
      toast.error("No Data to Export", {
        description: "Please load data before downloading",
      });
      return;
    }

    const headers = [
      "S/N",
      "Date",
      "Consolidated",
      "Settlement",
      "Acknowledge",
      "Settlement - Consolidated",
      "Acknowledge - Settlement"
    ];

    const escapeCSV = (str) => {
      if (str == null) return '""';
      const stringified = String(str);
      if (stringified.includes('"') || stringified.includes(',') || stringified.includes('\n')) {
        return `"${stringified.replace(/"/g, '""')}"`;
      }
      return stringified;
    };

    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        [
          escapeCSV(row.S_N),
          escapeCSV(new Date(row.Date).toLocaleDateString("en-GB")),
          escapeCSV(row.Consolidated),
          escapeCSV(row.Settlement),
          escapeCSV(row.Acknowledge_Settlement),
          escapeCSV(row.Consolidated_Acknowledge),
          escapeCSV(row.Acknowledge_Settlement),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `lcsc_cashcard_comparison_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV Downloaded", {
      description: "Your report has been exported successfully",
    });
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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
            <FileCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            LCSC Cashcard Collection Comparison
          </h1>
          <p className="text-gray-600">
            Compare and analyze cashcard collection records
          </p>
        </div>

        {/* Statistics Dashboard */}
        {data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Records
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{statistics.totalRecords}</p>
                <p className="text-sm text-gray-600">Total Records</p>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Consolidated
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  ${statistics.totalConsolidated.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Consolidated</p>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    Settlement
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  ${statistics.totalSettlement.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Settlement</p>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <FileCheck className="w-8 h-8 text-orange-600" />
                  <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    Acknowledge
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  ${statistics.totalAcknowledge.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Acknowledge</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Date Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 text-red-600" />
                Date
              </label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:bg-white/80"
              />
            </div>

            {/* Report Period */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 text-red-600" />
                Report Period
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:bg-white/80"
                />
                <span className="text-gray-500 font-medium">~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:bg-white/80"
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
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

            {data.length > 0 && (
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5" />
                Download CSV
              </button>
            )}
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
                  <h2 className="text-xl font-semibold text-gray-800">Comparison Records</h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {data.length > 0 ? `Showing ${data.length} record${data.length !== 1 ? 's' : ''}` : 'No records to display'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Loading comparison data...</p>
                <p className="text-sm text-gray-500 mt-1">Please wait</p>
              </div>
            ) : data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <AlertCircle className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No records found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        {[
                          { label: "S/N", key: "sn" },
                          { label: "Date", key: "date" },
                          { label: "Consolidated", key: "consolidated" },
                          { label: "Settlement", key: "settlement" },
                          { label: "Acknowledge", key: "acknowledge" },
                          { label: "Settlement - Consolidated", key: "diff1" },
                          { label: "Acknowledge - Settlement", key: "diff2" },
                        ].map((col) => (
                          <th
                            key={col.key}
                            className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {data.map((row, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-100 to-orange-100 text-red-700 rounded-lg font-semibold text-sm">
                              {row.S_N}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {new Date(row.Date).toLocaleDateString("en-GB")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg font-medium">
                              ${parseFloat(row.Consolidated || 0).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg font-medium">
                              ${parseFloat(row.Settlement || 0).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-lg font-medium">
                              ${parseFloat(row.Acknowledge_Settlement || 0).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className={`px-3 py-1 rounded-lg font-medium ${
                              parseFloat(row.Consolidated_Acknowledge || 0) >= 0
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-red-50 text-red-700'
                            }`}>
                              ${parseFloat(row.Consolidated_Acknowledge || 0).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className={`px-3 py-1 rounded-lg font-medium ${
                              parseFloat(row.Acknowledge_Settlement || 0) >= 0
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-red-50 text-red-700'
                            }`}>
                              ${parseFloat(row.Acknowledge_Settlement || 0).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Page <span className="font-semibold text-gray-900">{currentPage}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={data.length < pageSize}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Home Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl hover:from-gray-800 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
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
