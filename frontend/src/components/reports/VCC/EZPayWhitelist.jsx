import React, { useState } from "react";
import { Search, FileSearch, Download, Info, Car, ShieldCheck, History } from "lucide-react";

function EZPayWhitelistReport() {
  const [iuNo, setIuNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!iuNo) return;
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dynamic Header Section */}
      <div className="bg-gradient-to-br from-red-700 via-red-600 to-red-500 pt-12 pb-24 px-6 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-900 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold tracking-widest uppercase">
                <ShieldCheck size={14} />
                <span>Security Module</span>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                EZPay Whitelist <span className="text-red-100 font-light text-3xl">Report</span>
              </h1>
              <p className="text-red-100/80 max-w-xl text-sm leading-relaxed">
                Query the real-time centralized database for vehicle IU authorization and active whitelist durations.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all text-sm font-medium">
                <History size={16} />
                <span>Recent Queries</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 mb-12 relative z-20">
        
        {/* Search Panel */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 p-2 overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row items-stretch gap-2 p-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-slate-400 group-focus-within:text-red-600 transition-colors" />
              </div>
              <input
                type="text"
                value={iuNo}
                onChange={(e) => setIuNo(e.target.value)}
                placeholder="Scan or enter IU number..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400"
              />
            </div>
            
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-10 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:transform active:scale-95 transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-3 disabled:bg-slate-300"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FileSearch size={20} />
              )}
              {isLoading ? "Fetching..." : "Run Report"}
            </button>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <Car size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Results Table</h3>
                <p className="text-xs text-slate-400 uppercase tracking-tighter">Verified in real-time</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-red-600 p-2 transition-colors">
              <Download size={20} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  {["IU Details", "Vehicle Plate", "Effective Date", "Expiry Date"].map((header) => (
                    <th key={header} className="px-8 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Empty State Styling */}
                <tr>
                  <td colSpan={4} className="px-8 py-32 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100 animate-pulse">
                        <Search className="text-slate-200" size={40} />
                      </div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">Awaiting Input</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        No report generated yet. Enter an IU number to view the whitelist history for this car park.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-8 py-4 bg-slate-50/50 flex items-center text-slate-400">
            <Info size={14} className="mr-2 text-red-500" />
            <span className="text-[11px] font-bold uppercase tracking-tight">
              Data protected by G.tech encryption standards
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EZPayWhitelistReport;