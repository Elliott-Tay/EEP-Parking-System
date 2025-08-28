import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Static data
const hourlyData = [
  { hour: '6AM', occupancy: 15, revenue: 45 },
  { hour: '8AM', occupancy: 65, revenue: 195 },
  { hour: '10AM', occupancy: 80, revenue: 240 },
  { hour: '12PM', occupancy: 95, revenue: 285 },
  { hour: '2PM', occupancy: 88, revenue: 264 },
  { hour: '4PM', occupancy: 92, revenue: 276 },
  { hour: '6PM', occupancy: 70, revenue: 210 },
  { hour: '8PM', occupancy: 35, revenue: 105 },
];

const zoneData = [
  { name: 'Zone A', value: 25, color: '#8884d8' },
  { name: 'Zone B', value: 30, color: '#82ca9d' },
  { name: 'Zone C', value: 20, color: '#ffc658' },
  { name: 'Zone D', value: 25, color: '#ff7c7c' },
];

const hourlyFlowData = [
  { hour: '8 AM', entries: 12, exits: 5 },
  { hour: '9 AM', entries: 18, exits: 10 },
  { hour: '10 AM', entries: 20, exits: 15 },
];

// Main container component
export default function DashboardCharts() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HourlyRevenueChart />
        <ZoneDistributionChart />
      </div>
      <HourlyFlowChart />
    </div>
  );
}

// Hourly Revenue
function HourlyRevenueChart() {
  return (
    <Card title="Hourly Revenue" subtitle="Revenue generated throughout the day">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={hourlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
          <Bar dataKey="revenue" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Zone Distribution
function ZoneDistributionChart() {
  return (
    <Card title="Zone Distribution" subtitle="Current occupancy by zone">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={zoneData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {zoneData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Hourly Vehicle Flow
function HourlyFlowChart() {
  return (
    <Card title="Hourly Vehicle Flow" subtitle="Traffic flows in and out over the course of the day">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={hourlyFlowData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="entries" fill="#22c55e" name="Entries" />
          <Bar dataKey="exits" fill="#ef4444" name="Exits" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-4 text-sm">
        <LegendItem color="#22c55e" label="Entry into Carpark" />
        <LegendItem color="#ef4444" label="Exit from Carpark" />
      </div>
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

// Legend helper
function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}
