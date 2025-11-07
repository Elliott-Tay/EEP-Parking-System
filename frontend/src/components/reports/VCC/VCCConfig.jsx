import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  List, 
  Tag, 
  FileText,
  Layers,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { toast } from "react-toastify";

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
      if (data.success) {
        setRecords(data.data);
        if (searchVCC || searchClass) {
          toast.success(`Found ${data.data.length} record(s)`);
        }
      } else {
        setError("No records found");
        toast.error("No records found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch records");
      toast.error("Failed to fetch records");
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
      toast.error("All fields are required");
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
        toast.success(editingId ? "Record updated successfully" : "Record added successfully");
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting record");
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
      if (data.success) {
        fetchRecords();
        toast.success("Record deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting record");
    }
  };

  // Handle edit click
  const handleEdit = (record) => {
    setEditingId(record.Id);
    setForm({ vcc: record.VCC, description: record.Description, class: record.Class });
    toast.info("Editing record");
  };

  // Handle cancel
  const handleCancel = () => {
    setEditingId(null);
    setForm({ vcc: "", description: "", class: "" });
    toast.info("Edit cancelled");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
              <List className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                VCC List Management
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage vehicle classification codes and their configurations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-lg">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full -mr-10 -mt-10" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-blue-500 shadow-md">
                  <List className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-blue-700">Total Records</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{records.length}</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-5 shadow-lg">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full -mr-10 -mt-10" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-green-500 shadow-md">
                  <Tag className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-700">Mode</span>
              </div>
              <p className="text-lg font-bold text-green-900">
                {editingId ? "Editing" : "Add New"}
              </p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 shadow-lg">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-purple-500 shadow-md">
                  <Layers className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-purple-700">Status</span>
              </div>
              <p className="text-lg font-bold text-purple-900">
                {loading ? "Loading..." : "Active"}
              </p>
            </div>
          </div>
        </div>

        {/* Search Filters */}
        <div className="rounded-2xl border-2 bg-white shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Search Filters</h3>
                <p className="text-xs text-blue-100 mt-0.5">Find VCC records by code or class</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search by VCC Code
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter VCC code..."
                    value={searchVCC}
                    onChange={(e) => setSearchVCC(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search by Class
                </label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter class..."
                    value={searchClass}
                    onChange={(e) => setSearchClass(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={fetchRecords}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center font-medium"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        <div className="rounded-2xl border-2 bg-white shadow-xl overflow-hidden">
          <div className={`bg-gradient-to-r p-5 ${editingId ? 'from-orange-500 to-orange-600' : 'from-green-500 to-emerald-600'}`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                {editingId ? <Edit2 className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {editingId ? "Edit Record" : "Add New Record"}
                </h3>
                <p className="text-xs text-white/90 mt-0.5">
                  {editingId ? "Update existing VCC record" : "Create a new VCC record"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  VCC Code *
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="vcc"
                    placeholder="Enter VCC code"
                    value={form.vcc}
                    onChange={handleFormChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="description"
                    placeholder="Enter description"
                    value={form.description}
                    onChange={handleFormChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Class *
                </label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="class"
                    placeholder="Enter class"
                    value={form.class}
                    onChange={handleFormChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200 outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSubmit}
                className={`px-6 py-2.5 ${editingId ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'} text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium`}
              >
                {editingId ? (
                  <>
                    <Save className="h-4 w-4" />
                    Update Record
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Record
                  </>
                )}
              </button>
              
              {editingId && (
                <button
                  onClick={handleCancel}
                  className="px-6 py-2.5 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="rounded-2xl border-2 bg-white shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <List className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">VCC Records</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {records.length} record{records.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    VCC Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
                        <p className="text-slate-500">Loading records...</p>
                      </div>
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <AlertCircle className="h-12 w-12 text-slate-300" />
                        <p className="text-slate-500 font-medium">No records found</p>
                        <p className="text-sm text-slate-400">Try adjusting your search filters or add a new record</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  records.map((r, index) => (
                    <tr 
                      key={r.Id} 
                      className={`hover:bg-blue-50/50 transition-colors duration-150 ${editingId === r.Id ? 'bg-orange-50' : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-blue-100">
                            <Tag className="h-3.5 w-3.5 text-blue-600" />
                          </div>
                          <span className="font-medium text-slate-900">{r.VCC}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-700">{r.Description}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          {r.Class}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(r)}
                            className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors duration-200 group"
                            title="Edit record"
                          >
                            <Edit2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.Id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 group"
                            title="Delete record"
                          >
                            <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VCCList;
