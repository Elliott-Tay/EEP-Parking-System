import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ExitValidTransaction() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [iuTicketNo, setIuTicketNo] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        iu_ticket_no: iuTicketNo,
      });

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/exit-valid-transactions?${queryParams.toString()}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data); // assuming API returns an array of exit valid transactions
    } catch (error) {
      console.error(error);
      alert("Failed to fetch exit valid transactions.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
      <h1 className="text-2xl font-bold mb-6">Exit Valid Transaction Enquiry</h1>

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

        {/* IU/Ticket/Cashcard No */}
        <div className="flex gap-4 items-center">
          <label className="font-medium text-gray-700 w-32">IU/Ticket/Cashcard No:</label>
          <input
            type="text"
            value={iuTicketNo}
            onChange={(e) => setIuTicketNo(e.target.value)}
            placeholder="Enter IU, Ticket, or Cashcard No"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <th className="border px-3 py-2 text-left">IU/Ticket No</th>
                <th className="border px-3 py-2 text-left">Type</th>
                <th className="border px-3 py-2 text-left">Exit Time</th>
                <th className="border px-3 py-2 text-left">Parked Time</th>
                <th className="border px-3 py-2 text-left">Parking Fee</th>
                <th className="border px-3 py-2 text-left">Card Type</th>
                <th className="border px-3 py-2 text-left">Card No</th>
                <th className="border px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{item.iu_ticket_no}</td>
                    <td className="border px-3 py-2">{item.type}</td>
                    <td className="border px-3 py-2">{item.exit_time}</td>
                    <td className="border px-3 py-2">{item.parked_time}</td>
                    <td className="border px-3 py-2">{item.parking_fee}</td>
                    <td className="border px-3 py-2">{item.card_type}</td>
                    <td className="border px-3 py-2">{item.card_no}</td>
                    <td className="border px-3 py-2">{item.status}</td>
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
