import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Home,
  Download,
  History,
  Ticket,
  User,
  Building,
  Phone,
  Car,
  Clock,
  MapPin,
  Badge,
  AlertCircle,
  FileText,
  RefreshCw,
  CheckCircle,
  XCircle,
  Filter
} from "lucide-react";
import { toast } from "react-toastify";

export default function SeasonMasterHistoryEnquiry() {
  const [seasonSearch, setSeasonSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        season: seasonSearch,
        start_date: startDate,
        end_date: endDate,
      });

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/season-history?${queryParams.toString()}`,
        { 
          method: "GET", 
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": token ? `Bearer ${token}` : "", 
          } 
        }
      );

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setResults(data);
      toast.success(`Found ${data.length} record(s)`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch season history");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (results.length === 0) {
      toast.error("No data to download");
      return;
    }

    try {
      const csvContent = [
        Object.keys(results[0]).join(","), // header
        ...results.map(r => Object.values(r).map(v => `"${v || ''}"`).join(",")),
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `season_history_${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
      
      toast.success("CSV file downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download CSV");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'valid':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'invalid':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'expired':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'terminated':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-indigo-50/20">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-6 py-5">
          <div className="flex items-center gap-4 max-w-7xl mx-auto">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-indigo-600 shadow-lg shadow-red-200">
              <History className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl bg-gradient-to-r from-red-600 to-indigo-600 bg-clip-text text-transparent">
                Season Master History Enquiry
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Search and review historical season holder records
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats Summary */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative overflow-hidden rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-5 shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-red-500 shadow-md">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-red-700">Total Records</span>
                </div>
                <p className="text-2xl font-bold text-red-900">{results.length}</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500 shadow-md">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-700">Date Range</span>
                </div>
                <p className="text-sm font-bold text-blue-900">
                  {startDate && endDate ? `${startDate} ~ ${endDate}` : 'Not set'}
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-5 shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-green-500 shadow-md">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-green-700">Status</span>
                </div>
                <p className="text-lg font-bold text-green-900">Active</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Filters */}
        <div className="rounded-2xl border-2 bg-white shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-indigo-600 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                <Filter className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Search Filters</h3>
                <p className="text-sm text-red-100 mt-0.5">Enter search criteria to find season history records</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Report Period *
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-200 outline-none"
                  />
                </div>
                <span className="text-slate-500 font-medium">to</span>
                <div className="relative flex-1 w-full">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-200 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Season/Vehicle Search */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Season / Vehicle No
              </label>
              <div className="relative">
                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Enter Season or Vehicle Number..."
                  value={seasonSearch}
                  onChange={(e) => setSeasonSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-200 outline-none"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-indigo-600 hover:from-red-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Search Records
                  </>
                )}
              </button>
            </div>
          </div>
        </div>


        {/* Results Table */}
        <div className="rounded-2xl border-2 bg-white shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">History Records</h3>
                  <p className="text-sm text-slate-300 mt-0.5">
                    {results.length > 0 ? `${results.length} record(s) found` : "No records to display"}
                  </p>
                </div>
              </div>
              
              {results.length > 0 && (
                <button
                  onClick={handleDownloadCSV}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium shadow-lg"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <RefreshCw className="h-12 w-12 text-purple-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading history records...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-16">
                <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-600 mb-2">No records found</p>
                <p className="text-sm text-slate-500">
                  Try adjusting your search filters or date range
                </p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider sticky left-0 bg-slate-50 z-10">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Zone</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Season No</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Operator</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Update Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Valid From</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Valid To</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Vehicle No</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Holder Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Holder Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Unit No</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Tel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {results.map((item, index) => (
                    <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-3 sticky left-0 bg-white hover:bg-blue-50/50 transition-colors z-10">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm text-slate-700">{item.zone || "-"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-3.5 w-3.5 text-blue-500" />
                          <span className="text-sm font-medium text-slate-900">{item.seasonNo || "-"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm text-slate-700">{item.operator || "-"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm text-slate-700">{item.updateTime || "-"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                          {item.status || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-700">{item.validFrom || "-"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-700">{item.validTo || "-"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Car className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm font-medium text-slate-900">{item.vehicleNo || "-"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-700">{item.holderName || "-"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Badge className="h-3.5 w-3.5 text-purple-500" />
                          <span className="text-sm text-slate-700">{item.holderType || "-"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-700">{item.unitNo || "-"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Building className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm text-slate-700">{item.company || "-"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-sm text-slate-700">{item.tel || "-"}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Home className="h-5 w-5" />
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}