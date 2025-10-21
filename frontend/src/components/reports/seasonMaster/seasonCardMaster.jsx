import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  CreditCard,
  Eye,
  Download,
  X,
  Home,
  Info,
  User,
  Car,
  Calendar,
  CalendarCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileDown,
  Filter
} from "lucide-react";
import { toast } from "react-toastify";

export default function SeasonCardMaster() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cards, setCards] = useState([]);
  const [modalCard, setModalCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch season cards from API
  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/seasons`, 
          {
            headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          },
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setCards(data);
        toast.success(`Loaded ${data.length} season card${data.length !== 1 ? 's' : ''}`);
      } catch (err) {
        console.error("Failed to fetch season cards:", err);
        setCards([]);
        setError("Failed to fetch season cards");
        toast.error("Failed to fetch season cards");
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  const filteredCards = cards.filter(
    (card) =>
      card.season_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.holder_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.vehicle_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Preview modal
  const handlePreview = (card) => setModalCard(card);
  const closeModal = () => setModalCard(null);

  // Download individual card (CSV row)
  const handleDownload = (card) => {
    const csvContent = `Season No,Holder Name,Vehicle No,Valid From,Valid To
${card.season_no},${card.holder_name},${card.vehicle_no},${card.valid_from},${card.valid_to}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${card.season_no}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Downloaded season card: ${card.season_no}`);
  };

  // Download all cards as CSV
  const handleDownloadAll = () => {
    if (!filteredCards.length) {
      toast.warning("No cards to download");
      return;
    }

    const csvHeader = "Season No,Holder Name,Vehicle No,Valid From,Valid To\n";
    const csvRows = cards
      .map(
        (c) =>
          `${c.season_no},${c.holder_name},${c.vehicle_no},${c.valid_from},${c.valid_to}`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `season_cards.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Downloaded ${cards.length} season cards`);
  };

  // Calculate statistics
  const totalCards = filteredCards.length;
  const activeCards = filteredCards.filter(card => {
    const validTo = new Date(card.valid_to);
    return validTo >= new Date();
  }).length;
  const expiredCards = totalCards - activeCards;
  const uniqueHolders = [...new Set(filteredCards.map(card => card.holder_name))].length;

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
                <h1 className="text-3xl font-bold text-gray-900">Season Card Master</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and view all season parking cards
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
                  <h2 className="font-semibold text-gray-900">Search & Actions</h2>
                </div>
              </div>
              <p className="text-sm text-blue-700 mt-1">Filter season cards and export data</p>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search by card, holder or vehicle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                    className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Download All Button */}
                <button
                  onClick={handleDownloadAll}
                  disabled={loading || !cards.length}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
                >
                  <Download className="w-5 h-5" />
                  Download All
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
                <p className="text-gray-600 font-medium">Loading season cards...</p>
                <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Error Loading Data</h3>
                <p className="text-sm text-red-600 max-w-md">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg transition-all duration-200 font-semibold"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Cards</p>
                      <p className="text-2xl font-bold text-gray-900">{totalCards}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Active Cards</p>
                      <p className="text-2xl font-bold text-gray-900">{activeCards}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Expired</p>
                      <p className="text-2xl font-bold text-gray-900">{expiredCards}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-purple-600" />
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
                      <CreditCard className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Season Card Records</h3>
                    </div>
                    <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-medium">
                      {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {searchTerm ? `Filtered by "${searchTerm}"` : 'All season cards'}
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
                              <CreditCard className="w-4 h-4 text-gray-400" />
                              Card Number
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
                              <Car className="w-4 h-4 text-gray-400" />
                              Vehicle Number
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              Start Date
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <CalendarCheck className="w-4 h-4 text-gray-400" />
                              Expiry Date
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredCards.length > 0 ? (
                          filteredCards.map((card) => {
                            const isExpired = new Date(card.valid_to) < new Date();
                            return (
                              <tr key={card.season_no} className="hover:bg-blue-50/50 transition-colors duration-150">
                                <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">{card.season_no}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{card.holder_name}</td>
                                <td className="px-4 py-3 text-sm font-mono text-gray-700">{card.vehicle_no}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{card.valid_from}</td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-700">{card.valid_to}</span>
                                    {isExpired && (
                                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                        Expired
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handlePreview(card)}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors duration-150"
                                    >
                                      <Eye className="w-4 h-4" />
                                      Preview
                                    </button>
                                    <button
                                      onClick={() => handleDownload(card)}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors duration-150"
                                    >
                                      <Download className="w-4 h-4" />
                                      Download
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-gray-500">
                              <div className="flex flex-col items-center gap-2">
                                <Info className="w-8 h-8 text-gray-400" />
                                <p>{searchTerm ? `No cards match "${searchTerm}"` : "No cards found"}</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile/Tablet Card View */}
                  <div className="lg:hidden space-y-4">
                    {filteredCards.length > 0 ? (
                      filteredCards.map((card) => {
                        const isExpired = new Date(card.valid_to) < new Date();
                        return (
                          <div 
                            key={card.season_no}
                            className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm"
                          >
                            <div className="space-y-3">
                              {/* Header */}
                              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <span className="font-mono font-semibold text-gray-900">{card.season_no}</span>
                                </div>
                                {isExpired && (
                                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                    Expired
                                  </span>
                                )}
                              </div>

                              {/* Details */}
                              <div className="grid grid-cols-1 gap-3">
                                <div>
                                  <div className="flex items-center gap-1 mb-1">
                                    <User className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-600">Holder Name</span>
                                  </div>
                                  <p className="text-sm font-medium text-gray-900">{card.holder_name}</p>
                                </div>

                                <div>
                                  <div className="flex items-center gap-1 mb-1">
                                    <Car className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-600">Vehicle Number</span>
                                  </div>
                                  <p className="text-sm font-mono text-gray-900">{card.vehicle_no}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <div className="flex items-center gap-1 mb-1">
                                      <Calendar className="w-3 h-3 text-gray-400" />
                                      <span className="text-xs text-gray-600">Start Date</span>
                                    </div>
                                    <p className="text-sm text-gray-900">{new Date(card.valid_from).toLocaleDateString("en-GB")}</p>
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-1 mb-1">
                                      <CalendarCheck className="w-3 h-3 text-gray-400" />
                                      <span className="text-xs text-gray-600">Expiry Date</span>
                                    </div>
                                    <p className="text-sm text-gray-900">{new Date(card.valid_to).toLocaleDateString("en-GB")}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="pt-3 border-t border-gray-200 flex gap-2">
                                <button
                                  onClick={() => handlePreview(card)}
                                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  Preview
                                </button>
                                <button
                                  onClick={() => handleDownload(card)}
                                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                  Download
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Info className="w-8 h-8 text-gray-400" />
                          <p>{searchTerm ? `No cards match "${searchTerm}"` : "No cards found"}</p>
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
                <h4 className="font-semibold text-blue-900 mb-2">Season Card Master Information</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>View and manage all season parking cards with holder and vehicle information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Use the search box to filter cards by card number, holder name, or vehicle number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Click "Preview" to view comprehensive details about a specific season card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Download individual cards or export all cards to CSV format for reporting and analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Summary cards show total cards, active cards, expired cards, and unique holders at a glance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalCard && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-150"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Season Card Details</h2>
                  <p className="text-sm text-gray-600">Complete card information</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Card Number</span>
                  </div>
                  <p className="text-base font-mono font-bold text-gray-900">{modalCard.season_no}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Holder Name</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">{modalCard.holder_name}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Vehicle Number</span>
                  </div>
                  <p className="text-base font-mono font-bold text-gray-900">{modalCard.vehicle_no}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Valid From</span>
                  </div>
                  <p className="text-base font-bold text-gray-900">{modalCard.valid_from}</p>
                </div>

                <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarCheck className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Valid To</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-base font-bold text-gray-900">{modalCard.valid_to}</p>
                    {new Date(modalCard.valid_to) < new Date() && (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Expired
                      </span>
                    )}
                    {new Date(modalCard.valid_to) >= new Date() && (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5 font-semibold"
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