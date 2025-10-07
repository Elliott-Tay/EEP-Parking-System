import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Info,
  Loader2,
  Building2,
  MapPin,
  Calendar,
  Phone,
  Hash,
  Shield,
  Plus,
  Trash2,
  CheckCircle2,
  Users,
  Clock,
  FileText
} from "lucide-react";
import { toast } from "react-toastify";

function MultipleSeasonRegister() {
  const [serialNo, setSerialNo] = useState("");
  const [company, setCompany] = useState("");
  const [seasonStatus, setSeasonStatus] = useState("Valid");
  const [address, setAddress] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [telephone, setTelephone] = useState("");
  const [numIU, setNumIU] = useState(0);
  const [zoneAllowed, setZoneAllowed] = useState("All");
  const [numSeasonPurchased, setNumSeasonPurchased] = useState(0);

  const [iuList, setIUList] = useState([]);
  const [iuInput, setIUInput] = useState("");
  const [iuType, setIUType] = useState("Season"); // Season or Hourly
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAddIU = () => {
    if (!iuInput) {
      toast.error("Please enter an IU number");
      return;
    }
    setIUList([
      ...iuList,
      { id: Date.now(), iuNo: iuInput, type: iuType }
    ]);
    setIUInput("");
    toast.success(`IU ${iuInput} added as ${iuType}`);
  };

  const handleDeleteIU = (id) => {
    setIUList(iuList.filter(iu => iu.id !== id));
    toast.success("IU removed from list");
  };

  const countInSeason = iuList.filter(iu => iu.type === "Season").length;
  const countInHourly = iuList.filter(iu => iu.type === "Hourly").length;

  const handleRegister = async () => {
    const data = {
      serialNo,
      company,
      seasonStatus,
      address,
      validFrom,
      validTo,
      telephone,
      numIU,
      zoneAllowed,
      numSeasonPurchased,
      iuList,
    };

    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/tariff/multiple-season`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to register");
      }

      const result = await response.json();
      toast.success(`Registration successful! Serial No: ${result.serialNo}`);

      //Reset the form
      setSerialNo("");
      setCompany("");
      setSeasonStatus("Valid");
      setAddress("");
      setValidFrom("");
      setValidTo("");
      setTelephone("");
      setNumIU(0);
      setZoneAllowed("All");
      setNumSeasonPurchased(0);
      setIUList([]);
      setIUInput("");
      setIUType("Season");

      // Route back to dashboard if successful registration
      alert("Registration successful");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Registration unsuccessful");
      toast.error("Error registering season: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Valid': return 'bg-green-100 text-green-700 border-green-200';
      case 'Invalid': return 'bg-red-100 text-red-700 border-red-200';
      case 'Expired': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Terminated': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-red-100/20"></div>
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(239, 68, 68, 0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}
      ></div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/25">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Multiple Season Register</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Register multiple season holders with IU assignments
                </p>
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-900">Season Holder Information</h2>
                </div>
              </div>
              <p className="text-sm text-blue-700 mt-1">Enter season holder details and IU assignments</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Serial No / Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Hash className="w-4 h-4 text-gray-400" />
                    Serial No
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={serialNo}
                      onChange={(e) => setSerialNo(e.target.value)}
                      disabled={loading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter serial number"
                    />
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    Company Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      disabled={loading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter company name"
                    />
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Season Status / Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Shield className="w-4 h-4 text-gray-400" />
                    Season Status
                  </label>
                  <div className="relative">
                    <select
                      value={seasonStatus}
                      onChange={(e) => setSeasonStatus(e.target.value)}
                      disabled={loading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                    >
                      <option>Invalid</option>
                      <option>Valid</option>
                      <option>Expired</option>
                      <option>Terminated</option>
                    </select>
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${getStatusColor(seasonStatus)}`}>
                        {seasonStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={loading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter address"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Valid From / Valid To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Valid From
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={validFrom}
                      onChange={(e) => setValidFrom(e.target.value)}
                      disabled={loading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Valid To
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={validTo}
                      onChange={(e) => setValidTo(e.target.value)}
                      disabled={loading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Telephone / No of IU / Zone / No of Season Purchased */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Telephone
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      disabled={loading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Phone"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Hash className="w-4 h-4 text-gray-400" />
                    No of IU to Register
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={numIU}
                      onChange={(e) => setNumIU(e.target.value)}
                      disabled={loading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="0"
                    />
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Zone Allowed
                  </label>
                  <div className="relative">
                    <select
                      value={zoneAllowed}
                      onChange={(e) => setZoneAllowed(e.target.value)}
                      disabled={loading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option>All</option>
                      <option>Main</option>
                      <option>Zone 1</option>
                      <option>Zone 2</option>
                    </select>
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Hash className="w-4 h-4 text-gray-400" />
                    No of Season Purchased
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={numSeasonPurchased}
                      onChange={(e) => setNumSeasonPurchased(e.target.value)}
                      disabled={loading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="0"
                    />
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* IU Registration Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg mb-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100/50 border-b px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-600" />
                  <h2 className="font-semibold text-gray-900">IU Assignment</h2>
                </div>
              </div>
              <p className="text-sm text-green-700 mt-1">Add and manage IU numbers for this season holder</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Add IU Section */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Plus className="w-4 h-4 text-gray-400" />
                  Add IU
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="IU Number"
                      value={iuInput}
                      onChange={(e) => setIUInput(e.target.value)}
                      disabled={loading}
                      className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                  <select
                    value={iuType}
                    onChange={(e) => setIUType(e.target.value)}
                    disabled={loading}
                    className="p-3 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed sm:w-40"
                  >
                    <option value="Season">Season</option>
                    <option value="Hourly">Hourly</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddIU}
                    disabled={loading || !iuInput}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    Add IU
                  </button>
                </div>
              </div>

              {/* IU Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                      <Hash className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-700">Total IU Registered</p>
                      <p className="text-2xl font-bold text-blue-900">{iuList.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-green-700">Season Type</p>
                      <p className="text-2xl font-bold text-green-900">{countInSeason}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-purple-700">Hourly Type</p>
                      <p className="text-2xl font-bold text-purple-900">{countInHourly}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* IU Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                        IU No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {iuList.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-8 text-gray-500">
                          <div className="flex flex-col items-center gap-2">
                            <Info className="w-8 h-8 text-gray-400" />
                            <p>No IU registered yet</p>
                            <p className="text-xs text-gray-400">Add IU numbers using the form above</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      iuList.map((iu) => (
                        <tr key={iu.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                          <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">{iu.iuNo}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              iu.type === 'Season' 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-purple-100 text-purple-700 border border-purple-200'
                            }`}>
                              {iu.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => handleDeleteIU(iu.id)}
                              disabled={loading}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
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
          </div>

          {/* Action Buttons */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleRegister}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-green-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Register
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/")}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
            </div>
          </div>

          {/* Help Card */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Multiple Season Registration Information</h4>
                <ul className="space-y-1.5 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Enter season holder details including company name, address, and contact information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Set the validity period for the season pass using the date pickers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Add multiple IU numbers and specify whether each is a Season or Hourly type</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Review the IU statistics to ensure all required IUs are added before registration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                    <span>Click "Register" to submit the season holder information to the system</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultipleSeasonRegister;