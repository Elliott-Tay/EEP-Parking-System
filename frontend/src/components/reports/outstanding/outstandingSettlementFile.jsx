import React, { useState } from "react";

function OutstandingSettlementFile() {
  const [fileDate, setFileDate] = useState(""); // Optional, empty by default
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = `${process.env.REACT_APP_BACKEND_API_URL}/api/outstanding/settlement`;
      if (fileDate) url += `?fileDate=${fileDate}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Outstanding Settlement Files</h1>

      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 mb-6">
        <div className="flex-1 mb-4 sm:mb-0">
          <label className="block text-sm font-medium mb-1">File Date:</label>
          <input
            type="date"
            value={fileDate}
            onChange={(e) => setFileDate(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className={`px-6 py-2 rounded text-white font-medium transition-colors ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 rounded shadow-sm">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left font-medium">File Name</th>
              <th className="px-4 py-2 text-left font-medium">Total Transaction</th>
              <th className="px-4 py-2 text-left font-medium">Total Amount</th>
              <th className="px-4 py-2 text-left font-medium">Created At</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No records found
                </td>
              </tr>
            ) : (
              records.map((r, idx) => (
                <tr
                  key={r.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"}
                >
                  <td className="px-4 py-2">{r.file_name}</td>
                  <td className="px-4 py-2">{r.total_transaction}</td>
                  <td className="px-4 py-2">{r.total_amount.toLocaleString()}</td>
                  <td className="px-4 py-2">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2 capitalize">{r.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OutstandingSettlementFile;
