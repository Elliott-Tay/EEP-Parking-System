import { useState, useEffect } from "react";
import { 
  Power, Unlock, Settings, Building, ArrowRight, ArrowLeft,
  CheckCircle, XCircle, Activity, Car, Users, DollarSign, Loader2
} from "lucide-react";

const ThreeColumnPanel = () => {
  // mock Lot status data 
  const lotData = {
    main: {
      hourly: { allocated: 20, occupied: 20, available: 0 },
      season: { allocated: 15, occupied: 15, available: 0 },
      total: { allocated: 50, occupied: 35, available: 15 },
    },
    basement: {
      hourly: { allocated: 10, occupied: 7, available: 3 },
      season: { allocated: 10, occupied: 7, available: 3 },
      total: { allocated: 30, occupied: 20, available: 10 },
    },
    roof: {
      hourly: { allocated: 5, occupied: 2, available: 3 },
      season: { allocated: 5, occupied: 1, available: 4 },
      total: { allocated: 10, occupied: 3, available: 7 },
    },
    middle: {
      hourly: { allocated: 5, occupied: 3, available: 2 },
      season: { allocated: 5, occupied: 5, available: 0 },
      total: { allocated: 10, occupied: 3, available: 7 },
    }
  };

  const [currentZone, setCurrentZone] = useState("main");
  const currentLot = lotData[currentZone] || lotData["main"];

  const [station, setStation] = useState({ entrances: [], exits: [] });
  const [loading, setLoading] = useState(true);

  // Fetch station data
  useEffect(() => {
    const fetchStationStatus = async () => {
      try {
        const res = await fetch("/api/station-status");
        const data = await res.json();
        setStation({
          entrances:
            data.entrances?.length
              ? data.entrances
              : [{ id: "E1", name: "E1", status: "error", lastUpdate: new Date() }],
          exits:
            data.exits?.length
              ? data.exits
              : [{ id: "X1", name: "X1", status: "error", lastUpdate: new Date() }],
        });
      } catch (err) {
        console.error("Failed to fetch station status:", err);
        setStation({
          entrances: [{ id: "E1", name: "E1", status: "error", lastUpdate: new Date() }],
          exits: [{ id: "X1", name: "X1", status: "error", lastUpdate: new Date() }],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStationStatus();
  }, []);

  const toggleStationStatus = (type, id) => {
    setStation(prev => ({
      ...prev,
      [type]: prev[type].map(item =>
        item.id === id
          ? { ...item, status: item.status === "ok" ? "error" : "ok", lastUpdate: new Date() }
          : item
      ),
    }));
  };

  const formatTimeAgo = date => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const getStatusIcon = status => (status === "ok" ? CheckCircle : XCircle);

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
  ];

  const occupancyRate = Math.round(
    (currentLot.total.occupied / currentLot.total.allocated) * 100 || 0
  );

  return (
    <div className="space-y-2 mb-5">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Capacity", value: currentLot.total.allocated, icon: Building, label: `${currentZone.charAt(0).toUpperCase() + currentZone.slice(1)} lot spaces` },
          { title: "Occupied", value: currentLot.total.occupied, icon: Car, label: `${occupancyRate}% occupancy rate` },
          { title: "Available", value: currentLot.total.available, icon: Users, label: "Ready for vehicles" },
          { title: "System Status", value: "Online", icon: Activity, label: "All systems operational", isText: true, textColor: "text-green-600" }
        ].map((stat, idx) => (
          <div key={idx} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between p-4 pb-2">
              <h4 className="tracking-tight text-sm">{stat.title}</h4>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-4 pt-0">
              <div className={`text-2xl ${stat.textColor || ""}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lot Status */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1 p-6">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              <h3 className="text-xl leading-none tracking-tight">Lot Status</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Overview of lot statuses
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {Object.keys(lotData).map(zone => (
                <button
                  key={zone}
                  onClick={() => setCurrentZone(zone)}
                  className={`px-2 py-1 rounded ${
                    currentZone === zone
                      ? "bg-blue-500 text-white"
                      : "bg-muted/10 text-muted-foreground"
                  }`}
                >
                  {zone.charAt(0).toUpperCase() + zone.slice(1)}
                </button>
              ))}
            </div>
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
                      <td className="px-4 py-3 capitalize flex items-center gap-2">
                        {type === 'total' ? <Activity className="h-4 w-4 text-primary" />
                          : type === 'hourly' ? <Car className="h-4 w-4 text-blue-500" />
                          : <Users className="h-4 w-4 text-green-500" />}
                        {type}
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
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
                          currentLot[type].available <= 0
                            ? "bg-red-600 text-white animate-pulse"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {currentLot[type].available}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Occupancy Progress */}
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
                />
              </div>
            </div>
          </div>
        </div>

        {/* Remote Functions */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1 p-6">
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
              {remoteActions.map(action => {
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
                {["entrances", "exits"].map(type => (
                  <div key={type}>
                    <div className="flex items-center gap-2 mb-3">
                      {type === "entrances" ? <ArrowRight className="h-4 w-4 text-green-500" /> : <ArrowLeft className="h-4 w-4 text-red-500" />}
                      <h4 className="font-medium text-sm">{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                    </div>
                    <div className="space-y-2">
                      {station[type].map(item => {
                        const StatusIcon = getStatusIcon(item.status);
                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                              item.status === "ok"
                                ? "bg-green-50 border-green-200 hover:bg-green-100"
                                : "bg-red-50 border-red-200 hover:bg-red-100 animate-pulse"
                            }`}
                            onClick={() => toggleStationStatus(type, item.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <StatusIcon className={`h-4 w-4 ${item.status === "ok" ? "text-green-600" : "text-red-600"}`} />
                                <span className="text-sm font-medium">{item.name || item.id}</span>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                item.status === "ok" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}>
                                {item.status.toUpperCase()}
                              </span>
                            </div>
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
      </div>
    </div>
  );
};

export default ThreeColumnPanel;