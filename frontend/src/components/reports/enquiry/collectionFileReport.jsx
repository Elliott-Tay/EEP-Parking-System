import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Home,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Hash,
  Clock,
  FileCheck,
  AlertCircle,
  Download
} from "lucide-react";
import { toast } from "react-toastify";

export default function CepasCollectionFileReport() {
  const [reportDate, setReportDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reportData, setReportData] = useState([]);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select a start and end date.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/outstanding/cepas_collection?startDate=${startDate}&endDate=${endDate}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setReportData(data);
      toast.success(`Found ${data.length} record(s)`);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching report: " + error.message);
    }
  };

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-6 py-5">
          <div className="flex items-center gap-4 max-w-7xl mx-auto">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
              <FileCheck className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CEPAS Collection File Report
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                View and analyze CEPAS collection transaction files
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats Summary */}
        {reportData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500 shadow-md">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-700">Total Files</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{reportData.length}</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-5 shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-green-500 shadow-md">
                    <Hash className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-green-700">Total Trans.</span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {reportData.reduce((sum, row) => sum + (row.total_trans_no || 0), 0)}
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500 shadow-md">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-purple-700">Total Amount</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  ${reportData.reduce((sum, row) => sum + parseFloat(row.total_trans_amount || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-5 shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-orange-500 shadow-md">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-orange-700">Success Rate</span>
                </div>
                <p className="text-2xl font-bold text-orange-900">
                  {reportData.length > 0
                    ? (
                        (reportData.reduce((sum, row) => sum + (row.ok_trans_no || 0), 0) /
                          reportData.reduce((sum, row) => sum + (row.total_trans_no || 1), 0)) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="rounded-2xl border-2 bg-white shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Search Filters</h3>
                <p className="text-sm text-blue-100 mt-0.5">Select date range to view collection files</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Report Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Report Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                <Search className="h-5 w-5" />
                Search Records
              </button>
            </div>
          </div>
        </div>

        {/* Report Cards */}
        <div className="rounded-2xl border-2 bg-white shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Collection Files</h3>
                  <p className="text-sm text-slate-300 mt-0.5">
                    {reportData.length > 0 ? `${reportData.length} file(s) found` : "No files available"}
                  </p>
                </div>
              </div>
              {reportData.length > 0 && (
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2 border border-white/20">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {reportData.length > 0 ? (
              <div className="space-y-4">
                {reportData.map((row) => (
                  <div
                    key={row.id}
                    className="group relative rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600" />
                    
                    <div className="p-5 pl-6">
                      {/* Header Info */}
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 pb-4 border-b-2 border-slate-100">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 rounded-lg bg-blue-100">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 mb-1">{row.file_name}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{new Date(row.send_datetime).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {/* Total */}
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Hash className="h-3.5 w-3.5 text-blue-600" />
                            <span className="text-xs font-semibold text-blue-700">Total</span>
                          </div>
                          <p className="text-lg font-bold text-blue-900">{row.total_trans_no}</p>
                          <p className="text-xs text-blue-600 mt-0.5">${row.total_trans_amount}</p>
                        </div>

                        {/* Success */}
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <div className="flex items-center gap-1.5 mb-1">
                            <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                            <span className="text-xs font-semibold text-green-700">Success</span>
                          </div>
                          <p className="text-lg font-bold text-green-900">{row.ok_trans_no}</p>
                          <p className="text-xs text-green-600 mt-0.5">${row.ok_trans_amount}</p>
                        </div>

                        {/* Failed */}
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                          <div className="flex items-center gap-1.5 mb-1">
                            <XCircle className="h-3.5 w-3.5 text-red-600" />
                            <span className="text-xs font-semibold text-red-700">Failed</span>
                          </div>
                          <p className="text-lg font-bold text-red-900">{row.fail_trans_no}</p>
                          <p className="text-xs text-red-600 mt-0.5">${row.fail_trans_amount}</p>
                        </div>

                        {/* Success Rate */}
                        <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                          <div className="flex items-center gap-1.5 mb-1">
                            <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
                            <span className="text-xs font-semibold text-purple-700">Rate</span>
                          </div>
                          <p className="text-lg font-bold text-purple-900">
                            {row.total_trans_no > 0
                              ? ((row.ok_trans_no / row.total_trans_no) * 100).toFixed(1)
                              : 0}
                            %
                          </p>
                          <p className="text-xs text-purple-600 mt-0.5">Success</p>
                        </div>

                        {/* Amount Success Rate */}
                        <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                          <div className="flex items-center gap-1.5 mb-1">
                            <DollarSign className="h-3.5 w-3.5 text-orange-600" />
                            <span className="text-xs font-semibold text-orange-700">$ Rate</span>
                          </div>
                          <p className="text-lg font-bold text-orange-900">
                            {row.total_trans_amount > 0
                              ? ((row.ok_trans_amount / row.total_trans_amount) * 100).toFixed(1)
                              : 0}
                            %
                          </p>
                          <p className="text-xs text-orange-600 mt-0.5">Amount</p>
                        </div>

                        {/* Status */}
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <div className="flex items-center gap-1.5 mb-1">
                            <FileCheck className="h-3.5 w-3.5 text-slate-600" />
                            <span className="text-xs font-semibold text-slate-700">Status</span>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              row.ok_trans_no === row.total_trans_no
                                ? "bg-green-100 text-green-700"
                                : row.fail_trans_no === row.total_trans_no
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {row.ok_trans_no === row.total_trans_no
                              ? "Complete"
                              : row.fail_trans_no === row.total_trans_no
                              ? "Failed"
                              : "Partial"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <AlertCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-600 mb-2">No data available</p>
                <p className="text-sm text-slate-500">
                  Select a date range and click "Search Records" to view collection files
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {reportData.length > 0 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium text-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            
            <div className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <span className="text-white font-semibold">Page {currentPage}</span>
            </div>
            
            <button
              onClick={handleNextPage}
              className="px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 transition-all duration-200 flex items-center gap-2 font-medium text-slate-700"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Home Button */}
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