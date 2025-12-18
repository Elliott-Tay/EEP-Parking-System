import React, { useState } from "react";
import { Search, Loader2, FileText, Calendar, DollarSign, TrendingUp, AlertCircle, BarChart3 } from "lucide-react";
import { toast } from "react-toastify";

function VCCCollectionComparison() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate statistics from records
  const statistics = {
    totalRecords: records.length,
    totalConsolidated: records.reduce((sum, r) => sum + (parseFloat(r.consolidatedSettlement) || 0), 0),
    totalAckMinusSettlement: records.reduce((sum, r) => sum + (parseFloat(r.acknowledgeMinusSettlement) || 0), 0),
    avgConsolidated: records.length > 0
      ? records.reduce((sum, r) => sum + (parseFloat(r.consolidatedSettlement) || 0), 0) / records.length
      : 0,
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setRecords([]);

    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/vcc/vcc-collection-comparison?${queryParams.toString()}`
      );

      const data = await res.json();

      if (data.success && data.data.length > 0) {
        setRecords(data.data);
        toast.success("Data Loaded Successfully", {
          description: `Retrieved ${data.data.length} record${data.data.length !== 1 ? 's' : ''}`,
        });
      } else {
        setError("No records found for the selected period.");
        toast.info("No Records Found", {
          description: "No collection comparison data found for the selected period",
        });
      }
    } catch (err) {
      console.error("Error fetching VCC comparison:", err);
      setError("Failed to fetch report. Please try again later.");
      toast.error("Error Fetching Report", {
        description: "Failed to retrieve VCC collection comparison data",
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              VCC Collection Comparison
            </h1>
          </div>
          <div className="bg-white/70 backdrop-blur-lg rounded-xl px-4 py-2 shadow-md border border-white/20">
            <p className="text-sm text-gray-600">
              Date:{" "}
              <span className="font-semibold text-gray-900">
                {new Date().toLocaleDateString("en-GB")}
              </span>{" "}
              <span className="text-gray-500">(D/M/Y)</span>
            </p>
          </div>
        </div>

        {/* Statistics Dashboard */}
        {records.length > 0 && (
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
                    Total
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {statistics.totalConsolidated.toFixed(2)}
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
                    Average
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {statistics.avgConsolidated.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Avg Consolidated</p>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                  <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    Difference
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {statistics.totalAckMinusSettlement.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Ack - Settlement</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Search Criteria</h2>
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-red-600" />
                Report Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:bg-white/80"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-red-600" />
                Report End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:bg-white/80"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" /> Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Comparison Results</h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {records.length > 0 ? `Showing ${records.length} record${records.length !== 1 ? 's' : ''}` : 'No records to display'}
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
                      { label: "S/N", icon: FileText },
                      { label: "Date", icon: Calendar },
                      { label: "Consolidated Settlement", icon: DollarSign },
                      { label: "Acknowledge Settlement - Consolidated", icon: TrendingUp },
                      { label: "Acknowledge - Settlement", icon: TrendingUp },
                    ].map((header) => (
                      <th key={header.label} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <header.icon className="w-4 h-4 text-gray-500" />
                          {header.label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-16">
                        {loading ? (
                          <div className="flex flex-col items-center justify-center">
                            <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                            <p className="text-gray-600 font-medium">Fetching comparison data...</p>
                            <p className="text-sm text-gray-500 mt-1">Please wait</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                              <AlertCircle className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-gray-600 font-medium">No records available</p>
                            <p className="text-sm text-gray-500 mt-1">Select a date range and click Search</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    records.map((r, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-100 to-orange-100 text-red-700 rounded-lg font-semibold text-sm">
                            {r.serialNo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 text-sm text-gray-900 font-medium">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            {new Date(r.date).toLocaleDateString("en-GB")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg font-medium text-sm">
                            <DollarSign className="w-4 h-4" />
                            {r.consolidatedSettlement ?? "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg font-medium text-sm">
                            <TrendingUp className="w-4 h-4" />
                            {r.acknowledgeSettlementConsolidated ?? "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg font-medium text-sm ${
                            parseFloat(r.acknowledgeMinusSettlement) >= 0
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-orange-50 text-orange-700'
                          }`}>
                            <TrendingUp className="w-4 h-4" />
                            {r.acknowledgeMinusSettlement ?? "-"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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

export default VCCCollectionComparison;
