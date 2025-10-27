import React, { useState, useEffect } from "react";

function VCCWhitelistReport() {
  const [iuNo, setIuNo] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWhitelist = async (iuNoQuery = "") => {
    setLoading(true);
    setError("");
    setRecords([]);

    try {
      const query = iuNoQuery ? `?${new URLSearchParams({ iuNo: iuNoQuery })}` : "";
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/vcc/vcc-white-list${query}`);
      const data = await res.json();

      if (data.success) {
        setRecords(data.data);
        if (data.data.length === 0) setError("No records found");
      } else {
        setError(data.message || "No records found");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchWhitelist(iuNo.trim());
  const handleKeyPress = (e) => { if (e.key === "Enter") handleSearch(); };

  useEffect(() => { fetchWhitelist(); }, []);

  const isExpired = (validTo) => new Date(validTo) < new Date();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">VCC Whitelist Report</h1>

      {/* Search Bar */}
      <div className="flex gap-3 mb-6 items-end flex-wrap">
        <div className="flex-1 max-w-sm">
          <label className="block text-sm font-medium mb-1">IU No:</label>
          <input
            type="text"
            placeholder="Enter IU No or leave blank to fetch all"
            value={iuNo}
            onChange={(e) => setIuNo(e.target.value)}
            onKeyDown={handleKeyPress}
            className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

      {/* Total Records */}
      {!loading && records.length > 0 && (
        <div className="mb-4 text-gray-700 font-medium">
          Total Records: {records.length}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded shadow-md bg-white">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["IU No", "Vehicle No", "Valid From", "Valid To"].map((h) => (
                <th key={h} className="px-4 py-2 text-left font-semibold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  {loading ? "Loading..." : "No records to display"}
                </td>
              </tr>
            ) : (
              records.map((r, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-gray-50 ${isExpired(r.validTo) ? "bg-red-50" : ""}`}
                >
                  <td className="px-4 py-2">{r.iuNo}</td>
                  <td className="px-4 py-2">{r.vehicleNo}</td>
                  <td className="px-4 py-2">{new Date(r.validFrom).toLocaleDateString()}</td>
                  <td className={`px-4 py-2 ${isExpired(r.validTo) ? "text-red-600 font-bold" : ""}`}>
                    {new Date(r.validTo).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VCCWhitelistReport;
