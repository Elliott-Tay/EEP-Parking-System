// src/components/reports/ToBeExpiredSeason.js
import React, { useState, useEffect } from "react";
import { Search, Calendar, Bell, RefreshCw } from "lucide-react";

export default function ToBeExpiredSeason() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cards, setCards] = useState([]);

  // Dummy data
  useEffect(() => {
    const dummyCards = [
      {
        id: 1,
        cardNumber: "SC-001",
        holderName: "John Tan",
        expiryDate: "2025-09-30",
        daysLeft: 13,
        status: "Active",
      },
      {
        id: 2,
        cardNumber: "SC-002",
        holderName: "Mary Lim",
        expiryDate: "2025-10-05",
        daysLeft: 18,
        status: "Active",
      },
      {
        id: 3,
        cardNumber: "SC-003",
        holderName: "Alex Lee",
        expiryDate: "2025-09-20",
        daysLeft: 3,
        status: "Active",
      },
    ];
    setCards(dummyCards);
  }, []);

  const filteredCards = cards.filter(
    (card) =>
      card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.holderName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNotify = (card) => console.log("Notify holder:", card);
  const handleRenew = (card) => console.log("Renew card:", card);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Calendar className="h-6 w-6 text-orange-600" /> To Be Expired Season Cards
      </h1>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by card number or holder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Expiry Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Days Left</th>
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
                  <td className="px-6 py-4 text-sm">{card.expiryDate}</td>
                  <td className="px-6 py-4 text-sm">{card.daysLeft}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        card.daysLeft <= 7
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {card.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => handleNotify(card)}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Bell className="h-4 w-4" /> Notify
                    </button>
                    <button
                      onClick={() => handleRenew(card)}
                      className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <RefreshCw className="h-4 w-4" /> Renew
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No expiring cards found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
