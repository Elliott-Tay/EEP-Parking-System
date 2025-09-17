import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash, Save, Home, Calendar, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

export default function PublicHolidaySetup() {
  const navigate = useNavigate();
  
  const [year, setYear] = useState(2025);
  const [holidays, setHolidays] = useState([
    { date: "01/01/2025", description: "New Years Day", remarks: "" },
    { date: "29/01/2025", description: "Chinese New Year", remarks: "" },
    { date: "30/01/2025", description: "Chinese New Year", remarks: "" },
    { date: "31/03/2025", description: "Hari Raya Puasa", remarks: "" },
    { date: "18/04/2025", description: "Good Friday", remarks: "" },
    { date: "01/05/2025", description: "Labour Day", remarks: "" },
    { date: "03/05/2025", description: "GE 2025", remarks: "" },
    { date: "12/05/2025", description: "Vesak Day", remarks: "" },
    { date: "07/06/2025", description: "Hari Raya Haji", remarks: "" },
    { date: "09/08/2025", description: "National Day", remarks: "" },
    { date: "20/10/2025", description: "Deepavali", remarks: "" },
    { date: "25/12/2025", description: "Christmas Day", remarks: "" },
  ]);

  const handleAddHoliday = () => {
    setHolidays([...holidays, { date: "", description: "", remarks: "" }]);
  };

  const handleDeleteHoliday = (index) => {
    setHolidays(holidays.filter((_, i) => i !== index));
  };

  const handleChangeHoliday = (index, field, value) => {
    const updated = [...holidays];
    updated[index][field] = value;
    setHolidays(updated);
  };

  const handleSave = () => {
    // Save logic here (API call or local storage)
    console.log("Saving holidays:", holidays);
    alert("Holidays saved!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
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

      <div className="p-6 max-w-7xl mx-auto">
        {/* Year Selection Card */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6">
          <div className="flex flex-col space-y-1.5 p-6 pb-4">
            <h3 className="text-lg leading-none tracking-tight">Holiday Year Configuration</h3>
            <p className="text-sm text-muted-foreground">Select the year for holiday management</p>
          </div>
          <div className="p-6 pt-0">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Target Year:</label>
              <div className="relative">
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="h-10 w-32 px-3 py-2 rounded-md border border-input bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                  min="2020"
                  max="2030"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{holidays.length} holidays configured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Holiday Management Card */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-none tracking-tight">Holiday Schedule</h3>
                <p className="text-sm text-muted-foreground">Manage public holidays and special dates</p>
              </div>
              <button
                onClick={handleAddHoliday}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
                Add Holiday
              </button>
            </div>
          </div>

          <div className="p-6 pt-0">
            {/* Table Container with Scroll */}
            <div className="overflow-hidden rounded-lg border">
              <div className="overflow-x-auto max-h-96">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Date (DD/MM/YYYY)
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Holiday Description
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Remarks
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {holidays.map((holiday, index) => (
                      <tr key={index} className="hover:bg-muted/25 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={holiday.date}
                            onChange={(e) => handleChangeHoliday(index, "date", e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="w-full h-9 px-3 py-1 rounded-md border border-input bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={holiday.description}
                            onChange={(e) => handleChangeHoliday(index, "description", e.target.value)}
                            placeholder="Enter holiday name"
                            className="w-full h-9 px-3 py-1 rounded-md border border-input bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={holiday.remarks}
                            onChange={(e) => handleChangeHoliday(index, "remarks", e.target.value)}
                            placeholder="Optional remarks"
                            className="w-full h-9 px-3 py-1 rounded-md border border-input bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteHoliday(index)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                            title="Delete Holiday"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Empty State */}
            {holidays.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No holidays configured</h3>
                <p className="text-sm text-muted-foreground mb-4">Get started by adding your first public holiday</p>
                <button
                  onClick={handleAddHoliday}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add First Holiday
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="mt-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6 pb-4">
            <h3 className="text-lg leading-none tracking-tight">Actions</h3>
            <p className="text-sm text-muted-foreground">Save changes or return to previous page</p>
          </div>
          <div className="p-6 pt-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-6 py-3 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow hover:shadow-md flex-1 sm:flex-none"
              >
                <Save className="h-4 w-4" />
                Save Holiday Configuration
              </button>

              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-6 py-3 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 flex-1 sm:flex-none"
              >
                <Home className="h-4 w-4" />
                Return to Dashboard
              </button>
            </div>

            {/* Info Notice */}
            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">Configuration Notice</p>
                <p className="text-xs text-blue-700 mt-1">
                  Holiday settings will be applied system-wide and affect parking tariff calculations on configured dates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}