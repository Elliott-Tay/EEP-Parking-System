import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Clock,
  Car,
  DollarSign,
  Home,
  Filter,
  Info,
  Loader2,
  FileText,
  AlertTriangle,
  Timer,
  Ticket
} from "lucide-react";
import { toast } from "react-toastify";

function VehiclesParked72HoursReport() {
  const [reportMonth, setReportMonth] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      let url = `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/overstayed`;
      if (reportMonth) {
        url += `?reportMonth=${reportMonth}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to fetch overstayed vehicles");
        setRecords([]);
        return;
      }

      const mappedData = result.data.map((r) => ({
        iuTicket: r.ticket_id || r.iu_no || r.cashcard_no || "-",
        entryTime: r.entry_datetime ? new Date(r.entry_datetime).toLocaleString() : "-",
        exitTime: r.exit_datetime ? new Date(r.exit_datetime).toLocaleString() : "-",
        parkedTime: r.hours_parked
          ? `${Math.floor(r.hours_parked)}:${Math.round((r.hours_parked % 1) * 60)
              .toString()
              .padStart(2, "0")}`
          : "-",
        paidAmount: r.paid_amount ?? "-",
        vehicleNo: r.vehicle_number ?? "-",
      }));

      setRecords(mappedData);
      
      if (mappedData && mappedData.length > 0) {
        toast.success(`Found ${mappedData.length} overstayed vehicle${mappedData.length !== 1 ? 's' : ''}`);
      } else {
        toast.info("No overstayed vehicles found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while fetching overstayed vehicles.");
      setRecords([]);
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
                <h1 className="text-3xl font-bold text-gray-900">Vehicles Parked More Than 72 Hours Report</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Monitor and track vehicles with extended parking duration
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
              <p className="text-sm text-blue-700 mt-1">Select a report month to filter overstayed vehicles (optional)</p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Report Month */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Report Month (Optional)
                  </label>
                  <div className="relative max-w-md">
                    <input
                      type="month"
                      value={reportMonth}
                      onChange={(e) => setReportMonth(e.target.value)}
                      disabled={loading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Leave empty to view all overstayed vehicles, or select a specific month to filter
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
                <p className="text-gray-600 font-medium">Loading overstayed vehicles...</p>
                <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
              </div>
            </div>
          ) : records.length > 0 ? (
            <>
              {/* Summary Card */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Overstayed Vehicles Found</p>
                    <p className="text-2xl font-bold text-gray-900">{records.length}</p>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b px-6 py-4 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-gray-900">Overstayed Vehicle Records</h3>
                    </div>
                    <span className="px-3 py-1 bg-orange-600 text-white text-sm rounded-full font-medium">
                      {records.length} vehicle{records.length !== 1 ? 's' : ''} found
                    </span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    {reportMonth 
                      ? `Vehicles parked more than 72 hours in ${reportMonth}` 
                      : 'All vehicles parked more than 72 hours'}
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
                              <Ticket className="w-4 h-4 text-gray-400" />
                              IU / Ticket No
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-green-600" />
                              Entry Time
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-red-600" />
                              Exit Time
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Timer className="w-4 h-4 text-orange-600" />
                              Parked Time (HH:MM)
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-yellow-600" />
                              Paid Amt (S$)
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4 text-gray-400" />
                              Vehicle No
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {records.map((r, index) => (
                          <tr key={index} className="hover:bg-orange-50/50 transition-colors duration-150">
                            <td className="px-4 py-3">
                              <span className="text-sm font-mono font-medium text-gray-900">{r.iuTicket}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">{r.entryTime}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">{r.exitTime}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-mono font-semibold text-orange-700">{r.parkedTime}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold text-gray-900">{r.paidAmount}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium text-gray-900">{r.vehicleNo}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile/Tablet Card View */}
                  <div className="lg:hidden space-y-4">
                    {records.map((r, index) => (
                      <div 
                        key={index}
                        className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                              <Ticket className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="font-mono text-sm font-semibold text-gray-900">
                                {r.iuTicket}
                              </span>
                            </div>
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                              Overstayed
                            </span>
                          </div>

                          {/* Vehicle Number */}
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-1">
                              <Car className="w-4 h-4 text-blue-600" />
                              <span className="text-xs text-blue-700">Vehicle Number</span>
                            </div>
                            <p className="font-medium text-gray-900">{r.vehicleNo}</p>
                          </div>

                          {/* Times */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Clock className="w-3 h-3 text-green-600" />
                                <span className="text-xs text-green-700">Entry Time</span>
                              </div>
                              <p className="text-sm text-gray-900">{r.entryTime}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Clock className="w-3 h-3 text-red-600" />
                                <span className="text-xs text-red-700">Exit Time</span>
                              </div>
                              <p className="text-sm text-gray-900">{r.exitTime}</p>
                            </div>
                          </div>

                          {/* Parked Time and Payment */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Timer className="w-3 h-3 text-orange-600" />
                                <span className="text-xs text-orange-700">Parked Time</span>
                              </div>
                              <p className="font-mono font-bold text-orange-700">{r.parkedTime}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-600">Paid Amount</span>
                              <p className="font-bold text-gray-900">S$ {r.paidAmount}</p>
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
                  {reportMonth 
                    ? `No vehicles parked more than 72 hours found for ${reportMonth}. Try a different month or clear the filter.`
                    : "Click the Search button to load overstayed vehicle records."}
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
                <h4 className="font-semibold text-blue-900 mb-2">Overstayed Vehicles Information</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>This report identifies vehicles that have been parked for more than 72 hours (3 days)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Use the report month filter to narrow down results to a specific time period, or leave empty to view all</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Parked time is displayed in HH:MM format showing hours and minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Extended parking durations may require follow-up action or additional fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Use this report to monitor compliance with parking duration policies and identify potential issues</span>
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

export default VehiclesParked72HoursReport;