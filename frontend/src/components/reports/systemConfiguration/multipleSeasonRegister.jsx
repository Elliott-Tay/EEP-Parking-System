import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function MultipleSeasonRegister() {
  const [serialNo, setSerialNo] = useState("");
  const [company, setCompany] = useState("");
  const [seasonStatus, setSeasonStatus] = useState("Valid");
  const [address, setAddress] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [telephone, setTelephone] = useState("");
  const [numIU, setNumIU] = useState(0);
  const [zoneAllowed, setZoneAllowed] = useState("All");
  const [numSeasonPurchased, setNumSeasonPurchased] = useState(0);

  const [iuList, setIUList] = useState([]);
  const [iuInput, setIUInput] = useState("");
  const [iuType, setIUType] = useState("Season"); // Season or Hourly

  const navigate = useNavigate();

  const handleAddIU = () => {
    if (!iuInput) return;
    setIUList([
      ...iuList,
      { id: Date.now(), iuNo: iuInput, type: iuType }
    ]);
    setIUInput("");
  };

  const handleDeleteIU = (id) => {
    setIUList(iuList.filter(iu => iu.id !== id));
  };

  const countInSeason = iuList.filter(iu => iu.type === "Season").length;
  const countInHourly = iuList.filter(iu => iu.type === "Hourly").length;

  const handleRegister = async () => {
    const data = {
      serialNo,
      company,
      seasonStatus,
      address,
      validFrom,
      validTo,
      telephone,
      numIU,
      zoneAllowed,
      numSeasonPurchased,
      iuList,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/tariff/multiple-season`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to register");
      }

      const result = await response.json();
      alert(`Registration successful! Serial No: ${result.serialNo}`);

      //Reset the form
      setSerialNo("");
      setCompany("");
      setSeasonStatus("Valid");
      setAddress("");
      setValidFrom("");
      setValidTo("");
      setTelephone("");
      setNumIU(0);
      setZoneAllowed("All");
      setNumSeasonPurchased(0);
      setIUList([]);
      setIUInput("");
      setIUType("Season");

      // Route back to dashboard if successful registration
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error registering season: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Multiple Season Register</h1>

      <div className="w-full max-w-4xl bg-white border rounded-lg shadow p-6 space-y-4">

        {/* Serial No / Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="block font-medium text-gray-700 mb-1">Company Name:</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Enter company name"
              />
          </div>
        </div>

        {/* Season Status / Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Valid From / Valid To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Telephone / No of IU / Zone / No of Season Purchased */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Telephone:</label>
            <input
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">No of IU to Register:</label>
            <input
              type="number"
              value={numIU}
              onChange={(e) => setNumIU(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Zone Allowed:</label>
            <select
              value={zoneAllowed}
              onChange={(e) => setZoneAllowed(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option>All</option>
              <option>Main</option>
              <option>Zone 1</option>
              <option>Zone 2</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">No of Season Purchased:</label>
            <input
              type="number"
              value={numSeasonPurchased}
              onChange={(e) => setNumSeasonPurchased(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* IU Registration */}
        <div className="space-y-2">
          <label className="block font-medium text-gray-700 mb-1">Add IU:</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="IU Number"
              value={iuInput}
              onChange={(e) => setIUInput(e.target.value)}
              className="flex-1 border rounded p-2"
            />
            <select
              value={iuType}
              onChange={(e) => setIUType(e.target.value)}
              className="border rounded p-2"
            >
              <option value="Season">Season</option>
              <option value="Hourly">Hourly</option>
            </select>
            <button
              type="button"
              onClick={handleAddIU}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add IU
            </button>
          </div>
        </div>

        {/* IU Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">IU No</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {iuList.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-4">No IU registered</td>
                </tr>
              ) : (
                iuList.map((iu) => (
                  <tr key={iu.id}>
                    <td className="p-2 border">{iu.iuNo}</td>
                    <td className="p-2 border">{iu.type}</td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => handleDeleteIU(iu.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* IU Counts */}
        <p className="mt-2 font-medium">
          No of IU Registered: {iuList.length}, In as Season: {countInSeason}, In as Hourly: {countInHourly}
        </p>

        {/* Register Button */}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleRegister}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default MultipleSeasonRegister;
