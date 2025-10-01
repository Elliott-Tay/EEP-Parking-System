import React, { useState } from "react";

function DailyRedemptionEnquiry() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [serialFrom, setSerialFrom] = useState("");
  const [serialTo, setSerialTo] = useState("");
  const [ticketNo, setTicketNo] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let url = `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/redemption-enquiry?`;
      const params = new URLSearchParams();
      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      if (serialFrom) params.append("serialFrom", serialFrom);
      if (serialTo) params.append("serialTo", serialTo);
      if (ticketNo) params.append("ticketNo", ticketNo);

      url += params.toString();

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Daily Redemption Enquiry</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Report Period From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Report Period To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Serial No From:</label>
          <input
            type="text"
            value={serialFrom}
            onChange={(e) => setSerialFrom(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Serial No To:</label>
          <input
            type="text"
            value={serialTo}
            onChange={(e) => setSerialTo(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ticket No:</label>
          <input
            type="text"
            value={ticketNo}
            onChange={(e) => setTicketNo(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
      </div>

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
      >
        {loading ? "Loading..." : "Search"}
      </button>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Serial No</th>
              <th className="border px-3 py-2">Redemption No</th>
              <th className="border px-3 py-2">Merchant Name</th>
              <th className="border px-3 py-2">Issue Time</th>
              <th className="border px-3 py-2">Issue By</th>
              <th className="border px-3 py-2">Valid To</th>
              <th className="border px-3 py-2">Entry Station</th>
              <th className="border px-3 py-2">Entry Time</th>
              <th className="border px-3 py-2">Redeem Card No</th>
              <th className="border px-3 py-2">Redeem Amount</th>
              <th className="border px-3 py-2">Redeem Time</th>
              <th className="border px-3 py-2">Exit Station</th>
              <th className="border px-3 py-2">Exit Time</th>
              <th className="border px-3 py-2">Parked Time</th>
              <th className="border px-3 py-2">Parking</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={15} className="text-center py-4 text-gray-500">
                  No record found!
                </td>
              </tr>
            ) : (
              records.map((r, index) => (
                <tr key={r.id || index}>
                    <td className="border px-3 py-2">{r.serial_no}</td>
                    <td className="border px-3 py-2">{r.redemption_no}</td>
                    <td className="border px-3 py-2">{r.merchant_name}</td>
                    <td className="border px-3 py-2">{r.issue_time}</td>
                    <td className="border px-3 py-2">{r.issue_by}</td>
                    <td className="border px-3 py-2">{r.valid_to}</td>
                    <td className="border px-3 py-2">{r.entry_station}</td>
                    <td className="border px-3 py-2">{r.entry_time}</td>
                    <td className="border px-3 py-2">{r.redeem_card_no}</td>
                    <td className="border px-3 py-2">{r.redeem_amount}</td>
                    <td className="border px-3 py-2">{r.redeem_time}</td>
                    <td className="border px-3 py-2">{r.exit_station}</td>
                    <td className="border px-3 py-2">{r.exit_time}</td>
                    <td className="border px-3 py-2">{r.parked_time}</td>
                    <td className="border px-3 py-2">{r.parking}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DailyRedemptionEnquiry;