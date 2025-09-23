import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Shield, 
  User, 
  Mail, 
  Lock, 
  UserCheck, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  EyeOff,
  Users,
  Settings,
  Key
} from "lucide-react";

function AccessControl() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = async () => {
    if (!username || !email || !password) {
      alert("Username, email, and password are required!");
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      // Example API call
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log(data);
        setSuccessMessage("User registered successfully!");
        
        // Clear form
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("");
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error registering user: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = username && email && password;

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
              <h1 className="text-2xl">Access Control</h1>
              <p className="text-muted-foreground">Manage user accounts and system access permissions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>System Administration</span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 rounded-lg border bg-green-50 border-green-200 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Registration Successful</p>
                <p className="text-sm text-green-700 mt-1">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Registration Form */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 border-blue-200">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg leading-none tracking-tight">Create New User Account</h3>
                <p className="text-sm text-muted-foreground">Register a new user with system access credentials</p>
              </div>
            </div>
          </div>

          <div className="p-6 pt-0">
            {/* Form Fields */}
            <div className="space-y-6">
              {/* Username and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Username *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Choose a unique username for the account</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Valid email address for account notifications</p>
                </div>
              </div>

              {/* Password and Role Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-10 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Strong password with 8+ characters recommended</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    User Role
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    >
                      <option value="">Select user role</option>
                      <option value="user">User - Standard Access</option>
                      <option value="admin">Admin - Full Access</option>
                    </select>
                  </div>
                  <p className="text-xs text-muted-foreground">Optional: Assign access level permissions</p>
                </div>
              </div>

              {/* Form Validation Warning */}
              {!isFormValid && (username || email || password) && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Required Fields Missing</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Please fill in all required fields (marked with *) before saving.
                    </p>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-4">
                <button
                  onClick={handleSave}
                  disabled={!isFormValid || isLoading}
                  className={`inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    !isFormValid || isLoading
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 shadow hover:shadow-md'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating User...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create User Account
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Active Users</span>
              </div>
              <p className="text-2xl font-semibold">24</p>
              <p className="text-xs text-muted-foreground">Total registered users</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Admin Accounts</span>
              </div>
              <p className="text-2xl font-semibold">3</p>
              <p className="text-xs text-muted-foreground">Full access administrators</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">System Status</span>
              </div>
              <p className="text-lg font-semibold text-green-600">Operational</p>
              <p className="text-xs text-muted-foreground">Access control active</p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 rounded-lg border bg-blue-50 border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800">Security Notice</p>
              <p className="text-sm text-blue-700 mt-1">
                New user accounts will require administrator approval before gaining system access. 
                All account activities are logged for security monitoring and compliance purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessControl;