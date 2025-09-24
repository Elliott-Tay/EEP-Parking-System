import React, { useState } from "react";
import { BarChart3, Search, Calendar, Download, FileBarChart, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "react-toastify"

function IUFrequencyReport() {
  const [iuNo, setIuNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select a report period.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be later than end date.");
      return;
    }

    setIsLoading(true);
    setHasSearched(false);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/iu-frequency?startDate=${startDate}&endDate=${endDate}&iuNo=${iuNo}`
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      setData(result.data);
      setHasSearched(true);
      
      if (result.data.length === 0) {
        toast.info("No records found for the selected criteria.");
      } else {
        toast.success(`Found ${result.data.length} IU frequency record(s).`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch IU frequency report.");
      setData([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (data.length === 0) {
      toast.error("No data to export.");
      return;
    }

    const headers = ['IU No', 'Frequency'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => `${row.iuNo},${row.frequency}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `iu_frequency_report_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Report exported successfully!");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading && startDate && endDate) {
      handleSearch();
    }
  };

  const clearForm = () => {
    setIuNo("");
    setStartDate("");
    setEndDate("");
    setData([]);
    setHasSearched(false);
  };

  const getTotalFrequency = () => {
    return data.reduce((sum, item) => sum + item.frequency, 0);
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
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              IU Frequency Report
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Analyze the frequency of IU (In-Use) occurrences within a specified date range
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Filter Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-gray-900/10 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 sm:px-8 py-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-white" />
                <h2 className="text-xl font-semibold text-white">Report Filters</h2>
              </div>
              <p className="text-red-100 mt-2">
                Select date range and optional IU number to generate frequency report
              </p>
            </div>

            {/* Filter Content */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Start Date */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Report Period (From)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* End Date */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Report Period (To)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* IU Number */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    IU No (Optional)
                  </label>
                  <div className="relative">
                    <FileBarChart className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={iuNo}
                      onChange={(e) => setIuNo(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter IU Number"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSearch}
                  disabled={!startDate || !endDate || isLoading}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    !startDate || !endDate || isLoading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transform hover:-translate-y-0.5'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Generate Report
                    </>
                  )}
                </button>
                
                <button
                  onClick={clearForm}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none sm:px-6 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Results Card */}
          {hasSearched && (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-gray-900/10 overflow-hidden">
              {/* Results Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 sm:px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-white" />
                    <div>
                      <h2 className="text-xl font-semibold text-white">Frequency Report Results</h2>
                      <p className="text-blue-100 mt-1">
                        {data.length > 0 
                          ? `${data.length} record(s) found • Total frequency: ${getTotalFrequency()}`
                          : "No records found for the selected criteria"
                        }
                      </p>
                    </div>
                  </div>
                  {data.length > 0 && (
                    <button
                      onClick={handleExport}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  )}
                </div>
              </div>

              {/* Results Content */}
              <div className="p-6 sm:p-8">
                {data.length > 0 ? (
                  <div className="overflow-hidden">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-700">Total Records</p>
                            <p className="text-xl font-bold text-green-800">{data.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-700">Total Frequency</p>
                            <p className="text-xl font-bold text-blue-800">{getTotalFrequency()}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                            <FileBarChart className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-purple-700">Average Frequency</p>
                            <p className="text-xl font-bold text-purple-800">
                              {data.length > 0 ? (getTotalFrequency() / data.length).toFixed(1) : '0.0'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Data Table */}
                    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                IU No
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Frequency
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Percentage
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {data.map((row, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                  {row.iuNo}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium">{row.frequency}</span>
                                    <div className="flex-1 max-w-32">
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-300"
                                          style={{ 
                                            width: `${(row.frequency / Math.max(...data.map(d => d.frequency))) * 100}%` 
                                          }}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {((row.frequency / getTotalFrequency()) * 100).toFixed(1)}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      No IU frequency data was found for the selected date range and criteria. 
                      Try adjusting your search parameters.
                    </p>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 max-w-md mx-auto">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-blue-800 mb-1">
                          Search Tips
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Ensure the date range includes active periods</li>
                          <li>• Remove IU number filter to see all records</li>
                          <li>• Check if data exists for the selected timeframe</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IUFrequencyReport;