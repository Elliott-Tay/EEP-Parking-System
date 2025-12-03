import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  AlertCircle,
  Filter,
  Database,
  Activity,
  Clock
} from 'lucide-react';

function MovementsTable() {
  const [movementData, setMovementData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const rowsPerPage = 10;

  // Define fetchData outside of useEffect so we can call it on refresh
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/call-center-movement`
      );
      setMovementData(response.data);
    } catch (error) {
      console.error('Error fetching movements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered data based on search
  const filteredData = movementData.filter((item) =>
    Object.values(item).some((val) =>
      val?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentRows = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleFirstPage = () => setCurrentPage(1);
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200 shadow-lg p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <RefreshCw className="h-12 w-12 text-red-500 animate-spin" />
          <p className="text-gray-600 font-medium">Loading movements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Summary */}
      {movementData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Records */}
          <div className="relative overflow-hidden rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-200/30 rounded-full -mr-10 -mt-10" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-red-500 shadow-md">
                  <Database className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-red-700">Total Records</span>
              </div>
              <p className="text-2xl font-bold text-red-900">{movementData.length}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                <Activity className="h-3 w-3" />
                <span>All Movements</span>
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
              <p className="text-2xl font-bold text-blue-900">{filteredData.length}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                <Search className="h-3 w-3" />
                <span>{search ? 'Searching...' : 'No Filter'}</span>
              </div>
            </div>
          </div>

          {/* Current Page */}
          <div className="relative overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-purple-500 shadow-md">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-purple-700">Current Page</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{currentPage} / {totalPages || 1}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-purple-600">
                <Clock className="h-3 w-3" />
                <span>Viewing {currentRows.length} rows</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar & Refresh Button */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-red-100 shadow-lg p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search movements (alphanumeric only)..."
              value={search}
              onChange={(e) => {
                const alphanumericValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                setSearch(alphanumericValue);
                setCurrentPage(1); // reset to first page on new search
              }}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            onClick={() => {
              fetchData();
            }}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 hover:scale-105 whitespace-nowrap"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
        {search && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <span>
              Showing {filteredData.length} result(s) for "{search}"
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-red-500 to-rose-600 text-white">
                {movementData[0] &&
                  Object.keys(movementData[0]).map((col) => (
                    <th
                      key={col}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                    >
                      {col.replace(/_/g, ' ')}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentRows.length > 0 ? (
                currentRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-red-50/50 transition-colors duration-150">
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {typeof val === 'object' && val !== null ? JSON.stringify(val) : val}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={movementData[0] ? Object.keys(movementData[0]).length : 1} 
                    className="p-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 rounded-full bg-gray-100">
                        <AlertCircle className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium">No matching records found</p>
                      <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
                <span className="font-semibold text-gray-900">{totalPages || 1}</span>
                <span className="mx-2">•</span>
                <span className="text-gray-500">
                  Showing {currentRows.length} of {filteredData.length} record(s)
                </span>
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
                <div className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg font-semibold text-sm min-w-[60px] text-center">
                  {currentPage}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded-lg bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  title="Next Page"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={handleLastPage}
                  disabled={currentPage === totalPages || totalPages === 0}
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
    </div>
  );
}

export default MovementsTable;
