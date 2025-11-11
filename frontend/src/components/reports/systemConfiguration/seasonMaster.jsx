import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Users, 
  Hash, 
  Ticket, 
  Car, 
  User, 
  Building, 
  MapPin, 
  Calendar, 
  Phone, 
  Badge,
  Save,
  RotateCcw,
  CheckCircle,
  Loader2,
  Clock,
  UserCheck,
  FileText
} from "lucide-react";

function SeasonHolderMaster() {
  const navigate = useNavigate();
  const [serialNo, setSerialNo] = useState("");
  const [seasonNo, setSeasonNo] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [rateType, setRateType] = useState("");
  const [seasonType, setSeasonType] = useState("Master");
  const [holderType, setHolderType] = useState("VIP");
  const [holderName, setHolderName] = useState("");
  const [company, setCompany] = useState("");
  const [seasonStatus, setSeasonStatus] = useState("Valid");
  const [address, setAddress] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [employeeNo, setEmployeeNo] = useState("");
  const [telephone, setTelephone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");

    const payload = {
      serial_no: serialNo,
      season_no: seasonNo,
      vehicle_no: vehicleNo,
      rate_type: rateType,
      season_type: seasonType,
      holder_type: holderType,
      holder_name: holderName,
      company,
      season_status: seasonStatus,
      address,
      valid_from: validFrom,
      valid_to: validTo,
      employee_no: employeeNo,
      telephone,
    };

    try {
      console.log('payload', payload);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/seasons/season-holder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setSuccessMessage(data.message || "Season holder saved successfully!");
      
      // Optional: Reset form after successful save
      // handleReset();
    } catch (err) {
      console.error(err);
      alert("Failed to save season holder.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSerialNo("");
    setSeasonNo("");
    setVehicleNo("");
    setRateType("");
    setSeasonType("Master");
    setHolderType("VIP");
    setHolderName("");
    setCompany("");
    setSeasonStatus("Valid");
    setAddress("");
    setValidFrom("");
    setValidTo("");
    setEmployeeNo("");
    setTelephone("");
    setSuccessMessage("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Valid': return 'text-green-700 bg-green-100 border-green-200';
      case 'Invalid': return 'text-red-700 bg-red-100 border-red-200';
      case 'Expired': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'Terminated': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getHolderTypeColor = (type) => {
    switch (type) {
      case 'VIP': return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'Tenant': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'Day': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'Night': return 'text-indigo-700 bg-indigo-100 border-indigo-200';
      case 'G-Tech': return 'text-red-700 bg-red-100 border-red-200';
      case 'Complimentary': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
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
              <Users className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl">Season Holder Master</h1>
              <p className="text-muted-foreground">Create and manage season parking holder information</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Database Connection Active</span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 rounded-lg border bg-green-50 border-green-200 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Season Holder Saved Successfully</p>
                <p className="text-sm text-green-700 mt-1">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg leading-none tracking-tight">Basic Information</h3>
                  <p className="text-sm text-muted-foreground">Enter the fundamental details for the season holder</p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Serial No */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Serial No
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter serial number"
                      value={serialNo}
                      onChange={(e) => setSerialNo(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                  </div>
                </div>

                {/* Season No */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Season No
                  </label>
                  <div className="relative">
                    <Ticket className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter season number"
                      value={seasonNo}
                      onChange={(e) => setSeasonNo(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                  </div>
                </div>

                {/* Vehicle No */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Vehicle No
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter vehicle number"
                      value={vehicleNo}
                      onChange={(e) => setVehicleNo(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                  </div>
                </div>


                {/* Rate Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Rate Type
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <select
                      value={rateType}
                      onChange={(e) => setRateType(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    >
                      <option value="">Select Rate Type</option>
                      <option value="Season">Season</option>
                      <option value="Day Season">Day Season</option>
                      <option value="Night Season">Night Season</option>
                      <option value="CSPT">CSPT</option>
                      <option value="Special Parking">Special Parking</option>
                      <option value="Block1">Block1</option>
                      <option value="Block2">Block2</option>
                      <option value="Block3">Block3</option>
                      <option value="Authorized">Authorized</option>
                      <option value="Staff Estate(Type A)">Staff Estate(Type A)</option>
                      <option value="Staff Estate(Type B)">Staff Estate(Type B)</option>
                      <option value="URA Staff">URA Staff</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Type Configuration Section */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 border border-purple-200">
                  <Badge className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg leading-none tracking-tight">Type Configuration</h3>
                  <p className="text-sm text-muted-foreground">Configure season type, holder type, and status</p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Season Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Season Type
                  </label>
                  <select
                    value={seasonType}
                    onChange={(e) => setSeasonType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                  >
                    <option value="Master">Master</option>
                    <option value="IU">IU</option>
                    <option value="Cashcard">Cashcard</option>
                  </select>
                </div>

                {/* Holder Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Holder Type
                  </label>
                  <div className="relative">
                    <select
                      value={holderType}
                      onChange={(e) => setHolderType(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    >
                      <option value="VIP">VIP</option>
                      <option value="Day">Day</option>
                      <option value="Night">Night</option>
                      <option value="Tenant">Tenant</option>
                      <option value="Non-Tenant">Non-Tenant</option>
                      <option value="G-Tech">G-Tech</option>
                      <option value="Complimentary">Complimentary</option>
                    </select>
                    <div className="absolute right-12 top-1/2 -translate-y-1/2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${getHolderTypeColor(holderType)}`}>
                        {holderType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Season Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Season Status
                  </label>
                  <div className="relative">
                    <select
                      value={seasonStatus}
                      onChange={(e) => setSeasonStatus(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    >
                      <option value="Invalid">Invalid</option>
                      <option value="Valid">Valid</option>
                      <option value="Expired">Expired</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                    <div className="absolute right-12 top-1/2 -translate-y-1/2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${getStatusColor(seasonStatus)}`}>
                        {seasonStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 border border-green-200">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg leading-none tracking-tight">Personal Information</h3>
                  <p className="text-sm text-muted-foreground">Enter holder's personal and contact details</p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Holder Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Holder Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={holderName}
                      onChange={(e) => setHolderName(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Company
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <textarea
                      placeholder="Enter full address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="flex w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Employee No */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Employee No
                  </label>
                  <div className="relative">
                    <Badge className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter employee number"
                      value={employeeNo}
                      onChange={(e) => setEmployeeNo(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                  </div>
                </div>

                {/* Telephone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Telephone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Validity Period Section */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 border border-orange-200">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg leading-none tracking-tight">Validity Period</h3>
                  <p className="text-sm text-muted-foreground">Set the active period for this season holder</p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Valid From */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Valid From
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="date"
                      value={validFrom}
                      onChange={(e) => setValidFrom(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                  </div>
                </div>

                {/* Valid To */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Valid To
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="date"
                      value={validTo}
                      onChange={(e) => setValidTo(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Validity Period Summary */}
              {validFrom && validTo && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Validity Period: {Math.ceil((new Date(validTo) - new Date(validFrom)) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                isLoading
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow hover:shadow-md'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Season Holder...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Season Holder
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-200"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SeasonHolderMaster;