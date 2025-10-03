import { useState, useEffect } from 'react';
import axios from 'axios';

function MovementsTable() {
  const [movementData, setMovementData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const rowsPerPage = 10;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/movements/call-center-movement`,
        );
        if (isMounted) setMovementData(response.data);
      } catch (error) {
        console.error('Error fetching movements:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Initial fetch
    fetchData();
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

  if (loading) return <p className="text-center py-8">Loading movements...</p>;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex justify-start mt-1 ml-1">
        <input
          type="text"
          placeholder="Search movements..."
          value={search}
          onChange={(e) => {
            // Remove any non-alphanumeric characters
            const alphanumericValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
            setSearch(alphanumericValue);
            setCurrentPage(1); // reset to first page on new search
          }}
          className="border px-3 py-2 rounded w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-blue-500 text-white">
            <tr>
              {movementData[0] &&
                Object.keys(movementData[0]).map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    {col.replace(/_/g, ' ')}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.length > 0 ? (
              currentRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50">
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="px-4 py-2 text-sm">
                      {typeof val === 'object' && val !== null ? JSON.stringify(val) : val}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={movementData[0] ? Object.keys(movementData[0]).length : 1} className="p-4 text-center">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2">
        <button
          className="px-3 py-1 rounded border bg-white hover:bg-blue-100"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          className="px-3 py-1 rounded border bg-white hover:bg-blue-100"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MovementsTable;
