import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText, Calendar, Search, TrendingUp, AlertCircle, CheckCircle, XCircle, DollarSign } from "lucide-react";

export default function CSCRFilesDashboard() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchFiles = async () => {
    try {
      setLoading(true);

      let url = `${process.env.REACT_APP_BACKEND_API_URL}/api/settlement/cscr-files/get`;
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await axios.get(url, { params });
      setFiles(res.data.files);
      
      if (res.data.files.length === 0) {
        toast.info("No files found for the selected date range");
      } else {
        toast.success(`Successfully loaded ${res.data.files.length} CSCR file(s)`);
      }
    } catch (err) {
      console.error("Error fetching CSCR files:", err);
      toast.error("Failed to fetch CSCR files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFilter = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      toast.error("Start date must be before end date");
      return;
    }
    fetchFiles();
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setTimeout(() => fetchFiles(), 100);
  };

  // Calculate statistics
  const totalFiles = files.length;
  const totalTransactions = files.reduce((sum, file) => sum + (file.TotalTransNo || 0), 0);
  const totalAmount = files.reduce((sum, file) => sum + (file.TotalTransAmount || 0), 0);
  const totalFailures = files.reduce((sum, file) => sum + (file.FailTransNo || 0), 0);
  const successRate = totalTransactions > 0 ? ((totalTransactions - totalFailures) / totalTransactions * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              CSCR Files Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Monitor and analyze CSCR settlement file transactions
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Files</span>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{totalFiles}</div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Transactions</span>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{totalTransactions.toLocaleString()}</div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Amount</span>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">${totalAmount.toFixed(2)}</div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Success Rate</span>
            <CheckCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{successRate}%</div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-gray-200/50">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-800">Filter Files</h2>
        </div>
        
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white"
            />
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleFilter}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Search className="w-4 h-4" />
              Filter
            </button>
            
            <button
              onClick={handleClearFilter}
              disabled={loading}
              className="flex items-center gap-2 bg-gray-500 text-white px-6 py-2.5 rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <XCircle className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">CSCR Files</h2>
            <span className="text-sm text-gray-600">
              {files.length} file(s) found
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading CSCR files...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    File ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Send Date/Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total Trans
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Failed Trans
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Failed Amount
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Success Trans
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Success Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {files.map((file, index) => (
                  <tr
                    key={file.FileID}
                    className="hover:bg-gray-50/50 transition-colors duration-150"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {file.FileID}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(file.SendDateTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{file.FileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
                      {file.TotalTransNo.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
                      ${file.TotalTransAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className={`inline-flex items-center gap-1 ${file.FailTransNo > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {file.FailTransNo > 0 && <AlertCircle className="w-3 h-3" />}
                        {file.FailTransNo.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className={`font-medium ${file.FailTransAmount > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        ${file.FailTransAmount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className="inline-flex items-center gap-1 text-green-600">
                        {file.OkTransNo > 0 && <CheckCircle className="w-3 h-3" />}
                        {file.OkTransNo.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right font-medium">
                      ${file.OkTransAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {files.length === 0 && !loading && (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium mb-1">No CSCR files found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your date filter</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              {files.length > 0 && (
                <tfoot className="bg-gradient-to-r from-gray-100 to-gray-50 border-t-2 border-gray-300">
                  <tr className="font-bold">
                    <td colSpan={3} className="px-6 py-4 text-sm text-gray-800">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-red-500" />
                        <span className="text-base">TOTAL SUMMARY</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                      {files.reduce((sum, file) => sum + (file.TotalTransNo || 0), 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                      ${files.reduce((sum, file) => sum + (file.TotalTransAmount || 0), 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className="text-red-600">
                        {files.reduce((sum, file) => sum + (file.FailTransNo || 0), 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className="text-red-600">
                        ${files.reduce((sum, file) => sum + (file.FailTransAmount || 0), 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className="text-green-600">
                        {files.reduce((sum, file) => sum + (file.OkTransNo || 0), 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className="text-green-600">
                        ${files.reduce((sum, file) => sum + (file.OkTransAmount || 0), 0).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}