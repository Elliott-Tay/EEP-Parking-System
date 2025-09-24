import { useState, useEffect } from "react";
import { Unlock, Settings, DollarSign, Power, ArrowRight, X, User, Lock, Shield, Eye, EyeOff  } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Simple Login Modal
function LoginModal({ onClose, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Username and password are required.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed");
      } else {
        const token = data.token;
        localStorage.setItem("token", token);
        toast.success("Login successful!");
        onLoginSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Login error: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Close only if clicking directly on the backdrop and not inside the modal
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md">
        {/* Modal Card */}
        <div className="rounded-lg border bg-white text-card-foreground shadow-lg animate-in fade-in-0 zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex flex-col space-y-1.5 p-8 pb-6">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-center text-2xl leading-none tracking-tight">Welcome Back</h2>
            <p className="text-center text-sm text-muted-foreground">
              Sign in to access the parking management system
            </p>
          </div>

          {/* Form */}
          <div className="p-8 pt-0 space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
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
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleLogin}
                disabled={isLoading || !username || !password}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors shadow-sm hover:shadow bg-red-500"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2.5 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors bg-blue-500"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-1 w-1 rounded-full bg-green-500"></div>
              <span>Secure connection established</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StationControlModal({ onClose }) {
  const [remarks, setRemarks] = useState("");

  // Generic handler for actions
  const actionMap = {
    "Open Gate": { url: `${process.env.REACT_APP_BACKEND_API_URL}/api/remote-control/gate/open`, method: "POST" },
    "Open and Hold": { url: `${process.env.REACT_APP_BACKEND_API_URL}/api/remote-control/gate/open-hold`, method: "POST" },
    "Close Gate": { url: `${process.env.REACT_APP_BACKEND_API_URL}/api/remote-control/gate/close`, method: "POST" },
    "Restart App": { url: `${process.env.REACT_APP_BACKEND_API_URL}/api/remote-control/system/restart-app`, method: "POST" },
    "Eject Card": { url: `${process.env.REACT_APP_BACKEND_API_URL}/api/remote-control/card/eject`, method: "POST" },
    "Restart UPOS": { url: `${process.env.REACT_APP_BACKEND_API_URL}/api/remote-control/system/restart-upos`, method: "POST" },
  };

  const handleAction = async (action) => {
    if (!remarks.trim()) {
      toast.error("Remarks are required before performing this action.");
      return;
    }

    const config = actionMap[action];
    if (!config) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    // --- Check JWT expiration ---
    let username;
    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      username = payload.username || payload.sub;

      const now = Math.floor(Date.now() / 1000); // current timestamp in seconds
      if (payload.exp && payload.exp < now) {
        // Token expired
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        onClose?.(); // close modal or navigate away
        return; // stop further execution
      }
    } catch (err) {
      console.error("Invalid token:", err);
      toast.error("Invalid session. Please log in again.");
      localStorage.removeItem("token");
      onClose?.();
      return;
    }

    try {
      // Perform the main action
      const res = await fetch(config.url, {
        method: config.method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ remarks }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          toast.error("Session expired or unauthorized. Please log in again.");
          localStorage.removeItem("token");
          onClose?.();
        } else {
          toast.error(data.error || "Action failed");
        }
        return;
      }

      toast.success(`Action performed: ${action}`);
      setRemarks("");
      onClose?.();

      // Log the action
      await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/remote-control/remote-control-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_time: new Date().toISOString(),
          action,
          user: username,
          device: "PMS",
          status: "Successful",
        }),
      });
    } catch (err) {
      console.error(err);
      toast.error("Error performing action: " + err);
    }
  };


  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-3">Station Control</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Here you can control entry and exit gates remotely.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => handleAction("Open Gate")}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Open Gate
        </button>
        <button
          onClick={() => handleAction("Open and Hold")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Open and Hold
        </button>
        <button
          onClick={() => handleAction("Close Gate")}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Close Gate
        </button>
        <button
          onClick={() => handleAction("Restart App")}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Restart App
        </button>
        <button
          onClick={() => handleAction("Eject Card")}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Eject Card
        </button>
        <button
          onClick={() => handleAction("Restart UPOS")}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Restart UPOS
        </button>
      </div>

      {/* Remarks box */}
      <textarea
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        placeholder="Add remarks"
        className="mt-6 w-full border rounded-md px-3 py-2 text-sm"
        rows={3}
      />
    </div>
  );
}


function LotAdjustmentModal({ onClose }) {
  const [zones, setZones] = useState([]);
  const [zone, setZone] = useState("");
  const [type, setType] = useState("hourly");
  const [allocated, setAllocated] = useState("");
  const [occupied, setOccupied] = useState("");

  // Fetch zones from backend
  useEffect(() => {
    const env_backend = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:5000";

    const fetchZones = async () => {
      try {
        const response = await fetch(`${env_backend}/api/remote-control/lot-status`);
        if (!response.ok) throw new Error("Failed to fetch lot data");
        const data = await response.json();

        const zoneList = Object.keys(data).map((z) => ({
          name: z,
          active: data[z].total?.available > 0, // adjust based on backend structure
        }));

        setZones(zoneList);

        // Optionally set the first zone as selected if none chosen
        if (!zone && zoneList.length > 0) {
          setZone(zoneList[0].name);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load zones");
      }
    };

    fetchZones();
  }, []);

  const handleLotUpdate = async () => {
    if (!zone || !type || allocated === "" || occupied === "") {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/remote-control/lot-status/${zone}/${type}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          allocated: Number(allocated),
          occupied: Number(occupied),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update lot");
      } else {
        toast.success(
          `Updated zone ${zone} (${type}) to ${data.allocated} allocated, ${data.occupied} occupied`
        );
        setAllocated("");
        setOccupied("");
        onClose?.();
      }
    } catch (err) {
      toast.error("Error updating lot: " + err.message);
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-3">Lot Adjustment</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
        Adjust the parking allocations and occupied slots for different zones.
      </p>

      <div className="flex flex-col gap-3">
        {/* Dynamic Zone selector */}
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="">Select zone</option>
          {zones.map((z) => (
            <option key={z.name} value={z.name} disabled={!z.active}>
              {z.name} {z.active ? "" : "(full)"}
            </option>
          ))}
        </select>

        {/* Type selector */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="hourly">Hourly</option>
          <option value="season">Season</option>
        </select>

        {/* Allocated input */}
        <input
          type="number"
          placeholder="Enter new allocated slots"
          value={allocated}
          onChange={(e) => setAllocated(e.target.value)}
          className="border rounded-md px-3 py-2"
        />

        {/* Occupied input */}
        <input
          type="number"
          placeholder="Enter new occupied slots"
          value={occupied}
          onChange={(e) => setOccupied(e.target.value)}
          className="border rounded-md px-3 py-2"
        />

        {/* Submit button */}
        <button
          onClick={handleLotUpdate}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Update Lot
        </button>
      </div>
    </div>
  );
}

function ParkingTariffModal() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Parking Tariff</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Set or update parking tariffs for hourly or season passes.
      </p>
      <input
        type="text"
        placeholder="e.g., $2/hr"
        className="mt-2 w-full border rounded-md px-3 py-2 text-sm"
      />
    </div>
  );
}

export default function RemoteFunctions() {
  const [activeModal, setActiveModal] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const remoteActions = [
    {
      id: "station-control",
      label: "Station Control",
      icon: Unlock,
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Control entry/exit gates",
      component: StationControlModal,
    },
    {
      id: "lot-adjustment",
      label: "Lot Adjustment",
      icon: Settings,
      color: "bg-green-500 hover:bg-green-600",
      description: "Modify parking allocations",
      component: LotAdjustmentModal,
    },
    {
      id: "parking-tariff",
      label: "Parking Tariff",
      icon: DollarSign,
      color: "bg-orange-500 hover:bg-orange-600",
      description: "Update pricing structure",
      component: ParkingTariffModal,
    },
  ];

  // Determine which modal to render
  const ActiveModalComponent = remoteActions.find((a) => a.id === activeModal)?.component;

  const handleOpenModal = (modalId) => {
    if (!isLoggedIn) {
      setActiveModal("login");
    } else {
      setActiveModal(modalId);
    }
  };

  return (
    <div className="lg:col-span-1 rounded-lg border bg-card text-card-foreground shadow-sm max-w-sm">
      {/* Header */}
      <div className="flex flex-col space-y-2 p-4">
        <div className="flex items-center gap-2">
          <Power className="h-5 w-5 text-primary" />
          <h3 className="text-xl leading-none tracking-tight">Remote Functions</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          System control and management tools
        </p>
      </div>

      {/* Action buttons */}
      <div className="p-4 pt-0">
        <div className="grid gap-3 auto-rows-fr">
          {remoteActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleOpenModal(action.id)}
                className={`flex items-center gap-3 px-4 py-3 w-full text-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${action.color} group`}
              >
                <IconComponent className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
                <ArrowRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-20 rounded-xl w-200 shadow-2xl border border-gray-200 dark:border-gray-700 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              onClick={() => setActiveModal(null)}
            >
              <X className="h-10 w-10" />
            </button>

            {activeModal === "login" ? (
              <LoginModal
                onClose={() => setActiveModal(null)}
                onLoginSuccess={() => setIsLoggedIn(true)}
              />
            ) : (
              ActiveModalComponent && <ActiveModalComponent onClose={() => setActiveModal(null)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}