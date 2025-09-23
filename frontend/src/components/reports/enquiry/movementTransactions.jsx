import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MovementTransaction() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [iuTicketNo, setIuTicketNo] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        iu_ticket_no: iuTicketNo,
        vehicle_no: vehicleNo
      });

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/movements?${queryParams.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch movement transactions.");
    }
  };

  const handleDownloadCSV = () => {
    if (results.length === 0) return;

    const headers = [
      "IU/Cashcard/Ticket",
      "Vehicle No",
      "Update Date/Time",
      "Entry Type",
      "Entry Station",
      "Entry Time",
      "Exit Type",
      "Exit Station",
      "Exit Time",
      "Parking Charges",
      "Paid Amount"
    ];

    const csvRows = results.map(item => [
      item.cardNumber || item.ticketId || "-",
      item.vehicleNumber || "-",
      item.updateDatetime || "-",
      item.entryTransType || "-",
      item.entryStationId || "-",
      item.entryDatetime || "-",
      item.exitTransType || "-",
      item.exitStationId || "-",
      item.exitDatetime || "-",
      item.parkingCharges || 0,
      item.paidAmount || 0
    ]);

    const csvContent = [headers, ...csvRows]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `movement_transactions_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
      <h1 className="text-3xl font-bold mb-6">Movement Transaction Enquiry</h1>

      <div className="w-full max-w-6xl bg-white border rounded-xl shadow-lg p-6 space-y-6">
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="w-full h-11 px-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="w-full h-11 px-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div className="space-y-1 col-span-1 md:col-span-1">
            <label className="text-sm font-medium text-gray-600">Vehicle No</label>
            <input type="text" value={vehicleNo} onChange={e => setVehicleNo(e.target.value)}
              placeholder="Enter Vehicle No" 
              className="w-full h-11 px-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div className="flex gap-2">
            <button onClick={handleSearch} className="flex-1 h-11 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Search
            </button>
            <button onClick={handleDownloadCSV} className="flex-1 h-11 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
              Download CSV
            </button>
          </div>
        </div>

        {/* Results Table */}
        {results.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2 text-left">IU/Cashcard/Ticket</th>
                  <th className="border px-3 py-2 text-left">Vehicle No</th>
                  <th className="border px-3 py-2 text-left">Update Date/Time</th>
                  <th className="border px-3 py-2 text-left">Entry</th>
                  <th className="border px-3 py-2 text-left">Exit</th>
                  <th className="border px-3 py-2 text-left">Parking Charges</th>
                  <th className="border px-3 py-2 text-left">Paid Amount</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 even:bg-gray-50">
                    <td className="border px-3 py-2">{item.cardNumber || item.ticketId || "-"}</td>
                    <td className="border px-3 py-2">{item.vehicleNumber || "-"}</td>
                    <td className="border px-3 py-2">{item.updateDatetime || "-"}</td>
                    <td className="border px-3 py-2 whitespace-pre-line">
                      Type: {item.entryTransType || "-"}<br />
                      Station: {item.entryStationId || "-"}<br />
                      Time: {item.entryDatetime || "-"}
                    </td>
                    <td className="border px-3 py-2 whitespace-pre-line">
                      Type: {item.exitTransType || "-"}<br />
                      Station: {item.exitStationId || "-"}<br />
                      Time: {item.exitDatetime || "-"}
                    </td>
                    <td className="border px-3 py-2">{item.parkingCharges || 0}</td>
                    <td className="border px-3 py-2">{item.paidAmount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Home Button */}
        <div className="flex justify-center mt-6">
          <button onClick={() => navigate("/")} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
