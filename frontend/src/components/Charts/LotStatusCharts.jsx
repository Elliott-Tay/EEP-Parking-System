import React, { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

function LotStatusChart() {
  const [data, setData] = useState([]);

  const env_backend = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:5000";
  useEffect(() => {
    fetch(`${env_backend}/api/remote-control/lot-status`)
      .then(res => res.json())
      .then(json => {
        // Transform data into chart-friendly format
        const chartData = json.map(item => ({
          zone: item.zone,
          allocated: item.allocated,
          occupied: item.occupied,
          free: item.allocated - item.occupied
        }));
        setData(chartData);
      })
      .catch(err => console.error("Error fetching lot status:", err));
  }, [env_backend]);

  return (
    <Card title="Lot Status" subtitle="Current occupancy by zone">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="zone" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="occupied" fill="#ef4444" name="Occupied" />
          <Bar dataKey="free" fill="#22c55e" name="Free" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
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

export default LotStatusChart;
