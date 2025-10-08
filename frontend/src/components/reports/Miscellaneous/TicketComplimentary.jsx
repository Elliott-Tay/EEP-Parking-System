import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  Eye,
  Calendar,
  Home,
  Filter,
  Info,
  Loader2,
  Ticket,
  User,
  FileText,
  CheckCircle2,
  Clock,
  X
} from "lucide-react";
import { toast } from "react-toastify";

export default function TicketComplimentary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/movements/complimentary-tickets`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": token ? `Bearer ${token}` : "",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch tickets");

        const data = await response.json();
        setTickets(data);
        
        if (data && data.length > 0) {
          toast.success(`Loaded ${data.length} complimentary ticket${data.length !== 1 ? 's' : ''}`);
        } else {
          toast.info("No complimentary tickets found");
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
        toast.error("Failed to fetch complimentary tickets");
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
    setSelectedTicket(ticket);
  };

  const closeModal = () => {
    setSelectedTicket(null);
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
    
    toast.success(`Downloaded ticket ${ticket.ticketNo}`);
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
    
    toast.success(`Downloaded ${tickets.length} complimentary tickets`);
  };

  // Calculate statistics
  const totalTickets = filteredTickets.length;
  const usedTickets = filteredTickets.filter(t => t.status === "Used").length;
  const unusedTickets = filteredTickets.filter(t => t.status === "Unused").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-red-100/20"></div>
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(239, 68, 68, 0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      ></div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/25">
                <Ticket className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Ticket Complimentary</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and track complimentary parking tickets
                </p>
              </div>
            </div>
          </div>

          {/* Search and Actions Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-900">Search & Actions</h2>
                </div>
              </div>
              <p className="text-sm text-blue-700 mt-1">Filter tickets and perform bulk operations</p>
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={loading}
                    className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Download All Button */}
                <button
                  onClick={handleDownloadAll}
                  disabled={loading || !tickets.length}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
                >
                  <Download className="w-5 h-5" />
                  Download All
                </button>

                {/* Home Button */}
                <button
                  onClick={() => navigate("/")}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
                >
                  <Home className="w-5 h-5" />
                  Home
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading complimentary tickets...</p>
                <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
              </div>
            </div>
          ) : tickets.length > 0 ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Ticket className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Tickets</p>
                      <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Used Tickets</p>
                      <p className="text-2xl font-bold text-gray-900">{usedTickets}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Unused Tickets</p>
                      <p className="text-2xl font-bold text-gray-900">{unusedTickets}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-green-50 to-green-100/50 border-b px-6 py-4 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Complimentary Ticket Records</h3>
                    </div>
                    <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-medium">
                      {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {searchTerm ? `Filtered by "${searchTerm}"` : 'All complimentary tickets'}
                  </p>
                </div>

                <div className="p-6">
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              Date
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Ticket className="w-4 h-4 text-gray-400" />
                              Ticket No
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              Issued By
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              Reason
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            <div className="flex items-center gap-2">
                              <Info className="w-4 h-4 text-gray-400" />
                              Status
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredTickets.length > 0 ? (
                          filteredTickets.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                              <td className="px-4 py-3 text-sm text-gray-700">{ticket.date}</td>
                              <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">{ticket.ticketNo}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{ticket.issuedBy}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{ticket.reason}</td>
                              <td className="px-4 py-3 text-sm">
                                {ticket.status === "Used" ? (
                                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Used
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Unused
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleViewTicket(ticket)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors duration-150"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleDownloadTicket(ticket)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors duration-150"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-gray-500">
                              {searchTerm ? `No tickets match "${searchTerm}"` : "No tickets found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile/Tablet Card View */}
                  <div className="lg:hidden space-y-4">
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((ticket) => (
                        <div 
                          key={ticket.id}
                          className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="space-y-3">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                <Ticket className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <span className="font-mono text-sm font-semibold text-gray-900">
                                  {ticket.ticketNo}
                                </span>
                              </div>
                              {ticket.status === "Used" ? (
                                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Used
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Unused
                                </span>
                              )}
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <Calendar className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">Date</span>
                                </div>
                                <p className="text-sm text-gray-900">{ticket.date}</p>
                              </div>
                              <div>
                                <div className="flex items-center gap-1 mb-1">
                                  <User className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">Issued By</span>
                                </div>
                                <p className="text-sm text-gray-900">{ticket.issuedBy}</p>
                              </div>
                            </div>

                            {/* Reason */}
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <FileText className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600">Reason</span>
                              </div>
                              <p className="text-sm text-gray-900">{ticket.reason}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-gray-200">
                              <button
                                onClick={() => handleViewTicket(ticket)}
                                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                              <button
                                onClick={() => handleDownloadTicket(ticket)}
                                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <Info className="w-8 h-8 text-gray-400" />
                          <p>{searchTerm ? `No tickets match "${searchTerm}"` : "No tickets found"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : !loading && (
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Ticket className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Tickets Found</h3>
                <p className="text-sm text-gray-600 max-w-md">
                  No complimentary tickets available in the system.
                </p>
              </div>
            </div>
          )}

          {/* Help Card */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Complimentary Ticket Information</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Complimentary tickets are issued for special circumstances like VIP visits, maintenance vehicles, or promotional events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Use the search box to filter tickets by ticket number, date, issuer, reason, or status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Click "View" to see detailed information about a specific ticket in a modal dialog</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Download individual tickets or export all tickets to CSV format for record-keeping and reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Summary cards show real-time statistics: total tickets issued, used tickets, and unused tickets</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Ticket Modal */}
      {selectedTicket && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-150"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Ticket Details</h2>
                  <p className="text-sm text-gray-600">Complimentary parking ticket information</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Ticket className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Ticket No</span>
                  </div>
                  <p className="text-lg font-mono font-bold text-gray-900">{selectedTicket.ticketNo}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Date</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedTicket.date}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Issued By</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedTicket.issuedBy}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Status</span>
                  </div>
                  <div>
                    {selectedTicket.status === "Used" ? (
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Used
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <Clock className="w-4 h-4 mr-1" />
                        Unused
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-gray-600 uppercase tracking-wide font-medium">Reason</span>
                </div>
                <p className="text-base text-gray-900">{selectedTicket.reason}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  handleDownloadTicket(selectedTicket);
                  closeModal();
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:-translate-y-0.5 font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
              <button
                onClick={closeModal}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}