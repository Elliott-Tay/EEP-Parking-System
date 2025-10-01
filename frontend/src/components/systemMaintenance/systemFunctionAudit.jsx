import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Calendar, 
  Shield, 
  Users, 
  Clock, 
  FileText, 
  AlertCircle, 
  Loader2,
  Eye,
  Home,
  Activity,
  CheckCircle,
  User,
  Mail,
  Filter,
  Download
} from "lucide-react";

function SystemFunctionAudit() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [auditData, setAuditData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      alert("Please select a report period.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/auth/users?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setAuditData(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch audit data.");
      setAuditData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setAuditData([]);
    setHasSearched(false);
  };

  const handleDownloadCSV = () => {
    if (auditData.length === 0) return;

    const headers = ["Username", "Email", "Last Login"];
    const csvRows = auditData.map(user => [
      user.username || "-",
      user.email || "-",
      user.last_login || "-"
    ]);

    const csvContent = [headers, ...csvRows]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `system_function_audit_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isFormValid = startDate && endDate;

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
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl">System Function Audit</h1>
              <p className="text-muted-foreground">Monitor and audit system user activity and access logs</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Audit System Active</span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Search Form */}
        <div className="mb-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg leading-none tracking-tight">Audit Search Parameters</h3>
                <p className="text-sm text-muted-foreground">Configure date range to generate audit reports</p>
              </div>
            </div>
          </div>

          <div className="p-6 pt-0">
            <div className="space-y-6">
              {/* Date Range Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Report Period</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Start Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="flex h-11 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <span className="text-sm text-muted-foreground font-medium">to</span>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">End Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="flex h-11 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSearch}
                      disabled={!isFormValid || isLoading}
                      className={`flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                        !isFormValid || isLoading
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow hover:shadow-md'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
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

              {/* Additional Action Buttons */}
              <div className="flex justify-center gap-3 pt-4 border-t">
                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-200"
                >
                  <Filter className="h-4 w-4" />
                  Reset
                </button>

                {auditData.length > 0 && (
                  <button
                    onClick={handleDownloadCSV}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-green-600 text-white hover:bg-green-700 px-6 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-200 shadow hover:shadow-md"
                  >
                    <Download className="h-4 w-4" />
                    Download CSV
                  </button>
                )}

                <button
                  onClick={() => navigate("/")}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-200"
                >
                  <Home className="h-4 w-4" />
                  Home
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Summary */}
        {hasSearched && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Search Period</span>
                </div>
                <p className="text-sm font-mono">{startDate || 'Not set'} to {endDate || 'Not set'}</p>
                <p className="text-xs text-muted-foreground">Date range queried</p>
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Records Found</span>
                </div>
                <p className="text-2xl font-semibold">{auditData.length}</p>
                <p className="text-xs text-muted-foreground">User activity records</p>
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Last Search</span>
                </div>
                <p className="text-sm">{new Date().toLocaleTimeString()}</p>
                <p className="text-xs text-muted-foreground">Query executed</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {hasSearched && (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 border border-green-200">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg leading-none tracking-tight">Audit Results</h3>
                  <p className="text-sm text-muted-foreground">
                    {auditData.length === 0 ? 'No records found for the selected period' : `Found ${auditData.length} user activity records`}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              {auditData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-gray-100">
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">No Record Found!</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        No user activity was recorded during the selected period.
                      </p>
                    </div>
                    <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200 max-w-md">
                      <div className="flex items-start gap-2">
                        <Activity className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Search Tips</p>
                          <ul className="text-xs text-blue-700 mt-1 space-y-1">
                            <li>• Try expanding your date range</li>
                            <li>• Check if the dates are correct</li>
                            <li>• Ensure user activity occurred during this period</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Username
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Email
                            </div>
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Last Login
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-background divide-y divide-border">
                        {auditData.map((user, idx) => (
                          <tr 
                            key={idx} 
                            className="hover:bg-muted/30 transition-colors duration-150"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-blue-100 border border-blue-200">
                                  <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">
                                    {user.username || "-"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    User Account
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-foreground">
                                  {user.email || "-"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                    <p className="text-sm font-medium text-foreground">
                                        {user.last_login
                                        ? new Date(user.last_login).toLocaleString("en-GB", {
                                            weekday: "short", // e.g., Mon, Tue
                                            day: "2-digit",
                                            month: "short",   // e.g., Sep
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            })
                                        : "-"}
                                    </p>
                                    {user.last_login && (
                                        <p className="text-xs text-muted-foreground">Last activity</p>
                                    )}
                                    </div>
                                </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 rounded-lg border bg-blue-50 border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800">Security & Privacy Notice</p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• User activity data is logged for security and compliance purposes</li>
                <li>• All audit queries are logged and monitored</li>
                <li>• Access to audit data is restricted to authorized personnel only</li>
                <li>• Data is retained according to company security policies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemFunctionAudit;