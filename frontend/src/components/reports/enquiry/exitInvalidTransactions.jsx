import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ExitInvalidTransactionDetail() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        ticket_id: ticketId,
        vehicle_number: vehicleNumber,
        card_number: cardNumber,
      });

      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/exit-invalid-transactions?${queryParams.toString()}`,
        { method: "GET", headers: {
            "Content-Type": "application/json",
            // Send the token as a Bearer token
            "Authorization": token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      console.log('data', data);
      setResults(data); // MovementTrans records
    } catch (error) {
      console.error(error);
      alert("Failed to fetch exit invalid transaction details.");
    }
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString() : "N/A";
  const formatMoney = (amount) => amount != null ? `$${amount.toFixed(2)}` : "N/A";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
      <h1 className="text-2xl font-bold mb-6">Exit Invalid Transaction Detail</h1>

      <div className="w-full max-w-6xl bg-white border rounded-lg shadow p-6 space-y-4">
        
        {/* Report Period */}
        <div className="flex gap-4 items-center">
          <label className="font-medium text-gray-700 w-32">Report Period:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <label className="font-medium text-gray-700 w-32">Ticket ID:</label>
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="Enter Ticket ID"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="font-medium text-gray-700 w-32">Vehicle No:</label>
          <input
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="Enter Vehicle Number"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="font-medium text-gray-700 w-32">Card No:</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Enter Card Number"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Search Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Results Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2 text-left">S/N</th>
                <th className="border px-3 py-2 text-left">Ticket ID</th>
                <th className="border px-3 py-2 text-left">Type</th>
                <th className="border px-3 py-2 text-left">Exit Time</th>
                <th className="border px-3 py-2 text-left">Parked Duration (min)</th>
                <th className="border px-3 py-2 text-left">Parking Fee</th>
                <th className="border px-3 py-2 text-left">Card No</th>
                <th className="border px-3 py-2 text-left">Vehicle ID</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{idx + 1}</td>
                    <td className="border px-3 py-2">{item.ticket_id}</td>
                    <td className="border px-3 py-2">{item.entry_trans_type}</td>
                    <td className="border px-3 py-2">{formatDate(item.exit_datetime)}</td>
                    <td className="border px-3 py-2">{item.parking_dur || "N/A"}</td>
                    <td className="border px-3 py-2">{formatMoney(item.parking_charges || item.paid_amount)}</td>
                    <td className="border px-3 py-2">{item.card_number}</td>
                    <td className="border px-3 py-2">{item.vehicle_id || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border px-3 py-2 text-center" colSpan={8}>
                    No record found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Home Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Home
          </button>
        </div>

      </div>
    </div>
  );
}
