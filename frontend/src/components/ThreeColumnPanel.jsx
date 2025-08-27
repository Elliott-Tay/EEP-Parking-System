import { useState, useEffect } from "react";
import { 
  Power, 
  Unlock, 
  Lock, 
  Settings,
  Building,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Activity,
  Car,
  Users,
  DollarSign,
  Loader2,
} from "lucide-react";

const ThreeColumnPanel = () => {
  const [isBasement, setIsBasement] = useState(false);
  const [station, setStation] = useState({ entrances: [], exits: [] });
  const [loading, setLoading] = useState(true);

  // Fetch station data from backend
  useEffect(() => {
    const fetchStationStatus = async () => {
      try {
        const res = await fetch("/api/station-status"); // replace with your backend endpoint
        const data = await res.json();

        setStation({
          entrances:
            data.entrances && data.entrances.length
              ? data.entrances
              : [{ id: "E1", name: "E1", status: "error", lastUpdate: new Date() }],
          exits:
            data.exits && data.exits.length
              ? data.exits
              : [{ id: "X1", name: "E1", status: "error", lastUpdate: new Date() }],
        });
      } catch (err) {
        // fallback in case of error
        setStation({
          entrances: [{ id: "E1", name: "E1", status: "error", lastUpdate: new Date() }],
          exits: [{ id: "X1", name: "X1", status: "error", lastUpdate: new Date() }],
        });
        console.error("Failed to fetch station status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStationStatus();
  }, []);

  const toggleStationStatus = (type, id) => {
    setStation((prev) => ({
      ...prev,
      [type]: prev[type].map((item) =>
        item.id === id
          ? { ...item, status: item.status === "ok" ? "error" : "ok", lastUpdate: new Date() }
          : item
      ),
    }));
  };

  // Lot status data
  const lotData = {
    main: {
      hourly: { allocated: 20, occupied: 15, available: 5 },
      season: { allocated: 15, occupied: 10, available: 5 },
      total: { allocated: 50, occupied: 35, available: 15 },
    },
    basement: {
      hourly: { allocated: 10, occupied: 7, available: 3 },
      season: { allocated: 10, occupied: 7, available: 3 },
      total: { allocated: 30, occupied: 20, available: 10 },
    },
  };

  const currentLot = isBasement ? lotData.basement : lotData.main;

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const getStatusIcon = (status) => {
    return status === "ok" ? CheckCircle : XCircle;
  };

  const remoteActions = [
    {
      id: 'station-control',
      label: 'Station Control',
      icon: Unlock,
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Control entry/exit gates'
    },
    {
      id: 'lot-adjustment',
      label: 'Lot Adjustment',
      icon: Settings,
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Modify parking allocations'
    },
    {
      id: 'parking-tariff',
      label: 'Parking Tariff',
      icon: DollarSign,
      color: 'bg-orange-500 hover:bg-orange-600',
      description: 'Update pricing structure'
    },
    {
      id: 'emergency-lock',
      label: 'Emergency Lock',
      icon: Lock,
      color: 'bg-red-500 hover:bg-red-600',
      description: 'Emergency system lockdown'
    }
  ];

  const occupancyRate = Math.round((currentLot.total.occupied / currentLot.total.allocated) * 100);

  return (
    <div className="space-y-6 mb-10">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <h4 className="tracking-tight text-sm">Total Capacity</h4>
            <Building className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl">{currentLot.total.allocated}</div>
            <p className="text-xs text-muted-foreground">
              {isBasement ? 'Basement' : 'Main'} lot spaces
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <h4 className="tracking-tight text-sm">Occupied</h4>
            <Car className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl">{currentLot.total.occupied}</div>
            <p className="text-xs text-muted-foreground">
              {occupancyRate}% occupancy rate
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <h4 className="tracking-tight text-sm">Available</h4>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl">{currentLot.total.available}</div>
            <p className="text-xs text-muted-foreground">
              Ready for vehicles
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
            <h4 className="tracking-tight text-sm">System Status</h4>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lot Status */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl leading-none tracking-tight">Lot Status</h3>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${!isBasement ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Main
                </span>
                <button
                  onClick={() => setIsBasement(!isBasement)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    isBasement ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isBasement ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm ${isBasement ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Basement
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Current allocation and occupancy status
            </p>
          </div>
          <div className="p-6 pt-0">
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Allocated</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Occupied</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {["hourly", "season", "total"].map((type, index) => (
                    <tr key={type} className={`${index === 2 ? 'bg-muted/20 font-medium' : 'hover:bg-muted/10'}`}>
                      <td className="px-4 py-3 capitalize">
                        <div className="flex items-center gap-2">
                          {type === 'total' ? (
                            <Activity className="h-4 w-4 text-primary" />
                          ) : type === 'hourly' ? (
                            <Car className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Users className="h-4 w-4 text-green-500" />
                          )}
                          {type}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs text-blue-800">
                          {currentLot[type].allocated}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs text-red-800">
                          {currentLot[type].occupied}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs text-green-800">
                          {currentLot[type].available}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Occupancy Rate</span>
                <span>{occupancyRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    occupancyRate > 90 ? 'bg-red-500' : 
                    occupancyRate > 70 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${occupancyRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Remote Functions */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center gap-2">
              <Power className="h-5 w-5 text-primary" />
              <h3 className="text-xl leading-none tracking-tight">Remote Functions</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              System control and management tools
            </p>
          </div>
          <div className="p-6 pt-0">
            <div className="grid gap-3">
              {remoteActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={action.id}
                    className={`flex items-center gap-3 px-4 py-3 text-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${action.color} group`}
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
        </div>

        {/* Station Status */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              <h3 className="text-xl leading-none tracking-tight">Station Status</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Real-time gate monitoring
            </p>
          </div>
          <div className="p-6 pt-0">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading status...</span>
              </div>
            ) : (
              <div className="space-y-4">
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
                            e.status === "ok"
                              ? "bg-green-50 border-green-200 hover:bg-green-100"
                              : "bg-red-50 border-red-200 hover:bg-red-100 animate-pulse"
                          }`}
                          onClick={() => toggleStationStatus("entrances", e.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <StatusIcon className={`h-4 w-4 ${
                                e.status === "ok" ? "text-green-600" : "text-red-600"
                              }`} />
                              <span className="text-sm font-medium">{e.name || e.id}</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              e.status === "ok" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                            }`}>
                              {e.status.toUpperCase()}
                            </span>
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
                            x.status === "ok"
                              ? "bg-green-50 border-green-200 hover:bg-green-100"
                              : "bg-red-50 border-red-200 hover:bg-red-100 animate-pulse"
                          }`}
                          onClick={() => toggleStationStatus("exits", x.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <StatusIcon className={`h-4 w-4 ${
                                x.status === "ok" ? "text-green-600" : "text-red-600"
                              }`} />
                              <span className="text-sm font-medium">{x.name || x.id}</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              x.status === "ok" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                            }`}>
                              {x.status.toUpperCase()}
                            </span>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeColumnPanel;