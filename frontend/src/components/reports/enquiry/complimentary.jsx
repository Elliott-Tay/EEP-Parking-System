import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Ticket,
  Hash,
  Clock,
  User,
  Calendar,
  CreditCard,
  Home,
  Info,
  Loader2,
  FileText,
  DollarSign,
  Timer
} from "lucide-react";
import { toast } from "react-toastify";

export default function DailyComplimentaryEnquiry() {
  const [ticketNo, setTicketNo] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!ticketNo) {
      toast.error("Please enter a ticket number.");
      return;
    }

    setLoading(true);

    try {
      const queryParams = new URLSearchParams({ ticket_no: ticketNo });

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/complimentary?${queryParams.toString()}`,
        { method: "GET", headers: {
            "Content-Type": "application/json",
            // Send the token as a Bearer token
            "Authorization": token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data); // assuming API returns an array
      
      if (data && data.length > 0) {
        toast.success(`Found ${data.length} complimentary record${data.length !== 1 ? 's' : ''}`);
      } else {
        toast.info("No complimentary records found for this ticket number");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch daily complimentary records.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
                <Ticket className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Daily Complimentary Enquiry</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Search and view complimentary ticket records by ticket number
                </p>
              </div>
            </div>
          </div>

          {/* Search Form Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-900">Search Complimentary Ticket</h2>
                </div>
              </div>
              <p className="text-sm text-blue-700 mt-1">Enter the ticket number to retrieve complimentary records</p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Ticket Number Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Ticket className="w-4 h-4 text-gray-400" />
                    Ticket No
                  </label>
                  <div className="relative max-w-md">
                    <input
                      type="text"
                      value={ticketNo}
                      onChange={(e) => setTicketNo(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      placeholder="Enter ticket number"
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Press Enter or click Search to retrieve records
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSearch}
                    disabled={loading || !ticketNo}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      loading || !ticketNo
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
                <p className="text-gray-600 font-medium">Loading complimentary records...</p>
                <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <>
              {/* Summary Card */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Records Found</p>
                    <p className="text-2xl font-bold text-gray-900">{results.length}</p>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-green-50 to-green-100/50 border-b px-6 py-4 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Complimentary Records</h3>
                    </div>
                    <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-medium">
                      Ticket: {ticketNo}
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {results.length} record{results.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                <div className="p-6">
                  {/* Desktop Table View */}
                  <div className="hidden xl:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-gray-400" />
                              Serial No
                            </div>
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Ticket className="w-4 h-4 text-gray-400" />
                              Complimentary No
                            </div>
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              Issue Time
                            </div>
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              Issue By
                            </div>
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              Expire Time
                            </div>
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-green-600" />
                              Entry Time
                            </div>
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-red-600" />
                              Exit Time
                            </div>
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-gray-400" />
                              IU/Card No
                            </div>
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Timer className="w-4 h-4 text-gray-400" />
                              Parked Time
                            </div>
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-yellow-600" />
                              Parking Fee (S$)
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {results.map((item, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/50 transition-colors duration-150">
                            <td className="px-3 py-3">
                              <span className="text-sm text-gray-900">{item.serial_no}</span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-sm font-medium text-gray-900">{item.complimentary_no}</span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-sm text-gray-700">{item.issue_time}</span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-sm text-gray-700">{item.issue_by}</span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-sm text-gray-700">{item.expire_time}</span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-sm text-gray-700">{item.entry_time}</span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-sm text-gray-700">{item.exit_time}</span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-sm font-mono text-gray-900">{item.iu_card_no}</span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-sm text-gray-700">{item.parked_time}</span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-sm font-semibold text-gray-900">{item.parking_fee}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile/Tablet Card View */}
                  <div className="xl:hidden space-y-4">
                    {results.map((item, idx) => (
                      <div 
                        key={idx}
                        className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                              <Ticket className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-sm font-semibold text-gray-900">
                                {item.complimentary_no}
                              </span>
                            </div>
                            <span className="text-xs text-gray-600">Serial: {item.serial_no}</span>
                          </div>

                          {/* Issue Info */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-xs text-gray-600">Issue Time</span>
                              <p className="text-sm font-medium text-gray-900">{item.issue_time}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-600">Issue By</span>
                              <p className="text-sm font-medium text-gray-900">{item.issue_by}</p>
                            </div>
                          </div>

                          {/* Times */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-xs text-gray-600">Expire Time</span>
                              <p className="text-sm text-gray-700">{item.expire_time}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-600">Parked Time</span>
                              <p className="text-sm text-gray-700">{item.parked_time}</p>
                            </div>
                          </div>

                          {/* Entry/Exit */}
                          <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Clock className="w-3 h-3 text-green-600" />
                                <span className="text-xs text-green-700">Entry Time</span>
                              </div>
                              <p className="text-sm font-medium text-gray-900">{item.entry_time}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Clock className="w-3 h-3 text-red-600" />
                                <span className="text-xs text-red-700">Exit Time</span>
                              </div>
                              <p className="text-sm font-medium text-gray-900">{item.exit_time}</p>
                            </div>
                          </div>

                          {/* Card and Fee */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            <div>
                              <span className="text-xs text-gray-600">IU/Card No</span>
                              <p className="text-sm font-mono font-medium text-gray-900">{item.iu_card_no}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-600">Parking Fee</span>
                              <p className="text-lg font-bold text-green-700">S$ {item.parking_fee}</p>
                            </div>
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
                <h3 className="font-semibold text-gray-900 mb-2">No Records Found</h3>
                <p className="text-sm text-gray-600 max-w-md">
                  {ticketNo 
                    ? `No complimentary records found for ticket number "${ticketNo}". Please check the ticket number and try again.`
                    : "Enter a ticket number and click Search to view complimentary records."}
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
                <h4 className="font-semibold text-blue-900 mb-2">Complimentary Ticket Information</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Complimentary tickets are free parking passes issued for specific purposes or events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Enter the ticket number to view all associated records including issue, entry, and exit details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Records show issue time, expiry, parking duration, and any applicable fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Use this enquiry to track complimentary ticket usage and validate parking sessions</span>
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