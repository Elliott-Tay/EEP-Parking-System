import React, { useState } from "react";

function OutstandingMovementTransaction() {
  const [reportDate, setReportDate] = useState("2025-09-18");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/outstanding?reportDate=${reportDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          }
        }
      );
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to fetch transactions");

      setTransactions(json.data || []);
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Outstanding Movement Transaction</h1>

      {/* Report Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Date (D/M/Y):</label>
        <input
          type="date"
          value={reportDate}
          onChange={(e) => setReportDate(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} mb-6`}
      >
        {loading ? "Loading..." : "Search"}
      </button>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">IU/Ticket No</th>
              <th className="border px-3 py-2 text-left">Type</th>
              <th className="border px-3 py-2 text-left">Entry Time</th>
              <th className="border px-3 py-2 text-left">Exit Time</th>
              <th className="border px-3 py-2 text-left">Parked Time (mins)</th>
              <th className="border px-3 py-2 text-left">Parking Fee</th>
              <th className="border px-3 py-2 text-left">Card Type</th>
              <th className="border px-3 py-2 text-left">Card No</th>
              <th className="border px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
                <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                    No record found!
                </td>
                </tr>
            ) : (
                transactions.map((t, idx) => (
                <tr key={idx}>
                    <td className="border px-3 py-2">{t.vehicle_number || "-"}</td>
                    <td className="border px-3 py-2">{t.entry_trans_type}</td>
                    <td className="border px-3 py-2">{new Date(t.entry_datetime).toLocaleString()}</td>
                    <td className="border px-3 py-2">{t.exit_datetime ? new Date(t.exit_datetime).toLocaleString() : "-"}</td>
                    <td className="border px-3 py-2">{t.parking_dur || "-"}</td>
                    <td className="border px-3 py-2">{t.parking_charges || "-"}</td>
                    <td className="border px-3 py-2">{t.card_type || "-"}</td>
                    <td className="border px-3 py-2">{t.card_number || "-"}</td>
                    <td className="border px-3 py-2">{t.exit_trans_type ? "Exited" : "Outstanding"}</td>
                </tr>
                ))
            )}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default OutstandingMovementTransaction;
