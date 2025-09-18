import React, { useState } from "react";

function SeasonUpdate() {
  const [expireDate, setExpireDate] = useState("");
  const [company, setCompany] = useState("ALL");
  const [holderType, setHolderType] = useState("ALL");
  const [seasonStatus, setSeasonStatus] = useState("ALL");
  const [sortField, setSortField] = useState("Serial No");

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {
      expireDate,
      company,
      holderType,
      seasonStatus,
      sortField,
    };
    console.log("Filters applied:", filters);
    alert("Filters applied! Check console for details.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Season Update</h1>

      <form 
        onSubmit={handleSearch} 
        className="w-full max-w-3xl bg-white border rounded-lg shadow p-6 space-y-4"
      >
        {/* Expire Date / Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Expire Date (dd/mm/yyyy):
            </label>
            <input
              type="date"
              value={expireDate}
              onChange={(e) => setExpireDate(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Company:
            </label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option>ALL</option>
              <option>Company A</option>
              <option>Company B</option>
              <option>Company C</option>
            </select>
          </div>
        </div>

        {/* Holder Type / Season Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Holder Type:
            </label>
            <select
              value={holderType}
              onChange={(e) => setHolderType(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option>ALL</option>
              <option>VIP</option>
              <option>Tenant</option>
              <option>Non-Tenant</option>
              <option>G-Tech</option>
              <option>Complimentary</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Season Status:
            </label>
            <select
              value={seasonStatus}
              onChange={(e) => setSeasonStatus(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option>ALL</option>
              <option>Valid</option>
              <option>Invalid</option>
              <option>Expired</option>
              <option>Terminated</option>
            </select>
          </div>
        </div>

        {/* Sort Field */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Sort:</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option>Serial No</option>
            <option>Season No</option>
            <option>Holder Name</option>
            <option>Company</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
}

export default SeasonUpdate;
