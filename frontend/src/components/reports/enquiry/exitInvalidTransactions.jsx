import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Car,
  Clock,
  Hash,
  CreditCard,
  AlertCircle,
  Home,
  Filter,
  Info,
  CheckCircle,
  Loader2,
  DollarSign,
  FileText,
  Timer,
  XCircle
} from "lucide-react";
import { toast } from "react-toastify";

export default function ExitInvalidTransactionDetail() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        ticket_id: ticketId,
        vehicle_number: vehicleNumber,
        card_number: cardNumber,
      });

      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/exit-invalid-transactions?${queryParams.toString()}`,
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
      console.log('data', data);
      setResults(data);
      
      if (data.length > 0) {
        toast.success(`Found ${data.length} exit invalid transaction${data.length !== 1 ? 's' : ''}`);
      } else {
        toast.info("No exit invalid transactions found for the selected criteria");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch exit invalid transaction details.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString() : "N/A";
  const formatMoney = (amount) => amount != null ? `$${amount.toFixed(2)}` : "N/A";

  const getFilterCount = () => {
    let count = 0;
    if (startDate) count++;
    if (endDate) count++;
    if (ticketId) count++;
    if (vehicleNumber) count++;
    if (cardNumber) count++;
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
                <XCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Exit Invalid Transaction Detail</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Search and view detailed information for invalid exit transactions
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
              <p className="text-sm text-blue-700 mt-1">Configure date range and search criteria to find invalid exit transactions</p>
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

                {/* Search Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Ticket ID */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Hash className="w-4 h-4 text-gray-400" />
                      Ticket ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={ticketId}
                        onChange={(e) => setTicketId(e.target.value)}
                        placeholder="Enter Ticket ID"
                        disabled={isLoading}
                        className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Vehicle Number */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Car className="w-4 h-4 text-gray-400" />
                      Vehicle Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        placeholder="Enter Vehicle Number"
                        disabled={isLoading}
                        className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Enter Card Number"
                        disabled={isLoading}
                        className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Info Message */}
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    Use any combination of filters to narrow down your search. Leave fields empty to search all records.
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
                <p className="text-gray-600 font-medium">Searching exit invalid transactions...</p>
                <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
              <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-b px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-gray-900">Exit Invalid Transaction Records</h3>
                  </div>
                  <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full font-medium">
                    {results.length} record{results.length !== 1 ? 's' : ''} found
                  </span>
                </div>
                <p className="text-sm text-red-700 mt-1">Detailed information for invalid exit transactions</p>
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
                            S/N
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            Ticket ID
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            Type
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            Exit Time
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4 text-gray-400" />
                            Parked Duration (min)
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-yellow-600" />
                            Parking Fee
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            Card No
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-400" />
                            Vehicle ID
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.map((item, idx) => (
                        <tr key={idx} className="hover:bg-red-50/50 transition-colors duration-150">
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-gray-900">{idx + 1}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-gray-900">{item.ticket_id || "-"}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-700">{item.entry_trans_type || "-"}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-700">{formatDate(item.exit_datetime)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-gray-900">{item.parking_dur || "N/A"}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono font-semibold text-sm text-gray-900">
                              {formatMoney(item.parking_charges || item.paid_amount)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-gray-900">{item.card_number || "-"}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-gray-900">{item.vehicle_id || "N/A"}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {results.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-red-200 shadow-sm"
                    >
                      <div className="space-y-3">
                        {/* Header with Serial Number */}
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                              #{idx + 1}
                            </span>
                            <span className="font-mono text-sm text-gray-900">
                              {item.ticket_id || "N/A"}
                            </span>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-800 border-red-300">
                            Invalid
                          </span>
                        </div>

                        {/* Type */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Type</span>
                          <span className="text-sm text-gray-900">{item.entry_trans_type || "-"}</span>
                        </div>

                        {/* Exit Time */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Exit Time</span>
                          <span className="text-sm text-gray-700">{formatDate(item.exit_datetime)}</span>
                        </div>

                        {/* Parked Duration */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Parked Duration</span>
                          <span className="text-sm font-medium text-gray-900">{item.parking_dur || "N/A"} min</span>
                        </div>

                        {/* Vehicle & Card Info */}
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-blue-700">Vehicle ID</span>
                              <span className="font-mono text-sm text-blue-900">{item.vehicle_id || "N/A"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-blue-700">Card Number</span>
                              <span className="font-mono text-sm text-blue-900">{item.card_number || "-"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Parking Fee */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-yellow-600" />
                            <span className="text-xs text-gray-600">Parking Fee</span>
                          </div>
                          <span className="font-mono font-semibold text-gray-900">
                            {formatMoney(item.parking_charges || item.paid_amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Exit Invalid Transactions Found</h3>
                <p className="text-sm text-gray-600 max-w-md">
                  Enter search criteria above and click "Search Transactions" to view invalid exit transaction records with detailed information.
                </p>
              </div>
            </div>
          )}

          {/* Help Card */}
          <div className="mt-6 bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-red-900 mb-2">Search Tips</h4>
                <ul className="space-y-1.5 text-sm text-red-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-600 mt-2 flex-shrink-0"></span>
                    <span>Select a date range to filter transactions within a specific period</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-600 mt-2 flex-shrink-0"></span>
                    <span>Use ticket ID, vehicle number, or card number filters to find specific transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-600 mt-2 flex-shrink-0"></span>
                    <span>Invalid exit transactions indicate issues that require attention or resolution</span>
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