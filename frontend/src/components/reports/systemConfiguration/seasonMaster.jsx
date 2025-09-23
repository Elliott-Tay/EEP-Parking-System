import React, { useState } from "react";

function SeasonHolderMaster() {
  const [serialNo, setSerialNo] = useState("");
  const [seasonNo, setSeasonNo] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [seasonType, setSeasonType] = useState("Master");
  const [holderType, setHolderType] = useState("VIP");
  const [holderName, setHolderName] = useState("");
  const [company, setCompany] = useState("");
  const [seasonStatus, setSeasonStatus] = useState("Valid");
  const [address, setAddress] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [employeeNo, setEmployeeNo] = useState("");
  const [telephone, setTelephone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      serial_no: serialNo,
      season_no: seasonNo,
      vehicle_no: vehicleNo,
      season_type: seasonType,
      holder_type: holderType,
      holder_name: holderName,
      company,
      season_status: seasonStatus,
      address,
      valid_from: validFrom,
      valid_to: validTo,
      employee_no: employeeNo,
      telephone,
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/seasons/season-holder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to save season holder.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Season Holder Master</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white border rounded-lg shadow p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Serial No:</label>
            <input
              type="text"
              value={serialNo}
              onChange={(e) => setSerialNo(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Season No:</label>
            <input
              type="text"
              value={seasonNo}
              onChange={(e) => setSeasonNo(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Vehicle No:</label>
            <input
              type="text"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Season Type:</label>
            <select
              value={seasonType}
              onChange={(e) => setSeasonType(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option>Master</option>
              <option>IU</option>
              <option>Cashcard</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Holder Type:</label>
            <select
              value={holderType}
              onChange={(e) => setHolderType(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option>VIP</option>
              <option>Day</option>
              <option>Night</option>
              <option>Tenant</option>
              <option>Non-Tenant</option>
              <option>G-Tech</option>
              <option>Complimentary</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Season Status:</label>
            <select
              value={seasonStatus}
              onChange={(e) => setSeasonStatus(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option>Invalid</option>
              <option>Valid</option>
              <option>Expired</option>
              <option>Terminated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Holder Name:</label>
            <input
              type="text"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Company:</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Valid From:</label>
            <input
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Valid To:</label>
            <input
              type="date"
              value={validTo}
              onChange={(e) => setValidTo(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Employee No:</label>
            <input
              type="text"
              value={employeeNo}
              onChange={(e) => setEmployeeNo(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Telephone:</label>
            <input
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save Season Holder
          </button>
        </div>
      </form>
    </div>
  );
}

export default SeasonHolderMaster;
