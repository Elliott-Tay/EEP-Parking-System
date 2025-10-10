import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Bell,
  RefreshCw,
  Home,
  Info,
  CreditCard,
  User,
  CalendarCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter
} from "lucide-react";
import { toast } from "react-toastify";

export default function ToBeExpiredSeason() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/seasons/to-be-expired`, 
          {
            headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          },
        });
        // Map API data to your table format
        const mappedCards = res.data.map((item) => {
          const expiryDate = new Date(item.valid_to);
          const today = new Date();
          const timeDiff = expiryDate - today;
          const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          return {
            id: item.id,
            cardNumber: item.season_no,
            holderName: item.holder_name,
            expiryDate: expiryDate.toISOString().split("T")[0], // format as YYYY-MM-DD
            daysLeft,
            status: item.season_status === "Valid" ? "Active" : "Expired",
          };
        });
        setCards(mappedCards);
        toast.success(`Loaded ${mappedCards.length} season card${mappedCards.length !== 1 ? 's' : ''} to be expired`);
      } catch (err) {
        console.error("Error fetching to-be-expired seasons:", err);
        setError("Failed to fetch to-be-expired seasons or there are no expiring seasons this month.");
        toast.error("Failed to fetch to-be-expired seasons");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCards = cards.filter(
    (card) =>
      card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.holderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNotify = (card) => console.log("Notify holder:", card);
  const handleRenew = (card) => console.log("Renew card:", card);

  // Calculate statistics
  const totalCards = filteredCards.length;
  const criticalCards = filteredCards.filter(card => card.daysLeft <= 7).length;
  const warningCards = filteredCards.filter(card => card.daysLeft > 7 && card.daysLeft <= 30).length;
  const activeCards = filteredCards.filter(card => card.status === "Active").length;

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
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">To Be Expired Season Cards</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Monitor and manage season cards nearing expiration
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
              <p className="text-sm text-blue-700 mt-1">Filter season cards by card number or holder name</p>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search by card number or holder..."
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
                  <XCircle className="w-8 h-8 text-red-600" />
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
                    <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Critical (≤7 days)</p>
                      <p className="text-2xl font-bold text-gray-900">{criticalCards}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Warning (8-30 days)</p>
                      <p className="text-2xl font-bold text-gray-900">{warningCards}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Active Status</p>
                      <p className="text-2xl font-bold text-gray-900">{activeCards}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b px-6 py-4 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-gray-900">Expiring Season Cards</h3>
                    </div>
                    <span className="px-3 py-1 bg-orange-600 text-white text-sm rounded-full font-medium">
                      {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    {searchTerm ? `Filtered by "${searchTerm}"` : 'All season cards nearing expiration'}
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
                              <CalendarCheck className="w-4 h-4 text-gray-400" />
                              Expiry Date
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              Days Left
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Info className="w-4 h-4 text-gray-400" />
                              Status
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredCards.length > 0 ? (
                          filteredCards.map((card) => (
                            <tr key={card.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                              <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">{card.cardNumber}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{card.holderName}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{card.expiryDate}</td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                    card.daysLeft <= 7
                                      ? "bg-red-100 text-red-800 border-red-200"
                                      : card.daysLeft <= 30
                                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                      : "bg-green-100 text-green-800 border-green-200"
                                  }`}
                                >
                                  {card.daysLeft <= 7 && <AlertTriangle className="w-3 h-3 mr-1" />}
                                  {card.daysLeft > 7 && card.daysLeft <= 30 && <Clock className="w-3 h-3 mr-1" />}
                                  {card.daysLeft > 30 && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                  {card.daysLeft} days
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                    card.status === "Active"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : "bg-gray-100 text-gray-800 border-gray-200"
                                  }`}
                                >
                                  {card.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-gray-500">
                              <div className="flex flex-col items-center gap-2">
                                <Info className="w-8 h-8 text-gray-400" />
                                <p>{searchTerm ? `No cards match "${searchTerm}"` : "No expiring cards found"}</p>
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
                      filteredCards.map((card) => (
                        <div 
                          key={card.id}
                          className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="font-mono font-semibold text-gray-900">{card.cardNumber}</span>
                              </div>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${
                                  card.status === "Active"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                }`}
                              >
                                {card.status}
                              </span>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-1 gap-3">
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <User className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">Holder Name</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{card.holderName}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <div className="flex items-center gap-1 mb-1">
                                    <CalendarCheck className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-600">Expiry Date</span>
                                  </div>
                                  <p className="text-sm text-gray-900">{card.expiryDate}</p>
                                </div>

                                <div>
                                  <div className="flex items-center gap-1 mb-1">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-600">Days Left</span>
                                  </div>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${
                                      card.daysLeft <= 7
                                        ? "bg-red-100 text-red-700 border-red-200"
                                        : card.daysLeft <= 30
                                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                        : "bg-green-100 text-green-700 border-green-200"
                                    }`}
                                  >
                                    {card.daysLeft <= 7 && <AlertTriangle className="w-3 h-3 mr-1" />}
                                    {card.daysLeft > 7 && card.daysLeft <= 30 && <Clock className="w-3 h-3 mr-1" />}
                                    {card.daysLeft > 30 && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                    {card.daysLeft} days
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Info className="w-8 h-8 text-gray-400" />
                          <p>{searchTerm ? `No cards match "${searchTerm}"` : "No expiring cards found"}</p>
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
                <h4 className="font-semibold text-blue-900 mb-2">To Be Expired Season Cards Information</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Monitor season cards that are approaching expiration to prevent service disruptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Use the search box to filter cards by card number or holder name</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Critical alerts (red badge) show cards expiring within 7 days requiring immediate attention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Warning alerts (yellow badge) show cards expiring within 8-30 days for proactive renewal planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Summary cards display total expiring cards, critical cases, warnings, and active status counts</span>
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
