import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  Eye,
  Home,
  Info,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Filter,
  XCircle
} from "lucide-react";
import { toast } from "react-toastify";

export default function DailyCashcardCollection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Dummy data for demonstration
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        date: "2025-09-17",
        totalCollection: 8500,
        transactions: 95,
        failedTransactions: 1,
      },
      {
        id: 2,
        date: "2025-09-16",
        totalCollection: 9200,
        transactions: 100,
        failedTransactions: 0,
      },
      {
        id: 3,
        date: "2025-09-15",
        totalCollection: 7800,
        transactions: 90,
        failedTransactions: 2,
      },
    ];
    setRecords(dummyData);
  }, []);

  const filteredRecords = records.filter(
    (r) =>
      r.date.includes(searchTerm) ||
      r.totalCollection.toString().includes(searchTerm) ||
      r.transactions.toString().includes(searchTerm) ||
      r.failedTransactions.toString().includes(searchTerm)
  );

  const handleDownload = (record) => {
    console.log("Downloading Daily Cashcard Collection for:", record.date);
    toast.success(`Downloading cashcard collection for ${record.date}`);
  };

  const handlePreview = (record) => {
    console.log("Previewing Daily Cashcard Collection for:", record.date);
    toast.info(`Previewing cashcard collection for ${record.date}`);
  };

  // Calculate statistics
  const totalRecords = filteredRecords.length;
  const totalCollectionSum = filteredRecords.reduce((sum, r) => sum + r.totalCollection, 0);
  const totalTransactionsSum = filteredRecords.reduce((sum, r) => sum + r.transactions, 0);
  const totalFailedSum = filteredRecords.reduce((sum, r) => sum + r.failedTransactions, 0);

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
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Daily Cashcard Collection</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Monitor daily cashcard transactions and collection summaries
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
                  <h2 className="font-semibold text-gray-900">Search & Filter</h2>
                </div>
              </div>
              <p className="text-sm text-blue-700 mt-1">Search by date or totals</p>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search by date or totals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                    className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Home Button */}
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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Days</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRecords}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Collection</p>
                  <p className="text-2xl font-bold text-gray-900">${totalCollectionSum.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTransactionsSum.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  totalFailedSum > 0 ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {totalFailedSum > 0 ? (
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-600">Failed Txns</p>
                  <p className={`text-2xl font-bold ${
                    totalFailedSum > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>{totalFailedSum}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
            <div className="bg-gradient-to-r from-green-50 to-green-100/50 border-b px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Cashcard Collection Records</h3>
                </div>
                <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-medium">
                  {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {searchTerm ? `Filtered by "${searchTerm}"` : 'All daily cashcard collection records'}
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
                          <Calendar className="w-4 h-4 text-gray-400" />
                          Date
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          Total Collection
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          Transactions
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-gray-400" />
                          Failed Transactions
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{record.date}</td>
                          <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">
                            ${record.totalCollection.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              {record.transactions} txns
                            </span>
                          </td>
                          <td
                            className={`px-4 py-3 text-sm ${
                              record.failedTransactions > 0 ? "text-red-600 font-semibold" : "text-green-600"
                            }`}
                          >
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                              record.failedTransactions > 0
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-green-100 text-green-800 border-green-200"
                            }`}>
                              {record.failedTransactions > 0 && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {record.failedTransactions === 0 && <CheckCircle2 className="w-3 h-3 mr-1" />}
                              {record.failedTransactions}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handlePreview(record)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors duration-150"
                              >
                                <Eye className="w-4 h-4" /> Preview
                              </button>
                              <button
                                onClick={() => handleDownload(record)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors duration-150"
                              >
                                <Download className="w-4 h-4" /> Download
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500">
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

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden space-y-4">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <div 
                      key={record.id}
                      className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="font-semibold text-gray-900">{record.date}</span>
                          </div>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${
                            record.failedTransactions > 0
                              ? "bg-red-100 text-red-700 border-red-200"
                              : "bg-green-100 text-green-700 border-green-200"
                          }`}>
                            {record.failedTransactions > 0 && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {record.failedTransactions === 0 && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {record.failedTransactions} failed
                          </span>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <DollarSign className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">Total Collection</span>
                            </div>
                            <p className="text-sm font-mono font-medium text-gray-900">${record.totalCollection.toLocaleString()}</p>
                          </div>

                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <TrendingUp className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">Transactions</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{record.transactions}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-gray-200 flex gap-2">
                          <button
                            onClick={() => handlePreview(record)}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Preview
                          </button>
                          <button
                            onClick={() => handleDownload(record)}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Info className="w-8 h-8 text-gray-400" />
                      <p>{searchTerm ? `No records match "${searchTerm}"` : "No records found"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Help Card */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Daily Cashcard Collection Information</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Monitor daily cashcard collection summaries including transaction counts and total revenue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Use the search box to filter records by date, collection amount, or transaction counts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Failed transactions are highlighted in red and require investigation to ensure payment processing accuracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Click "Preview" to view detailed information or "Download" to export individual daily reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Summary cards provide quick insights: total days, aggregate collections, transactions, and failed transaction counts</span>
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