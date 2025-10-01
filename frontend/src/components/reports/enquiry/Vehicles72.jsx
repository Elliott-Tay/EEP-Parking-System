import React, { useState } from "react";

function VehiclesParked72HoursReport() {
  const [reportMonth, setReportMonth] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      let url = `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/overstayed`;
      if (reportMonth) {
        url += `?reportMonth=${reportMonth}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to fetch overstayed vehicles");
        setRecords([]);
        return;
      }

      const mappedData = result.data.map((r) => ({
        iuTicket: r.ticket_id || r.iu_no || r.cashcard_no || "-",
        entryTime: r.entry_datetime ? new Date(r.entry_datetime).toLocaleString() : "-",
        exitTime: r.exit_datetime ? new Date(r.exit_datetime).toLocaleString() : "-",
        parkedTime: r.hours_parked
          ? `${Math.floor(r.hours_parked)}:${Math.round((r.hours_parked % 1) * 60)
              .toString()
              .padStart(2, "0")}`
          : "-",
        paidAmount: r.paid_amount ?? "-",
        vehicleNo: r.vehicle_number ?? "-",
      }));

      setRecords(mappedData);
    } catch (err) {
      console.error(err);
      alert("Server error while fetching overstayed vehicles.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Vehicles Parked More Than 72 Hours Report
      </h1>

      {/* Report Month Selector */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium">Report Month</label>
          <input
            type="month"
            value={reportMonth}
            onChange={(e) => setReportMonth(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">IU / Ticket No</th>
              <th className="border px-3 py-2 text-left">Entry Time</th>
              <th className="border px-3 py-2 text-left">Exit Time</th>
              <th className="border px-3 py-2 text-left">Parked Time (HH:MM)</th>
              <th className="border px-3 py-2 text-left">Paid Amt (S$)</th>
              <th className="border px-3 py-2 text-left">Vehicle No</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No record found!
                </td>
              </tr>
            ) : (
              records.map((r, index) => (
                <tr key={index}>
                  <td className="border px-3 py-2">{r.iuTicket}</td>
                  <td className="border px-3 py-2">{r.entryTime}</td>
                  <td className="border px-3 py-2">{r.exitTime}</td>
                  <td className="border px-3 py-2">{r.parkedTime}</td>
                  <td className="border px-3 py-2">{r.paidAmount}</td>
                  <td className="border px-3 py-2">{r.vehicleNo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VehiclesParked72HoursReport;
