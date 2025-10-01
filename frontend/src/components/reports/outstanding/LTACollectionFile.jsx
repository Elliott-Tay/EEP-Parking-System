import React, { useState } from "react";

function OutstandingLTAResultFile() {
  const [fileDate, setFileDate] = useState(""); // optional, empty by default
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = `${process.env.REACT_APP_BACKEND_API_URL}/api/outstanding/lta-result`;
      if (fileDate) {
        url += `?fileDate=${fileDate}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      console.log('data', data);
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
      <h1 className="text-2xl font-bold mb-6">Outstanding LTA Result File</h1>

      {/* Optional: File Date */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Settle Date (YYYY-MM-DD):
        </label>
        <input
          type="date"
          value={fileDate}
          onChange={(e) => setFileDate(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
      >
        {loading ? "Loading..." : "Search"}
      </button>

      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">File Name</th>
              <th className="border px-3 py-2 text-left">Total Transaction</th>
              <th className="border px-3 py-2 text-left">Total Amount</th>
              <th className="border px-3 py-2 text-left">Settle Date</th>
              <th className="border px-3 py-2 text-left">Send Time</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No record found!
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id}>
                  <td>{r.file_name}</td>
                  <td>{r.total_transaction}</td>
                  <td>{r.total_amount}</td>
                  <td>{new Date(r.settle_date).toLocaleDateString()}</td>
                  <td>{r.send_time ? new Date(r.send_time).toLocaleString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OutstandingLTAResultFile;
