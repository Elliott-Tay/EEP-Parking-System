import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Car,
  Clock,
  Hash,
  CreditCard,
  ArrowRight,
  Home,
  Filter,
  Info,
  AlertCircle,
  CheckCircle,
  Loader2,
  DollarSign,
  FileText
} from "lucide-react";
import { toast } from "react-toastify";

export default function EntryTransaction() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ticketSearch, setTicketSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        ticket_search: ticketSearch
      });

      const token = localStorage.getItem('token');

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/entry-transactions?${queryParams.toString()}`,
        { 
          method: "GET", 
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          }, 
        }
      );

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      setResults(data);
      
      if (data.length > 0) {
        toast.success(`Found ${data.length} entry transaction${data.length !== 1 ? 's' : ''}`);
      } else {
        toast.info("No entry transactions found for the selected criteria");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch entry transactions.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString();
  };

  const getStatusInfo = (item) => {
    if (item.exit_trans_type) {
      return {
        label: "Exited",
        color: "bg-red-100 text-red-800 border-red-300",
        icon: "bg-red-500"
      };
    }
    return {
      label: "In Parking",
      color: "bg-green-100 text-green-800 border-green-300",
      icon: "bg-green-500"
    };
  };

  const getFilterCount = () => {
    let count = 0;
    if (startDate) count++;
    if (endDate) count++;
    if (ticketSearch) count++;
    return count;
  };

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
                <ArrowRight className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Entry Transaction Enquiry</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Search and view vehicle entry transactions with detailed information
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
                  {getFilterCount() > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                      {getFilterCount()} filter{getFilterCount() !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-blue-700 mt-1">Configure date range and search criteria to find entry transactions</p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Report Period */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Report Period
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:flex-1">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        disabled={isLoading}
                        className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">to</span>
                    <div className="relative w-full sm:flex-1">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={isLoading}
                        className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Ticket/Vehicle/Card Search */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Search className="w-4 h-4 text-gray-400" />
                    Ticket/Vehicle/Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={ticketSearch}
                      onChange={(e) => setTicketSearch(e.target.value)}
                      placeholder="Enter Ticket ID, Card Number, or Vehicle Number"
                      disabled={isLoading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Search by ticket ID, cashcard number, or vehicle registration number
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      isLoading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Search Transactions
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => navigate("/")}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
                  >
                    <Home className="w-5 h-5" />
                    Home
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {isLoading ? (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Searching entry transactions...</p>
                <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
              <div className="bg-gradient-to-r from-green-50 to-green-100/50 border-b px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Entry Transaction Records</h3>
                  </div>
                  <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-medium">
                    {results.length} record{results.length !== 1 ? 's' : ''} found
                  </span>
                </div>
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
                            Card No
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                          <div className="flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 text-green-600" />
                            Entry Type
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            Entry Time
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
                            <FileText className="w-4 h-4 text-gray-400" />
                            Ticket Type
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            Paid Amount
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-gray-400" />
                            Status
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.map((item, idx) => {
                        const statusInfo = getStatusInfo(item);
                        return (
                          <tr key={idx} className="hover:bg-blue-50/50 transition-colors duration-150">
                            <td className="px-4 py-3">
                              <span className="font-mono text-sm text-gray-900">{item.card_number || "-"}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-900">{item.entry_trans_type || "-"}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">{formatDate(item.entry_datetime)}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-mono text-sm text-gray-900">{item.vehicle_number || "-"}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">{item.ticket_type || "-"}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-mono font-semibold text-sm text-gray-900">
                                ${(item.paid_amount || 0).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                                <span className={`w-2 h-2 rounded-full ${statusInfo.icon} animate-pulse`}></span>
                                {statusInfo.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {results.map((item, idx) => {
                    const statusInfo = getStatusInfo(item);
                    return (
                      <div 
                        key={idx}
                        className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="space-y-3">
                          {/* Header with Status */}
                          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4 text-gray-400" />
                              <span className="font-mono font-semibold text-gray-900">
                                {item.vehicle_number || "N/A"}
                              </span>
                            </div>
                            <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                              <span className={`w-2 h-2 rounded-full ${statusInfo.icon} animate-pulse`}></span>
                              {statusInfo.label}
                            </span>
                          </div>

                          {/* Card Number */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Card Number</span>
                            <span className="font-mono text-sm text-gray-900">{item.card_number || "-"}</span>
                          </div>

                          {/* Entry Type */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Entry Type</span>
                            <span className="text-sm text-gray-900">{item.entry_trans_type || "-"}</span>
                          </div>

                          {/* Entry Time */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Entry Time</span>
                            <span className="text-sm text-gray-700">{formatDate(item.entry_datetime)}</span>
                          </div>

                          {/* Ticket Type */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Ticket Type</span>
                            <span className="text-sm text-gray-700">{item.ticket_type || "-"}</span>
                          </div>

                          {/* Paid Amount */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-xs text-gray-600">Paid Amount</span>
                            </div>
                            <span className="font-mono font-semibold text-gray-900">
                              ${(item.paid_amount || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Entry Transactions Found</h3>
                <p className="text-sm text-gray-600 max-w-md">
                  Enter search criteria above and click "Search Transactions" to view entry transaction records with detailed information.
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
                <h4 className="font-semibold text-blue-900 mb-2">Search Tips</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Select a date range to filter transactions within a specific period</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Search by ticket ID, cashcard number, or vehicle registration number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Status shows whether the vehicle has exited or is still in the parking lot</span>
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