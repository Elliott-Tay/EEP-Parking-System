// src/components/reports/DailyParkingDuration.js
import React, { useState, useEffect } from "react";
import { Search, Eye, X, Download } from "lucide-react";

export default function DailyParkingDuration() {
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
        const token = localStorage.getItem("token");
        const response = await fetch(`${env_backend}/api/movements/day/${selectedDay}`,
          {
            headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          },
        });
        const result = await response.json();

        const mappedRecords = result.data.map((r) => {
          const entryTime = new Date(r.entry_datetime);
          const exitTime = r.exit_datetime ? new Date(r.exit_datetime) : null;
          const parkingDuration = exitTime ? Math.round((exitTime - entryTime) / 60000) : 0; // in minutes

          return {
            log_id: r.log_id,
            vehicle_number: r.vehicle_number,
            entry_station_id: r.entry_station_id,
            exit_station_id: r.exit_station_id,
            entry_datetime: r.entry_datetime,
            exit_datetime: r.exit_datetime,
            parking_dur: parkingDuration, // dynamically calculated
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

  const filteredRecords = records.filter((r) =>
    Object.values(r).some((val) =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // --- Parking Duration Calculations ---
  const avgDuration =
    filteredRecords.length > 0
      ? filteredRecords.reduce((sum, r) => sum + (r.parking_dur || 0), 0) /
        filteredRecords.length
      : 0;

  const durationBins = Array.from({ length: 10 }, (_, i) => i + 1).reduce(
    (acc, hour) => {
      acc[hour] = filteredRecords.filter(
        (r) => (r.parking_dur || 0) / 60 >= hour - 1 && (r.parking_dur || 0) / 60 < hour
      ).length;
      return acc;
    },
    {}
  );
  durationBins["10+"] = filteredRecords.filter(
    (r) => (r.parking_dur || 0) / 60 >= 10
  ).length;

  const handlePreview = (record) => setSelectedRecord(record);
  const closeModal = () => setSelectedRecord(null);

  const handleDownloadCSV = () => {
    if (!filteredRecords.length) return;

    const headers = [
      "log_id",
      "vehicle_number",
      "entry_station_id",
      "exit_station_id",
      "entry_datetime",
      "exit_datetime",
      "parking_dur",
      "parking_charges",
      "paid_amount",
      "card_number",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredRecords.map((r) =>
        headers.map((h) => r[h] ?? "").join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `parking_duration_${selectedDay}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Daily Parking Duration</h1>

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
            placeholder="Search all fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Records</p>
          <p className="text-lg font-semibold">{filteredRecords.length}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Average Parking Duration</p>
          <p className="text-lg font-semibold">{avgDuration.toFixed(1)} min</p>
        </div>
        {Object.entries(durationBins).map(([bin, count]) => (
          <div key={bin} className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">
              {bin} hr{bin !== "1" && "+"}
            </p>
            <p className="text-lg font-semibold">{count}</p>
          </div>
        ))}
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
                    "log_id",
                    "vehicle_number",
                    "entry_station_id",
                    "exit_station_id",
                    "entry_datetime",
                    "exit_datetime",
                    "parking_dur",
                    "parking_charges",
                    "paid_amount",
                    "card_number",
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
                      {Object.values(record).map((val, idx) => (
                        <td key={idx} className="px-6 py-4 text-sm">
                          {val?.toString() || "-"}
                        </td>
                      ))}
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
                    <td colSpan={11} className="text-center py-4 text-gray-500">
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
