import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, RefreshCcw, ChevronLeft, ChevronRight, Car, CreditCard, LogIn, LogOut, DollarSign, Calendar, Loader2, AlertCircle, FileText } from "lucide-react";
import { toast } from "react-toastify";

const AdminMovements = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [entryStation, setEntryStation] = useState("");
  const [exitStation, setExitStation] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [date, setDate] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit,
        vehicle_id: vehicleId || undefined,
        vehicle_number: vehicleNumber || undefined,
        card_number: cardNumber || undefined,
        entry_station_id: entryStation || undefined,
        exit_station_id: exitStation || undefined,
        entry_from: date ? `${date}T00:00:00` : undefined,
        entry_to: date ? `${date}T23:59:59` : undefined,
      };

      const res = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/movements/admin`, { params });
      setData(res.data.data);
      setTotalPages(res.data.total_pages);

      if (res.data.data.length === 0) {
        toast.info("No records found matching your criteria");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to fetch movement transactions";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleFilter = () => {
    setPage(1);
    fetchData();
    toast.success("Filters applied successfully");
  };

  const handleClearFilters = () => {
    setVehicleNumber("");
    setCardNumber("");
    setEntryStation("");
    setExitStation("");
    setPage(1);
    toast.info("Filters cleared");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "-";
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const handleExportCSV = () => {
    if (!data || data.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Define CSV headers
    const headers = [
      "Vehicle ID",
      "Vehicle Number",
      "Card Number",
      "Entry Station",
      "Entry Time",
      "Exit Time",
      "Parking Charges",
      "Paid Amount"
    ];

    // Convert rows to CSV lines
    const rows = data.map(row => [
      row.vehicle_id || "-",
      row.vehicle_number || "-",
      row.card_number || "-",
      row.entry_station_id || "-",
      formatDateTime(row.entry_datetime),
      formatDateTime(row.exit_datetime),
      row.parking_charges ?? "-",
      row.paid_amount ?? "-"
    ]);

    // Build CSV text with escaping
    const csvContent = [
      headers.join(","), 
      ...rows.map(r =>
        r
          .map(value => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    // Create downloadable Blob
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `movements_page_${page}.csv`);
    link.click();

    URL.revokeObjectURL(url);

    toast.success("CSV exported successfully");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30">
              <FileText className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Movement Transactions</h1>
              <p className="text-gray-700 mt-1">Admin Portal - Monitor and manage all vehicle movements</p>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-gray-100 rounded-2xl border border-gray-200 p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-red-400" />
            <h2 className="text-xl font-semibold text-gray-900">Search Filters</h2>
          </div>

          {/* Vehicle ID */}
          <div className="relative mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle ID
            </label>
            <input
              type="text"
              placeholder="Enter vehicle ID"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full pl-3 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Date */}
          <div className="relative mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-3 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Vehicle Number */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Number
              </label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g., ABC1234X"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Card Number */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter card number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Entry Station */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entry Station
              </label>
              <div className="relative">
                <LogIn className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Station ID"
                  value={entryStation}
                  onChange={(e) => setEntryStation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Exit Station */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exit Station
              </label>
              <div className="relative">
                <LogOut className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Station ID"
                  value={exitStation}
                  onChange={(e) => setExitStation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleFilter}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Apply Filters
            </button>

            <button
              onClick={handleClearFilters}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCcw className="w-5 h-5" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Transaction Records</h2>
                <p className="text-gray-700 text-sm mt-1">
                  {data.length > 0 && `Showing ${data.length} records`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Export CSV Button */}
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  Export CSV
                </button>

                {/* Page Counter */}
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-lg border border-red-500/30">
                  <Calendar className="w-5 h-5 text-red-400" />
                  <span className="text-gray-900 font-medium">Page {page} of {totalPages}</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Transaction Records</h2>
                <p className="text-gray-700 text-sm mt-1">
                  {data.length > 0 && `Showing ${data.length} records`}
                </p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-lg border border-red-500/30">
                <Calendar className="w-5 h-5 text-red-400" />
                <span className="text-gray-900 font-medium">Page {page} of {totalPages}</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
              <p className="text-gray-700">Loading transaction data...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-4 bg-red-500/20 rounded-full mb-4">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>
              <p className="text-red-600 text-lg">{error}</p>
              <button
                onClick={fetchData}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                Try Again
              </button>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-4 bg-gray-200 rounded-full mb-4">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-700 text-lg">No movement transactions found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Vehicle ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Vehicle Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Card Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Entry Station
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Entry Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Exit Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Parking Charges
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Paid Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((row, index) => (
                    <tr
                      key={row.vehicle_id + row.entry_datetime + index}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-gray-900 font-medium">{row.vehicle_id || "-"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-900">{row.vehicle_number || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{row.card_number || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm border border-blue-200">
                          {row.entry_station_id || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <LogIn className="w-4 h-4 text-green-500" />
                          <span className="text-gray-700 text-sm">{formatDateTime(row.entry_datetime)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span className="text-gray-700 text-sm">{formatDateTime(row.exit_datetime)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-yellow-500" />
                          <span className="text-gray-900 font-medium">{formatCurrency(row.parking_charges)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-green-700 font-medium">{formatCurrency(row.paid_amount)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && data.length > 0 && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-gray-700 text-sm">
                  Showing page <span className="text-gray-900 font-medium">{page}</span> of{" "}
                  <span className="text-gray-900 font-medium">{totalPages}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>

                  <div className="hidden sm:flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            pageNum === page
                              ? "bg-red-600 text-white"
                              : "bg-gray-200 text-gray-900 hover:bg-gray-300 transition-all"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-200"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMovements;
