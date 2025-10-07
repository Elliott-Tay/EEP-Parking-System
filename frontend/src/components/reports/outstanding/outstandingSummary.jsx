import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  FileText,
  Hash,
  DollarSign,
  Clock,
  Home,
  Filter,
  Info,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Send
} from "lucide-react";
import { toast } from "react-toastify";

// Reusable status badge
function StatusBadge({ sent }) {
  return sent ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
      <CheckCircle2 className="w-3.5 h-3.5" />
      Sent
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
      <AlertCircle className="w-3.5 h-3.5" />
      Pending
    </span>
  );
}

export default function OutstandingSummaryFile() {
  const [fileDate, setFileDate] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = `${process.env.REACT_APP_BACKEND_API_URL}/api/outstanding/summary`;
      if (fileDate) url += `?fileDate=${fileDate}`;

      const token = localStorage.getItem("token");
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      setRecords(data);
      
      if (data && data.length > 0) {
        toast.success(`Found ${data.length} summary file${data.length !== 1 ? 's' : ''}`);
      } else {
        toast.info("No summary files found");
      }
    } catch (err) {
      console.error(err);
      setRecords([]);
      toast.error("Failed to fetch summary files");
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics
  const totalTransactions = records.reduce((sum, r) => sum + (r.total_transaction || 0), 0);
  const totalAmount = records.reduce((sum, r) => sum + (r.total_amount || 0), 0);
  const sentCount = records.filter(r => !!r.send_time).length;
  const pendingCount = records.length - sentCount;

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
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Outstanding Summary Files</h1>
                <p className="text-sm text-gray-600 mt-1">
                  View and monitor outstanding transaction summary files
                </p>
              </div>
            </div>
          </div>

          {/* Search Form Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-900">Search Parameters</h2>
                </div>
              </div>
              <p className="text-sm text-blue-700 mt-1">Filter summary files by file date (optional)</p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* File Date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    File Date (Optional)
                  </label>
                  <div className="relative max-w-md">
                    <input
                      type="date"
                      value={fileDate}
                      onChange={(e) => setFileDate(e.target.value)}
                      disabled={loading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Leave empty to view all summary files, or select a specific date to filter
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      loading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5'
                    }`}
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

                  <button
                    onClick={() => navigate("/")}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
                  >
                    <Home className="w-5 h-5" />
                    Home
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading summary files...</p>
                <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
              </div>
            </div>
          ) : records.length > 0 ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Files</p>
                      <p className="text-2xl font-bold text-gray-900">{records.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Hash className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Transactions</p>
                      <p className="text-2xl font-bold text-gray-900">{totalTransactions.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center">
                      <Send className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Sent / Pending</p>
                      <p className="text-2xl font-bold text-gray-900">{sentCount} / {pendingCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-green-50 to-green-100/50 border-b px-6 py-4 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Summary File Records</h3>
                    </div>
                    <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-medium">
                      {records.length} file{records.length !== 1 ? 's' : ''} found
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {fileDate ? `Summary files for ${fileDate}` : 'All summary files'}
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
                              <FileText className="w-4 h-4 text-gray-400" />
                              File Name
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-gray-400" />
                              Total Transaction
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-yellow-600" />
                              Total Amount
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              Create Date/Time
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Send className="w-4 h-4 text-gray-400" />
                              Send Status
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {records.map((r) => (
                          <tr key={r.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                            <td className="px-4 py-3">
                              <span className="font-mono text-sm text-gray-900">{r.file_name}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium text-gray-900">{r.total_transaction}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-mono font-semibold text-sm text-gray-900">
                                ${r.total_amount.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">
                                {new Date(r.created_at).toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge sent={!!r.send_time} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-4">
                    {records.map((r) => (
                      <div 
                        key={r.id}
                        className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="space-y-3">
                          {/* Header with File Name and Status */}
                          <div className="flex items-start justify-between pb-3 border-b border-gray-200">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="font-mono text-sm font-semibold text-gray-900 truncate">
                                {r.file_name}
                              </span>
                            </div>
                            <StatusBadge sent={!!r.send_time} />
                          </div>

                          {/* Transaction Count */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Total Transaction</span>
                            <span className="text-sm font-medium text-gray-900">{r.total_transaction}</span>
                          </div>

                          {/* Amount */}
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-green-700">Total Amount</span>
                              </div>
                              <span className="font-mono font-semibold text-green-900">
                                ${r.total_amount.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Create Date/Time */}
                          <div className="pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">Create Date/Time</span>
                            </div>
                            <p className="text-sm text-gray-900">
                              {new Date(r.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : !loading && (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Summary Files Found</h3>
                <p className="text-sm text-gray-600 max-w-md">
                  {fileDate 
                    ? `No summary files found for ${fileDate}. Try a different date or clear the filter.`
                    : "Click the Search button to load summary files."}
                </p>
              </div>
            </div>
          )}

          {/* Help Card */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Summary File Information</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Outstanding summary files contain aggregated transaction data for reporting and reconciliation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>You can filter by file date or view all summary files by leaving the date field empty</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Each file shows total transactions, total amount, creation timestamp, and send status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span><strong>Sent</strong> status indicates the file has been successfully transmitted, while <strong>Pending</strong> means it's awaiting transmission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Use these records to track outstanding transactions and ensure proper data synchronization</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}