import React, { useState } from "react";
import { 
  Search, Calendar, FileArchive, ArrowRight, 
  Download, Filter, ChevronLeft, ChevronRight, Info 
} from "lucide-react";

function EZPayCollectionFileReport() {
  const [reportDate, setReportDate] = useState("2025-09-18");
  const [reportPeriodStart, setReportPeriodStart] = useState("");
  const [reportPeriodEnd, setReportPeriodEnd] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* G.tech Header Section */}
      <div className="bg-gradient-to-br from-red-700 via-red-600 to-red-500 pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold tracking-[0.2em] uppercase">
                <FileArchive size={14} />
                <span>Financial Module</span>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                Collection <span className="text-red-100 font-light">Files</span>
              </h1>
              <p className="text-red-100/80 max-w-xl text-sm leading-relaxed">
                Access and manage centralized EZPay collection batches and settlement records.
              </p>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all text-sm font-medium">
              <Download size={16} />
              <span>Export Batch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 mb-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* Report Date */}
            <div className="lg:col-span-3 space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Report Date
              </label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            {/* Report Period */}
            <div className="lg:col-span-6 space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Settlement Period
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="date"
                    value={reportPeriodStart}
                    onChange={(e) => setReportPeriodStart(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all outline-none text-slate-700 font-medium"
                  />
                </div>
                <ArrowRight size={18} className="text-slate-300 shrink-0" />
                <div className="relative flex-1 group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="date"
                    value={reportPeriodEnd}
                    onChange={(e) => setReportPeriodEnd(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all outline-none text-slate-700 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-3">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 disabled:bg-slate-300"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search size={18} />
                )}
                {isLoading ? "Querying..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mt-8">
          <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <Filter size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">File Batch List</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Filename", "Processed Date", "Records", "Total Amount", "Status"].map((header) => (
                    <th key={header} className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                        <FileArchive className="text-slate-200" size={32} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-800">No Collection Records</h4>
                      <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                        Please specify a report date and period to fetch collection batch details.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Info size={14} className="mr-2 text-red-500" />
              <span>Records are archived every 30 days</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white hover:text-red-600 transition-all disabled:opacity-30" disabled>
                <ChevronLeft size={18} />
              </button>
              <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white hover:text-red-600 transition-all disabled:opacity-30" disabled>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EZPayCollectionFileReport;