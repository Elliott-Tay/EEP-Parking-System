import React, { useState } from "react";

function AccessControl() {
  const [userID, setUserID] = useState("");
  const [level, setLevel] = useState("");
  const [password, setPassword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSave = () => {
    // TODO: Replace with API call to save user access
    console.log({ userID, level, password, startDate, expiryDate, remarks });
    alert("User access saved!");
  };

  const functions = [
    { code: "CarPark002", description: "Remote Control (Open Barrier)", remarks: "Data Entry" },
    { code: "CarPark005", description: "Station Admin Control", remarks: "" },
    { code: "CarPark204", description: "Daily Movement Transaction Report", remarks: "Report" },
    { code: "Carpark215", description: "Redemption/Complimentary Report", remarks: "" },
    { code: "CarPark401", description: "Enquiry Movement Transaction Enquiry", remarks: "" },
    { code: "CarPark403", description: "Entry Transaction Enquiry", remarks: "Enquiry" },
    { code: "CarPark406", description: "XPS Transaction Enquiry", remarks: "Enquiry" },
    { code: "CarPark507", description: "Parking Lot Adjustment and Reset", remarks: "Data Entry" },
    { code: "CarPark606", description: "Outstanding Movement Trans Report", remarks: "Report" },
    { code: "ChuGateway", description: "Chu Gateway", remarks: "Chu Gateway" },
    { code: "Compliment", description: "Compliment PWD Issue", remarks: "Issue from cashier" },
    { code: "Complimentary", description: "Complimentary Report", remarks: "Report" },
    { code: "LotAutoAdjust", description: "Lot auto adjustment settings", remarks: "Lot auto adjust" },
    { code: "Redemption", description: "Redemption Report", remarks: "Report" },
    { code: "RedemptionSetup", description: "Set up Redemption", remarks: "" },
    { code: "ViewReport", description: "View Web Reports", remarks: "View Web Reports" },
    { code: "Web", description: "Access to Report", remarks: "Data Entry" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Access Control</h1>

      {/* User Details Form */}
      <div className="bg-white border rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">User ID:</label>
            <input
              type="text"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Level:</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="">Select Level</option>
              <option value="Level 1">Level 1</option>
              <option value="Level 2">Level 2</option>
              <option value="Level 3">Level 3</option>
              <option value="Level 4">Level 4</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date:</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Remarks:</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save User Access
        </button>
      </div>

      {/* Functions Table */}
      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Function Code</th>
              <th className="border px-3 py-2 text-left">Description</th>
              <th className="border px-3 py-2 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {functions.map((fn) => (
              <tr key={fn.code}>
                <td className="border px-3 py-2">{fn.code}</td>
                <td className="border px-3 py-2">{fn.description}</td>
                <td className="border px-3 py-2">{fn.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AccessControl;
