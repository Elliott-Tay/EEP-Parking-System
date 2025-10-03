import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Calendar, Building, Users, CheckCircle, Hash, Sparkles, Save, AlertCircle, Info } from "lucide-react";
import { toast } from "react-toastify";

function SeasonUpdate() {
  const navigate = useNavigate();
  const [serialNo, setSerialNo] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [company, setCompany] = useState("");
  const [holderType, setHolderType] = useState("");
  const [seasonStatus, setSeasonStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!serialNo) {
      toast.error("Serial No is required to update a record.");
      return;
    }

    setIsLoading(true);

    // Map form state to database column names
    const payload = { serial_no: serialNo };
    if (expireDate) payload.valid_to = expireDate;
    if (company) payload.company = company;
    if (holderType) payload.holder_type = holderType;
    if (seasonStatus) payload.season_status = seasonStatus;

    if (Object.keys(payload).length <= 1) {
      toast.error("Please fill at least one field to update.");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/seasons/update`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            // Send the token as a Bearer token
            "Authorization": token ? `Bearer ${token}` : "",
          }, 
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Update failed");
      }

      toast.success(data.message || "Record updated successfully!");

      // Navigate home after a short delay to allow user to see the toast
      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Update failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getUpdateCount = () => {
    let count = 0;
    if (expireDate) count++;
    if (company) count++;
    if (holderType) count++;
    if (seasonStatus) count++;
    return count;
  };

  const hasUpdates = getUpdateCount() > 0;

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
      
      <div className="relative z-10 p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/25">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Season Update</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Update season holder record information
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form - Left Side */}
              <div className="lg:col-span-2 space-y-6">
                {/* Serial No Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
                  <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-b px-6 py-4 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <Hash className="w-5 h-5 text-red-600" />
                      <h2 className="font-semibold text-gray-900">Record Identifier</h2>
                      <span className="ml-auto px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">Required</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">Enter the serial number of the record to update</p>
                  </div>
                  
                  <div className="p-6">
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
                          placeholder="Enter serial number..."
                          className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 font-mono"
                          required
                          disabled={isLoading}
                        />
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {!serialNo && (
                        <p className="text-xs text-amber-600 flex items-center gap-1 mt-2">
                          <AlertCircle className="w-3 h-3" />
                          Serial number is required to identify the record
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Update Fields Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b px-6 py-4 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <Save className="w-5 h-5 text-blue-600" />
                      <h2 className="font-semibold text-gray-900">Update Information</h2>
                      {hasUpdates && (
                        <span className="ml-auto px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                          {getUpdateCount()} field{getUpdateCount() !== 1 ? 's' : ''} to update
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-blue-700 mt-1">Fill in the fields you want to update (optional)</p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Expire Date */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        Expire Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={expireDate}
                          onChange={(e) => setExpireDate(e.target.value)}
                          className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                          disabled={isLoading}
                        />
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Building className="w-4 h-4 text-gray-400" />
                        Company
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Type or select company name..."
                          list="company-suggestions"
                          className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                          disabled={isLoading}
                        />
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <datalist id="company-suggestions">
                          <option value="Company A" />
                          <option value="Company B" />
                          <option value="Company C" />
                        </datalist>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Start typing to see suggestions
                      </p>
                    </div>

                    {/* Holder Type & Season Status Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Holder Type */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <Users className="w-4 h-4 text-gray-400" />
                          Holder Type
                        </label>
                        <div className="relative">
                          <select
                            value={holderType}
                            onChange={(e) => setHolderType(e.target.value)}
                            className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                            disabled={isLoading}
                          >
                            <option value="">-- Select Holder Type --</option>
                            <option value="VIP">VIP</option>
                            <option value="Tenant">Tenant</option>
                            <option value="Non-Tenant">Non-Tenant</option>
                            <option value="G-Tech">G-Tech</option>
                            <option value="Complimentary">Complimentary</option>
                          </select>
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Season Status */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <CheckCircle className="w-4 h-4 text-gray-400" />
                          Season Status
                        </label>
                        <div className="relative">
                          <select
                            value={seasonStatus}
                            onChange={(e) => setSeasonStatus(e.target.value)}
                            className="w-full p-3 pl-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                            disabled={isLoading}
                          >
                            <option value="">-- Select Status --</option>
                            <option value="Valid">Valid</option>
                            <option value="Invalid">Invalid</option>
                            <option value="Expired">Expired</option>
                            <option value="Terminated">Terminated</option>
                          </select>
                          <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg p-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isLoading || !serialNo}
                      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all duration-200 ${
                        isLoading || !serialNo
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating Record...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Update Record
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <Home className="w-5 h-5" />
                      Return Home
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary Panel - Right Side */}
              <div className="lg:col-span-1 space-y-6">
                {/* Update Summary Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg sticky top-6">
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b px-6 py-4 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Update Summary</h3>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {/* Record Identifier */}
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-xs font-medium text-red-800 mb-1">Record Identifier</p>
                      {serialNo ? (
                        <p className="text-sm font-mono text-red-700 break-all">{serialNo}</p>
                      ) : (
                        <p className="text-sm text-red-600 italic">Not specified</p>
                      )}
                    </div>

                    {/* Fields to Update */}
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Fields to Update:</p>
                      {!hasUpdates ? (
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <p className="text-sm text-amber-700 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            No updates specified
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {expireDate && (
                            <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-xs font-medium text-blue-800 mb-0.5">Expire Date</p>
                              <p className="text-sm text-blue-700">{expireDate}</p>
                            </div>
                          )}
                          {company && (
                            <div className="p-2.5 bg-green-50 rounded-lg border border-green-200">
                              <p className="text-xs font-medium text-green-800 mb-0.5">Company</p>
                              <p className="text-sm text-green-700">{company}</p>
                            </div>
                          )}
                          {holderType && (
                            <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-200">
                              <p className="text-xs font-medium text-purple-800 mb-0.5">Holder Type</p>
                              <p className="text-sm text-purple-700">{holderType}</p>
                            </div>
                          )}
                          {seasonStatus && (
                            <div className="p-2.5 bg-orange-50 rounded-lg border border-orange-200">
                              <p className="text-xs font-medium text-orange-800 mb-0.5">Season Status</p>
                              <p className="text-sm text-orange-700">{seasonStatus}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className={`p-3 rounded-lg border ${
                        serialNo && hasUpdates
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            serialNo && hasUpdates ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                          }`}></div>
                          <p className={`text-xs font-medium ${
                            serialNo && hasUpdates ? 'text-green-800' : 'text-gray-700'
                          }`}>
                            {serialNo && hasUpdates
                              ? `Ready to update ${getUpdateCount()} field${getUpdateCount() !== 1 ? 's' : ''}`
                              : 'Awaiting input'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Help Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Info className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">How to Update</h4>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                          <span>Enter the Serial No to identify the record</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                          <span>Fill in at least one field to update</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                          <span>Click "Update Record" to save changes</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Warning */}
            {serialNo && !hasUpdates && (
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
                <div className="flex items-start gap-3 p-5 bg-yellow-50 border-l-4 border-yellow-400 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-900 mb-1">
                      No Update Fields Specified
                    </p>
                    <p className="text-sm text-yellow-800">
                      You've entered a Serial No but haven't specified any fields to update. Please fill in at least one field (Expire Date, Company, Holder Type, or Season Status) to perform an update.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default SeasonUpdate;