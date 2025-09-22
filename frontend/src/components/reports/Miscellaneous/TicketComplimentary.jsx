import React, { useState, useEffect } from "react";
import { Search, Download, Eye, Calendar } from "lucide-react";

export default function TicketComplimentary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/complimentary-tickets`
        );
        if (!response.ok) throw new Error("Failed to fetch tickets");

        const data = await response.json();
        setTickets(data);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const term = searchTerm.toLowerCase();
    return (
      (ticket.ticketNo || "").toLowerCase().includes(term) ||
      (ticket.issuedBy || "").toLowerCase().includes(term) ||
      (ticket.reason || "").toLowerCase().includes(term) ||
      (ticket.status || "").toLowerCase().includes(term) ||
      (ticket.date || "").includes(term)
    );
  });

  const handleViewTicket = (ticket) => {
    alert(
      `Ticket No: ${ticket.ticketNo}\nDate: ${ticket.date}\nIssued By: ${ticket.issuedBy}\nReason: ${ticket.reason}\nStatus: ${ticket.status}`
    );
  };

  const handleDownloadTicket = (ticket) => {
    const csvContent = `Ticket No,Date,Issued By,Reason,Status\n${ticket.ticketNo},${ticket.date},${ticket.issuedBy},${ticket.reason},${ticket.status}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${ticket.ticketNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    if (!tickets.length) return;
    const csvRows = ["Ticket No,Date,Issued By,Reason,Status"];
    tickets.forEach((t) => {
      csvRows.push(`${t.ticketNo},${t.date},${t.issuedBy},${t.reason},${t.status}`);
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `complimentary_tickets.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-600" /> Ticket Complimentary
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Download className="h-4 w-4" /> Download All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Ticket No</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Issued By</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Reason</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">Loading...</td>
              </tr>
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{ticket.date}</td>
                  <td className="px-6 py-4 text-sm">{ticket.ticketNo}</td>
                  <td className="px-6 py-4 text-sm">{ticket.issuedBy}</td>
                  <td className="px-6 py-4 text-sm">{ticket.reason}</td>
                  <td className="px-6 py-4 text-sm">
                    {ticket.status === "Used" ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Used</span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Unused</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => handleViewTicket(ticket)}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Eye className="h-4 w-4" /> View
                    </button>
                    <button
                      onClick={() => handleDownloadTicket(ticket)}
                      className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <Download className="h-4 w-4" /> Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">No tickets found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
