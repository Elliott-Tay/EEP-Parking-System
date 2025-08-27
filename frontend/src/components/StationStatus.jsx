import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Clock,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';

const StationStatus = () => {
  const [stations, setStations] = useState([
    {
      id: 1,
      name: "Main Entrance Station",
      location: "Zone A",
      entrances: [
        { id: "E1", name: "Entry Gate 1", status: "green", lastUpdate: new Date() },
        { id: "E2", name: "Entry Gate 2", status: "green", lastUpdate: new Date() }
      ],
      exits: [
        { id: "X1", name: "Exit Gate 1", status: "green", lastUpdate: new Date() },
        { id: "X2", name: "Exit Gate 2", status: "green", lastUpdate: new Date() }
      ],
      connection: "online"
    },
    {
      id: 2,
      name: "Secondary Station", 
      location: "Zone B",
      entrances: [
        { id: "E3", name: "Entry Gate 3", status: "green", lastUpdate: new Date() }
      ],
      exits: [
        { id: "X3", name: "Exit Gate 3", status: "green", lastUpdate: new Date() }
      ],
      connection: "online"
    },
    {
      id: 3,
      name: "Emergency Station",
      location: "Zone C", 
      entrances: [
        { id: "E4", name: "Emergency Entry", status: "green", lastUpdate: new Date() }
      ],
      exits: [
        { id: "X4", name: "Emergency Exit", status: "green", lastUpdate: new Date() }
      ],
      connection: "online"
    }
  ]);

  const [statusHistory, setStatusHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Show alert notifications for status changes
  useEffect(() => {
    stations.forEach((station) => {
      station.entrances.forEach((e) => {
        if (e.status === "red") {
          const alertId = `${station.id}-${e.id}-${Date.now()}`;
          const newAlert = {
            id: alertId,
            type: 'error',
            station: station.name,
            gate: e.name,
            message: `${station.name} - ${e.name} has an issue!`,
            timestamp: new Date(),
            resolved: false
          };
          setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep latest 10
        }
      });

      station.exits.forEach((x) => {
        if (x.status === "red") {
          const alertId = `${station.id}-${x.id}-${Date.now()}`;
          const newAlert = {
            id: alertId,
            type: 'error', 
            station: station.name,
            gate: x.name,
            message: `${station.name} - ${x.name} has an issue!`,
            timestamp: new Date(),
            resolved: false
          };
          setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep latest 10
        }
      });
    });
  }, [stations]);

  // Toggle status manually (simulate error/fix)
  const toggleStatus = (stationId, type, id) => {
    setStations((prev) =>
      prev.map((station) => {
        if (station.id !== stationId) return station;

        const updatedStation = {
          ...station,
          [type]: station[type].map((item) => {
            if (item.id === id) {
              const newStatus = item.status === "green" ? "red" : "green";
              const historyEntry = {
                id: Date.now(),
                stationName: station.name,
                gateName: item.name,
                oldStatus: item.status,
                newStatus: newStatus,
                timestamp: new Date(),
                action: newStatus === "green" ? "Resolved" : "Issue Detected"
              };
              setStatusHistory(prev => [historyEntry, ...prev.slice(0, 19)]); // Keep latest 20
              
              return { 
                ...item, 
                status: newStatus,
                lastUpdate: new Date()
              };
            }
            return item;
          })
        };

        return updatedStation;
      })
    );
  };

  // Simulate random connection issues
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const randomStationIndex = Math.floor(Math.random() * stations.length);
        setStations(prev => prev.map((station, index) => {
          if (index === randomStationIndex) {
            return {
              ...station,
              connection: station.connection === "online" ? "offline" : "online"
            };
          }
          return station;
        }));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [stations.length]);

  const totalGates = stations.reduce((acc, station) => 
    acc + station.entrances.length + station.exits.length, 0
  );
  
  const healthyGates = stations.reduce((acc, station) => 
    acc + station.entrances.filter(e => e.status === "green").length + 
    station.exits.filter(x => x.status === "green").length, 0
  );

  const onlineStations = stations.filter(station => station.connection === "online").length;
  
  const getStatusIcon = (status) => {
    return status === "green" ? CheckCircle : XCircle;
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="tracking-tight text-sm">Total Gates</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl">{totalGates}</div>
            <p className="text-xs text-muted-foreground">
              {healthyGates} operational
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="tracking-tight text-sm">Station Health</h3>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl">{Math.round((healthyGates / totalGates) * 100)}%</div>
            <p className="text-xs text-muted-foreground">
              Gates operational
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="tracking-tight text-sm">Connectivity</h3>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl">{onlineStations}/{stations.length}</div>
            <p className="text-xs text-muted-foreground">
              Stations online
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Station Status Grid */}
        <div className="space-y-4">
          <h2 className="text-xl">Station Status</h2>
          <div className="space-y-4">
            {stations.map((station) => (
              <div
                key={station.id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">{station.name}</h3>
                      <p className="text-sm text-muted-foreground">{station.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {station.connection === "online" ? (
                        <Wifi className="h-4 w-4 text-green-500" />
                      ) : (
                        <WifiOff className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        station.connection === "online" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {station.connection}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Entrances */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ArrowRight className="h-4 w-4 text-green-500" />
                        <h4 className="font-medium text-sm">Entrances</h4>
                      </div>
                      <div className="space-y-2">
                        {station.entrances.map((e) => {
                          const StatusIcon = getStatusIcon(e.status);
                          return (
                            <div
                              key={e.id}
                              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                                e.status === "green"
                                  ? "bg-green-50 border-green-200 hover:bg-green-100"
                                  : "bg-red-50 border-red-200 hover:bg-red-100 animate-pulse"
                              }`}
                              onClick={() => toggleStatus(station.id, "entrances", e.id)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{e.name}</span>
                                <StatusIcon className={`h-4 w-4 ${
                                  e.status === "green" ? "text-green-600" : "text-red-600"
                                }`} />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Updated {formatTimeAgo(e.lastUpdate)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Exits */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ArrowLeft className="h-4 w-4 text-red-500" />
                        <h4 className="font-medium text-sm">Exits</h4>
                      </div>
                      <div className="space-y-2">
                        {station.exits.map((x) => {
                          const StatusIcon = getStatusIcon(x.status);
                          return (
                            <div
                              key={x.id}
                              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                                x.status === "green"
                                  ? "bg-green-50 border-green-200 hover:bg-green-100"
                                  : "bg-red-50 border-red-200 hover:bg-red-100 animate-pulse"
                              }`}
                              onClick={() => toggleStatus(station.id, "exits", x.id)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{x.name}</span>
                                <StatusIcon className={`h-4 w-4 ${
                                  x.status === "green" ? "text-green-600" : "text-red-600"
                                }`} />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Updated {formatTimeAgo(x.lastUpdate)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts and History */}
        <div className="space-y-6">
          {/* Recent Alerts */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h3 className="text-2xl leading-none tracking-tight">Recent Alerts</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Latest system alerts and notifications
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50 text-green-500" />
                    <p className="text-sm">All systems operational</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-orange-800">{alert.message}</p>
                        <p className="text-xs text-orange-600">
                          {formatTimeAgo(alert.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <h3 className="text-2xl leading-none tracking-tight">Status History</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Recent status changes and activities
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {statusHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent status changes</p>
                  </div>
                ) : (
                  statusHistory.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className={`w-3 h-3 rounded-full ${
                        entry.newStatus === "green" ? "bg-green-500" : "bg-red-500"
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{entry.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.stationName} - {entry.gateName} • {formatTimeAgo(entry.timestamp)}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        entry.newStatus === "green" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {entry.newStatus.toUpperCase()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationStatus;