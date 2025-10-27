import React, { useState } from "react";

function VCCExitTransaction() {
  const [iuNo, setIuNo] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setRecords([]);

    try {
      const query = iuNo.trim() ? new URLSearchParams({ iuNo }).toString() : "";
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/vcc/vcc-exit-transactions${query ? `?${query}` : ""}`);
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">VCC Exit Transaction Enquiry</h1>

      {/* Search Bar */}
      <div className="flex gap-3 mb-6 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">IU No (optional):</label>
          <input
            type="text"
            placeholder="Enter IU No or leave empty for all"
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

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "IU/Ticket No",
                "Type",
                "Exit Time",
                "Parked Time",
                "Parking Fee",
                "Card Type",
                "Vehicle No",
                "Ticket No",
                "Status",
              ].map((h) => (
                <th key={h} className="border px-3 py-2 text-left font-medium text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500">
                  {loading ? "Loading..." : "No records to display"}
                </td>
              </tr>
            ) : (
              records.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{r.IUTicketNo}</td>
                  <td className="border px-3 py-2">{r.TransactionType}</td>
                  <td className="border px-3 py-2">{new Date(r.ExitTime).toLocaleString()}</td>
                  <td className="border px-3 py-2">{r.ParkedTimeText || `${r.ParkedMinutes} min`}</td>
                  <td className="border px-3 py-2">{r.ParkingFee?.toFixed(2)}</td>
                  <td className="border px-3 py-2">{r.CardType}</td>
                  <td className="border px-3 py-2">{r.VehicleNo}</td>
                  <td className="border px-3 py-2">{r.TicketNo}</td>
                  <td className="border px-3 py-2">{r.Status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VCCExitTransaction;
