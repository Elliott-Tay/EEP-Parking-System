import React, { useState } from "react";

function OutstandingAcknowledgeFile() {
  const [fileDate, setFileDate] = useState(""); // optional
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = `${process.env.REACT_APP_BACKEND_API_URL}/api/outstanding/acknowledgement`;
      if (fileDate) {
        url += `?fileDate=${fileDate}`;
      }

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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Outstanding Acknowledge Files</h1>

      {/* Filter */}
      <div className="flex items-end gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            File Date
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded shadow-sm">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">File Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Total Transaction</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Total Amount</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Create Date/Time</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Send Status</th>
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
                  <td className="px-4 py-2">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {r.send_time ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Sent
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
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

export default OutstandingAcknowledgeFile;
