import React, { useState } from "react";

// Dummy Transaction Data
const transactionData = [
  {
    vehicleId: "V001",
    entryVehicleNo: "SGB1234X",
    entryStationId: "ST01",
    entryDateTime: "2025-08-20 08:15",
    entryTransType: "Entry",
    exitVehicleNo: "SGB1234X",
    exitStationId: "ST05",
    exitDateTime: "2025-08-20 10:45",
    exitTransType: "Exit",
    parkedTime: "2h 30m",
    parkingFee: "$5.00",
    paymentCard: "Visa ****1234",
  },
  {
    vehicleId: "V002",
    entryVehicleNo: "SGH5678M",
    entryStationId: "ST02",
    entryDateTime: "2025-08-21 09:00",
    entryTransType: "Entry",
    exitVehicleNo: "SGH5678M",
    exitStationId: "ST06",
    exitDateTime: "2025-08-21 12:15",
    exitTransType: "Exit",
    parkedTime: "3h 15m",
    parkingFee: "$7.50",
    paymentCard: "Mastercard ****9876",
  },
];

// Dummy Season Data
const seasonData = [
  {
    seasonNo: "S001",
    vehicleNo: "SGB1234X",
    seasonStatus: "Active",
    validDate: "2025-01-01",
    expireDate: "2025-12-31",
  },
  {
    seasonNo: "S002",
    vehicleNo: "SGH5678M",
    seasonStatus: "Expired",
    validDate: "2024-01-01",
    expireDate: "2024-12-31",
  },
];

export default function OperationsPage() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [seasonSearch, setSeasonSearch] = useState("");

  // Filtered Transactions
  const filteredTransactions = transactionData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(transactionSearch.toLowerCase())
    )
  );

  // Filtered Seasons
  const filteredSeasons = seasonData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(seasonSearch.toLowerCase())
    )
  );

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex border-b w-1/2 mb-4">
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex-1 px-4 py-2 text-center ${
            activeTab === "transactions"
              ? "border-b-2 border-blue-500 font-medium text-blue-600"
              : "text-gray-600"
          }`}
        >
          Transaction Checker
        </button>
        <button
          onClick={() => setActiveTab("seasons")}
          className={`flex-1 px-4 py-2 text-center ${
            activeTab === "seasons"
              ? "border-b-2 border-blue-500 font-medium text-blue-600"
              : "text-gray-600"
          }`}
        >
          Season Checker
        </button>
      </div>

      {/* Transaction Checker */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-lg shadow p-4">
          <input
            type="text"
            placeholder="Search transactions..."
            value={transactionSearch}
            onChange={(e) => setTransactionSearch(e.target.value)}
            className="w-md mb-4 px-3 py-2 border rounded"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Vehicle ID</th>
                  <th className="p-2 border">Entry Vehicle No</th>
                  <th className="p-2 border">Entry Station ID</th>
                  <th className="p-2 border">Entry Date Time</th>
                  <th className="p-2 border">Entry Trans Type</th>
                  <th className="p-2 border">Exit Vehicle No</th>
                  <th className="p-2 border">Exit Station ID</th>
                  <th className="p-2 border">Exit Date Time</th>
                  <th className="p-2 border">Exit Trans Type</th>
                  <th className="p-2 border">Parked Time</th>
                  <th className="p-2 border">Parking Fee</th>
                  <th className="p-2 border">Payment Card</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-2 border">{row.vehicleId}</td>
                      <td className="p-2 border">{row.entryVehicleNo}</td>
                      <td className="p-2 border">{row.entryStationId}</td>
                      <td className="p-2 border">{row.entryDateTime}</td>
                      <td className="p-2 border">{row.entryTransType}</td>
                      <td className="p-2 border">{row.exitVehicleNo}</td>
                      <td className="p-2 border">{row.exitStationId}</td>
                      <td className="p-2 border">{row.exitDateTime}</td>
                      <td className="p-2 border">{row.exitTransType}</td>
                      <td className="p-2 border">{row.parkedTime}</td>
                      <td className="p-2 border">{row.parkingFee}</td>
                      <td className="p-2 border">{row.paymentCard}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="p-4 text-center">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Season Checker */}
      {activeTab === "seasons" && (
        <div className="bg-white rounded-lg shadow p-4">
          <input
            type="text"
            placeholder="Search seasons..."
            value={seasonSearch}
            onChange={(e) => setSeasonSearch(e.target.value)}
            className="w-md mb-4 px-3 py-2 border rounded"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Season No</th>
                  <th className="p-2 border">Vehicle No</th>
                  <th className="p-2 border">Season Status</th>
                  <th className="p-2 border">Valid Date</th>
                  <th className="p-2 border">Expire Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSeasons.length > 0 ? (
                  filteredSeasons.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-2 border">{row.seasonNo}</td>
                      <td className="p-2 border">{row.vehicleNo}</td>
                      <td className="p-2 border">{row.seasonStatus}</td>
                      <td className="p-2 border">{row.validDate}</td>
                      <td className="p-2 border">{row.expireDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
