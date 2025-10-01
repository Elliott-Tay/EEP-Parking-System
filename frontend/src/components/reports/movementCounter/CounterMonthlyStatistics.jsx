// src/components/reports/CounterMonthlyStatistics.js
import React, { useState, useEffect } from "react";
import { Search, Eye, Calendar, X, Download } from "lucide-react";

export default function CounterMonthlyStatistics() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // YYYY-MM
  const [loading, setLoading] = useState(false);

  const env_backend = process.env.REACT_APP_BACKEND_API_URL;

  useEffect(() => {
    if (!selectedMonth) return;

    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${env_backend}/api/movements/monthly/${selectedMonth}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": token ? `Bearer ${token}` : "",
            },
          }
        );
        const data = await res.json();
        setRecords(data.data || []);
      } catch (err) {
        console.error("Error fetching monthly records:", err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const filteredRecords = records.filter((r) =>
    Object.values(r).some((val) =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handlePreview = (record) => setSelectedRecord(record);
  const closeModal = () => setSelectedRecord(null);

  // Compute stats
  const totalRecords = filteredRecords.length;
  const totalVehicles = new Set(filteredRecords.map(r => r.vehicle_number)).size;
  const totalPaidAmount = filteredRecords.reduce((sum, r) => sum + (r.paid_amount || 0), 0);
  const totalParkingCharges = filteredRecords.reduce((sum, r) => sum + (r.parking_charges || 0), 0);

  const [year, month] = selectedMonth.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const avgDailyVehicles = daysInMonth ? totalVehicles / daysInMonth : 0;

  // --- CSV Download ---
  const handleDownloadCSV = () => {
    if (!filteredRecords.length) return;

    const headers = Object.keys(filteredRecords[0]);
    const csvContent = [
      headers.join(","),
      ...filteredRecords.map(r =>
        headers.map(h => r[h] ?? "").join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `counter_monthly_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Counter Monthly Statistics</h1>

      {/* Month Picker and Search */}
      <div className="mb-4 flex items-center gap-3">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
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
        {filteredRecords.length > 0 && (
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Download className="h-4 w-4" /> Download CSV
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Records" value={totalRecords} color="blue" />
        <StatCard label="Total Vehicles" value={totalVehicles} color="green" />
        <StatCard label="Avg Daily Vehicles" value={avgDailyVehicles.toFixed(1)} color="purple" />
        <StatCard label="Total Paid Amount" value={totalPaidAmount.toFixed(2)} color="yellow" />
        <StatCard label="Total Parking Charges" value={totalParkingCharges.toFixed(2)} color="red" />
      </div>

      {loading ? (
        <p>Loading records...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(records[0] || {}).map((col) => (
                  <th key={col} className="px-6 py-3 text-left text-sm font-medium text-gray-700">{col}</th>
                ))}
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.length > 0 ? filteredRecords.map((r) => (
                <tr key={r.log_id} className="hover:bg-gray-50">
                  {Object.values(r).map((val, i) => <td key={i} className="px-6 py-4 text-sm">{val || "-"}</td>)}
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handlePreview(r)} className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      <Eye className="h-4 w-4" /> Preview
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={Object.keys(records[0] || {}).length + 1} className="text-center py-4 text-gray-500">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-xl shadow-lg relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Record Preview (Log ID: {selectedRecord.log_id})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {Object.entries(selectedRecord).map(([key, val]) => (
                <div key={key} className="flex gap-2"><span className="font-medium">{key}:</span><span>{val || "-"}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Small component for stats
function StatCard({ label, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm flex items-center gap-3">
      <div className={`p-2 rounded-lg ${colors[color] || "bg-gray-100 text-gray-600"}`}>
        <Calendar className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
