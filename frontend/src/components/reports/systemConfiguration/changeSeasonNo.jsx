import React, { useState } from "react";

function ChangeSeasonIU() {
  const [oldSeasonNo, setOldSeasonNo] = useState("");
  const [newSeasonNo, setNewSeasonNo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeSeason = async () => {
    if (!oldSeasonNo || !newSeasonNo) {
      alert("Please fill in Old Season No and New Season No.");
      return;
    }

    const payload = { oldSeasonNo, newSeasonNo };

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/seasons/change-season`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change season IU");
      }

      alert(data.message || "Season IU changed successfully!");
      setOldSeasonNo("");
      setNewSeasonNo("");
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Change Season (IU) No</h1>

      <div className="w-full max-w-lg bg-white border rounded-lg shadow p-6 space-y-4">
        {[
          { label: "Old Season No", value: oldSeasonNo, setter: setOldSeasonNo },
          { label: "New Season No", value: newSeasonNo, setter: setNewSeasonNo },
        ].map((field, idx) => (
          <div key={idx}>
            <label className="block text-gray-700 font-medium mb-1">{field.label}:</label>
            <input
              type="text"
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div className="flex justify-center mt-4">
          <button
            onClick={handleChangeSeason}
            disabled={loading}
            className={`px-6 py-2 text-white rounded transition-colors ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Processing..." : "Change Season"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeSeasonIU;
