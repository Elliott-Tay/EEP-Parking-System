import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SeasonMasterHistoryEnquiry() {
  const [seasonSearch, setSeasonSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        season: seasonSearch,
        start_date: startDate,
        end_date: endDate,
      });

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/season-history?${queryParams.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setResults(data); // Expecting array of season history records
    } catch (error) {
      console.error(error);
      alert("Failed to fetch season history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Season Master History Enquiry</h1>

      <div className="w-full max-w-6xl bg-white border rounded-lg shadow p-6 space-y-4">
        {/* Report Period */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <label className="text-gray-700 font-medium mb-1 md:mb-0">Report Period:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="mx-2">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Season / Vehicle Search */}
        <div className="flex gap-2 items-center">
          <label className="text-gray-700 font-medium">Season / Vehicle No:</label>
          <input
            type="text"
            placeholder="Enter Season or Vehicle No..."
            value={seasonSearch}
            onChange={(e) => setSeasonSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Loading indicator */}
        {loading && <p className="text-gray-500 text-center">Loading...</p>}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border">No</th>
                <th className="px-3 py-2 border">Zone</th>
                <th className="px-3 py-2 border">Season No</th>
                <th className="px-3 py-2 border">Operator</th>
                <th className="px-3 py-2 border">Update Time</th>
                <th className="px-3 py-2 border">Status</th>
                <th className="px-3 py-2 border">Valid From</th>
                <th className="px-3 py-2 border">Valid To</th>
                <th className="px-3 py-2 border">Vehicle No</th>
                <th className="px-3 py-2 border">Holder Name</th>
                <th className="px-3 py-2 border">Holder Type</th>
                <th className="px-3 py-2 border">Unit No</th>
                <th className="px-3 py-2 border">Company</th>
                <th className="px-3 py-2 border">Tel</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 && !loading && (
                <tr>
                  <td colSpan="14" className="text-center py-4 text-gray-500">
                    No record found!
                  </td>
                </tr>
              )}
              {results.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{item.zone || "-"}</td>
                  <td className="border px-3 py-2">{item.seasonNo || "-"}</td>
                  <td className="border px-3 py-2">{item.operator || "-"}</td>
                  <td className="border px-3 py-2">{item.updateTime || "-"}</td>
                  <td className="border px-3 py-2">{item.status || "-"}</td>
                  <td className="border px-3 py-2">{item.validFrom || "-"}</td>
                  <td className="border px-3 py-2">{item.validTo || "-"}</td>
                  <td className="border px-3 py-2">{item.vehicleNo || "-"}</td>
                  <td className="border px-3 py-2">{item.holderName || "-"}</td>
                  <td className="border px-3 py-2">{item.holderType || "-"}</td>
                  <td className="border px-3 py-2">{item.unitNo || "-"}</td>
                  <td className="border px-3 py-2">{item.company || "-"}</td>
                  <td className="border px-3 py-2">{item.tel || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Home Button */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Home
          </button>
          {results.length > 0 && (
            <button
              onClick={() => {
                const csvContent = [
                  Object.keys(results[0]).join(","), // header
                  ...results.map(r => Object.values(r).join(",")),
                ].join("\n");
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.setAttribute("download", "season_history.csv");
                link.click();
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Download CSV
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
