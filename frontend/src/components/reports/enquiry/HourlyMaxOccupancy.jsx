import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Home,
  Download,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  MapPin,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  CheckCircle,
  ParkingSquare,
  Maximize2,
  Activity,
  FileX
} from "lucide-react";
import { toast } from "react-toastify";

export default function HourlyMaxOccupancyReport() {
  const [zone, setZone] = useState("Main");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!zone || !startDate || !endDate) {
      toast.error("Please fill in all fields");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be after end date");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({ zone, startDate, endDate });
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/hourly-max-occupancy?${params}`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setRecords(data);
      setCurrentPage(1);
      toast.success(`Found ${data.length} record(s)`);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching report: " + err.message);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setZone("Main");
    setStartDate("");
    setEndDate("");
    setRecords([]);
    setCurrentPage(1);
    toast.info("Filters cleared");
  };

  const handleDownloadCSV = () => {
    if (records.length === 0) {
      toast.error("No data to download");
      return;
    }

    try {
      const csvHeaders = ["Hour", "Zone", "Occupancy", "Season Max", "Remarks"].join(",");
      const csvRows = records.map(row =>
        [row.hour, row.zone, row.occupancy, row.seasonMax, row.remarks || ""].join(",")
      );

      const csvContent = [csvHeaders, ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute(
        "download",
        `hourly_max_occupancy_${zone}_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.click();

      toast.success("CSV file downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download CSV");
    }
  };

  // Pagination
  const totalPages = Math.ceil(records.length / itemsPerPage);
  const paginatedData = records.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFirstPage = () => setCurrentPage(1);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

  // Calculate statistics
  const totalRecords = records.length;
  const avgOccupancy = records.length > 0
    ? (records.reduce((sum, r) => sum + (r.occupancy || 0), 0) / records.length).toFixed(1)
    : 0;
  const maxOccupancy = records.length > 0
    ? Math.max(...records.map(r => r.occupancy || 0))
    : 0;
  const peakHour = records.length > 0
    ? records.reduce((max, r) => (r.occupancy > max.occupancy ? r : max), records[0]).hour
    : "N/A";
  const avgSeasonMax = records.length > 0
    ? (records.reduce((sum, r) => sum + (r.seasonMax || 0), 0) / records.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-rose-50/20">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-200">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  Hourly Maximum Occupancy Report
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Counter daily statistics with hourly and season maximum occupancy
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 hover:scale-105"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Statistics Summary - Only show when data is available */}
        {records.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Records */}
            <div className="relative overflow-hidden rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-red-500 shadow-md">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-red-700">Total Hours</span>
                </div>
                <p className="text-2xl font-bold text-red-900">{totalRecords}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                  <Clock className="h-3 w-3" />
                  <span>Tracked</span>
                </div>
              </div>
            </div>

            {/* Average Occupancy */}
            <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500 shadow-md">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-700">Avg Occupancy</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{avgOccupancy}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Vehicles</span>
                </div>
              </div>
            </div>

            {/* Max Occupancy */}
            <div className="relative overflow-hidden rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-orange-500 shadow-md">
                    <Maximize2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-orange-700">Max Occupancy</span>
                </div>
                <p className="text-2xl font-bold text-orange-900">{maxOccupancy}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                  <AlertCircle className="h-3 w-3" />
                  <span>Peak Value</span>
                </div>
              </div>
            </div>

            {/* Peak Hour */}
            <div className="relative overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500 shadow-md">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-purple-700">Peak Hour</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{peakHour}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-purple-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>Busiest</span>
                </div>
              </div>
            </div>

            {/* Avg Season Max */}
            <div className="relative overflow-hidden rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-green-500 shadow-md">
                    <ParkingSquare className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-green-700">Avg Season Max</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{avgSeasonMax}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                  <Users className="h-3 w-3" />
                  <span>Season Holders</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-red-100 shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Search Filters</h2>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              {showFilters ? "Hide" : "Show"}
            </button>
          </div>

          {showFilters && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Carpark Zone */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-2 text-red-600" />
                    Carpark Zone
                  </label>
                  <input
                    type="text"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter zone name"
                  />
                </div>

                {/* Start Date */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-2 text-red-600" />
                    Report Period (From)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* End Date */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-2 text-red-600" />
                    Report Period (To)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Search
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </button>
                {records.length > 0 && (
                  <button
                    onClick={handleDownloadCSV}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:scale-105"
                  >
                    <Download className="h-4 w-4" />
                    Download CSV
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Table */}
        {loading ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200 shadow-lg p-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <RefreshCw className="h-12 w-12 text-red-500 animate-spin" />
              <p className="text-gray-600 font-medium">Loading occupancy data...</p>
            </div>
          </div>
        ) : records.length > 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Occupancy Records</h3>
              <p className="text-sm text-red-50 mt-0.5">
                Showing {paginatedData.length} of {records.length} record(s) for {zone} zone
              </p>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Hour
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Zone
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Occupancy
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Season Max
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.map((record, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-red-50/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-semibold text-gray-900">
                            {record.hour}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-700">
                            {record.zone}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 border-2 border-blue-200 text-sm font-semibold">
                          <Users className="h-3.5 w-3.5" />
                          {record.occupancy}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 border-2 border-green-200 text-sm font-semibold">
                          <ParkingSquare className="h-3.5 w-3.5" />
                          {record.seasonMax}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {record.remarks || "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Page <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
                    <span className="font-semibold text-gray-900">{totalPages}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleFirstPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      title="First Page"
                    >
                      <ChevronsLeft className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      title="Previous Page"
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-600" />
                    </button>
                    <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg font-semibold text-sm">
                      {currentPage}
                    </div>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      title="Next Page"
                    >
                      <ChevronRight className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={handleLastPage}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      title="Last Page"
                    >
                      <ChevronsRight className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200 shadow-lg p-12">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="p-4 rounded-2xl bg-gray-100">
                <FileX className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No Records Found
                </h3>
                <p className="text-sm text-gray-600">
                  Select a zone and date range, then click Search to view occupancy data
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}