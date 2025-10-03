import React, { useState } from "react";

// Reusable status badge
function StatusBadge({ sent }) {
  return sent ? (
    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
      Sent
    </span>
  ) : (
    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
      Pending
    </span>
  );
}

export default function OutstandingSummaryFile() {
  const [fileDate, setFileDate] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = `${process.env.REACT_APP_BACKEND_API_URL}/api/outstanding/summary`;
      if (fileDate) url += `?fileDate=${fileDate}`;

      const token = localStorage.getItem("token");
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Outstanding Summary Files
      </h1>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row items-end gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-gray-600">File Date</label>
          <input
            type="date"
            value={fileDate}
            onChange={(e) => setFileDate(e.target.value)}
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded font-semibold transition
            ${loading ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}
          `}
        >
          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border border-gray-200 rounded shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["File Name", "Total Transaction", "Total Amount", "Create Date/Time", "Send Status"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-left font-medium text-gray-700 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No records found
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{r.file_name}</td>
                  <td className="px-4 py-2">{r.total_transaction}</td>
                  <td className="px-4 py-2">${r.total_amount.toLocaleString()}</td>
                  <td className="px-4 py-2">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <StatusBadge sent={!!r.send_time} />
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
