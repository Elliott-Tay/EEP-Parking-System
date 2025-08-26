import { useState, useEffect } from 'react';
import { 
  Car, 
  MapPin, 
  DollarSign, 
  Users,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data
const parkingSpaces = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  zone: ['A', 'B', 'C', 'D'][Math.floor(i / 25)],
  status: Math.random() > 0.3 ? 'occupied' : 'available',
  timeOccupied: Math.random() > 0.5 ? Math.floor(Math.random() * 240) : 0,
  vehicleType: ['car', 'truck', 'motorcycle'][Math.floor(Math.random() * 3)],
}));

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

const occupancyData = [
  { zone: 'Zone A', total: 25, occupied: 18, available: 7 },
  { zone: 'Zone B', total: 25, occupied: 22, available: 3 },
  { zone: 'Zone C', total: 25, occupied: 15, available: 10 },
  { zone: 'Zone D', total: 25, occupied: 20, available: 5 },
];

const generateMockVehicle = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const vehicleId = 
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    letters.charAt(Math.floor(Math.random() * letters.length)) +
    '-' +
    numbers.charAt(Math.floor(Math.random() * numbers.length)) +
    numbers.charAt(Math.floor(Math.random() * numbers.length)) +
    numbers.charAt(Math.floor(Math.random() * numbers.length));
  
  const zones = ['A', 'B', 'C', 'D'];
  const zone = zones[Math.floor(Math.random() * zones.length)];
  const spaceNumber = String(Math.floor(Math.random() * 25) + 1).padStart(2, '0');
  
  return {
    vehicleId,
    space: `${zone}-${spaceNumber}`,
    zone,
    timestamp: new Date()
  };
};

function Home() {
  const [activeTab, setActiveTab] = useState('overview');
  const [entryEvents, setEntryEvents] = useState([]);
  const [exitEvents, setExitEvents] = useState([]);

  const totalSpaces = parkingSpaces.length;
  const occupiedSpaces = parkingSpaces.filter(space => space.status === 'occupied').length;
  const availableSpaces = totalSpaces - occupiedSpaces;
  const occupancyRate = Math.round((occupiedSpaces / totalSpaces) * 100);

  // Simulate backend events for entry and exit
  useEffect(() => {
    const generateEvent = () => {
      const isEntry = Math.random() > 0.5;
      const mockData = generateMockVehicle();
      
      const event = {
        id: Date.now() + Math.random(),
        ...mockData,
        timeAgo: 'Just now'
      };

      if (isEntry) {
        setEntryEvents(prev => [event, ...prev.slice(0, 4)]);
      } else {
        setExitEvents(prev => [event, ...prev.slice(0, 4)]);
      }
    };

    const interval = setInterval(() => {
      generateEvent();
    }, Math.random() * 5000 + 3000);

    for (let i = 0; i < 3; i++) {
      setTimeout(generateEvent, i * 1000);
    }

    return () => clearInterval(interval);
  }, []);

  // Update time ago for events
  useEffect(() => {
    const updateTimeAgo = () => {
      const updateEvents = (events) => events.map(event => {
        const secondsAgo = Math.floor((new Date() - event.timestamp) / 1000);
        let timeAgo;
        
        if (secondsAgo < 60) {
          timeAgo = secondsAgo < 5 ? 'Just now' : `${secondsAgo}s ago`;
        } else if (secondsAgo < 3600) {
          timeAgo = `${Math.floor(secondsAgo / 60)}m ago`;
        } else {
          timeAgo = `${Math.floor(secondsAgo / 3600)}h ago`;
        }
        
        return { ...event, timeAgo };
      });

      setEntryEvents(prev => updateEvents(prev));
      setExitEvents(prev => updateEvents(prev));
    };

    const interval = setInterval(updateTimeAgo, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="tracking-tight text-sm">Total Spaces</h3>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl">{totalSpaces}</div>
              <p className="text-xs text-muted-foreground">Across 4 zones</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="tracking-tight text-sm">Occupied</h3>
              <Car className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl">{occupiedSpaces}</div>
              <p className="text-xs text-muted-foreground">{occupancyRate}% occupancy rate</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="tracking-tight text-sm">Available</h3>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl">{availableSpaces}</div>
              <p className="text-xs text-muted-foreground">Ready for new vehicles</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <h3 className="tracking-tight text-sm">Today's Revenue</h3>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl">$1,247</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12.5% from yesterday
              </p>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="space-y-6">
          <div className="inline-flex h-10 items-center justify-center rounded-md p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`
                inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 transition-all 
                duration-200 transform 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                disabled:pointer-events-none disabled:opacity-50
                ${
                  activeTab === 'overview'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:translate-y-[-2px]'
                }
              `}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`
                inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 transition-all 
                duration-200 transform 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                disabled:pointer-events-none disabled:opacity-50
                ${
                  activeTab === 'analytics'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:translate-y-[-2px]'
                }
              `}
            >
              Analytics
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Occupancy Status Chart */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl leading-none tracking-tight">Parking Occupancy by Zone</h3>
                    <p className="text-sm text-muted-foreground">
                      Current capacity vs occupied spaces across all zones
                    </p>
                  </div>
                  <div className="p-6 pt-0">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={occupancyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="zone" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="available" stackId="a" fill="#22c55e" name="Available" />
                        <Bar dataKey="occupied" stackId="a" fill="#ef4444" name="Occupied" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-6 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span>Available Spaces</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>Occupied Spaces</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Entry Status */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5 text-green-500" />
                      <h3 className="text-2xl leading-none tracking-tight">Entry Status</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Live vehicle entries
                    </p>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="space-y-3">
                      {entryEvents.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Waiting for entry events...</p>
                        </div>
                      ) : (
                        entryEvents.map((event) => (
                          <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200 animate-in slide-in-from-top-2 duration-300">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-green-800">Vehicle Entered</p>
                              <p className="text-xs text-green-600 truncate">
                                Space {event.space} • {event.timeAgo}
                              </p>
                            </div>
                            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-white border-green-300 text-green-700 shrink-0">
                              {event.vehicleId}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Exit Status */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <div className="flex items-center gap-2">
                      <ArrowLeft className="h-5 w-5 text-red-500" />
                      <h3 className="text-2xl leading-none tracking-tight">Exit Status</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Live vehicle exits
                    </p>
                  </div>
                  <div className="p-6 pt-0">
                    <div className="space-y-3">
                      {exitEvents.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Waiting for exit events...</p>
                        </div>
                      ) : (
                        exitEvents.map((event) => (
                          <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200 animate-in slide-in-from-top-2 duration-300">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-red-800">Vehicle Exited</p>
                              <p className="text-xs text-red-600 truncate">
                                Space {event.space} • {event.timeAgo}
                              </p>
                            </div>
                            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-white border-red-300 text-red-700 shrink-0">
                              {event.vehicleId}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl leading-none tracking-tight">Hourly Revenue</h3>
                    <p className="text-sm text-muted-foreground">
                      Revenue generated throughout the day
                    </p>
                  </div>
                  <div className="p-6 pt-0">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                        <Bar dataKey="revenue" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Zone Distribution */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl leading-none tracking-tight">Zone Distribution</h3>
                    <p className="text-sm text-muted-foreground">
                      Current occupancy by zone
                    </p>
                  </div>
                  <div className="p-6 pt-0">
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
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;