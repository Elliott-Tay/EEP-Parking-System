import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  Activity,
  ArrowUpCircle,
  ArrowDownCircle,
  Home,
  AlertCircle
} from "lucide-react";
import { toast } from "react-toastify";

export default function MovementChart() {
  const [movementData, setMovementData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

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
      toast.success(`Loaded data for ${chartData.length} time period(s)`);
    } catch (err) {
      console.error("Failed to fetch movements:", err);
      setError("Failed to load movement data");
      toast.error("Failed to load movement data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  // Calculate statistics
  const totalEntries = movementData.reduce((sum, item) => sum + (item.entries || 0), 0);
  const totalExits = movementData.reduce((sum, item) => sum + (item.exits || 0), 0);
  const netMovement = totalEntries - totalExits;
  const peakEntryHour = movementData.length > 0 
    ? movementData.reduce((max, item) => (item.entries > max.entries ? item : max), movementData[0])
    : null;
  const peakExitHour = movementData.length > 0
    ? movementData.reduce((max, item) => (item.exits > max.exits ? item : max), movementData[0])
    : null;

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl border-2 border-gray-200 rounded-xl shadow-xl p-4">
          <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-red-500" />
            {label}
          </p>
          <div className="space-y-1">
            <p className="text-sm flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-gray-600">Entries:</span>
              </span>
              <span className="font-semibold text-green-600">{payload[0].value}</span>
            </p>
            <p className="text-sm flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-gray-600">Exits:</span>
              </span>
              <span className="font-semibold text-red-600">{payload[1].value}</span>
            </p>
            <div className="pt-2 mt-2 border-t border-gray-200">
              <p className="text-sm flex items-center justify-between gap-4">
                <span className="text-gray-600">Net:</span>
                <span className={`font-semibold ${(payload[0].value - payload[1].value) >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {payload[0].value - payload[1].value > 0 ? '+' : ''}{payload[0].value - payload[1].value}
                </span>
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-rose-50/20">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-200">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  Hourly Vehicle Movements
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Traffic in and out of the carpark
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  fetchMovements();
                  toast.info('Refreshing movement data...');
                }}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 text-red-600 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline text-gray-700 font-medium">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Statistics Summary - Only show when data is available */}
        {!loading && !error && movementData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Entries */}
            <div className="relative overflow-hidden rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-green-500 shadow-md">
                    <ArrowUpCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-green-700">Total Entries</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{totalEntries.toLocaleString()}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Vehicles In</span>
                </div>
              </div>
            </div>

            {/* Total Exits */}
            <div className="relative overflow-hidden rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-red-500 shadow-md">
                    <ArrowDownCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-red-700">Total Exits</span>
                </div>
                <p className="text-2xl font-bold text-red-900">{totalExits.toLocaleString()}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                  <TrendingDown className="h-3 w-3" />
                  <span>Vehicles Out</span>
                </div>
              </div>
            </div>

            {/* Net Movement */}
            <div className={`relative overflow-hidden rounded-xl border-2 ${netMovement >= 0 ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100' : 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-100'} p-5 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className={`absolute top-0 right-0 w-20 h-20 ${netMovement >= 0 ? 'bg-blue-200/30' : 'bg-orange-200/30'} rounded-full -mr-10 -mt-10`} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${netMovement >= 0 ? 'bg-blue-500' : 'bg-orange-500'} shadow-md`}>
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  <span className={`text-xs font-semibold ${netMovement >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Net Movement</span>
                </div>
                <p className={`text-2xl font-bold ${netMovement >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                  {netMovement > 0 ? '+' : ''}{netMovement.toLocaleString()}
                </p>
                <div className={`mt-2 flex items-center gap-1 text-xs ${netMovement >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {netMovement >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{netMovement >= 0 ? 'More In' : 'More Out'}</span>
                </div>
              </div>
            </div>

            {/* Peak Hours */}
            <div className="relative overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500 shadow-md">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-purple-700">Peak Hours</span>
                </div>
                <div className="space-y-1">
                  {peakEntryHour && (
                    <p className="text-sm text-purple-900">
                      <span className="font-semibold">In:</span> {peakEntryHour.hour}
                    </p>
                  )}
                  {peakExitHour && (
                    <p className="text-sm text-purple-900">
                      <span className="font-semibold">Out:</span> {peakExitHour.hour}
                    </p>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-purple-600">
                  <BarChart3 className="h-3 w-3" />
                  <span>Busiest Times</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart Card */}
        <Card title="Hourly Vehicle Movements" subtitle="Traffic in and out of the carpark">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <RefreshCw className="h-12 w-12 text-red-500 animate-spin" />
              <p className="text-gray-600 font-medium">Loading movement data...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="p-4 rounded-2xl bg-red-100">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <div className="text-center">
                <p className="text-red-600 font-semibold mb-1">{error}</p>
                <button
                  onClick={fetchMovements}
                  className="mt-3 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : movementData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="p-4 rounded-2xl bg-gray-100">
                <BarChart3 className="h-12 w-12 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-gray-600 font-semibold mb-1">No movement data available</p>
                <p className="text-sm text-gray-500">Check back later for traffic data</p>
              </div>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={movementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="hour" 
                    tick={{ fill: '#6b7280', fontSize: 13 }}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 13 }}
                    stroke="#9ca3af"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="entries" 
                    fill="#22c55e" 
                    name="Entries" 
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar 
                    dataKey="exits" 
                    fill="#ef4444" 
                    name="Exits" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Enhanced Legend */}
              <div className="flex items-center justify-center gap-8 mt-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                <LegendItem color="#22c55e" label="Entries" icon={ArrowUpCircle} />
                <LegendItem color="#ef4444" label="Exits" icon={ArrowDownCircle} />
              </div>

              {/* Data Summary */}
              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    Showing {movementData.length} time period(s)
                  </span>
                  <span className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-400" />
                    Live Data
                  </span>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

// Reusable Card wrapper with enhanced styling
function Card({ title, subtitle, children }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-red-50 mt-0.5">{subtitle}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// Enhanced Legend helper
function LegendItem({ color, label, icon: Icon }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border-2 border-gray-200">
        <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
        {Icon && <Icon className="h-4 w-4" style={{ color }} />}
        <span className="font-medium text-gray-700">{label}</span>
      </div>
    </div>
  );
}
