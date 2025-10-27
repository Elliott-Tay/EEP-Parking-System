import React, { useState, useEffect } from "react";

function VCCList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchVCC, setSearchVCC] = useState("");
  const [searchClass, setSearchClass] = useState("");
  const [form, setForm] = useState({ vcc: "", description: "", class: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch records from backend
  const fetchRecords = async () => {
    setLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams();
      if (searchVCC) queryParams.append("vcc", searchVCC);
      if (searchClass) queryParams.append("class", searchClass);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/vcc/vcc-list?${queryParams.toString()}`
      );
      const data = await res.json();
      if (data.success) setRecords(data.data);
      else setError("No records found");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Handle form input changes
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle add or update
  const handleSubmit = async () => {
    if (!form.vcc || !form.description || !form.class) {
      alert("All fields are required");
      return;
    }

    try {
      const url = editingId
        ? `${process.env.REACT_APP_BACKEND_API_URL}/api/vcc/vcc-list/${editingId}`
        : `${process.env.REACT_APP_BACKEND_API_URL}/api/vcc/vcc-list`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        fetchRecords();
        setForm({ vcc: "", description: "", class: "" });
        setEditingId(null);
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting record");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/vcc/vcc-list/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) fetchRecords();
      else alert(data.message || "Failed to delete");
    } catch (err) {
      console.error(err);
      alert("Error deleting record");
    }
  };

  // Handle edit click
  const handleEdit = (record) => {
    setEditingId(record.Id);
    setForm({ vcc: record.VCC, description: record.Description, class: record.Class });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">VCC List Management</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-4 items-end">
        <input
          type="text"
          placeholder="Search by VCC"
          value={searchVCC}
          onChange={(e) => setSearchVCC(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Search by Class"
          value={searchClass}
          onChange={(e) => setSearchClass(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchRecords}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Form for Add/Edit */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="font-medium mb-2">{editingId ? "Edit Record" : "Add New Record"}</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <input
            type="text"
            name="vcc"
            placeholder="VCC (Code)"
            value={form.vcc}
            onChange={handleFormChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleFormChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="class"
            placeholder="Class"
            value={form.class}
            onChange={handleFormChange}
            className="border p-2 rounded"
          />
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              onClick={() => { setEditingId(null); setForm({ vcc: "", description: "", class: "" }); }}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Records Table */}
      <div className="overflow-x-auto border border-gray-300 rounded shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["VCC", "Description", "Class", "Actions"].map((h) => (
                <th key={h} className="border px-3 py-2 text-left font-medium text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">Loading...</td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">No records found</td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.Id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{r.VCC}</td>
                  <td className="border px-3 py-2">{r.Description}</td>
                  <td className="border px-3 py-2">{r.Class}</td>
                  <td className="border px-3 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(r)}
                      className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r.Id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VCCList;
