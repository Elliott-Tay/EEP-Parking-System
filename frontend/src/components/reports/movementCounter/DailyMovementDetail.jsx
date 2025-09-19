// src/components/reports/DailyMovementDetails.js
import React, { useState, useEffect } from "react";
import { Search, Download, Eye, X } from "lucide-react";

export default function DailyMovementDetails() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedDay, setSelectedDay] = useState(""); // YYYY-MM-DD
  const [loading, setLoading] = useState(false);

  const env_backend = process.env.REACT_APP_BACKEND_API_URL;

  useEffect(() => {
    if (!selectedDay) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${env_backend}/api/movements/day/${selectedDay}`);
        const result = await response.json();

        const mappedRecords = result.data.map((r) => {
          const entry = new Date(r.entry_datetime);
          const exit = r.exit_datetime ? new Date(r.exit_datetime) : null;
          const durationMinutes = exit ? Math.round((exit - entry) / 60000) : 0;

          return {
            log_id: r.log_id,
            date: entry.toISOString().split("T")[0],
            counter: r.entry_station_id,
            vehicleId: r.vehicle_number,
            entryTime: entry.toTimeString().slice(0, 5),
            exitTime: exit ? exit.toTimeString().slice(0, 5) : "-",
            durationMinutes,
            parking_charges: r.parking_charges,
            paid_amount: r.paid_amount,
            card_number: r.card_number,
          };
        });

        setRecords(mappedRecords);
      } catch (err) {
        console.error("Error fetching records:", err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDay, env_backend]);

  const filteredRecords = records.filter(
    (r) =>
      r.date?.includes(searchTerm) ||
      r.counter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vehicleId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadCSV = () => {
    if (!filteredRecords.length) return;

    const headers = [
      "Date",
      "Counter",
      "Vehicle ID",
      "Entry Time",
      "Exit Time",
      "Duration (min)",
      "Parking Charges",
      "Paid Amount",
      "Card Number",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredRecords.map((r) =>
        [
          r.date,
          r.counter,
          r.vehicleId,
          r.entryTime,
          r.exitTime,
          r.durationMinutes,
          r.parking_charges,
          r.paid_amount,
          r.card_number,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `daily_movements_${selectedDay}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (record) => setSelectedRecord(record);
  const closeModal = () => setSelectedRecord(null);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Daily Movement Details</h1>

      {/* Date Picker and Search */}
      <div className="mb-4 flex items-center gap-3">
        <input
          type="date"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by date, counter, or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading records...</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Date",
                    "Counter",
                    "Vehicle ID",
                    "Entry Time",
                    "Exit Time",
                    "Duration (min)",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-sm font-medium text-gray-700"
                    >
                      {col}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.log_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{record.date}</td>
                      <td className="px-6 py-4 text-sm">{record.counter}</td>
                      <td className="px-6 py-4 text-sm">{record.vehicleId}</td>
                      <td className="px-6 py-4 text-sm">{record.entryTime}</td>
                      <td className="px-6 py-4 text-sm">{record.exitTime}</td>
                      <td className="px-6 py-4 text-sm">{record.durationMinutes}</td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => handlePreview(record)}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          <Eye className="h-4 w-4" /> Preview
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Download CSV Button */}
          {filteredRecords.length > 0 && (
            <div className="mt-4">
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Download className="h-4 w-4" /> Download CSV
              </button>
            </div>
          )}
        </>
      )}

      {/* Preview Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-xl shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Record Preview (Log ID: {selectedRecord.log_id})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {Object.entries(selectedRecord).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <span className="font-medium">{key}:</span>
                  <span>{value?.toString() || "-"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}