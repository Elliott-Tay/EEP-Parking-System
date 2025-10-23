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
    "Restart Station": { url: `${backend}/api/remote-control/system/restart-app`, method: "POST" },
    "Restart UPOS": { url: `${backend}/api/remote-control/system/restart-upos`, method: "POST" },
    "Eject Card": { url: `${backend}/api/remote-control/card/eject`, method: "POST" },
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
            remarks
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

  const now = new Date();
  const formatted = now.toLocaleString('en-SG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(',', '');

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Station Control
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage live station gates and monitor their real-time status. 
          Updates appear automatically via live SSE feed.
        </p>
      </header>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 animate-pulse">
          <span className="w-3 h-3 rounded-full bg-green-400 animate-ping" />
          Loading stations...
        </div>
      )}

      {/* Entrances */}
      <section className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Entrances
        </h3>

        {stations.entrances.length === 0 ? (
          <p className="text-sm text-gray-500">No entrances detected.</p>
        ) : (
          <div className="space-y-3">
            {stations.entrances.map((s) => (
              <div
                key={s.id}
                className={`flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                  s.status === "ok"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                    : "border-red-500 bg-red-50 dark:bg-red-900/20"
                }`}
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {s.station_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {s.status.toUpperCase()} • {formatted}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Open", color: "green", action: "Open Gate" },
                    { label: "Close", color: "red", action: "Close Gate" },
                    { label: "Hold", color: "blue", action: "Open and Hold" },
                    { label: "Restart", color: "yellow", action: "Restart Station" },
                  ].map((btn) => (
                    <button
                      key={btn.action}
                      onClick={() => handleAction(btn.action, s.id)}
                      className={`px-3 py-1.5 text-sm font-medium text-white rounded-lg bg-${btn.color}-500 hover:bg-${btn.color}-600 transition-all`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Exits */}
      <section className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Exits
        </h3>

        {stations.exits.length === 0 ? (
          <p className="text-sm text-gray-500">No exits detected.</p>
        ) : (
          <div className="space-y-3">
            {stations.exits.map((s) => (
              <div
                key={s.id}
                className={`flex flex-col md:flex-row md:items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                  s.status === "ok"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                    : "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                }`}
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {s.station_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {s.status.toUpperCase()} • {formatted}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Open", color: "green", action: "Open Gate" },
                    { label: "Close", color: "red", action: "Close Gate" },
                    { label: "Hold", color: "blue", action: "Open and Hold" },
                    { label: "Restart", color: "yellow", action: "Restart Station" },
                    { label: "Restart UPOS", color: "gray", action: "Restart UPOS" },
                  ].map((btn) => (
                    <button
                      key={btn.action}
                      onClick={() => handleAction(btn.action, s.id)}
                      className={`px-3 py-1.5 text-sm font-medium text-white rounded-lg bg-${btn.color}-500 hover:bg-${btn.color}-600 transition-all`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Remarks */}
      <section className="mt-8">
        <label
          htmlFor="remarks"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Remarks
        </label>
        <textarea
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Add operator remarks here..."
          rows={4}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-gray-200 shadow-sm"
        />
      </section>
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
      // Step 1: Update the lot status
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/remote-control/lot-status/${zone}/${type}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            allocated: Number(allocated),
            occupied: Number(occupied),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update lot");
        return;
      }

      toast.success(
        `Updated zone ${zone} (${type}) to ${data.allocated} allocated, ${data.occupied} occupied`
      );

      // Step 2: Log the lot status history
      try {
        const token = localStorage.getItem("token");
        let username = 0; // default value if no token

        if (token) {
          // JWT format: header.payload.signature
          const payloadBase64 = token.split(".")[1];
          const payloadJson = atob(payloadBase64); // decode base64
          const payload = JSON.parse(payloadJson);

          username = payload.username; // now it's assigned
        }

        await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/remote-control/lot-status-history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            zone,
            type,
            allocated: Number(allocated),
            occupied: Number(occupied),
            users: username || 0,
          }),
        });
      } catch (logErr) {
        console.error("Failed to log lot status history:", logErr);
      }

      // Reset inputs and close modal
      setAllocated("");
      setOccupied("");
      onClose?.();

    } catch (err) {
      toast.error("Error updating lot: " + err.message);
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
      <h2 className="text-3xl font-extrabold mb-3 text-gray-900 dark:text-gray-100 tracking-tight">
        Lot Adjustment
      </h2>
      <p className="text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
        Modify the <span className="font-semibold text-green-600">allocated</span> and{" "}
        <span className="font-semibold text-blue-600">occupied</span> parking slots for
        different zones. Ensure data reflects real-time occupancy for accuracy.
      </p>

      <div className="space-y-6">
        {/* Zone Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Zone
          </label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-4 focus:ring-green-400 transition"
          >
            <option value="">Select zone</option>
            {zones.map((z) => (
              <option key={z.name} value={z.name} disabled={!z.active}>
                {z.name} {z.active ? "" : "(Full)"}
              </option>
            ))}
          </select>
        </div>

        {/* Type Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-4 focus:ring-green-400 transition"
          >
            <option value="hourly">Hourly</option>
            <option value="season">Season</option>
          </select>
        </div>

        {/* Allocated Slots */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Allocated Slots
          </label>
          <input
            type="number"
            placeholder="e.g. 50"
            value={allocated}
            onChange={(e) => setAllocated(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-4 focus:ring-green-400 transition"
          />
        </div>

        {/* Occupied Slots */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Occupied Slots
          </label>
          <input
            type="number"
            placeholder="e.g. 20"
            value={occupied}
            onChange={(e) => setOccupied(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-4 focus:ring-green-400 transition"
          />
        </div>

        {/* Update Button */}
        <button
          onClick={handleLotUpdate}
          disabled={!zone || !allocated || !occupied}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-semibold rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Update Lot
        </button>

        {/* Summary Footer (Optional) */}
        {zone && (
          <div className="mt-6 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <p>
              <span className="font-semibold">Zone:</span> {zone} |{" "}
              <span className="font-semibold">Type:</span> {type} |{" "}
              <span className="font-semibold">Allocated:</span> {allocated} |{" "}
              <span className="font-semibold">Occupied:</span> {occupied}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ParkingTariffModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-[95vw] max-w-5xl p-10 relative overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          className="absolute top-6 right-6 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">
          Parking Tariff Management
        </h1>

        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Set or update parking tariffs for hourly or season passes. Upload and preview the current tariff image below.
        </p>

        {/* Image Preview */}
        <div className="mb-8">
          <p className="text-lg text-gray-800 dark:text-gray-200 mb-4 font-semibold">
            Current Tariff Image
          </p>
          <div className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-2xl shadow-lg overflow-hidden bg-gray-50 dark:bg-gray-800 flex justify-center items-center p-4">
            <img
              src="http://localhost:5000/api/image/tariff-image"
              alt="Tariff"
              className="object-contain max-h-[600px] w-full"
            />
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            className="px-8 py-4 bg-red-600 text-white text-lg font-bold rounded-2xl hover:bg-red-700 transition-colors duration-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>
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
        navigate("/"); 
      } else {
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error("Error decoding token:", err);
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/"); 
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
      description: "Show parking tariff structure",
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