import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Search, Home, Hash, Car, User, Building, CheckCircle, AlertCircle, Loader2, Info, Filter, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

export default function SearchCheckSeason() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    setLoading(true);
    setResults([]);

    const env_backend = process.env.REACT_APP_BACKEND_API_URL;
    try {
      // Use query parameter for partial match across multiple columns
      const queryParams = new URLSearchParams();
      queryParams.append("seasonNo", searchTerm);

      const res = await fetch(`${env_backend}/api/system-configuration/season-holder?${queryParams.toString()}`);

      const data = await res.json();

      setResults(data.data || []);
      
      if (data.data && data.data.length > 0) {
        toast.success(`Found ${data.data.length} result${data.data.length !== 1 ? 's' : ''}`);
      } else {
        toast.info("No results found for your search");
      }
    } catch (err) {
      console.error("Error fetching season holders:", err);
      toast.error("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch();
    }
  };

  const getStatusBadgeColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'valid') return 'bg-green-100 text-green-800 border-green-300';
    if (statusLower === 'expired') return 'bg-red-100 text-red-800 border-red-300';
    if (statusLower === 'invalid') return 'bg-orange-100 text-orange-800 border-orange-300';
    if (statusLower === 'terminated') return 'bg-gray-100 text-gray-800 border-gray-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const handleDelete = async (seasonNo) => {
    if (!seasonNo) {
      toast.error("Invalid Season No");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete Season No: ${seasonNo}?`
    );
    if (!confirmDelete) return;

    const env_backend = process.env.REACT_APP_BACKEND_API_URL;

    try {
      const res = await fetch(`${env_backend}/api/seasons/${seasonNo}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // adjust if you store JWT differently
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to delete");
        return;
      }

      toast.success(`Season ${seasonNo} deleted successfully!`);

      // Refresh results after deletion
      setResults(results.filter((r) => r.season_no !== seasonNo));

    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting. Please try again.");
    }
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/25">
                <Search className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Search / Check Season</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Search for season holders by IU number, vehicle number, holder name, or company
                </p>
              </div>
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b px-6 py-4 rounded-t-xl">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-gray-900">Search Criteria</h2>
              </div>
              <p className="text-sm text-blue-700 mt-1">Enter any of the following: Season (IU) number, Vehicle number, Holder name, or Company name</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Search Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Search className="w-4 h-4 text-gray-400" />
                    Search Term
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter season number, vehicle number, holder name, or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Info className="w-3 h-3" />
                    <span>Search across multiple fields - partial matches are supported</span>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={loading || !searchTerm.trim()}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    loading || !searchTerm.trim()
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search Records
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {loading && (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600">Searching season holder records...</p>
              </div>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
              <div className="bg-gradient-to-r from-green-50 to-green-100/50 border-b px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Search Results</h3>
                  </div>
                  <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-medium">
                    {results.length} record{results.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              </div>

              <div className="p-6">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 rounded-tl-lg">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-gray-400" />
                            Season No
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-400" />
                            Vehicle No
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            Holder Name
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            Company
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 rounded-tr-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-gray-400" />
                            Status
                          </div>
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 bg-gray-50">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.map((row, idx) => (
                        <tr 
                          key={idx} 
                          className="hover:bg-blue-50/50 transition-colors duration-150"
                        >
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-gray-900">{row.season_no || '-'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medi um text-sm text-gray-900">{row.vehicle_no || '-'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-900">{row.holder_name || '-'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-700">{row.company || '-'}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(row.season_status)}`}>
                              {row.season_status || 'Unknown'}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDelete(row.season_no)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {results.map((row, idx) => (
                    <div 
                      key={idx}
                      className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-600">Season No</span>
                          </div>
                          <span className="font-mono text-sm font-semibold text-gray-900">{row.season_no || '-'}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-600">Vehicle No</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{row.vehicle_no || '-'}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-600">Holder Name</span>
                          </div>
                          <span className="text-sm text-gray-900 text-right">{row.holder_name || '-'}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-600">Company</span>
                          </div>
                          <span className="text-sm text-gray-700 text-right">{row.company || '-'}</span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-600">Status</span>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(row.season_status)}`}>
                            {row.season_status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!loading && results.length === 0 && searchTerm && (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-sm text-gray-600 mb-4 max-w-md">
                  No season holder records match your search term "<span className="font-medium text-gray-900">{searchTerm}</span>". 
                  Try a different search term or check your spelling.
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}

          {/* Return Home Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate("/")}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
            >
              <Home className="w-5 h-5" />
              Return Home
            </button>
          </div>

          {/* Help Info */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Search Tips</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>You can search by season number, vehicle number, holder name, or company name</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Partial matches are supported - you don't need to enter the complete term</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Press Enter after typing to quickly search</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}