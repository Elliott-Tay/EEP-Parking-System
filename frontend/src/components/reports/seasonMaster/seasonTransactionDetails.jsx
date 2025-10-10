import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Eye,
  Download,
  X,
  Home,
  Info,
  Search,
  CreditCard,
  User,
  Car,
  Building2,
  Calendar,
  CalendarCheck,
  Hash,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Filter
} from "lucide-react";
import { toast } from "react-toastify";

export default function SeasonTransactionDetails({ defaultSeasonId }) {
  const [seasonId, setSeasonId] = useState(defaultSeasonId || "");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewTx, setPreviewTx] = useState(null); // transaction to preview
  const navigate = useNavigate();

  const fetchTransactions = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/seasons/${id}/transactions`,
          { 
            headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          }, 
        }
      );
      const data = await response.json();
      setTransactions(data);
      toast.success(`Loaded ${data.length} transaction${data.length !== 1 ? 's' : ''} for season ${id}`);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setTransactions([]);
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (seasonId) fetchTransactions(seasonId);
  }, [seasonId]);

  const handleSearch = () => {
    fetchTransactions(seasonId);
  };

  const handleDownload = (tx) => {
    const csvContent =
      `Serial No,Season No,Vehicle No,Season Type,Holder Type,Holder Name,Company,Season Status,Address,Valid From,Valid To,Employee No,Telephone,Created At,Updated At\n` +
      `${tx.serial_no},${tx.season_no},${tx.vehicle_no},${tx.season_type},${tx.holder_type},${tx.holder_name},${tx.company},${tx.season_status},${tx.address},${tx.valid_from},${tx.valid_to},${tx.employee_no},${tx.telephone},${tx.created_at},${tx.updated_at}`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${tx.season_no}_transaction.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Downloaded transaction: ${tx.season_no}`);
  };

  // Calculate statistics
  const totalTransactions = transactions.length;
  const activeSeasons = transactions.filter(tx => tx.season_status === "Active" || tx.season_status === "active").length;
  const uniqueVehicles = [...new Set(transactions.map(tx => tx.vehicle_no))].length;
  const uniqueHolders = [...new Set(transactions.map(tx => tx.holder_name))].length;

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
                <h1 className="text-3xl font-bold text-gray-900">Season Transaction Details</h1>
                <p className="text-sm text-gray-600 mt-1">
                  View transaction history for season parking cards
                </p>
              </div>
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-900">Search Season</h2>
                </div>
              </div>
              <p className="text-sm text-blue-700 mt-1">Enter season number to view transaction history</p>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Season ID Input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Enter Season No"
                    value={seasonId}
                    onChange={(e) => setSeasonId(e.target.value)}
                    disabled={loading}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={loading || !seasonId}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-orange-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>

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

          {/* Loading State */}
          {loading ? (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading transactions...</p>
                <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
              </div>
            </div>
          ) : !seasonId ? (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <CreditCard className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Enter Season Number</h3>
                <p className="text-sm text-gray-600 max-w-md">
                  Please enter a season number in the search box above to view transaction details.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Transactions</p>
                      <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Active Seasons</p>
                      <p className="text-2xl font-bold text-gray-900">{activeSeasons}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Car className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Unique Vehicles</p>
                      <p className="text-2xl font-bold text-gray-900">{uniqueVehicles}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Unique Holders</p>
                      <p className="text-2xl font-bold text-gray-900">{uniqueHolders}</p>
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
                      <h3 className="font-semibold text-gray-900">Transaction Records</h3>
                    </div>
                    <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-medium">
                      {transactions.length} record{transactions.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Season: {seasonId}
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
                              <Hash className="w-4 h-4 text-gray-400" />
                              Serial No
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-gray-400" />
                              Season No
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4 text-gray-400" />
                              Vehicle No
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              Holder Name
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              Company
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Info className="w-4 h-4 text-gray-400" />
                              Status
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              Valid From
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <CalendarCheck className="w-4 h-4 text-gray-400" />
                              Valid To
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {transactions.length > 0 ? (
                          transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                              <td className="px-4 py-3 text-sm text-gray-700">{tx.serial_no}</td>
                              <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">{tx.season_no}</td>
                              <td className="px-4 py-3 text-sm font-mono text-gray-700">{tx.vehicle_no}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{tx.holder_name}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{tx.company}</td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                    tx.season_status === "Active" || tx.season_status === "active"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  }`}
                                >
                                  {tx.season_status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{tx.valid_from}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{tx.valid_to}</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setPreviewTx(tx)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors duration-150"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Preview
                                  </button>
                                  <button
                                    onClick={() => handleDownload(tx)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors duration-150"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={9} className="text-center py-8 text-gray-500">
                              <div className="flex flex-col items-center gap-2">
                                <Info className="w-8 h-8 text-gray-400" />
                                <p>No transactions found</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile/Tablet Card View */}
                  <div className="lg:hidden space-y-4">
                    {transactions.length > 0 ? (
                      transactions.map((tx) => (
                        <div 
                          key={tx.id}
                          className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="font-mono font-semibold text-gray-900">{tx.season_no}</span>
                              </div>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${
                                  tx.season_status === "Active" || tx.season_status === "active"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                }`}
                              >
                                {tx.season_status}
                              </span>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-1 gap-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <div className="flex items-center gap-1 mb-1">
                                    <Hash className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-600">Serial No</span>
                                  </div>
                                  <p className="text-sm text-gray-900">{tx.serial_no}</p>
                                </div>

                                <div>
                                  <div className="flex items-center gap-1 mb-1">
                                    <Car className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-600">Vehicle No</span>
                                  </div>
                                  <p className="text-sm font-mono text-gray-900">{tx.vehicle_no}</p>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <User className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">Holder Name</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{tx.holder_name}</p>
                              </div>

                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <Building2 className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">Company</span>
                                </div>
                                <p className="text-sm text-gray-900">{tx.company}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <div className="flex items-center gap-1 mb-1">
                                    <Calendar className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-600">Valid From</span>
                                  </div>
                                  <p className="text-sm text-gray-900">{tx.valid_from}</p>
                                </div>

                                <div>
                                  <div className="flex items-center gap-1 mb-1">
                                    <CalendarCheck className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-600">Valid To</span>
                                  </div>
                                  <p className="text-sm text-gray-900">{tx.valid_to}</p>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-3 border-t border-gray-200 flex gap-2">
                              <button
                                onClick={() => setPreviewTx(tx)}
                                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                Preview
                              </button>
                              <button
                                onClick={() => handleDownload(tx)}
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
                          <p>No transactions found</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Help Card */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Season Transaction Details Information</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Enter a season card number to view its complete transaction history and details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>View comprehensive information including holder details, vehicle numbers, and validity dates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Click "Preview" to see all transaction fields in a detailed modal view</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Download individual transaction records to CSV format for reporting and archiving</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Summary cards display total transactions, active seasons, unique vehicles, and unique holders</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTx && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200"
          onClick={() => setPreviewTx(null)}
        >
          <div 
            className="bg-white rounded-xl p-8 w-full max-w-4xl shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewTx(null)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-150"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Transaction Preview</h2>
                  <p className="text-sm text-gray-600">Complete transaction information</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {Object.entries(previewTx).map(([key, value]) => {
                // Determine icon based on key
                let IconComponent = Info;
                if (key === 'season_no') IconComponent = CreditCard;
                else if (key === 'vehicle_no') IconComponent = Car;
                else if (key === 'holder_name') IconComponent = User;
                else if (key === 'company') IconComponent = Building2;
                else if (key === 'valid_from') IconComponent = Calendar;
                else if (key === 'valid_to') IconComponent = CalendarCheck;
                else if (key === 'serial_no') IconComponent = Hash;
                else if (key === 'season_status') IconComponent = CheckCircle2;

                return (
                  <div key={key} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <IconComponent className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-600 uppercase tracking-wide font-medium block mb-1">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-sm font-medium text-gray-900 break-words">
                          {value}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => handleDownload(previewTx)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:-translate-y-0.5 font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download CSV
              </button>
              <button
                onClick={() => setPreviewTx(null)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5 font-semibold"
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