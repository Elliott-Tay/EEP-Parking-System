import React, { useState, useEffect } from "react";
import { Search, CreditCard, Eye, Download, X } from "lucide-react";

export default function SeasonCardMaster() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cards, setCards] = useState([]);
  const [modalCard, setModalCard] = useState(null);

  // Fetch season cards from API
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/seasons`, 
          {
            headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          },
        });
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setCards(data);
      } catch (err) {
        console.error("Failed to fetch season cards:", err);
        setCards([]);
      }
    };
    fetchCards();
  }, []);

  const filteredCards = cards.filter(
    (card) =>
      card.season_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.holder_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.vehicle_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Preview modal
  const handlePreview = (card) => setModalCard(card);
  const closeModal = () => setModalCard(null);

  // Download individual card (CSV row)
  const handleDownload = (card) => {
    const csvContent = `Season No,Holder Name,Vehicle No,Valid From,Valid To
${card.season_no},${card.holder_name},${card.vehicle_no},${card.valid_from},${card.valid_to}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${card.season_no}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all cards as CSV
  const handleDownloadAll = () => {
    const csvHeader = "Season No,Holder Name,Vehicle No,Valid From,Valid To\n";
    const csvRows = cards
      .map(
        (c) =>
          `${c.season_no},${c.holder_name},${c.vehicle_no},${c.valid_from},${c.valid_to}`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `season_cards.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <CreditCard className="h-6 w-6 text-green-600" /> Season Card Master
      </h1>

      {/* Search + Download All */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by card, holder or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          onClick={handleDownloadAll}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
        >
          <Download className="h-4 w-4" /> Download All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Card Number</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Holder Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Vehicle Number</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Start Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Expiry Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <tr key={card.season_no} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{card.season_no}</td>
                  <td className="px-6 py-4 text-sm">{card.holder_name}</td>
                  <td className="px-6 py-4 text-sm">{card.vehicle_no}</td>
                  <td className="px-6 py-4 text-sm">{card.valid_from}</td>
                  <td className="px-6 py-4 text-sm">{card.valid_to}</td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => handlePreview(card)}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Eye className="h-4 w-4" /> Preview
                    </button>
                    <button
                      onClick={() => handleDownload(card)}
                      className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <Download className="h-4 w-4" /> Download
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No cards found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalCard && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>
            <h2 className="text-lg font-semibold mb-4">Season Card Details</h2>
            <p><strong>Card Number:</strong> {modalCard.season_no}</p>
            <p><strong>Holder Name:</strong> {modalCard.holder_name}</p>
            <p><strong>Vehicle Number:</strong> {modalCard.vehicle_no}</p>
            <p><strong>Valid From:</strong> {modalCard.valid_from}</p>
            <p><strong>Valid To:</strong> {modalCard.valid_to}</p>
          </div>
        </div>
      )}
    </div>
  );
}
