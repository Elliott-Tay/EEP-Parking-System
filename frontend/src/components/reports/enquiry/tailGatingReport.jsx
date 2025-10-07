import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  AlertTriangle,
  Hash,
  DollarSign,
  Home,
  Filter,
  Info,
  Loader2,
  Video,
  Clock,
  CreditCard,
  ExternalLink,
  Ticket
} from "lucide-react";
import { toast } from "react-toastify";

function TailgatingReport() {
  const [iuNo, setIuNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token"); // get token from localStorage
      const params = new URLSearchParams();
      if (iuNo) params.append("iuNo", iuNo);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/tailgating?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch reports");

      const data = await res.json();
      setReports(data);
      
      if (data && data.length > 0) {
        toast.success(`Found ${data.length} tailgating incident${data.length !== 1 ? 's' : ''}`);
      } else {
        toast.info("No tailgating incidents found");
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      toast.error("Failed to fetch tailgating reports");
    } finally {
      setLoading(false);
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
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tailgating Report</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Monitor and track tailgating incidents at exit points
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
              <p className="text-sm text-blue-700 mt-1">Filter tailgating reports by date range and IU number</p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Date Range Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Report Period (From)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        disabled={loading}
                        className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Report Period (To)
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={loading}
                        className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* IU Number */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Hash className="w-4 h-4 text-gray-400" />
                    IU Number (Optional)
                  </label>
                  <div className="relative max-w-md">
                    <input
                      type="text"
                      value={iuNo}
                      onChange={(e) => setIuNo(e.target.value)}
                      placeholder="Enter IU Number"
                      disabled={loading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Leave empty to search all IU numbers
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
                <p className="text-gray-600 font-medium">Loading tailgating reports...</p>
                <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
              </div>
            </div>
          ) : reports.length > 0 ? (
            <>
              {/* Summary Card */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Tailgating Incidents Found</p>
                    <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-b px-6 py-4 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-gray-900">Tailgating Incident Records</h3>
                    </div>
                    <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full font-medium">
                      {reports.length} incident{reports.length !== 1 ? 's' : ''} found
                    </span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Unauthorized exit attempts detected by the system
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
                              IU No
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-gray-400" />
                              Cashcard No
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Ticket className="w-4 h-4 text-gray-400" />
                              Exit ID
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-green-600" />
                              Entry Date/Time
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-red-600" />
                              Occurrence Date/Time
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-yellow-600" />
                              Evaded Fees
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              Card Balance
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Video className="w-4 h-4 text-blue-600" />
                              Video 1
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Video className="w-4 h-4 text-blue-600" />
                              Video 2
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reports.map((report) => (
                          <tr
                            key={report.id}
                            className="hover:bg-red-50/50 transition-colors duration-150"
                          >
                            <td className="px-4 py-3">
                              <span className="text-sm font-mono font-medium text-gray-900">{report.iu_no}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-mono text-gray-700">{report.cashcard_no || "-"}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">{report.exit_id}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">{report.entry_datetime}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">{report.occurrence_datetime}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold text-red-700">{report.evaded_parking_fees}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold text-gray-900">{report.card_balance}</span>
                            </td>
                            <td className="px-4 py-3">
                              {report.video_1 ? (
                                <a
                                  href={report.video_1}
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-sm"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Video className="w-4 h-4" />
                                  Video 1
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {report.video_2 ? (
                                <a
                                  href={report.video_2}
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline text-sm"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Video className="w-4 h-4" />
                                  Video 2
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile/Tablet Card View */}
                  <div className="lg:hidden space-y-4">
                    {reports.map((report) => (
                      <div 
                        key={report.id}
                        className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="font-mono text-sm font-semibold text-gray-900">
                                {report.iu_no}
                              </span>
                            </div>
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                              Tailgating
                            </span>
                          </div>

                          {/* Card Details */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <CreditCard className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600">Cashcard No</span>
                              </div>
                              <p className="text-sm font-mono text-gray-900">{report.cashcard_no || "-"}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Ticket className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600">Exit ID</span>
                              </div>
                              <p className="text-sm text-gray-900">{report.exit_id}</p>
                            </div>
                          </div>

                          {/* Dates */}
                          <div className="space-y-2">
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Clock className="w-3 h-3 text-green-600" />
                                <span className="text-xs text-green-700">Entry Date/Time</span>
                              </div>
                              <p className="text-sm text-gray-900">{report.entry_datetime}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Clock className="w-3 h-3 text-red-600" />
                                <span className="text-xs text-red-700">Occurrence Date/Time</span>
                              </div>
                              <p className="text-sm text-gray-900">{report.occurrence_datetime}</p>
                            </div>
                          </div>

                          {/* Fees */}
                          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                              <div className="flex items-center gap-1 mb-1">
                                <DollarSign className="w-3 h-3 text-red-600" />
                                <span className="text-xs text-red-700">Evaded Fees</span>
                              </div>
                              <p className="font-bold text-red-700">{report.evaded_parking_fees}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-1 mb-1">
                                <DollarSign className="w-3 h-3 text-gray-600" />
                                <span className="text-xs text-gray-600">Card Balance</span>
                              </div>
                              <p className="font-bold text-gray-900">{report.card_balance}</p>
                            </div>
                          </div>

                          {/* Videos */}
                          {(report.video_1 || report.video_2) && (
                            <div className="pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-1 mb-2">
                                <Video className="w-3 h-3 text-blue-600" />
                                <span className="text-xs text-blue-700">Video Evidence</span>
                              </div>
                              <div className="flex gap-2">
                                {report.video_1 && (
                                  <a
                                    href={report.video_1}
                                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm border border-blue-200 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Video className="w-4 h-4" />
                                    Video 1
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                                {report.video_2 && (
                                  <a
                                    href={report.video_2}
                                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm border border-blue-200 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Video className="w-4 h-4" />
                                    Video 2
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
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
                <h3 className="font-semibold text-gray-900 mb-2">No Tailgating Incidents Found</h3>
                <p className="text-sm text-gray-600 max-w-md">
                  No tailgating incidents match your search criteria. Try adjusting the date range or IU number filter.
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
                <h4 className="font-semibold text-blue-900 mb-2">Tailgating Incident Information</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Tailgating occurs when a vehicle exits without proper authorization, following closely behind an authorized vehicle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>The system captures video evidence at the exit point to document each incident</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Evaded parking fees represent the amount that should have been collected from the unauthorized exit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Use this report to identify patterns, track losses, and improve security measures at exit points</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Video evidence can be reviewed by clicking the video links (opens in new tab)</span>
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

export default TailgatingReport;