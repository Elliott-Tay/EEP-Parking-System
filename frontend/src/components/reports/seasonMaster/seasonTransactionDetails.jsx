// src/components/reports/SeasonTransactionDetails.js
import React, { useState, useEffect } from "react";
import { Search, FileText, Eye, Download } from "lucide-react";

export default function SeasonTransactionDetails() {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState([]);

  // Dummy transaction data
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        cardNumber: "SC-001",
        holderName: "John Tan",
        transactionType: "Renewal",
        amount: 1200,
        date: "2025-01-01",
        status: "Completed",
      },
      {
        id: 2,
        cardNumber: "SC-002",
        holderName: "Mary Lim",
        transactionType: "Top-up",
        amount: 500,
        date: "2025-03-10",
        status: "Completed",
      },
      {
        id: 3,
        cardNumber: "SC-003",
        holderName: "Alex Lee",
        transactionType: "Expired",
        amount: 0,
        date: "2025-08-31",
        status: "Expired",
      },
    ];
    setTransactions(dummyData);
  }, []);

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.transactionType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePreview = (tx) => console.log("Preview transaction:", tx);
  const handleDownload = (tx) => console.log("Download transaction:", tx);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="h-6 w-6 text-orange-600" /> Season Transaction Details
      </h1>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by card, holder, or transaction..."
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Transaction Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{tx.cardNumber}</td>
                  <td className="px-6 py-4 text-sm">{tx.holderName}</td>
                  <td className="px-6 py-4 text-sm">{tx.transactionType}</td>
                  <td className="px-6 py-4 text-sm">${tx.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">{tx.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => handlePreview(tx)}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Eye className="h-4 w-4" /> Preview
                    </button>
                    <button
                      onClick={() => handleDownload(tx)}
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
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
