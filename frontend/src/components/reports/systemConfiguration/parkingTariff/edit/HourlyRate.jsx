import React, { useState, useEffect } from "react";
import axios from "axios";

export default function HourlyRatesCRUD({ rateType = "Hourly" }) {
  const [ratesData, setRatesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    vehicle: "",
    dayOfWeek: "Monday",
    from: "",
    to: "",
    rateType: rateType,
    every: "",
    minFee: 0,
    graceTime: 0,
    firstMinFee: 0,
    min: 0,
    max: 0,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRates();
  }, [rateType]);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tariff/tariff-setup?rateType=${rateType}`
      );
      console.log('data', res.data);
      setRatesData(res.data || {});
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load rates.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        vehicle_type: formData.vehicle,
        day_of_week: formData.dayOfWeek,
        from_time: formData.from,
        to_time: formData.to,
        rate_type: formData.rateType,
        every: formData.every,
        min_fee: formData.minFee,
        grace_time: formData.graceTime,
        first_min_fee: formData.firstMinFee,
        min_charge: formData.min,
        max_charge: formData.max,
      };

      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/tariff/tariff-setup/${editingId}`,
          payload
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/tariff/tariff-setup",
          payload
        );
      }

      setFormData({
        vehicle: "",
        dayOfWeek: "Monday",
        from: "",
        to: "",
        rateType: rateType,
        every: "",
        minFee: 0,
        graceTime: 0,
        firstMinFee: 0,
        min: 0,
        max: 0,
      });
      setEditingId(null);
      fetchRates();
    } catch (err) {
      console.error(err);
      setError("Failed to save rate.");
    }
  };

  const handleEdit = (day, rateIndex) => {
    const rate = ratesData[day][rateIndex];
    setFormData({
      vehicle: rate.vehicle_type,
      dayOfWeek: day,
      from: rate.from,
      to: rate.to,
      rateType: rate.rateType,
      every: rate.every || "",
      minFee: rate.min_fee || 0,
      graceTime: rate.grace_time || 0,
      firstMinFee: rate.first_min_fee || 0,
      min: rate.min_charge || 0,
      max: rate.max_charge || 0,
    });
    setEditingId(rate.id);
  };

  const handleDelete = async (rate) => {
    if (!window.confirm("Are you sure you want to delete this rate?")) return;

    try {
      await axios.delete("http://localhost:5000/api/tariff/tariff-slot", {
        data: {
          vehicleType: rate.vehicleType,
          dayOfWeek: rate.day_of_week,
          fromTime: rate.from,
          toTime: rate.to,
          effectiveStart: ratesData.effectiveStart,
          effectiveEnd: ratesData.effectiveEnd,
        },
      });

      fetchRates();
    } catch (err) {
      console.error(err);
      setError("Failed to delete rate.");
    }
  };

  if (loading) return <p>Loading rates...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const { effectiveStart, effectiveEnd, ...days } = ratesData;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{rateType} Rates CRUD</h1>

      {/* Form Description */}
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">
          {editingId ? "Editing Rate" : "Create New Rate"}
        </h2>
        <p className="text-gray-700 text-sm">
          {editingId
            ? `You are editing the ${formData.vehicle} rate for ${formData.dayOfWeek} from ${formData.from} to ${formData.to}.`
            : "Fill out the fields below to create a new hourly rate. Specify the vehicle type, day, time range, rate, and other optional parameters like grace time and min/max charges."}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 border p-4 rounded bg-gray-50">

      {/* Vehicle Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
        <p className="text-xs text-gray-500 mb-1">The type of vehicle this rate applies to (e.g., Car, Van, Motorcycle).</p>
        <input
          placeholder="Vehicle"
          value={formData.vehicle}
          onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      {/* Day of Week */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Day of Week</label>
        <p className="text-xs text-gray-500 mb-1">The day this rate applies to (e.g., Monday, Tuesday).</p>
        <select
          value={formData.dayOfWeek}
          onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
          className="border px-2 py-1 w-full"
        >
          {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      {/* Start Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Time</label>
        <p className="text-xs text-gray-500 mb-1">The starting time for this rate.</p>
        <input
          type="time"
          value={formData.from}
          onChange={(e) => setFormData({ ...formData, from: e.target.value })}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      {/* End Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700">End Time</label>
        <p className="text-xs text-gray-500 mb-1">The ending time for this rate.</p>
        <input
          type="time"
          value={formData.to}
          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          className="border px-2 py-1 w-full"
          required
        />
      </div>

      {/* Rate Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Rate Type</label>
        <input
          type="text"
          value={formData.rateType}
          onChange={(e) => setFormData({ ...formData, rateType: e.target.value })}
          className="border px-2 py-1 w-full"
        />
      </div>

      {/* Every */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Every (minutes)</label>
        <input
          type="number"
          value={formData.every}
          onChange={(e) => setFormData({ ...formData, every: Number(e.target.value) })}
          className="border px-2 py-1 w-full"
        />
      </div>

      {/* Min Fee */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Min Fee</label>
        <input
          type="number"
          value={formData.minFee}
          onChange={(e) => setFormData({ ...formData, minFee: Number(e.target.value) })}
          className="border px-2 py-1 w-full"
        />
      </div>

      {/* Grace Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Grace Time (minutes)</label>
        <input
          type="number"
          value={formData.graceTime}
          onChange={(e) => setFormData({ ...formData, graceTime: Number(e.target.value) })}
          className="border px-2 py-1 w-full"
        />
      </div>

      {/* First Min Fee */}
      <div>
        <label className="block text-sm font-medium text-gray-700">First Min Fee</label>
        <input
          type="number"
          value={formData.firstMinFee}
          onChange={(e) => setFormData({ ...formData, firstMinFee: Number(e.target.value) })}
          className="border px-2 py-1 w-full"
        />
      </div>

      {/* Min Charge */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Min Charge</label>
        <input
          type="number"
          value={formData.min}
          onChange={(e) => setFormData({ ...formData, min: Number(e.target.value) })}
          className="border px-2 py-1 w-full"
        />
      </div>

      {/* Max Charge */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Max Charge</label>
        <input
          type="number"
          value={formData.max}
          onChange={(e) => setFormData({ ...formData, max: Number(e.target.value) })}
          className="border px-2 py-1 w-full"
        />
      </div>

      {/* Submit Button */}
      <div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Create"}
        </button>
      </div>
    </form>



      {/* Tables */}
      {Object.keys(days).map((day) => (
        <div key={day} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{day}</h2>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Vehicle</th>
                <th className="border px-2 py-1">From</th>
                <th className="border px-2 py-1">To</th>
                <th className="border px-2 py-1">Rate Type</th>
                <th className="border px-2 py-1">Every</th>
                <th className="border px-2 py-1">Min Fee</th>
                <th className="border px-2 py-1">Grace Time</th>
                <th className="border px-2 py-1">First Min Fee</th>
                <th className="border px-2 py-1">Min Charge</th>
                <th className="border px-2 py-1">Max Charge</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(days[day]) && days[day].length > 0 ? (
                days[day].map((rate, index) => (
                  <tr key={rate.id || index}>
                    <td className="border px-2 py-1">{rate.vehicleType}</td>
                    <td className="border px-2 py-1">{rate.from}</td>
                    <td className="border px-2 py-1">{rate.to}</td>
                    <td className="border px-2 py-1">{rate.rateType}</td>
                    <td className="border px-2 py-1">{rate.every}</td>
                    <td className="border px-2 py-1">{rate.minFee}</td>
                    <td className="border px-2 py-1">{rate.graceTime}</td>
                    <td className="border px-2 py-1">{rate.firstMinFee}</td>
                    <td className="border px-2 py-1">{rate.min}</td>
                    <td className="border px-2 py-1">{rate.max}</td>
                    <td className="border px-2 py-1">
                      <button
                        className="text-blue-500 mr-2"
                        onClick={() => handleEdit(day, index)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => handleDelete(rate.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-2">
                    No rates for this day
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
