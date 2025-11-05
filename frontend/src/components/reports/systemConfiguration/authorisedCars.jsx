import React, { useEffect, useState } from "react";
import axios from "axios";
import { Car, User, Calendar, FileText, Edit2, Trash2, Plus, Save, X, Loader2, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { toast } from "react-toastify";

export default function AuthorizedCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    id: null,
    plateNumber: "",
    ownerName: "",
    vehicleType: "Car",
    authorizationType: "Full",
    validFrom: "",
    validTo: "",
    notes: "",
  });

  // Fetch all cars
  const fetchCars = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/authorized-cars/authorized-cars`);
      setCars(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch cars");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        // Update
        await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/api/authorized-cars/authorized-cars/${form.id}`, form);
        toast.success("Vehicle updated successfully");
      } else {
        // Create
        await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/api/authorized-cars/authorized-cars`, form);
        toast.success("Vehicle added successfully");
      }
      setForm({
        id: null,
        plateNumber: "",
        ownerName: "",
        vehicleType: "Car",
        authorizationType: "Full",
        validFrom: "",
        validTo: "",
        notes: "",
      });
      fetchCars();
    } catch (err) {
      toast.error("Error saving car: " + err.message);
    }
  };

  // Handle edit
  const handleEdit = (car) => {
    setForm({
      id: car.id,
      plateNumber: car.plateNumber,
      ownerName: car.ownerName,
      vehicleType: car.vehicleType,
      authorizationType: car.authorizationType,
      validFrom: car.validFrom?.split("T")[0] || "",
      validTo: car.validTo?.split("T")[0] || "",
      notes: car.notes || "",
    });
    toast.info("Editing vehicle: " + car.plateNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/api/authorized-cars/authorized-cars/${id}`);
      toast.success("Vehicle deleted successfully");
      fetchCars();
    } catch (err) {
      toast.error("Error deleting car: " + err.message);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      plateNumber: "",
      ownerName: "",
      vehicleType: "Car",
      authorizationType: "Full",
      validFrom: "",
      validTo: "",
      notes: "",
    });
    toast.info("Form cleared");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-100 p-4 md:p-6 lg:p-8">
        <div className="backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-xl shadow-gray-900/5 p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
            <p className="text-gray-600">Loading authorized vehicles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-100 p-4 md:p-6 lg:p-8">
        <div className="backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-xl shadow-gray-900/5 p-12">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg text-gray-900 mb-1">Error Loading Data</h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl tracking-tight text-gray-900">Authorized Vehicles</h1>
            <p className="text-sm text-gray-600 mt-1">Manage authorized vehicle access and permissions</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mb-8 backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-xl shadow-gray-900/5 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-red-50/30 px-6 py-4 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {form.id ? (
                <>
                  <Edit2 className="h-5 w-5 text-red-500" />
                  <h2 className="text-lg text-gray-900">Edit Vehicle</h2>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-red-500" />
                  <h2 className="text-lg text-gray-900">Add New Vehicle</h2>
                </>
              )}
            </div>
            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 
                         hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plate Number */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <Car className="h-4 w-4 text-red-500" />
                <span>Plate Number</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="plateNumber"
                value={form.plateNumber}
                onChange={handleChange}
                required
                placeholder="Enter plate number"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm 
                         focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 
                         transition-all duration-200 placeholder:text-gray-400"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <User className="h-4 w-4 text-red-500" />
                <span>Owner Name</span>
              </label>
              <input
                type="text"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                placeholder="Enter owner name"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm 
                         focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 
                         transition-all duration-200 placeholder:text-gray-400"
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <Car className="h-4 w-4 text-red-500" />
                <span>Vehicle Type</span>
              </label>
              <select
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm 
                         focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 
                         transition-all duration-200"
              >
                <option value="Car">Car</option>
                <option value="HGV">HGV</option>
                <option value="MC">MC</option>
              </select>
            </div>

            {/* Authorization Type */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <Shield className="h-4 w-4 text-red-500" />
                <span>Authorization Type</span>
              </label>
              <select
                name="authorizationType"
                value={form.authorizationType}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm 
                         focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 
                         transition-all duration-200"
              >
                <option value="Full">Full</option>
                <option value="Limited">Limited</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>

            {/* Valid From */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <Calendar className="h-4 w-4 text-red-500" />
                <span>Valid From</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="validFrom"
                value={form.validFrom}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm 
                         focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 
                         transition-all duration-200"
              />
            </div>

            {/* Valid To */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <Calendar className="h-4 w-4 text-red-500" />
                <span>Valid To</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="validTo"
                value={form.validTo}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm 
                         focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 
                         transition-all duration-200"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <FileText className="h-4 w-4 text-red-500" />
                <span>Notes</span>
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Enter any additional notes..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm 
                         focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 
                         transition-all duration-200 placeholder:text-gray-400 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 h-12 bg-gradient-to-r from-red-500 to-red-600 
                       text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 
                       shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 flex-1 sm:flex-none"
            >
              {form.id ? (
                <>
                  <Save className="h-5 w-5" />
                  <span>Update Vehicle</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span>Add Vehicle</span>
                </>
              )}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 h-12 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 
                         transition-all duration-200"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Vehicles"
          value={cars.length}
          icon={Car}
          color="blue"
        />
        <StatCard
          label="Full Access"
          value={cars.filter(c => c.authorizationType === "Full").length}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          label="Limited Access"
          value={cars.filter(c => c.authorizationType === "Limited").length}
          icon={Shield}
          color="yellow"
        />
        <StatCard
          label="Temporary Access"
          value={cars.filter(c => c.authorizationType === "Temporary").length}
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Table */}
      {cars.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-xl shadow-gray-900/5 p-12">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Car className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg text-gray-900 mb-1">No Vehicles Found</h3>
              <p className="text-sm text-gray-600">Add your first authorized vehicle using the form above</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-xl shadow-gray-900/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-red-50/30">
                    {["ID", "Plate Number", "Owner Name", "Vehicle Type", "Authorization Type", "Valid From", "Valid To", "Notes", "Actions"].map(
                      (th) => (
                        <th key={th} className="px-6 py-4 text-left text-xs tracking-wider text-gray-700 uppercase whitespace-nowrap">
                          {th}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cars.map((car) => (
                    <tr key={car.id} className="hover:bg-red-50/30 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{car.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-red-500" />
                          <span>{car.plateNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{car.ownerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                          {car.vehicleType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          car.authorizationType === "Full" ? "bg-green-100 text-green-700" :
                          car.authorizationType === "Limited" ? "bg-yellow-100 text-yellow-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>
                          {car.authorizationType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{car.validFrom?.split("T")[0]}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{car.validTo?.split("T")[0]}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{car.notes || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(car)}
                            className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 
                                     text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 
                                     shadow-md shadow-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/40"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(car.id)}
                            className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 
                                     text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 
                                     shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/40"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {cars.map((car) => (
              <div
                key={car.id}
                className="backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-lg shadow-gray-900/5 p-6 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                      <Car className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Plate Number</p>
                      <p className="text-gray-900">{car.plateNumber}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">ID: {car.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Owner Name</p>
                    <p className="text-sm text-gray-900">{car.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Vehicle Type</p>
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                      {car.vehicleType}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Authorization</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                      car.authorizationType === "Full" ? "bg-green-100 text-green-700" :
                      car.authorizationType === "Limited" ? "bg-yellow-100 text-yellow-700" :
                      "bg-purple-100 text-purple-700"
                    }`}>
                      {car.authorizationType}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Valid From</p>
                    <p className="text-sm text-gray-900">{car.validFrom?.split("T")[0]}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Valid To</p>
                    <p className="text-sm text-gray-900">{car.validTo?.split("T")[0]}</p>
                  </div>
                  {car.notes && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Notes</p>
                      <p className="text-sm text-gray-600">{car.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(car)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 
                             text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 
                             shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 
                             text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 
                             shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Results Count */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {cars.length} authorized vehicle{cars.length !== 1 ? 's' : ''}
          </div>
        </>
      )}
    </div>
  );
}

// StatCard Component
function StatCard({ label, value, icon: Icon, color }) {
  const colorStyles = {
    blue: {
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/30"
    },
    green: {
      bg: "bg-gradient-to-br from-green-500 to-green-600",
      shadow: "shadow-green-500/30"
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/30"
    },
    yellow: {
      bg: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      shadow: "shadow-yellow-500/30"
    },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className="backdrop-blur-xl bg-white/80 border border-gray-200/50 rounded-2xl shadow-lg shadow-gray-900/5 p-6 hover:shadow-xl transition-all duration-200 group">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${style.bg} ${style.shadow} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">
            {label}
          </p>
          <p className="text-2xl text-gray-900 truncate">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
