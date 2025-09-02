import React, { useState, useEffect } from "react";
import { Activity, Car, Users } from "lucide-react";
import { io } from "socket.io-client";

const USE_MOCK = true; // toggle mock data

// Mock lot status data
const lotMockData = {
  main: {
    hourly: { allocated: 20, occupied: 20, available: 0 },
    season: { allocated: 15, occupied: 15, available: 0 },
    total: { allocated: 50, occupied: 45, available: 5 },
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
    season: { allocated: 5, occupied: 4, available: 1 },
    total: { allocated: 10, occupied: 7, available: 3 },
  },
  zone_c: {
    hourly: { allocated: 5, occupied: 3, available: 2 },
    season: { allocated: 5, occupied: 5, available: 0 },
    total: { allocated: 10, occupied: 3, available: 7 },
  },
};

export default function LotStatus({ currentZone, setCurrentZone }) {
  const [lotData, setLotData] = useState(lotMockData);

  const currentLot = lotData[currentZone] || lotData["main"];
  const occupancyRate = Math.round(
    (currentLot.total.occupied / currentLot.total.allocated) * 100 || 0
  );

  const formatZoneName = (zone) => zone.charAt(0).toUpperCase() + zone.slice(1);

  // Real-time updates with useEffect
  useEffect(() => {
    if (USE_MOCK) {
      setLotData(lotMockData);
      setCurrentZone(Object.keys(lotMockData)[0]);
      return;
    }

    const env_backend = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:5000";
    const socket = io(env_backend);

    socket.on("lot-update", ({ zone, slot }) => {
      setLotData((prev) => ({
        ...prev,
        [zone]: {
          ...prev[zone],
          [slot.type]: slot,
        },
      }));

      if (!currentZone) setCurrentZone(zone);
    });

    socket.on("lot-status-error", (error) => {
      console.error("Lot status error:", error);
    });

    return () => {
      socket.off("lot-update");
      socket.off("lot-status-error");
      socket.disconnect();
    };
  }, [currentZone, setCurrentZone]);

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
                  ${isSelected ? "bg-blue-500 text-white border border-black" : "bg-muted/10 text-muted-foreground"}
                  ${isFull ? "bg-red-600 text-white animate-pulse" : ""}`}
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
