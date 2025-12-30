import React, { useState } from "react";
import { Search, Calendar, CreditCard, Clock, FileText, Download, Receipt, ArrowRight } from "lucide-react";

function EZPayExitTransaction() {
  const [reportPeriodStart, setReportPeriodStart] = useState("");
  const [reportPeriodEnd, setReportPeriodEnd] = useState("");
  const [iuNo, setIuNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!reportPeriodStart || !reportPeriodEnd) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* G.tech Branding Header */}
      <div className="bg-gradient-to-br from-red-700 via-red-600 to-red-500 pt-12 pb-24 px-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold tracking-[0.2em] uppercase">
                <Receipt size={14} />
                <span>Transaction Module</span>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                Exit <span className="text-red-100 font-light">Transactions</span>
              </h1>
              <p className="text-red-100/80 max-w-xl text-sm leading-relaxed">
                Review and audit parking exit records, fee breakdowns, and payment statuses.
              </p>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all text-sm font-medium">
              <Download size={16} />
              <span>Download XLSX</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 mb-12 relative z-20">
        
        {/* Filter Panel */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            
            {/* Date Range Picker */}
            <div className="lg:col-span-5 space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Report Period
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="date"
                    value={reportPeriodStart}
                    onChange={(e) => setReportPeriodStart(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all outline-none text-slate-600 text-sm font-medium"
                  />
                </div>
                <ArrowRight size={16} className="text-slate-300" />
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="date"
                    value={reportPeriodEnd}
                    onChange={(e) => setReportPeriodEnd(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all outline-none text-slate-600 text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* IU Input */}
            <div className="lg:col-span-4 space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                IU / Ticket No
              </label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-600 transition-colors" size={18} />
                <input
                  type="text"
                  value={iuNo}
                  onChange={(e) => setIuNo(e.target.value)}
                  placeholder="Enter ID..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all outline-none text-slate-700 font-medium"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-3">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 disabled:bg-slate-300"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search size={18} />
                )}
                {isLoading ? "Searching..." : "Search Records"}
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {[
                    "IU/Ticket No", "Type", "Exit Time", "Parked Time", 
                    "Fee", "Card", "Ticket", "Status"
                  ].map((header) => (
                    <th key={header} className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Empty State */}
                <tr>
                  <td colSpan={8} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                        <FileText className="text-slate-200" size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">No Transactions Found</h3>
                      <p className="text-slate-400 text-sm mt-1">
                        Adjust your filters or report period to view transaction logs.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Live Database Connection Active</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">G.tech Monitoring v1.0.2</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EZPayExitTransaction;