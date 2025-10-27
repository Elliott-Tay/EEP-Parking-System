import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";

function VCCCollectionComparison() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setRecords([]);

    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/vcc/vcc-collection-comparison?${queryParams.toString()}`
      );

      const data = await res.json();

      if (data.success && data.data.length > 0) {
        setRecords(data.data);
      } else {
        setError("No records found for the selected period.");
      }
    } catch (err) {
      console.error("Error fetching VCC comparison:", err);
      setError("Failed to fetch report. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          VCC Collection Comparison
        </h1>
        <p className="text-sm text-gray-500">
          Date:{" "}
          <span className="font-semibold">
            {new Date().toLocaleDateString("en-GB")}
          </span>{" "}
          (D/M/Y)
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-5 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Report Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Report End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Loading...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" /> Search
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Results Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
            <tr>
              {[
                "S/N",
                "Date",
                "Consolidated Settlement",
                "Acknowledge Settlement - Consolidated",
                "Acknowledge - Settlement",
              ].map((header) => (
                <th key={header} className="px-4 py-3 border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-gray-500 italic"
                >
                  {loading ? "Fetching data..." : "No records available"}
                </td>
              </tr>
            ) : (
              records.map((r, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-blue-50 transition-colors"
                >
                  <td className="px-4 py-2">{r.serialNo}</td>
                  <td className="px-4 py-2">
                    {new Date(r.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-2">
                    {r.consolidatedSettlement ?? "-"}
                  </td>
                  <td className="px-4 py-2">
                    {r.acknowledgeSettlementConsolidated ?? "-"}
                  </td>
                  <td className="px-4 py-2">
                    {r.acknowledgeMinusSettlement ?? "-"}
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

export default VCCCollectionComparison;
