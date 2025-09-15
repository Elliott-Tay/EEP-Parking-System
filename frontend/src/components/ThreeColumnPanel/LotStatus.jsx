import React, { useState, useEffect } from "react";
import { Activity, Car, Users } from "lucide-react";

export default function LotStatus() {
  const [lotData, setLotData] = useState({}); // all lot data
  const [currentZone, setCurrentZone] = useState(null); // selected zone

  // Compute currentLot based on selected zone or first available
  const currentLot = currentZone && lotData[currentZone]
    ? lotData[currentZone]
    : Object.keys(lotData).length > 0
      ? lotData[Object.keys(lotData)[0]]
      : { hourly: {}, season: {}, total: { allocated: 0, occupied: 0, available: 0 } };

  const occupancyRate = currentLot.total.allocated
    ? Math.round((currentLot.total.occupied / currentLot.total.allocated) * 100)
    : 0;

  const formatZoneName = (zone) => zone.charAt(0).toUpperCase() + zone.slice(1);

  // Fetch lot data from backend every 3 seconds
  useEffect(() => {
    const env_backend = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:5000";

    const fetchLotData = async () => {
      try {
        const response = await fetch(`${env_backend}/api/remote-control/lot-status`);
        if (!response.ok) throw new Error("Failed to fetch lot data");
        const data = await response.json();
        setLotData(data);

        // Set currentZone if not already set
        if (!currentZone && Object.keys(data).length > 0) {
          setCurrentZone(Object.keys(data)[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchLotData();
    const intervalId = setInterval(fetchLotData, 3000);
    return () => clearInterval(intervalId);
  }, [currentZone]);

  // SSE for real-time updates
  useEffect(() => {
    const env_backend = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:5000";
    const source = new EventSource(`${env_backend}/api/remote-control/lot-status/stream`);

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLotData(data);
    };

    source.onerror = (err) => {
      console.error("SSE connection error:", err);
      source.close();
    };

    return () => source.close();
  }, []);

  return (
    <div className="lg:col-span-2 rounded-lg border bg-card text-card-foreground shadow-sm">
      {/* Header */}
      <div className="flex flex-col space-y-1 p-3">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          <h3 className="text-xl leading-none tracking-tight">Lot Status</h3>
        </div>
        <p className="text-sm text-muted-foreground">Overview of lot statuses</p>

        {/* Zone Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {Object.keys(lotData).map((zone) => {
            const isSelected = currentZone === zone;
            const isFull = Object.values(lotData[zone]).some(
              (category) => category.available <= 0
            );

            return (
              <button
                key={zone}
                onClick={() => setCurrentZone(zone)}
                className={`px-2 py-1 rounded transition-all
                  ${isSelected ? "bg-blue-500 text-white border border-black" : ""}
                  ${!isSelected && isFull ? "bg-red-600 text-white animate-pulse" : ""}
                  ${!isSelected && !isFull ? "bg-muted/10 text-muted-foreground" : ""}`}
              >
                {formatZoneName(zone)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lot Table */}
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
                <tr key={type} className={`${index === 2 ? "bg-muted/20 font-medium" : "hover:bg-muted/10"}`}>
                  <td className="px-4 py-3 capitalize flex items-center gap-2">
                    {type === "total" ? <Activity className="h-4 w-4 text-primary" />
                      : type === "hourly" ? <Car className="h-4 w-4 text-blue-500" />
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
                      currentLot[type].available <= 0 ? "bg-red-600 text-white animate-pulse" : "bg-green-100 text-green-800"
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
                occupancyRate >= 90 ? "bg-red-500" :
                occupancyRate >= 70 ? "bg-orange-500" : "bg-green-500"
              }`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
