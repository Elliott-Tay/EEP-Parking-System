import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, Calendar, Building, Users, CheckCircle, Filter, Clock, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

function SeasonUpdate() {
  const navigate = useNavigate();
  const [expireDate, setExpireDate] = useState("");
  const [company, setCompany] = useState("ALL");
  const [holderType, setHolderType] = useState("ALL");
  const [seasonStatus, setSeasonStatus] = useState("ALL");
  const [sortField, setSortField] = useState("Serial No");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!expireDate) {
      toast.error("Please select an expire date to search.");
      return;
    }

    setIsLoading(true);
    
    const filters = {
      expireDate,
      company,
      holderType,
      seasonStatus,
      sortField,
    };
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Filters applied:", filters);
      toast.success("Search completed successfully! Check console for filter details.");
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilterCount = () => {
    let count = 0;
    if (expireDate) count++;
    if (company !== "ALL") count++;
    if (holderType !== "ALL") count++;
    if (seasonStatus !== "ALL") count++;
    return count;
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
      
      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Season Update</h1>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-600">Search and filter season holder records</span>
                  {getFilterCount() > 0 && (
                    <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                      <Filter className="w-3 h-3" />
                      {getFilterCount()} filter{getFilterCount() !== 1 ? 's' : ''} applied
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Main Filter Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
              <div className="bg-blue-50 border-b px-6 py-4 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-900">Search Filters</h2>
                </div>
                <p className="text-sm text-blue-700 mt-1">Configure search parameters to find season holder records</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Date and Company Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Expire Date (dd/mm/yyyy)
                    </label>
                    <input
                      type="date"
                      value={expireDate}
                      onChange={(e) => setExpireDate(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      disabled={isLoading}
                      required
                    />
                    {!expireDate && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Required for search
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Building className="w-4 h-4 text-gray-400" />
                      Company
                    </label>
                    <select
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      disabled={isLoading}
                    >
                      <option value="ALL">ALL</option>
                      <option value="Company A">Company A</option>
                      <option value="Company B">Company B</option>
                      <option value="Company C">Company C</option>
                    </select>
                  </div>
                </div>

                {/* Holder Type and Season Status Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Users className="w-4 h-4 text-gray-400" />
                      Holder Type
                    </label>
                    <select
                      value={holderType}
                      onChange={(e) => setHolderType(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      disabled={isLoading}
                    >
                      <option value="ALL">ALL</option>
                      <option value="VIP">VIP</option>
                      <option value="Tenant">Tenant</option>
                      <option value="Non-Tenant">Non-Tenant</option>
                      <option value="G-Tech">G-Tech</option>
                      <option value="Complimentary">Complimentary</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <CheckCircle className="w-4 h-4 text-gray-400" />
                      Season Status
                    </label>
                    <select
                      value={seasonStatus}
                      onChange={(e) => setSeasonStatus(e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                      disabled={isLoading}
                    >
                      <option value="ALL">ALL</option>
                      <option value="Valid">Valid</option>
                      <option value="Invalid">Invalid</option>
                      <option value="Expired">Expired</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                </div>

                {/* Sort Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Sort By
                  </label>
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className="w-full md:w-1/2 p-3 rounded-lg border border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    disabled={isLoading}
                  >
                    <option value="Serial No">Serial No</option>
                    <option value="Season No">Season No</option>
                    <option value="Holder Name">Holder Name</option>
                    <option value="Company">Company</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Search className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Ready to Search</h3>
                    <p className="text-sm text-gray-600">
                      Search season holder records with the configured filters
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading || !expireDate}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      isLoading || !expireDate
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Apply Filters
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <Home className="w-4 h-4" />
                    Return Home
                  </button>
                </div>
              </div>

              {/* Validation Messages */}
              {!expireDate && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200 mt-4">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Expire Date Required
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Please select an expire date to perform the search operation.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Filter Summary */}
            {getFilterCount() > 0 && (
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Active Filters Summary</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {expireDate && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs font-medium text-blue-800 mb-1">Expire Date</p>
                      <p className="text-sm text-blue-700">{expireDate}</p>
                    </div>
                  )}
                  {company !== "ALL" && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs font-medium text-green-800 mb-1">Company</p>
                      <p className="text-sm text-green-700">{company}</p>
                    </div>
                  )}
                  {holderType !== "ALL" && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs font-medium text-purple-800 mb-1">Holder Type</p>
                      <p className="text-sm text-purple-700">{holderType}</p>
                    </div>
                  )}
                  {seasonStatus !== "ALL" && (
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-xs font-medium text-orange-800 mb-1">Season Status</p>
                      <p className="text-sm text-orange-700">{seasonStatus}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-1">Sort Order</p>
                  <p className="text-sm text-gray-600">{sortField}</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default SeasonUpdate;