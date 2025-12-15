import React, { useState } from "react";
import { Search, AlertCircle, Loader2, FileText, Clock, DollarSign, Car, CreditCard, CheckCircle, XCircle, Calendar, Timer } from "lucide-react";
import { toast } from "react-toastify";

function VCCExitTransaction() {
  const [iuNo, setIuNo] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate statistics from records
  const statistics = {
    totalRecords: records.length,
    totalParkingFee: records.reduce((sum, r) => sum + (parseFloat(r.ParkingFee) || 0), 0),
    avgParkedMinutes: records.length > 0 
      ? records.reduce((sum, r) => sum + (r.ParkedMinutes || 0), 0) / records.length 
      : 0,
    successCount: records.filter(r => r.Status?.toLowerCase().includes('success') || r.Status?.toLowerCase().includes('valid')).length,
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setRecords([]);

    try {
      const query = iuNo.trim() ? new URLSearchParams({ iuNo }).toString() : "";
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/vcc/vcc-exit-transactions${query ? `?${query}` : ""}`);
      const data = await res.json();

      if (data.success) {
        setRecords(data.data);
        if (data.data.length === 0) {
          setError("No records found");
          toast.info("No Records Found", {
            description: "No exit transactions match your search criteria",
          });
        } else {
          toast.success("Data Loaded Successfully", {
            description: `Retrieved ${data.data.length} exit transaction${data.data.length !== 1 ? 's' : ''}`,
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
        description: "Failed to retrieve exit transaction data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const getStatusBadge = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('success') || statusLower.includes('valid') || statusLower.includes('completed')) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          {status}
        </span>
      );
    } else if (statusLower.includes('fail') || statusLower.includes('invalid') || statusLower.includes('error')) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
          <XCircle className="w-3 h-3" />
          {status}
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
        {status}
      </span>
    );
  };

  const getCardTypeBadge = (cardType) => {
    const colors = {
      'VCC': 'bg-purple-100 text-purple-700',
      'Season': 'bg-blue-100 text-blue-700',
      'Cashcard': 'bg-green-100 text-green-700',
      'Complimentary': 'bg-orange-100 text-orange-700',
    };
    
    const color = colors[cardType] || 'bg-gray-100 text-gray-700';
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 ${color} rounded-full text-xs font-medium`}>
        <CreditCard className="w-3 h-3" />
        {cardType}
      </span>
    );
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
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            VCC Exit Transaction Enquiry
          </h1>
          <p className="text-gray-600">
            Search and analyze vehicle exit transactions
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
                <p className="text-sm text-gray-600">Exit Transactions</p>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Revenue
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  ${statistics.totalParkingFee.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Parking Fees</p>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Timer className="w-8 h-8 text-purple-600" />
                  <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    Average
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {Math.round(statistics.avgParkedMinutes)}
                </p>
                <p className="text-sm text-gray-600">Avg. Parked Minutes</p>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-8 h-8 text-orange-600" />
                  <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    Success
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{statistics.successCount}</p>
                <p className="text-sm text-gray-600">Successful Exits</p>
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

          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Car className="w-4 h-4 text-red-600" />
                IU No (optional)
              </label>
              <input
                type="text"
                placeholder="Enter IU No or leave empty to search all transactions"
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

        {/* Data Table */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Exit Transactions</h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {records.length > 0 ? `Showing ${records.length} transaction${records.length !== 1 ? 's' : ''}` : 'No transactions to display'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Loading exit transactions...</p>
                <p className="text-sm text-gray-500 mt-1">Please wait</p>
              </div>
            ) : records.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <AlertCircle className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No transactions found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria or leave IU No empty to see all</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      {[
                        { label: "IU/Ticket No", icon: FileText },
                        { label: "Type", icon: CreditCard },
                        { label: "Exit Time", icon: Calendar },
                        { label: "Parked Time", icon: Clock },
                        { label: "Parking Fee", icon: DollarSign },
                        { label: "Card Type", icon: CreditCard },
                        { label: "Vehicle No", icon: Car },
                        { label: "Ticket No", icon: FileText },
                        { label: "Status", icon: CheckCircle },
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
                        className="hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">{r.IUTicketNo}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                            {r.TransactionType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(r.ExitTime).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            {r.ParkedTimeText || `${r.ParkedMinutes} min`}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg font-medium text-sm">
                            <DollarSign className="w-3 h-3" />
                            {r.ParkingFee?.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getCardTypeBadge(r.CardType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                            <Car className="w-3 h-3 text-gray-500" />
                            {r.VehicleNo || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {r.TicketNo || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(r.Status)}
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

export default VCCExitTransaction;
