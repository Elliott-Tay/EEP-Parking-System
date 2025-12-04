import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, CheckCircle, XCircle, Activity, Loader2 } from "lucide-react";

const StationStatus = ({ env_backend }) => {
  const [station, setStation] = useState({ entrances: [], exits: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial station status
  useEffect(() => {
    const fetchStationStatus = async () => {
      try {
        const [entryRes, exitRes] = await Promise.all([
          fetch(`${env_backend}/api/movements/entry-station`),
          fetch(`${env_backend}/api/movements/exit-station`)
        ]);

        const [entryData, exitData] = await Promise.all([entryRes.json(), exitRes.json()]);

        setStation({
          entrances: (entryData?.entrances || []).map(e => ({
            ...e,
            id: e.id || e.Station,
            status: (e.Status || "ok").toLowerCase(),
            errors: e.errors || [],
            lastUpdate: new Date()
          })),
          exits: (exitData?.exits || []).map(x => ({
            ...x,
            id: x.id || x.Station,
            status: (x.Status || "ok").toLowerCase(),
            errors: x.errors || [],
            lastUpdate: new Date()
          }))
        });
      } catch (err) {
        console.error("Failed to fetch station status:", err);
        setError("Failed to load station status");
      } finally {
        setLoading(false);
      }
    };

    fetchStationStatus();
  }, [env_backend]);

  // SSE subscription for live updates
  useEffect(() => {
    const entrySource = new EventSource(`${env_backend}/api/movements/stream/entries`);
    const exitSource = new EventSource(`${env_backend}/api/movements/stream/exits`);

    const normalizeData = (data) => ({
      ...data,
      id: data.id || data.Station,
      status: (data.Status || data.status || "ok").toLowerCase(),
      errors: Array.isArray(data.errors) ? data.errors : [],
      lastUpdate: new Date()
    });

    const updateStation = (type, data) => {
      const normalized = normalizeData(data);
      setStation(prev => {
        const updated = [...prev[type]];
        const index = updated.findIndex(item => item.id === normalized.id);
        if (index >= 0) {
          updated[index] = { ...updated[index], ...normalized };
        } else {
          updated.unshift(normalized);
        }
        return { ...prev, [type]: updated };
      });
    };

    entrySource.onmessage = e => {
      try {
        const data = JSON.parse(e.data);
        updateStation("entrances", data);
      } catch (err) {
        console.error("Error parsing entry SSE:", err);
      }
    };

    exitSource.onmessage = e => {
      try {
        const data = JSON.parse(e.data);
        updateStation("exits", data);
      } catch (err) {
        console.error("Error parsing exit SSE:", err);
      }
    };

    entrySource.onerror = () => {
      console.error("Entry SSE connection lost");
      entrySource.close();
    };

    exitSource.onerror = () => {
      console.error("Exit SSE connection lost");
      exitSource.close();
    };

    return () => {
      entrySource.close();
      exitSource.close();
    };
  }, [env_backend]);

  const toggleStationStatus = (type, id) => {
    setStation(prev => ({
      ...prev,
      [type]: prev[type].map(item =>
        item.id === id
          ? {
              ...item,
              lastUpdate: new Date(),
              errors: item.errors?.length ? [] : ["Simulated error"],
              status: item.status === "ok" ? "error" : "ok"
            }
          : item
      )
    }));
  };

  const formatTimeAgo = date =>
    new Date(date).toLocaleString("en-SG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });

  const getStatusIcon = status => (status === "ok" ? CheckCircle : XCircle);

  return (
    <div className="lg:col-span-2 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-500" />
          <h3 className="text-xl leading-none tracking-tight">Station Status</h3>
        </div>
        <p className="text-sm text-muted-foreground">Gate monitoring</p>
      </div>

      <div className="p-6 pt-0">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading status...</span>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["entrances", "exits"].map(type => (
              <div key={type}>
                <div className="flex items-center gap-2 mb-3">
                  {type === "entrances" ? (
                    <ArrowRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowLeft className="h-4 w-4 text-red-500" />
                  )}
                  <h4 className="font-medium text-sm">{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
                  {station[type].map(item => {
                    const hasError = item.status === "error" || (item.errors?.length > 0);
                    const StatusIcon = getStatusIcon(hasError ? "error" : "ok");

                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                          hasError
                            ? "bg-red-50 border-red-200 hover:bg-red-100 animate-pulse"
                            : "bg-green-50 border-green-200 hover:bg-green-100"
                        }`}
                        onClick={() => toggleStationStatus(type, item.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`h-4 w-4 ${hasError ? "text-red-600" : "text-green-600"}`} />
                            <span className="text-sm font-medium">{item.name || item.id}</span>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              hasError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                            }`}
                          >
                            {hasError ? "ERROR" : "OK"}
                          </span>
                        </div>

                        {hasError && item.errors?.length > 0 && (
                          <ul className="mt-1 space-y-1 text-xs text-red-600 list-disc list-inside">
                            {item.errors.map((err, idx) => (
                              <li key={idx}>{err}</li>
                            ))}
                          </ul>
                        )}

                        <p className="text-xs text-muted-foreground mt-1">
                          Updated {formatTimeAgo(item.lastUpdate)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StationStatus;
