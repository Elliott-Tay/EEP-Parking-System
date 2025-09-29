import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Car, Calendar, Clock, Eye, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function TariffSetupMotorcycleBView() {
  const navigate = useNavigate();
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "PH"];
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/tariff/tariff-setup?vehicleType=MotorcycleB`
        );
        const data = await response.json();
        if (response.ok) {
          setRates(data);
          toast.success("Tariff rates loaded successfully!");
        } else {
          console.error("Error fetching rates:", data);
          toast.error("Error fetching rates: " + (data.error || "Unknown error"));
        }
      } catch (err) {
        console.error("Network error:", err);
        toast.error("Network error while fetching rates");
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  const getDayDisplayName = (day) => {
    const dayNames = {
      "Mon": "Monday", "Tue": "Tuesday", "Wed": "Wednesday", "Thu": "Thursday",
      "Fri": "Friday", "Sat": "Saturday", "Sun": "Sunday", "PH": "Public Holiday"
    };
    return dayNames[day] || day;
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === "-") return "-";
    return `${amount}¢`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border rounded-xl shadow-sm p-6 flex items-center gap-4">
          <Loader2 className="w-6 h-6 animate-spin text-red-600" />
          <div>
            <h2 className="font-semibold text-gray-900">Loading Tariff Rates</h2>
            <p className="text-sm text-gray-600">Fetching Car/Van B configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tariff Setup for Car/Van B</h1>
              <div className="flex items-center gap-2 mt-1">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">Read-Only Mode</span>
              </div>
            </div>
          </div>
        </div>

        {/* Effective Period */}
        <div className="bg-white border rounded-lg shadow-sm mb-6">
          <div className="bg-red-50 border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-600" />
              <h2 className="font-semibold text-gray-900">Effective Period</h2>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Start Date</label>
                <div className="p-2 bg-gray-50 rounded border text-sm">
                  {rates?.effectiveStartDate || "-"}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Start Time</label>
                <div className="p-2 bg-gray-50 rounded border text-sm">
                  {rates?.effectiveStartTime || "-"}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">End Date</label>
                <div className="p-2 bg-gray-50 rounded border text-sm">
                  {rates?.effectiveEndDate || "-"}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">End Time</label>
                <div className="p-2 bg-gray-50 rounded border text-sm">
                  {rates?.effectiveEndTime || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Tariff Tables */}
        <div className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="bg-white border rounded-lg shadow-sm">
              <div className="bg-blue-50 border-b px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">{getDayDisplayName(day)}</h3>
                  </div>
                  <span className="text-xs text-blue-700">
                    {rates?.[day]?.length > 0 ? `${rates[day].length} periods` : "No rates"}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                {rates?.[day]?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">From</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">To</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Rate Type</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Every</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Min Fee</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Grace</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">First Min</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Min</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Max</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {rates[day].map((slot, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2">{slot.from || "-"}</td>
                            <td className="px-3 py-2">{slot.to || "-"}</td>
                            <td className="px-3 py-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {slot.rateType || "-"}
                              </span>
                            </td>
                            <td className="px-3 py-2">{slot.every || "-"}</td>
                            <td className="px-3 py-2">{formatCurrency(slot.minFee)}</td>
                            <td className="px-3 py-2">
                              {slot.graceTime ? `${slot.graceTime}m` : "-"}
                            </td>
                            <td className="px-3 py-2">{formatCurrency(slot.firstMinFee)}</td>
                            <td className="px-3 py-2">{formatCurrency(slot.min)}</td>
                            <td className="px-3 py-2">{formatCurrency(slot.max)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No rates configured for {getDayDisplayName(day)}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
