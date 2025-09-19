import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash, Save, Home, Calendar, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function PublicHolidaySetup() {
  const navigate = useNavigate();
  const [year, setYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

  const env_backend = process.env.REACT_APP_BACKEND_API_URL;
  const baseURL = `${env_backend}/api/system-configuration/holidays`;

  // ================= FETCH HOLIDAYS BY YEAR =================
  const fetchHolidays = async (year) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseURL}/${year}`);
      const data = await res.json();
      if (res.ok) {
        setHolidays(
          data.holidays.map(h => ({
            id: h.id,
            date: new Date(h.holiday_date).toLocaleDateString("en-GB"),
            description: h.description,
            remarks: h.remarks
          }))
        );
      } else {
        alert(data.error || "Failed to fetch holidays");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while fetching holidays");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays(year);
  }, [year]);

  // ================= HOLIDAY STATE HANDLERS =================
  const handleAddHoliday = () => setHolidays([...holidays, { date: "", description: "", remarks: "" }]);
  const handleDeleteHoliday = async (id) => {
    if (!window.confirm("Are you sure you want to delete this holiday?")) return;

    setLoading(true);
    try {
        const res = await fetch(`${baseURL}/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (res.ok) {
        alert(data.message || "Holiday deleted");
        // Refresh list after delete
        fetchHolidays(year);
        } else {
        alert(data.error || "Failed to delete holiday");
        }
    } catch (err) {
        console.error(err);
        alert("Server error while deleting holiday");
    } finally {
        setLoading(false);
    }
    };

  const handleChangeHoliday = (index, field, value) => {
    const updated = [...holidays];
    updated[index][field] = value;
    setHolidays(updated);
  };

  // ================= SAVE HOLIDAYS =================
  const handleSave = async () => {
    setLoading(true);
    try {
      const formattedHolidays = holidays.map(h => ({
        date: h.date.split("/").reverse().join("-"), // convert DD/MM/YYYY → YYYY-MM-DD
        description: h.description,
        remarks: h.remarks
      }));

      const res = await fetch(baseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, holidays: formattedHolidays })
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Holidays saved successfully!");
        fetchHolidays(year);
      } else {
        alert(data.error || "Failed to save holidays");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while saving holidays");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-accent transition-colors">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="p-2 rounded-lg bg-red-100 border border-red-200">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl">Public Holiday Setup</h1>
              <p className="text-muted-foreground">Configure public holidays for the parking management system</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>System Configuration</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Year Selector */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6 p-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Target Year:</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="h-10 w-32 px-3 py-2 rounded-md border"
              min="2020"
              max="2030"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{holidays.length} holidays configured</span>
            </div>
          </div>
        </div>

        {/* Holidays Table */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium">Holiday Schedule</h3>
              <p className="text-sm text-muted-foreground">Manage public holidays</p>
            </div>
            <button
              onClick={handleAddHoliday}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> Add Holiday
            </button>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Date (DD/MM/YYYY)</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Remarks</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {holidays.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No holidays configured
                    </td>
                  </tr>
                )}
                {holidays.map((h, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={h.date}
                        onChange={(e) => handleChangeHoliday(i, "date", e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={h.description}
                        onChange={(e) => handleChangeHoliday(i, "description", e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={h.remarks}
                        onChange={(e) => handleChangeHoliday(i, "remarks", e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDeleteHoliday(h.id)}
                        className="text-red-600 hover:text-red-800"
                        >
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700"
            >
              <Save className="h-4 w-4" /> Save Holidays
            </button>

            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-md border px-6 py-2 hover:bg-gray-100"
            >
              <Home className="h-4 w-4" /> Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
