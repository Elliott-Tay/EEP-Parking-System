import React, { useState } from "react";

function ChangeSeasonIU() {
  const [oldSeasonNo, setOldSeasonNo] = useState("");
  const [newSeasonNo, setNewSeasonNo] = useState("");
  const [newVehicleNo, setNewVehicleNo] = useState("");
  const [multiSeasonNo, setMultiSeasonNo] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const handleChangeSeason = () => {
    if (!oldSeasonNo || !newSeasonNo) {
      alert("Please fill in Old Season No and New Season No.");
      return;
    }

    const payload = {
      oldSeasonNo,
      newSeasonNo,
      newVehicleNo,
      multiSeasonNo,
      phoneNo,
    };

    console.log("Changing Season IU:", payload);
    alert("Season IU changed! Check console for details.");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Change Season (IU) No</h1>

      <div className="w-full max-w-lg bg-white border rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Old Season No:</label>
          <input
            type="text"
            value={oldSeasonNo}
            onChange={(e) => setOldSeasonNo(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">New Season No:</label>
          <input
            type="text"
            value={newSeasonNo}
            onChange={(e) => setNewSeasonNo(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">New Vehicle No:</label>
          <input
            type="text"
            value={newVehicleNo}
            onChange={(e) => setNewVehicleNo(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Multi Season No:</label>
          <input
            type="text"
            value={multiSeasonNo}
            onChange={(e) => setMultiSeasonNo(e.target.value)}
            placeholder="Separate multiple seasons with commas"
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone No:</label>
          <input
            type="text"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleChangeSeason}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Change Season
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeSeasonIU;
