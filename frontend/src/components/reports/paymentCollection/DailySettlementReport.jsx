import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  Home,
  Info,
  Calendar,
  TrendingUp,
  DollarSign,
  FileText,
  Filter,
  Loader2
} from "lucide-react";
import { toast } from "react-toastify";

function DailySettlementReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Simulate fetching data
  useEffect(() => {
    const dummyData = [
      { id: 1, date: "2025-09-17", totalTransactions: 120, totalAmount: 4500 },
      { id: 2, date: "2025-09-16", totalTransactions: 98, totalAmount: 3800 },
      { id: 3, date: "2025-09-15", totalTransactions: 110, totalAmount: 4100 },
    ];
    setRecords(dummyData);
  }, []);

  const filteredRecords = records.filter(
    (r) =>
      r.date.includes(searchTerm) ||
      r.totalTransactions.toString().includes(searchTerm) ||
      r.totalAmount.toString().includes(searchTerm)
  );

  const handleDownload = (record) => {
    // Placeholder: implement CSV/Excel download here
    toast.success(`Downloading settlement file for ${record.date}`);
  };

  // Calculate statistics
  const totalRecords = filteredRecords.length;
  const totalTransactionsSum = filteredRecords.reduce((sum, r) => sum + r.totalTransactions, 0);
  const totalRevenueSum = filteredRecords.reduce((sum, r) => sum + r.totalAmount, 0);
  const avgTransactionsPerDay = totalRecords > 0 ? Math.round(totalTransactionsSum / totalRecords) : 0;

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
                <h1 className="text-3xl font-bold text-gray-900">Daily Settlement File</h1>
                <p className="text-sm text-gray-600 mt-1">
                  View and download daily settlement records for all transactions
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
              <p className="text-sm text-blue-700 mt-1">Search by date, transactions, or amount</p>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search by date, transactions or amount..."
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
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTransactionsSum.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${totalRevenueSum.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Avg per Day</p>
                  <p className="text-2xl font-bold text-gray-900">{avgTransactionsPerDay}</p>
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
                  <h3 className="font-semibold text-gray-900">Settlement Records</h3>
                </div>
                <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-medium">
                  {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                {searchTerm ? `Filtered by "${searchTerm}"` : 'All daily settlement records'}
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
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          Total Transactions
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          Total Amount (SGD)
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
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              {record.totalTransactions} txns
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">
                            ${record.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => handleDownload(record)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors duration-150"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-gray-500">
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
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                            {record.totalTransactions} txns
                          </span>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <TrendingUp className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">Transactions</span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">{record.totalTransactions}</p>
                          </div>

                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <DollarSign className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">Amount (SGD)</span>
                            </div>
                            <p className="text-sm font-mono font-medium text-gray-900">${record.totalAmount.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-gray-200">
                          <button
                            onClick={() => handleDownload(record)}
                            className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download Settlement File
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
                <h4 className="font-semibold text-blue-900 mb-2">Daily Settlement File Information</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>View comprehensive daily settlement records showing transaction counts and revenue totals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Use the search box to filter records by date, number of transactions, or total amount</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Click "Download" to export individual daily settlement files for accounting and reconciliation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Summary cards display total days recorded, aggregate transactions, total revenue, and daily averages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>All amounts are displayed in Singapore Dollars (SGD) with proper formatting</span>
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

export default DailySettlementReport;