import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

export default function OperationsPage() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [seasonSearch, setSeasonSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(false);

  const backend_API_URL = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:5000";
 
   // Fetch Transactions
  useEffect(() => {
    if (activeTab === "transactions") {
      setLoading(true);
      axios
        .get(`${backend_API_URL}/api/movements/transaction-checker`) // adjust prefix if needed
        .then((res) => setTransactions(res.data))
        .catch((err) => console.error("Error fetching transactions:", err))
        .finally(() => setLoading(false));
    }
  }, [activeTab, backend_API_URL]);

  // Fetch Seasons
  useEffect(() => {
    if (activeTab === "seons") {
      setLoading(true);
      axios
        .get(`${backend_API_URL}//api/movements/seasons-checker`) // adjust prefix if needed
        .then((res) => setSeasons(res.data))
        .catch((err) => console.error("Error fetching seasons:", err))
        .finally(() => setLoading(false));
    }
  }, [activeTab, backend_API_URL]);

  // Fetch Seasons
  useEffect(() => {
    if (activeTab !== "seasons") return;

    let cancel;
    const fetchSeasons = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${backend_API_URL}/api/movements/season-checker`,
          { cancelToken: new axios.CancelToken(c => (cancel = c)) }
        );
        setSeasons(res.data);
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Seasons error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasons();
    return () => cancel?.();
  }, [activeTab, backend_API_URL]);

  // Filtering
  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(transactionSearch.toLowerCase())
      )
    );
  }, [transactions, transactionSearch]);
  
  const filteredSeasons = useMemo(() => {
    return seasons.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(seasonSearch.toLowerCase())
      )
    );
  }, [seasons, seasonSearch]);

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex border-b w-1/2 mb-4">
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex-1 px-4 py-2 text-center ${
            activeTab === "transactions"
              ? "border-b-2 border-blue-500 font-medium text-blue-600"
              : "text-gray-600"
          }`}
        >
          Transaction Checker
        </button>
        <button
          onClick={() => setActiveTab("seasons")}
          className={`flex-1 px-4 py-2 text-center ${
            activeTab === "seasons"
              ? "border-b-2 border-blue-500 font-medium text-blue-600"
              : "text-gray-600"
          }`}
        >
          Season Checker
        </button>
      </div>

      {loading && <p className="text-gray-500 mb-4">Loading...</p>}

      {/* Transaction Checker */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-lg shadow p-4">
          <input
            type="text"
            placeholder="Search transactions..."
            value={transactionSearch}
            onChange={(e) => setTransactionSearch(e.target.value)}
            className="w-md mb-4 px-3 py-2 border rounded"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  {transactions.length > 0 &&
                    Object.keys(transactions[0]).map((key) => (
                      <th key={key} className="p-2 border capitalize">
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="p-2 border">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={transactions[0] ? Object.keys(transactions[0]).length : 1}
                      className="p-4 text-center"
                    >
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Season Checker */}
      {activeTab === "seasons" && (
        <div className="bg-white rounded-lg shadow p-4">
          <input
            type="text"
            placeholder="Search seasons..."
            value={seasonSearch}
            onChange={(e) => setSeasonSearch(e.target.value)}
            className="w-md mb-4 px-3 py-2 border rounded"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  {seasons.length > 0 &&
                    Object.keys(seasons[0]).map((key) => (
                      <th key={key} className="p-2 border capitalize">
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {filteredSeasons.length > 0 ? (
                  filteredSeasons.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="p-2 border">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={seasons[0] ? Object.keys(seasons[0]).length : 1}
                      className="p-4 text-center"
                    >
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
