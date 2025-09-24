import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function MovementChart() {
  const [movementData, setMovementData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch movement data
  const fetchMovements = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/movements/movement-chart`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Transform backend data to chart-friendly format
      const chartData = data.map(item => ({
        hour: item.hour, // e.g., "08:00"
        entries: item.entries,
        exits: item.exits,
      }));
      setMovementData(chartData);
    } catch (err) {
      console.error("Failed to fetch movements:", err);
      setError("Failed to load movement data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  return (
    <div className="p-6">
      <Card title="Hourly Vehicle Movements" subtitle="Traffic in and out of the carpark">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-red-600 text-center py-8">{error}</div>
        ) : movementData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No movement data available</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={movementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="entries" fill="#22c55e" name="Entries" />
                <Bar dataKey="exits" fill="#ef4444" name="Exits" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-6 mt-4 text-sm">
              <LegendItem color="#22c55e" label="Entries" />
              <LegendItem color="#ef4444" label="Exits" />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

// Reusable Card wrapper
function Card({ title, subtitle, children }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl leading-none tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="p-6 pt-0">{children}</div>
    </div>
  );
}

// Legend helper
function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}
