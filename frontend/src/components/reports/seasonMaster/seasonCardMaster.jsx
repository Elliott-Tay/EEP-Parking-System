// src/components/reports/SeasonCardMaster.js
import React, { useState, useEffect } from "react";
import { Search, CreditCard, Eye, Download } from "lucide-react";

export default function SeasonCardMaster() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cards, setCards] = useState([]);

  // Dummy data
  useEffect(() => {
    const dummyCards = [
      {
        id: 1,
        cardNumber: "SC-001",
        holderName: "John Tan",
        vehicleNumber: "SGX1234A",
        startDate: "2025-01-01",
        expiryDate: "2025-12-31",
        status: "Active",
      },
      {
        id: 2,
        cardNumber: "SC-002",
        holderName: "Mary Lim",
        vehicleNumber: "SGY5678B",
        startDate: "2025-03-01",
        expiryDate: "2026-02-28",
        status: "Active",
      },
      {
        id: 3,
        cardNumber: "SC-003",
        holderName: "Alex Lee",
        vehicleNumber: "SGZ9101C",
        startDate: "2024-09-01",
        expiryDate: "2025-08-31",
        status: "Expired",
      },
    ];
    setCards(dummyCards);
  }, []);

  const filteredCards = cards.filter(
    (card) =>
      card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePreview = (card) => {
    console.log("Preview card:", card);
  };

  const handleDownload = (card) => {
    console.log("Download card:", card);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <CreditCard className="h-6 w-6 text-green-600" /> Season Card Master
      </h1>

      {/* Search */}
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <tr key={card.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{card.cardNumber}</td>
                  <td className="px-6 py-4 text-sm">{card.holderName}</td>
                  <td className="px-6 py-4 text-sm">{card.vehicleNumber}</td>
                  <td className="px-6 py-4 text-sm">{card.startDate}</td>
                  <td className="px-6 py-4 text-sm">{card.expiryDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        card.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {card.status}
                    </span>
                  </td>
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
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No cards found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}