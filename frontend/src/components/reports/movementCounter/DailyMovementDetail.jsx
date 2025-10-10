import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  Eye,
  X,
  Home,
  Info,
  Loader2,
  Calendar,
  Car,
  Clock,
  DollarSign,
  CreditCard,
  Filter,
  MapPin,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { toast } from "react-toastify";

export default function DailyMovementDetails() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedDay, setSelectedDay] = useState(""); // YYYY-MM-DD
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const env_backend = process.env.REACT_APP_BACKEND_API_URL;

  useEffect(() => {
    if (!selectedDay) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${env_backend}/api/movements/day/${selectedDay}`,
          {
            headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          },
        });
        const result = await response.json();

        const mappedRecords = result.data.map((r) => {
          const entry = new Date(r.entry_datetime);
          const exit = r.exit_datetime ? new Date(r.exit_datetime) : null;
          const durationMinutes = exit ? Math.round((exit - entry) / 60000) : 0;

          return {
            log_id: r.log_id,
            date: entry.toISOString().split("T")[0],
            counter: r.entry_station_id,
            vehicleId: r.vehicle_number,
            entryTime: entry.toTimeString().slice(0, 5),
            exitTime: exit ? exit.toTimeString().slice(0, 5) : "-",
            durationMinutes,
            parking_charges: r.parking_charges,
            paid_amount: r.paid_amount,
            card_number: r.card_number,
          };
        });

        setRecords(mappedRecords);
        toast.success(`Loaded ${mappedRecords.length} movement record${mappedRecords.length !== 1 ? 's' : ''} for ${selectedDay}`);
      } catch (err) {
        console.error("Error fetching records:", err);
        setRecords([]);
        toast.error("Failed to fetch movement records");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDay, env_backend]);

  const filteredRecords = records.filter(
    (r) =>
      r.date?.includes(searchTerm) ||
      r.counter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vehicleId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadCSV = () => {
    if (!filteredRecords.length) return;

    const headers = [
      "Date",
      "Counter",
      "Vehicle ID",
      "Entry Time",
      "Exit Time",
      "Duration (min)",
      "Parking Charges",
      "Paid Amount",
      "Card Number",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredRecords.map((r) =>
        [
          r.date,
          r.counter,
          r.vehicleId,
          r.entryTime,
          r.exitTime,
          r.durationMinutes,
          r.parking_charges,
          r.paid_amount,
          r.card_number,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `daily_movements_${selectedDay}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Downloaded ${filteredRecords.length} movement records`);
  };

  const handlePreview = (record) => setSelectedRecord(record);
  const closeModal = () => setSelectedRecord(null);

  // Calculate statistics
  const totalRecords = filteredRecords.length;
  const totalRevenue = filteredRecords.reduce((sum, r) => sum + (parseFloat(r.paid_amount) || 0), 0);
  const totalCharges = filteredRecords.reduce((sum, r) => sum + (parseFloat(r.parking_charges) || 0), 0);
  const avgDuration = totalRecords > 0 
    ? Math.round(filteredRecords.reduce((sum, r) => sum + (r.durationMinutes || 0), 0) / totalRecords) 
    : 0;

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
                <h1 className="text-3xl font-bold text-gray-900">Daily Movement Details</h1>
                <p className="text-sm text-gray-600 mt-1">
                  View and analyze daily parking movement transactions
                </p>
              </div>
            </div>
          </div>

          {/* Date Picker and Search Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-900">Date Selection & Search</h2>
                </div>
              </div>
              <p className="text-sm text-blue-700 mt-1">Select a date and filter movement records</p>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Date Picker */}
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    disabled={loading}
                    className="p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Search */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search by date, counter, or vehicle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                    className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Download CSV Button */}
                <button
                  onClick={handleDownloadCSV}
                  disabled={loading || !filteredRecords.length}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
                >
                  <Download className="w-5 h-5" />
                  Download CSV
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
                <p className="text-gray-600 font-medium">Loading movement records...</p>
                <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
              </div>
            </div>
          ) : !selectedDay ? (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Select a Date</h3>
                <p className="text-sm text-gray-600 max-w-md">
                  Please select a date using the date picker above to view daily movement records.
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
                      <Car className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Movements</p>
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
                      <p className="text-xs text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Charges</p>
                      <p className="text-2xl font-bold text-gray-900">${totalCharges.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Avg Duration</p>
                      <p className="text-2xl font-bold text-gray-900">{avgDuration} min</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-green-50 to-green-100/50 border-b px-6 py-4 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Movement Records</h3>
                    </div>
                    <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-medium">
                      {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {searchTerm ? `Filtered by "${searchTerm}"` : `All movements for ${selectedDay}`}
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
                              <MapPin className="w-4 h-4 text-gray-400" />
                              Counter
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4 text-gray-400" />
                              Vehicle ID
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                              Entry Time
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <ArrowRight className="w-4 h-4 text-gray-400 rotate-180" />
                              Exit Time
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              Duration
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
                            <tr key={record.log_id} className="hover:bg-blue-50/50 transition-colors duration-150">
                              <td className="px-4 py-3 text-sm text-gray-700">{record.date}</td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{record.counter}</td>
                              <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">{record.vehicleId}</td>
                              <td className="px-4 py-3 text-sm font-mono text-gray-700">{record.entryTime}</td>
                              <td className="px-4 py-3 text-sm font-mono text-gray-700">{record.exitTime}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                  {record.durationMinutes} min
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <button
                                  onClick={() => handlePreview(record)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors duration-150"
                                >
                                  <Eye className="w-4 h-4" />
                                  Preview
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center py-8 text-gray-500">
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
                          key={record.log_id}
                          className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                <Car className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="font-mono font-semibold text-gray-900">{record.vehicleId}</span>
                              </div>
                              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                                {record.durationMinutes} min
                              </span>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <Calendar className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">Date</span>
                                </div>
                                <p className="text-sm text-gray-900">{record.date}</p>
                              </div>

                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">Counter</span>
                                </div>
                                <p className="text-sm text-gray-900">{record.counter}</p>
                              </div>

                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <ArrowRight className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">Entry Time</span>
                                </div>
                                <p className="text-sm font-mono text-gray-900">{record.entryTime}</p>
                              </div>

                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <ArrowRight className="w-3 h-3 text-gray-400 rotate-180" />
                                  <span className="text-xs text-gray-600">Exit Time</span>
                                </div>
                                <p className="text-sm font-mono text-gray-900">{record.exitTime}</p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-3 border-t border-gray-200">
                              <button
                                onClick={() => handlePreview(record)}
                                className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
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
            </>
          )}

          {/* Help Card */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Daily Movement Details Information</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Select a specific date to view all parking movements that occurred on that day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Use the search box to filter records by date, counter station, or vehicle ID</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Click "Preview" to view comprehensive details including parking charges and payment information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Download all filtered records to CSV format for reporting and analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Summary cards show total movements, revenue collected, charges applied, and average parking duration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedRecord && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl p-8 w-full max-w-3xl shadow-2xl relative animate-in zoom-in-95 duration-200"
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
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Car className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Record Preview</h2>
                  <p className="text-sm text-gray-600">Log ID: {selectedRecord.log_id}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedRecord).map(([key, value]) => (
                <div key={key} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    {key === 'date' && <Calendar className="w-4 h-4 text-gray-600" />}
                    {key === 'counter' && <MapPin className="w-4 h-4 text-gray-600" />}
                    {key === 'vehicleId' && <Car className="w-4 h-4 text-gray-600" />}
                    {key === 'entryTime' && <ArrowRight className="w-4 h-4 text-gray-600" />}
                    {key === 'exitTime' && <ArrowRight className="w-4 h-4 text-gray-600 rotate-180" />}
                    {key === 'durationMinutes' && <Clock className="w-4 h-4 text-gray-600" />}
                    {key === 'parking_charges' && <DollarSign className="w-4 h-4 text-gray-600" />}
                    {key === 'paid_amount' && <DollarSign className="w-4 h-4 text-gray-600" />}
                    {key === 'card_number' && <CreditCard className="w-4 h-4 text-gray-600" />}
                    {!['date', 'counter', 'vehicleId', 'entryTime', 'exitTime', 'durationMinutes', 'parking_charges', 'paid_amount', 'card_number'].includes(key) && <Info className="w-4 h-4 text-gray-600" />}
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">
                      {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}
                    </span>
                  </div>
                  <p className={`text-base font-bold text-gray-900 ${['entryTime', 'exitTime', 'vehicleId'].includes(key) ? 'font-mono' : ''}`}>
                    {value?.toString() || "-"}
                  </p>
                </div>
              ))}
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