import React, { useState, useEffect } from "react";
import { Search, AlertCircle, Loader2, FileText, Car, Calendar, CheckCircle, XCircle, Shield } from "lucide-react";
import { toast } from "react-toastify";

function VCCWhitelistReport() {
  const [iuNo, setIuNo] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isExpired = (validTo) => new Date(validTo) < new Date();

  const statistics = {
    totalRecords: records.length,
    activeRecords: records.filter(r => !isExpired(r.validTo)).length,
    expiredRecords: records.filter(r => isExpired(r.validTo)).length,
    uniqueVehicles: new Set(records.map(r => r.vehicleNo)).size,
  };

  const fetchWhitelist = async (iuNoQuery = "") => {
    setLoading(true);
    setError("");
    setRecords([]);

    try {
      const query = iuNoQuery ? `?${new URLSearchParams({ iuNo: iuNoQuery })}` : "";
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/vcc/vcc-white-list${query}`);
      const data = await res.json();

      if (data.success) {
        setRecords(data.data);
        if (data.data.length === 0) {
          setError("No records found");
          toast.info("No Records Found", {
            description: "No whitelist entries match your search criteria",
          });
        } else {
          toast.success("Data Loaded Successfully", {
            description: `Retrieved ${data.data.length} whitelist record${data.data.length !== 1 ? 's' : ''}`,
          });
        }
      } else {
        const errorMsg = data.message || "No records found";
        setError(errorMsg);
        toast.error("Search Failed", {
          description: errorMsg,
        });
      }
    } catch (err) {
      console.error(err);
      const errorMsg = "Error fetching data";
      setError(errorMsg);
      toast.error("Connection Error", {
        description: "Failed to retrieve whitelist data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchWhitelist(iuNo.trim());
  const handleKeyPress = (e) => { if (e.key === "Enter") handleSearch(); };

  useEffect(() => { fetchWhitelist(); }, []);

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
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            VCC Whitelist Report
          </h1>
          <p className="text-gray-600">
            Monitor and manage authorized vehicle whitelist entries
          </p>
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
                    Total
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
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Active
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{statistics.activeRecords}</p>
                <p className="text-sm text-gray-600">Active Entries</p>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <XCircle className="w-8 h-8 text-red-600" />
                  <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    Expired
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{statistics.expiredRecords}</p>
                <p className="text-sm text-gray-600">Expired Entries</p>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Car className="w-8 h-8 text-purple-600" />
                  <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    Vehicles
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{statistics.uniqueVehicles}</p>
                <p className="text-sm text-gray-600">Unique Vehicles</p>
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
            <h2 className="text-xl font-semibold text-gray-800">Search Whitelist</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full max-w-md">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Shield className="w-4 h-4 text-red-600" />
                IU No
              </label>
              <input
                type="text"
                placeholder="Enter IU No or leave blank to fetch all entries"
                value={iuNo}
                onChange={(e) => setIuNo(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:bg-white/80"
              />
            </div>
            <button
              onClick={handleSearch}
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

        {/* Error Message */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Total Records Display */}
        {!loading && records.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <p className="text-blue-900 font-medium">
              Total Records: <span className="text-2xl font-bold">{records.length}</span>
            </p>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Whitelist Entries</h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {records.length > 0 ? `Showing ${records.length} authorized entr${records.length !== 1 ? 'ies' : 'y'}` : 'No entries to display'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Loading whitelist entries...</p>
                <p className="text-sm text-gray-500 mt-1">Please wait</p>
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <AlertCircle className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No whitelist entries found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria or leave IU No blank to see all</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      {[
                        { label: "IU No", icon: Shield },
                        { label: "Vehicle No", icon: Car },
                        { label: "Valid From", icon: Calendar },
                        { label: "Valid To", icon: Calendar },
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
                    {records.map((r, idx) => (
                      <tr
                        key={idx}
                        className={`transition-all duration-200 ${
                          isExpired(r.validTo)
                            ? "bg-red-50 hover:bg-red-100"
                            : "hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 font-medium text-gray-900">
                            <Shield className="w-4 h-4 text-blue-600" />
                            {r.iuNo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg font-medium text-sm">
                            <Car className="w-4 h-4" />
                            {r.vehicleNo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 text-sm text-gray-700">
                            <Calendar className="w-4 h-4 text-green-600" />
                            {new Date(r.validFrom).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isExpired(r.validTo) ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg font-bold text-sm">
                              <XCircle className="w-4 h-4" />
                              {new Date(r.validTo).toLocaleDateString()}
                              <span className="ml-1 text-xs">(Expired)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg font-medium text-sm">
                              <CheckCircle className="w-4 h-4" />
                              {new Date(r.validTo).toLocaleDateString()}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

export default VCCWhitelistReport;