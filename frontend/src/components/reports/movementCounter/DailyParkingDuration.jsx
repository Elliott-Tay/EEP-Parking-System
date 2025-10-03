import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  X,
  Download,
  Calendar,
  Car,
  Clock,
  Hash,
  Home,
  Filter,
  Info,
  Loader2,
  Timer,
  BarChart3,
  TrendingUp,
  FileText
} from "lucide-react";
import { toast } from "react-toastify";

export default function DailyParkingDuration() {
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
        const entryTime = new Date(r.entry_datetime);
        const exitTime = r.exit_datetime ? new Date(r.exit_datetime) : null;
        const parkingDuration = exitTime ? Math.round((exitTime - entryTime) / 60000) : 0; // in minutes

        // Format dates
        const formatDate = (date) => date ? date.toLocaleString('en-SG', { 
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          hour12: false 
        }) : null;

        return {
          log_id: r.log_id,
          vehicle_number: r.vehicle_number,
          entry_station_id: r.entry_station_id,
          exit_station_id: r.exit_station_id,
          entry_datetime: formatDate(entryTime),
          exit_datetime: formatDate(exitTime),
          parking_dur: parkingDuration, // dynamically calculated
          parking_charges: r.parking_charges,
          paid_amount: r.paid_amount,
          card_number: r.card_number,
        };
      });

        setRecords(mappedRecords);
        toast.success(`Loaded ${mappedRecords.length} parking record${mappedRecords.length !== 1 ? 's' : ''} for ${selectedDay}`);
      } catch (err) {
        console.error("Error fetching records:", err);
        setRecords([]);
        toast.error("Failed to fetch parking duration records");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDay, env_backend]);

  const filteredRecords = records.filter((r) =>
    Object.values(r).some((val) =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // --- Parking Duration Calculations ---
  const avgDuration =
    filteredRecords.length > 0
      ? filteredRecords.reduce((sum, r) => sum + (r.parking_dur || 0), 0) /
        filteredRecords.length
      : 0;

  const durationBins = Array.from({ length: 10 }, (_, i) => i + 1).reduce(
    (acc, hour) => {
      acc[hour] = filteredRecords.filter(
        (r) => (r.parking_dur || 0) / 60 >= hour - 1 && (r.parking_dur || 0) / 60 < hour
      ).length;
      return acc;
    },
    {}
  );
  durationBins["10+"] = filteredRecords.filter(
    (r) => (r.parking_dur || 0) / 60 >= 10
  ).length;

  const handlePreview = (record) => setSelectedRecord(record);
  const closeModal = () => setSelectedRecord(null);

  const handleDownloadCSV = () => {
    if (!filteredRecords.length) return;

    const headers = [
      "log_id",
      "vehicle_number",
      "entry_station_id",
      "exit_station_id",
      "entry_datetime",
      "exit_datetime",
      "parking_dur",
      "parking_charges",
      "paid_amount",
      "card_number",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredRecords.map((r) =>
        headers.map((h) => r[h] ?? "").join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `parking_duration_${selectedDay}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV file downloaded successfully");
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
                <Timer className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Daily Parking Duration</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Analyze parking duration patterns and statistics for a specific day
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
                  <h2 className="font-semibold text-gray-900">Date Selection & Search</h2>
                </div>
              </div>
              <p className="text-sm text-blue-700 mt-1">Select a date and search through parking records</p>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Date Picker */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="date"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    disabled={loading}
                    className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Search all fields..."
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
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold whitespace-nowrap"
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
                <p className="text-gray-600 font-medium">Loading parking duration records...</p>
                <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
              </div>
            </div>
          ) : selectedDay ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {/* Total Records */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-gray-600">Total Records</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{filteredRecords.length}</p>
                </div>

                {/* Average Duration */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <p className="text-xs text-gray-600">Avg Duration</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{avgDuration.toFixed(1)} <span className="text-sm">min</span></p>
                </div>

                {/* Duration Bins */}
                {Object.entries(durationBins).map(([bin, count]) => (
                  <div key={bin} className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Timer className="w-4 h-4 text-purple-600" />
                      <p className="text-xs text-gray-600">
                        {bin} hr{bin !== "1" && bin !== "10+" && ""}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                ))}
              </div>

              {/* Records Table/Cards */}
              {filteredRecords.length > 0 ? (
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg mb-6">
                  <div className="bg-gradient-to-r from-green-50 to-green-100/50 border-b px-6 py-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-gray-900">Parking Duration Records</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-medium">
                          {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
                        </span>
                        <button
                          onClick={handleDownloadCSV}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all duration-200 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          CSV
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            {[
                              { key: "log_id", label: "Log ID", icon: Hash },
                              { key: "vehicle_number", label: "Vehicle Number", icon: Car },
                              { key: "entry_station_id", label: "Entry Station", icon: Hash },
                              { key: "exit_station_id", label: "Exit Station", icon: Hash },
                              { key: "entry_datetime", label: "Entry Time", icon: Clock },
                              { key: "exit_datetime", label: "Exit Time", icon: Clock },
                              { key: "parking_dur", label: "Duration (min)", icon: Timer },
                              { key: "parking_charges", label: "Charges", icon: null },
                              { key: "paid_amount", label: "Paid", icon: null },
                              { key: "card_number", label: "Card No", icon: null },
                            ].map((col) => (
                              <th
                                key={col.key}
                                className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50"
                              >
                                <div className="flex items-center gap-2">
                                  {col.icon && <col.icon className="w-4 h-4 text-gray-400" />}
                                  {col.label}
                                </div>
                              </th>
                            ))}
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredRecords.map((record) => (
                            <tr key={record.log_id} className="hover:bg-blue-50/50 transition-colors duration-150">
                              {Object.values(record).map((val, idx) => (
                                <td key={idx} className="px-4 py-3 text-sm text-gray-900">
                                  {val?.toString() || "-"}
                                </td>
                              ))}
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handlePreview(record)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 text-sm font-medium"
                                >
                                  <Eye className="w-4 h-4" />
                                  Preview
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-4">
                      {filteredRecords.map((record) => (
                        <div 
                          key={record.log_id}
                          className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold text-gray-900">Log #{record.log_id}</span>
                              </div>
                              <button
                                onClick={() => handlePreview(record)}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                <Eye className="w-3 h-3" />
                                View
                              </button>
                            </div>

                            {/* Vehicle */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Vehicle</span>
                              <span className="font-mono font-semibold text-sm text-gray-900">{record.vehicle_number || "-"}</span>
                            </div>

                            {/* Stations */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <span className="text-xs text-gray-600">Entry Station</span>
                                <p className="text-sm font-medium text-gray-900">{record.entry_station_id || "-"}</p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-600">Exit Station</span>
                                <p className="text-sm font-medium text-gray-900">{record.exit_station_id || "-"}</p>
                              </div>
                            </div>

                            {/* Duration */}
                            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Timer className="w-4 h-4 text-purple-600" />
                                  <span className="text-xs text-purple-700">Parking Duration</span>
                                </div>
                                <span className="font-semibold text-purple-900">{record.parking_dur || 0} min</span>
                              </div>
                            </div>

                            {/* Payment */}
                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                              <div>
                                <span className="text-xs text-gray-600">Charges</span>
                                <p className="text-sm font-medium text-gray-900">{record.parking_charges || "-"}</p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-600">Paid</span>
                                <p className="text-sm font-medium text-gray-900">{record.paid_amount || "-"}</p>
                              </div>
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
                    <h3 className="font-semibold text-gray-900 mb-2">No Records Found</h3>
                    <p className="text-sm text-gray-600 max-w-md">
                      {searchTerm 
                        ? `No parking records match your search "${searchTerm}"`
                        : "No parking records found for the selected date"}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Select a Date to Begin</h3>
                <p className="text-sm text-gray-600 max-w-md">
                  Choose a date from the date picker above to view daily parking duration records and statistics.
                </p>
              </div>
            </div>
          )}

          {/* Help Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Report Information</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Select a specific date to view all parking duration records for that day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Summary cards show total records, average duration, and distribution by hour brackets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Use the search box to filter records across all fields including vehicle numbers and card numbers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Click "Preview" to view detailed information for any record, or download all data as CSV</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-900">
                    Record Preview - Log ID: {selectedRecord.log_id}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-lg hover:bg-white/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedRecord).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1 uppercase tracking-wider">{key.replace(/_/g, ' ')}</p>
                    <p className="font-medium text-gray-900">{value?.toString() || "-"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t px-6 py-4 rounded-b-xl bg-gray-50">
              <button
                onClick={closeModal}
                className="w-full px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25 transition-all duration-200 font-semibold"
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