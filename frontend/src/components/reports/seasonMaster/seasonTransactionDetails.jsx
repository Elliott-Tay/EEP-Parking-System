import React, { useState, useEffect } from "react";
import { FileText, Eye, Download, X } from "lucide-react";

export default function SeasonTransactionDetails({ defaultSeasonId }) {
  const [seasonId, setSeasonId] = useState(defaultSeasonId || "");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewTx, setPreviewTx] = useState(null); // transaction to preview

  const fetchTransactions = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/seasons/${id}/transactions`,
        { headers: { "Content-Type": "application/json" } }
      );
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (seasonId) fetchTransactions(seasonId);
  }, [seasonId]);

  const handleSearch = () => {
    fetchTransactions(seasonId);
  };

  const handleDownload = (tx) => {
    const csvContent =
      `Serial No,Season No,Vehicle No,Season Type,Holder Type,Holder Name,Company,Season Status,Address,Valid From,Valid To,Employee No,Telephone,Created At,Updated At\n` +
      `${tx.serial_no},${tx.season_no},${tx.vehicle_no},${tx.season_type},${tx.holder_type},${tx.holder_name},${tx.company},${tx.season_status},${tx.address},${tx.valid_from},${tx.valid_to},${tx.employee_no},${tx.telephone},${tx.created_at},${tx.updated_at}`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${tx.season_no}_transaction.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="h-6 w-6 text-orange-600" /> Season Transaction Details
      </h1>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <input
          type="text"
          placeholder="Enter Season No"
          value={seasonId}
          onChange={(e) => setSeasonId(e.target.value)}
          className="pl-3 w-64 h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Serial No</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Season No</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Vehicle No</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Holder Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Company</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Season Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Valid From</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Valid To</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{tx.serial_no}</td>
                  <td className="px-6 py-4 text-sm">{tx.season_no}</td>
                  <td className="px-6 py-4 text-sm">{tx.vehicle_no}</td>
                  <td className="px-6 py-4 text-sm">{tx.holder_name}</td>
                  <td className="px-6 py-4 text-sm">{tx.company}</td>
                  <td className="px-6 py-4 text-sm">{tx.season_status}</td>
                  <td className="px-6 py-4 text-sm">{tx.valid_from}</td>
                  <td className="px-6 py-4 text-sm">{tx.valid_to}</td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => setPreviewTx(tx)}
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
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {previewTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 relative shadow-lg">
            <button
              onClick={() => setPreviewTx(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Transaction Preview</h2>
            <div className="space-y-2 text-sm">
              {Object.entries(previewTx).map(([key, value]) => (
                <div key={key}>
                  <strong>{key.replace(/_/g, " ")}:</strong> {value}
                </div>
              ))}
            </div>
            <button
              onClick={() => handleDownload(previewTx)}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Download CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
