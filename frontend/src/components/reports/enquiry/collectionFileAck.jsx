import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Home,
  Download,
  FileCheck,
  FileX,
  AlertCircle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Hash,
  DollarSign,
  Clock,
  Filter
} from "lucide-react";
import { toast } from "react-toastify";

export default function CepasAckResultAnalysis() {
  const [reportDate, setReportDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Mock data for demonstration
  const mockData = [
    {
      id: 1,
      fileName: "ACK_20231201_001.dat",
      statusACK: "Success",
      statusSummary: "Complete",
      noOfTransTotal: 1245,
      noOfTransReject: 5,
      noOfTransMissing: 0,
      noOfTransOk: 1240,
      amountOfTransTotal: 15678.50,
      amountOfTransReject: 125.50,
      amountOfTransMissing: 0,
      amountOfTransOK: 15553.00,
      receivedTime: "2023-12-01 14:30:22"
    },
    {
      id: 2,
      fileName: "RST_20231201_001.dat",
      statusACK: "Success",
      statusSummary: "Warning",
      noOfTransTotal: 1243,
      noOfTransReject: 8,
      noOfTransMissing: 2,
      noOfTransOk: 1233,
      amountOfTransTotal: 15650.00,
      amountOfTransReject: 185.75,
      amountOfTransMissing: 45.00,
      amountOfTransOK: 15419.25,
      receivedTime: "2023-12-01 14:32:15"
    },
    {
      id: 3,
      fileName: "ACK_20231202_001.dat",
      statusACK: "Success",
      statusSummary: "Complete",
      noOfTransTotal: 2156,
      noOfTransReject: 3,
      noOfTransMissing: 0,
      noOfTransOk: 2153,
      amountOfTransTotal: 27843.75,
      amountOfTransReject: 75.25,
      amountOfTransMissing: 0,
      amountOfTransOK: 27768.50,
      receivedTime: "2023-12-02 14:28:10"
    },
    {
      id: 4,
      fileName: "RST_20231202_001.dat",
      statusACK: "Failed",
      statusSummary: "Error",
      noOfTransTotal: 2150,
      noOfTransReject: 15,
      noOfTransMissing: 5,
      noOfTransOk: 2130,
      amountOfTransTotal: 27750.25,
      amountOfTransReject: 325.50,
      amountOfTransMissing: 112.75,
      amountOfTransOK: 27312.00,
      receivedTime: "2023-12-02 14:35:45"
    },
    {
      id: 5,
      fileName: "ACK_20231203_001.dat",
      statusACK: "Success",
      statusSummary: "Complete",
      noOfTransTotal: 1876,
      noOfTransReject: 2,
      noOfTransMissing: 0,
      noOfTransOk: 1874,
      amountOfTransTotal: 19234.00,
      amountOfTransReject: 48.50,
      amountOfTransMissing: 0,
      amountOfTransOK: 19185.50,
      receivedTime: "2023-12-03 14:29:33"
    }
  ];

  // Initialize with current month's date range
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    setStartDate(formatDate(firstDay));
    setEndDate(formatDate(lastDay));
    
    // Automatically fetch data for current month
    handleInitialSearch(formatDate(firstDay), formatDate(lastDay));
  }, []);

  const handleInitialSearch = async (start, end) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, replace with actual API call
      // const response = await fetch(
      //   `${process.env.REACT_APP_BACKEND_API_URL}/api/cepas-analysis?startDate=${start}&endDate=${end}`,
      //   {
      //     headers: {
      //       "Authorization": `Bearer ${localStorage.getItem("token")}`
      //     }
      //   }
      // );
      // const data = await response.json();
      
      setAnalysisData(mockData);
      setCurrentPage(1);
      toast.success(`Current month data loaded: ${mockData.length} file(s) found`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch CEPAS analysis data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!reportDate && (!startDate || !endDate)) {
      toast.error("Please select a report date or report period");
      return;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be after end date");
      return;
    }

    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, replace with actual API call
      // const response = await fetch(
      //   `${process.env.REACT_APP_BACKEND_API_URL}/api/cepas-analysis?reportDate=${reportDate}&startDate=${startDate}&endDate=${endDate}`,
      //   {
      //     headers: {
      //       "Authorization": `Bearer ${localStorage.getItem("token")}`
      //     }
      //   }
      // );
      // const data = await response.json();
      
      setAnalysisData(mockData);
      setCurrentPage(1);
      toast.success(`Analysis completed: ${mockData.length} file(s) found`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch CEPAS analysis data");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReportDate("");
    setStartDate("");
    setEndDate("");
    setAnalysisData([]);
    setCurrentPage(1);
    toast.info("Filters cleared");
  };

  const handleDownloadCSV = () => {
    if (analysisData.length === 0) {
      toast.error("No data to download");
      return;
    }

    try {
      const csvHeaders = [
        "File Name",
        "Status ACK",
        "Status Summary",
        "No. of Trans Total",
        "No. of Trans Reject",
        "No. of Trans Missing",
        "No. of Trans Ok",
        "Amount of Trans Total",
        "Amount of Trans Reject",
        "Amount of Trans Missing",
        "Amount of Trans OK",
        "Received Time"
      ].join(",");

      const csvRows = analysisData.map(row =>
        [
          row.fileName,
          row.statusACK,
          row.statusSummary,
          row.noOfTransTotal,
          row.noOfTransReject,
          row.noOfTransMissing,
          row.noOfTransOk,
          row.amountOfTransTotal.toFixed(2),
          row.amountOfTransReject.toFixed(2),
          row.amountOfTransMissing.toFixed(2),
          row.amountOfTransOK.toFixed(2),
          row.receivedTime
        ].join(",")
      );

      const csvContent = [csvHeaders, ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute(
        "download",
        `cepas_analysis_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.click();

      toast.success("CSV file downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download CSV");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Success: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
        icon: CheckCircle
      },
      Complete: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
        icon: CheckCircle
      },
      Warning: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200",
        icon: AlertCircle
      },
      Error: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
        icon: XCircle
      },
      Failed: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
        icon: XCircle
      }
    };

    const config = statusConfig[status] || statusConfig.Warning;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 ${config.bg} ${config.text} ${config.border} text-xs font-semibold`}
      >
        <Icon className="h-3.5 w-3.5" />
        {status}
      </span>
    );
  };

  // Pagination
  const totalPages = Math.ceil(analysisData.length / itemsPerPage);
  const paginatedData = analysisData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFirstPage = () => setCurrentPage(1);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

  // Calculate statistics
  const totalTransTotal = analysisData.reduce((sum, item) => sum + item.noOfTransTotal, 0);
  const totalTransReject = analysisData.reduce((sum, item) => sum + item.noOfTransReject, 0);
  const totalTransMissing = analysisData.reduce((sum, item) => sum + item.noOfTransMissing, 0);
  const totalTransOk = analysisData.reduce((sum, item) => sum + item.noOfTransOk, 0);
  const totalAmountTotal = analysisData.reduce((sum, item) => sum + item.amountOfTransTotal, 0);
  const totalAmountReject = analysisData.reduce((sum, item) => sum + item.amountOfTransReject, 0);
  const totalAmountMissing = analysisData.reduce((sum, item) => sum + item.amountOfTransMissing, 0);
  const totalAmountOK = analysisData.reduce((sum, item) => sum + item.amountOfTransOK, 0);
  const successCount = analysisData.filter(item => item.statusSummary === "Complete").length;
  const errorCount = analysisData.filter(item => item.statusSummary === "Error").length;
  const successRate = totalTransTotal > 0 ? ((totalTransOk / totalTransTotal) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-rose-50/20">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-200">
                <FileCheck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  CEPAS Analysis of Acknowledge and Result File
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Analyze and compare CEPAS acknowledgment and result files
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
        {analysisData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Files */}
            <div className="relative overflow-hidden rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-red-500 shadow-md">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-red-700">Total Files</span>
                </div>
                <p className="text-2xl font-bold text-red-900">{analysisData.length}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>{successCount} Complete</span>
                  {errorCount > 0 && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{errorCount} Errors</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Total Transactions */}
            <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500 shadow-md">
                    <Hash className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-700">Total Transactions</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{totalTransTotal.toLocaleString()}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>{totalTransOk.toLocaleString()} OK</span>
                  <span className="mx-1">•</span>
                  <XCircle className="h-3 w-3 text-red-500" />
                  <span>{totalTransReject.toLocaleString()} Reject</span>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="relative overflow-hidden rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-green-500 shadow-md">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-green-700">Total Amount</span>
                </div>
                <p className="text-2xl font-bold text-green-900">${totalAmountTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>${totalAmountOK.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} OK</span>
                </div>
              </div>
            </div>

            {/* Success Rate */}
            <div className="relative overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500 shadow-md">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-purple-700">Success Rate</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{successRate}%</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-purple-600">
                  {totalTransMissing > 0 && (
                    <>
                      <AlertCircle className="h-3 w-3" />
                      <span>{totalTransMissing} Missing</span>
                    </>
                  )}
                  {totalTransMissing === 0 && (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      <span>No Missing Trans</span>
                    </>
                  )}
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
              {/* Report Date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="text-sm font-medium text-gray-700 min-w-[120px]">
                  <Calendar className="inline h-4 w-4 mr-2 text-red-600" />
                  Report Date:
                </label>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Report Period */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="text-sm font-medium text-gray-700 min-w-[120px]">
                  <Calendar className="inline h-4 w-4 mr-2 text-red-600" />
                  Report Period:
                </label>
                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Start Date"
                  />
                  <span className="text-gray-400 self-center">~</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="End Date"
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
                {analysisData.length > 0 && (
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
              <p className="text-gray-600 font-medium">Loading analysis data...</p>
            </div>
          </div>
        ) : analysisData.length > 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">Analysis Results</h3>
              <p className="text-sm text-red-50 mt-0.5">
                Showing {paginatedData.length} of {analysisData.length} file(s)
              </p>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      File Name
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status ACK
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status Summary
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Trans Total
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Trans Reject
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Trans Missing
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Trans OK
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount Total
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount Reject
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount Missing
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount OK
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Received Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-red-50/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900 font-mono">
                            {item.fileName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(item.statusACK)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(item.statusSummary)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          {item.noOfTransTotal.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${item.noOfTransReject > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {item.noOfTransReject.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${item.noOfTransMissing > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                          {item.noOfTransMissing.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-semibold text-green-600">
                          {item.noOfTransOk.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          ${item.amountOfTransTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${item.amountOfTransReject > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          ${item.amountOfTransReject.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-semibold ${item.amountOfTransMissing > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                          ${item.amountOfTransMissing.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-semibold text-green-600">
                          ${item.amountOfTransOK.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          {item.receivedTime}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Summary Footer */}
                {analysisData.length > 0 && (
                  <tfoot className="bg-gradient-to-r from-gray-100 to-gray-50 border-t-2 border-gray-300">
                    <tr className="font-bold">
                      <td colSpan={3} className="px-6 py-4 text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-red-500" />
                          <span className="text-base">TOTAL SUMMARY</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        {totalTransTotal.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className="text-red-600">
                          {totalTransReject.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className="text-orange-600">
                          {totalTransMissing.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className="text-green-600">
                          {totalTransOk.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                        ${totalAmountTotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className="text-red-600">
                          ${totalAmountReject.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className="text-orange-600">
                          ${totalAmountMissing.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className="text-green-600">
                          ${totalAmountOK.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        —
                      </td>
                    </tr>
                  </tfoot>
                )}
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
                  No Analysis Data
                </h3>
                <p className="text-sm text-gray-600">
                  Select a date range and click Search to view CEPAS analysis results
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}