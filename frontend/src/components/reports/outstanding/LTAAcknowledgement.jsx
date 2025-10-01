import React, { useState } from "react";

function OutstandingLTAAcknowledgeFile() {
  const [fileDate, setFileDate] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = `${process.env.REACT_APP_BACKEND_API_URL}/api/outstanding/lta-acknowledge`;
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

  const formatNumber = (num) => num?.toLocaleString() || "-";

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Outstanding LTA Acknowledge Files</h1>

      {/* Date filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Settle Date:</label>
          <input
            type="date"
            value={fileDate}
            onChange={(e) => setFileDate(e.target.value)}
            className="border rounded p-2 w-48"
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["File Name", "Total Transaction", "Total Amount", "Settle Date", "Send Time"].map(
                (header) => (
                  <th
                    key={header}
                    className="border px-4 py-2 text-left text-gray-700 uppercase tracking-wide"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No record found!
                </td>
              </tr>
            ) : (
              records.map((r, idx) => (
                <tr
                  key={r.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border px-4 py-2">{r.file_name}</td>
                  <td className="border px-4 py-2">{formatNumber(r.total_transaction)}</td>
                  <td className="border px-4 py-2">{formatNumber(r.total_amount)}</td>
                  <td className="border px-4 py-2">
                    {r.settle_date ? new Date(r.settle_date).toLocaleDateString() : "-"}
                  </td>
                  <td className="border px-4 py-2">
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

export default OutstandingLTAAcknowledgeFile;
