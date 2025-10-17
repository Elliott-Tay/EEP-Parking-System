import { useState, useEffect } from "react";
import { Unlock, Settings, DollarSign, Power, ArrowRight, X, User, Lock, Shield, Eye, EyeOff  } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

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
  const [selectedStationId, setSelectedStationId] = useState("");
  const [stations, setStations] = useState({ entrances: [], exits: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const backend = process.env.REACT_APP_BACKEND_API_URL;

  // --- SSE subscriptions ---
  useEffect(() => {
    const entrySource = new EventSource(`${backend}/api/movements/stream/entries`);
    const exitSource = new EventSource(`${backend}/api/movements/stream/exits`);

    const updateStation = (type, data) => {
      setStations((prev) => {
        const key = data.Station || data.id;
        if (!key) return prev;

        const updated = [...prev[type]];
        const index = updated.findIndex((item) => (item.id || item.station_name) === key);

        const normalized = {
          id: key,
          station_name: data.Station || data.station_name || key, // ✅ ensure station_name exists
          status: (data.Status || "ok").toLowerCase(),
          lastUpdate: new Date(),
        };

        if (index >= 0) updated[index] = { ...updated[index], ...normalized };
        else updated.unshift(normalized);

        // Ensure uniqueness by station_name
        const uniqueUpdated = Array.from(
          new Map(updated.map((s) => [s.station_name, s])).values()
        );

        return { ...prev, [type]: uniqueUpdated };
      });
    };

    entrySource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        updateStation("entrances", data);
      } catch (err) {
        console.error("Entry SSE parse error:", err);
      }
    };

    exitSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        updateStation("exits", data);
      } catch (err) {
        console.error("Exit SSE parse error:", err);
      }
    };

    entrySource.onerror = () => entrySource.close();
    exitSource.onerror = () => exitSource.close();

    setLoading(false);
    return () => {
      entrySource.close();
      exitSource.close();
    };
  }, [backend]);
  // Load stations from backend and/or localStorage
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${backend}/api/remote-control/stations`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch stations");

        const data = await res.json();
        console.log("Fetched stations:", data);

        // Load previous stations from localStorage
        const prevEntrances = JSON.parse(localStorage.getItem("entrances") || "[]");
        const prevExits = JSON.parse(localStorage.getItem("exits") || "[]");

        // Helper: merge previous and incoming stations, keeping station_name unique
        const mergeUniqueStations = (prev, incoming) =>
          Array.from(
            new Map(
              [...prev, ...incoming].map((station) => [
                station.station_name, // use station_name as unique key
                {
                  ...station,
                  lastUpdate: station.last_update
                    ? new Date(station.last_update)
                    : new Date(),
                },
              ])
            ).values()
          );

        // Filter by type
        const entrances = mergeUniqueStations(
          prevEntrances,
          data.filter((s) => s.type === "entrance")
        );

        const exits = mergeUniqueStations(
          prevExits,
          data.filter((s) => s.type === "exit")
        );

        // Update state
        setStations({ entrances, exits });

        // Persist to localStorage
        localStorage.setItem("entrances", JSON.stringify(entrances));
        localStorage.setItem("exits", JSON.stringify(exits));
      } catch (err) {
        console.error("Error fetching stations:", err);

        // Fallback: load from localStorage
        const prevEntrances = JSON.parse(localStorage.getItem("entrances") || "[]");
        const prevExits = JSON.parse(localStorage.getItem("exits") || "[]");
        setStations({ entrances: prevEntrances, exits: prevExits });
      }
    };

    fetchStations();
  }, [backend]);

  // Persist stations on change
  useEffect(() => {
    localStorage.setItem("entrances", JSON.stringify(stations.entrances));
    localStorage.setItem("exits", JSON.stringify(stations.exits));
  }, [stations]);

  // --- Action URLs ---
  const actionMap = {
    "Open Gate": { url: `${backend}/api/remote-control/gate/open`, method: "POST" },
    "Close Gate": { url: `${backend}/api/remote-control/gate/close`, method: "POST" },
    "Open and Hold": { url: `${backend}/api/remote-control/gate/open-hold`, method: "POST" },
  };

  // --- Handle Action ---
  const handleAction = async (action, stationId) => {
    if (!stationId) {
      toast.error("No station selected.");
      return;
    }
    if (!remarks.trim()) {
      toast.error("Please add remarks before performing this action.");
      return;
    }

    const config = actionMap[action];
    if (!config) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      // Decode token and check expiry
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        toast.error("Session expired.");
        localStorage.removeItem("token");
        onClose?.();
        return;
      }

      const res = await fetch(config.url, {
        method: config.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ station_id: stationId, remarks }),
      });

      const data = await res.json();
      console.log('data', data);
      if (!res.ok) {
        toast.error(data.error || "Action failed.");
        return;
      }
      
      toast.success(`${action} executed on ${stationId}`);

      navigate("/");

      // Log action
      try {
        const token = localStorage.getItem("token");
        const nowIso = new Date().toISOString();
        const logRes = await fetch(`${backend}/api/remote-control/remote-control-logs`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
           },
          body: JSON.stringify({
            event_time: nowIso,
            action,
            user: payload.username || payload.sub,
            device: "PMS",
            station_id: stationId,
            status: "Successful",
            created_at: nowIso,
            updated_at: nowIso,
          }),
        });

        if (!logRes.ok) {
          const errData = await logRes.json().catch(() => ({}));
          console.error("Failed to log action:", errData);
        } else {
          console.log(`Action logged successfully: ${action} on ${stationId}`);
        }
      } catch (err) {
        console.error("Error logging action:", err);
      }
    } catch (err) {
      console.error("Action error:", err);
      toast.error("Error performing action.");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        Station Control
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Live stations will appear below as they report in via SSE.
      </p>

      {loading && <p className="text-sm text-gray-500">Loading stations...</p>}

      {/* Entrances */}
      <div className="mt-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Entrances
        </h3>
        {stations.entrances.length === 0 ? (
          <p className="text-sm text-gray-500">No entrances detected.</p>
        ) : (
          <div className="space-y-2">
            {stations.entrances.map((s) => (
              <div
                key={s.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                  s.status === "ok"
                    ? "border-green-500"
                    : "border-red-500 bg-red-50 dark:bg-red-900/20"
                }`}
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {s.station_name} {/* Display station_name */}
                  </p>
                  <p className="text-xs text-gray-500">
                    {s.status.toUpperCase()} • {s.lastUpdate.toLocaleTimeString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction("Open Gate", s.id)}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Open
                  </button>

                  <button
                    onClick={() => handleAction("Close Gate", s.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => handleAction("Open and Hold", s.id)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Open & Hold
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exits */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Exits
        </h3>
        {stations.exits.length === 0 ? (
          <p className="text-sm text-gray-500">No exits detected.</p>
        ) : (
          <div className="space-y-2">
            {stations.exits.map((s) => (
              <div
                key={s.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                  s.status === "ok"
                    ? "border-blue-500"
                    : "border-red-500 bg-red-50 dark:bg-red-900/20"
                }`}
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {s.station_name} {/* Display station_name */}
                  </p>
                  <p className="text-xs text-gray-500">
                    {s.status.toUpperCase()} • {s.lastUpdate.toLocaleTimeString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction("Open Gate", s.id)}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Open
                  </button>

                  <button
                    onClick={() => handleAction("Close Gate", s.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => handleAction("Open and Hold", s.id)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Open & Hold
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remarks */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Remarks
        </label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Add remarks..."
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          rows={3}
        />
      </div>
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
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        Lot Adjustment
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Adjust the allocated and occupied parking slots for each zone.
      </p>

      <div className="flex flex-col gap-4">
        {/* Zone selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Zone
          </label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          >
            <option value="">Select zone</option>
            {zones.map((z) => (
              <option key={z.name} value={z.name} disabled={!z.active}>
                {z.name} {z.active ? "" : "(full)"}
              </option>
            ))}
          </select>
        </div>

        {/* Type selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          >
            <option value="hourly">Hourly</option>
            <option value="season">Season</option>
          </select>
        </div>

        {/* Allocated input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Allocated Slots
          </label>
          <input
            type="number"
            placeholder="e.g. 50"
            value={allocated}
            onChange={(e) => setAllocated(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Occupied input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Occupied Slots
          </label>
          <input
            type="number"
            placeholder="e.g. 20"
            value={occupied}
            onChange={(e) => setOccupied(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleLotUpdate}
          disabled={!zone || !allocated || !occupied}
          className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Update Lot
        </button>
      </div>
    </div>

  );
}

function ParkingTariffModal() {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        Parking Tariff
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Set or update parking tariffs for hourly or season passes.
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tariff Rate
        </label>
        <input
          type="text"
          placeholder="e.g., $2/hr"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        />
      </div>
    </div>
  );
}

export default function RemoteFunctions() {
  const [activeModal, setActiveModal] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        // Token expired
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/"); // Redirect to home
      } else {
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error("Error decoding token:", err);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/"); // Redirect on error
    }
  }, [navigate]);

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