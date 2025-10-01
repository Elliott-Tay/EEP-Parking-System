import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DailyComplimentaryEnquiry() {
  const [ticketNo, setTicketNo] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!ticketNo) {
      alert("Please enter a ticket number.");
      return;
    }

    try {
      const queryParams = new URLSearchParams({ ticket_no: ticketNo });

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/complimentary?${queryParams.toString()}`,
        { method: "GET", headers: {
            "Content-Type": "application/json",
            // Send the token as a Bearer token
            "Authorization": token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data); // assuming API returns an array
    } catch (error) {
      console.error(error);
      alert("Failed to fetch daily complimentary records.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
      <h1 className="text-2xl font-bold mb-6">Daily Complimentary Enquiry</h1>

      <div className="w-full max-w-6xl bg-white border rounded-lg shadow p-6 space-y-4">
        {/* Ticket No */}
        <div className="flex gap-4 items-center">
          <label className="font-medium text-gray-700 w-32">Ticket No:</label>
          <input
            type="text"
            value={ticketNo}
            onChange={(e) => setTicketNo(e.target.value)}
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
                <th className="border px-3 py-2 text-left">Serial No</th>
                <th className="border px-3 py-2 text-left">Complimentary No</th>
                <th className="border px-3 py-2 text-left">Issue Time</th>
                <th className="border px-3 py-2 text-left">Issue By</th>
                <th className="border px-3 py-2 text-left">Expire Time</th>
                <th className="border px-3 py-2 text-left">Entry Time</th>
                <th className="border px-3 py-2 text-left">Exit Time</th>
                <th className="border px-3 py-2 text-left">IU/Card No</th>
                <th className="border px-3 py-2 text-left">Parked Time</th>
                <th className="border px-3 py-2 text-left">Parking Fee (S$)</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{item.serial_no}</td>
                    <td className="border px-3 py-2">{item.complimentary_no}</td>
                    <td className="border px-3 py-2">{item.issue_time}</td>
                    <td className="border px-3 py-2">{item.issue_by}</td>
                    <td className="border px-3 py-2">{item.expire_time}</td>
                    <td className="border px-3 py-2">{item.entry_time}</td>
                    <td className="border px-3 py-2">{item.exit_time}</td>
                    <td className="border px-3 py-2">{item.iu_card_no}</td>
                    <td className="border px-3 py-2">{item.parked_time}</td>
                    <td className="border px-3 py-2">{item.parking_fee}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border px-3 py-2 text-center" colSpan={10}>
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
