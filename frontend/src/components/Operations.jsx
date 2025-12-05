import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  FileCheck,
  Ticket,
  Database,
  Filter,
  AlertCircle,
  CheckCircle,
  Activity,
  Calendar,
  TrendingUp
} from "lucide-react";

export default function OperationsPage() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [seasonSearch, setSeasonSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(false);

  const backend_API_URL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:5000";
 
  // Fetch Transactions
  useEffect(() => {
    if (activeTab === "transactions") {
      setLoading(true);
      axios
        .get(`${backend_API_URL}/api/movements/transaction-checker`)
        .then((res) => {
          setTransactions(res.data);
        })
        .catch((err) => {
          console.error("Error fetching transactions:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [activeTab, backend_API_URL]);

  // Fetch Seasons
  useEffect(() => {
    if (activeTab === "seasons") {
      setLoading(true);
      axios
        .get(`${backend_API_URL}//api/movements/seasons-checker`)
        .then((res) => {
          setSeasons(res.data);
        })
        .catch((err) => {
          console.error("Error fetching seasons:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [activeTab, backend_API_URL]);

  // Fetch Seasons (with cancel token)
  useEffect(() => {
    if (activeTab !== "seasons") return;

    let cancel;
    const fetchSeasons = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${backend_API_URL}/api/movements/season-checker`,
          { cancelToken: new axios.CancelToken(c => (cancel = c)) }
        );
        setSeasons(res.data);
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Seasons error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasons();
    return () => cancel?.();
  }, [activeTab, backend_API_URL]);

  // Filtering
  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(transactionSearch.toLowerCase())
      )
    );
  }, [transactions, transactionSearch]);
  
  const filteredSeasons = useMemo(() => {
    return seasons.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(seasonSearch.toLowerCase())
      )
    );
  }, [seasons, seasonSearch]);

  // Current data based on active tab
  const currentData = activeTab === "transactions" ? filteredTransactions : filteredSeasons;
  const currentSearch = activeTab === "transactions" ? transactionSearch : seasonSearch;
  const totalRecords = activeTab === "transactions" ? transactions.length : seasons.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-rose-50/20">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-200">
                <Activity className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  Operations Management
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Transaction and season checker tools
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Statistics Summary */}
        {totalRecords > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Records */}
            <div className="relative overflow-hidden rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-red-500 shadow-md">
                    <Database className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-red-700">
                    {activeTab === "transactions" ? "Total Transactions" : "Total Seasons"}
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-900">{totalRecords}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>All Records</span>
                </div>
              </div>
            </div>

            {/* Filtered Results */}
            <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500 shadow-md">
                    <Filter className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-700">Filtered Results</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{currentData.length}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                  <Search className="h-3 w-3" />
                  <span>{currentSearch ? 'Searching...' : 'No Filter'}</span>
                </div>
              </div>
            </div>

            {/* Match Rate */}
            <div className="relative overflow-hidden rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-green-500 shadow-md">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-green-700">Match Rate</span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {totalRecords > 0 ? Math.round((currentData.length / totalRecords) * 100) : 0}%
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <span>Of Total</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-red-100 shadow-lg overflow-hidden">
          <div className="flex border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab("transactions")}
              className={`flex-1 px-6 py-4 text-center transition-all duration-200 relative ${
                activeTab === "transactions"
                  ? "bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow-lg"
                  : "text-gray-600 hover:bg-red-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FileCheck className="h-5 w-5" />
                <span>Transaction Checker</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("seasons")}
              className={`flex-1 px-6 py-4 text-center transition-all duration-200 relative ${
                activeTab === "seasons"
                  ? "bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow-lg"
                  : "text-gray-600 hover:bg-red-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Ticket className="h-5 w-5" />
                <span>Season Checker</span>
              </div>
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <RefreshCw className="h-12 w-12 text-red-500 animate-spin" />
                <p className="text-gray-600 font-medium">
                  Loading {activeTab === "transactions" ? "transactions" : "seasons"}...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Search Bar */}
              <div className="p-6 border-b-2 border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab === "transactions" ? "transactions" : "seasons"}...`}
                    value={activeTab === "transactions" ? transactionSearch : seasonSearch}
                    onChange={(e) => {
                      if (activeTab === "transactions") {
                        setTransactionSearch(e.target.value);
                      } else {
                        setSeasonSearch(e.target.value);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                {currentSearch && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span>
                      Showing {currentData.length} result(s) for "{currentSearch}"
                    </span>
                  </div>
                )}
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      {(activeTab === "transactions" ? transactions : seasons).length > 0 &&
                        Object.keys((activeTab === "transactions" ? transactions : seasons)[0]).map((key) => (
                          <th key={key} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                            {key.replace(/_/g, ' ')}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentData.length > 0 ? (
                      currentData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-red-50/50 transition-colors duration-150">
                          {Object.values(row).map((val, i) => (
                            <td key={i} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={
                            (activeTab === "transactions" ? transactions : seasons)[0]
                              ? Object.keys((activeTab === "transactions" ? transactions : seasons)[0]).length
                              : 1
                          }
                          className="p-12 text-center"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-3 rounded-full bg-gray-100">
                              <AlertCircle className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-600 font-medium">No matching records found</p>
                            <p className="text-sm text-gray-500">
                              {currentSearch 
                                ? "Try adjusting your search criteria" 
                                : `No ${activeTab === "transactions" ? "transactions" : "seasons"} available`}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Info */}
              {currentData.length > 0 && (
                <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Showing <span className="font-semibold text-gray-900">{currentData.length}</span> of{" "}
                      <span className="font-semibold text-gray-900">{totalRecords}</span> record(s)
                    </span>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Live Data</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}