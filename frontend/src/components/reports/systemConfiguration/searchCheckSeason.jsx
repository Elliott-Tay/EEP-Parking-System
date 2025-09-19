import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function SearchCheckSeason() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setResults([]);

    const env_backend = process.env.REACT_APP_BACKEND_API_URL;
    try {
      // Use query parameter for partial match across multiple columns
      const queryParams = new URLSearchParams();
      queryParams.append("seasonNo", searchTerm);

      const res = await fetch(`${env_backend}/api/system-configuration/season-holder?${queryParams.toString()}`);

      const data = await res.json();

      setResults(data.data || []);
    } catch (err) {
      console.error("Error fetching season holders:", err);
      alert("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
      <h1 className="text-2xl font-bold mb-6">Search / Check Season</h1>

      <div className="w-full max-w-xl bg-white border rounded-lg shadow p-6">
        <label className="block text-gray-700 font-medium mb-2">
          Please Key In Season (IU) / Vehicle No / Holder / Company Name
        </label>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter season, vehicle no, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}

        {/* Results Table */}
        {results.length > 0 && (
          <table className="w-full border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Season No</th>
                <th className="p-2 border">Vehicle No</th>
                <th className="p-2 border">Holder Name</th>
                <th className="p-2 border">Company</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 border">{row.season_no}</td>
                  <td className="p-2 border">{row.vehicle_no}</td>
                  <td className="p-2 border">{row.holder_name}</td>
                  <td className="p-2 border">{row.company}</td>
                  <td className="p-2 border">{row.season_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {results.length === 0 && !loading && (
          <p className="text-gray-500">No results found.</p>
        )}

        {/* Centered Home Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
