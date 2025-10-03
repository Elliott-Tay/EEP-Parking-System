import React, { useState } from "react";

export default function OutstandingLTAResultFile() {
  const [fileDate, setFileDate] = useState(""); // optional
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = `${process.env.REACT_APP_BACKEND_API_URL}/api/outstanding/lta-result`;
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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Outstanding LTA Result File
      </h1>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row items-end gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-gray-600">
            Settle Date
          </label>
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
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border border-gray-200 rounded shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["File Name", "Total Transaction", "Total Amount", "Settle Date", "Send Time"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider"
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
              records.map((r, index) => (
                <tr key={r.id || index} className="hover:bg-gray-50 transition">
                  <td className="px-3 py-2">{r.file_name || "-"}</td>
                  <td className="px-3 py-2">{r.total_transaction ?? "-"}</td>
                  <td className="px-3 py-2">
                    {r.total_amount != null ? `$${r.total_amount.toLocaleString()}` : "-"}
                  </td>
                  <td className="px-3 py-2">
                    {r.settle_date ? new Date(r.settle_date).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-3 py-2">
                    {r.send_time ? new Date(r.send_time).toLocaleString() : "-"}
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
