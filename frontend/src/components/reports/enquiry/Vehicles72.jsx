import React, { useState } from "react";

function VehiclesParked72HoursReport() {
  const [reportMonth, setReportMonth] = useState("");

  const handleSearch = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/movements/overstayed`);
        const result = await response.json();

        if (!response.ok) {
        alert(result.error || "Failed to fetch overstayed vehicles");
        return;
        }

        // Map backend data to table-friendly format
        const mappedData = result.data.map((r) => ({
        iuTicket: r.ticket_id || r.iu_no || r.cashcard_no,
        entryTime: new Date(r.entry_datetime).toLocaleString(),
        exitTime: r.exit_datetime ? new Date(r.exit_datetime).toLocaleString() : "-",
        parkedTime: `${Math.floor(r.hours_parked)}:${Math.round((r.hours_parked % 1) * 60).toString().padStart(2, "0")}`,
        paidAmount: r.paid_amount ?? "-",
        vehicleNo: r.vehicle_number ?? "-",
        }));

        console.log(mappedData); // Replace with setState to render table
    } catch (err) {
        console.error(err);
        alert("Server error while fetching overstayed vehicles.");
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
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
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
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No record found!
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehiclesParked72HoursReport;
