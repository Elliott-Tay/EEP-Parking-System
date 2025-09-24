import React, { useState } from "react";
import {
  RefreshCw,
  ArrowRightLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChangeSeasonIU() {
  const [oldSeasonNo, setOldSeasonNo] = useState("");
  const [newSeasonNo, setNewSeasonNo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeSeason = async () => {
    if (!oldSeasonNo || !newSeasonNo) {
      toast.error("Please fill in Old Season No and New Season No.");
      return;
    }

    if (oldSeasonNo === newSeasonNo) {
      toast.error("Old Season No and New Season No cannot be the same.");
      return;
    }

    const payload = { oldSeasonNo, newSeasonNo };

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/seasons/change-season`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change season IU");
      }

      toast.success(data.message || "Season IU changed successfully!");
      setOldSeasonNo("");
      setNewSeasonNo("");
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading && oldSeasonNo && newSeasonNo) {
      handleChangeSeason();
    }
  };

  const isFormValid =
    oldSeasonNo && newSeasonNo && oldSeasonNo !== newSeasonNo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-red-100/20"></div>
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(239, 68, 68, 0.15) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="w-full max-w-2xl text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25">
            <RefreshCw className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            Change Season (IU) No
          </h1>
          <p className="text-gray-600 text-lg">
            Update existing season identification numbers in the system
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-2xl">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-gray-900/10 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
              <div className="flex items-center gap-3">
                <ArrowRightLeft className="w-6 h-6 text-white" />
                <h2 className="text-xl font-semibold text-white">
                  Season Number Update
                </h2>
              </div>
              <p className="text-red-100 mt-2">
                Modify season identification numbers for existing records
              </p>
            </div>

            {/* Form Content */}
            <div className="p-8 space-y-8">
              {/* Form Fields */}
              <div className="space-y-6">
                {/* Old Season No */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Current Season No
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={oldSeasonNo}
                      onChange={(e) => setOldSeasonNo(e.target.value.trim())}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter current season number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50"
                      disabled={loading}
                    />
                    {oldSeasonNo && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow Indicator */}
                <div className="flex items-center justify-center py-2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100">
                    <ArrowRightLeft className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      Update to
                    </span>
                  </div>
                </div>

                {/* New Season No */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    New Season No
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newSeasonNo}
                      onChange={(e) => setNewSeasonNo(e.target.value.trim())}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter new season number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:bg-gray-50"
                      disabled={loading}
                    />
                    {newSeasonNo && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Validation Message */}
              {oldSeasonNo && newSeasonNo && oldSeasonNo === newSeasonNo && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Invalid Input
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Old Season No and New Season No must be different.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleChangeSeason}
                  disabled={!isFormValid || loading}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    !isFormValid || loading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transform hover:-translate-y-0.5"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Update...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      Update Season Number
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setOldSeasonNo("");
                    setNewSeasonNo("");
                  }}
                  disabled={loading}
                  className="flex-1 sm:flex-none sm:px-6 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Fields
                </button>
              </div>

              {/* Info Note */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Important Note
                  </p>
                  <p className="text-sm text-blue-700">
                    This operation will update the season identification number
                    across all related records. Please ensure the new season
                    number is unique and follows your organization's numbering
                    convention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full max-w-2xl mt-8 text-center">
          <p className="text-sm text-gray-500">
            Changes will be applied immediately and cannot be undone
          </p>
        </div>
      </div>

      {/* Toastify container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default ChangeSeasonIU;
