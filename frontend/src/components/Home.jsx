import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ToastContainer } from "react-toastify";
import ThreeColumnPanel from './ThreeColumnPanel';
import MovementsTable from './MovementsTable';
import Overview from './Overview';
import Operations from './Operations';

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
      <ToastContainer position="top-right" autoClose={4000} />
      <div className="p-6">
        {/* Stats Cards */}
        <ThreeColumnPanel />

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
              onClick={() => setActiveTab('movements')}
              className={`
                inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 transition-all 
                duration-200 transform 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                disabled:pointer-events-none disabled:opacity-50
                ${
                  activeTab === 'movements'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:translate-y-[-2px]'
                }
              `}
            >
              Movements
            </button>
            <button
              onClick={() => setActiveTab('operations')}
              className={`
                inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 transition-all 
                duration-200 transform 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                disabled:pointer-events-none disabled:opacity-50
                ${
                  activeTab === 'operations'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 hover:translate-y-[-2px]'
                }
              `}
            >
              Operations
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
            <Overview 
              entryEvents={entryEvents} 
              exitEvents={exitEvents} 
              occupancyData={occupancyData} 
            />
          )}

          {/* Movement Tab */}
          {activeTab === 'movements' && (
            <div className="overflow-x-auto">
              <MovementsTable />
            </div>
          )}

          {/* Operations Tab */}
          {activeTab === "operations" && (
            <div className="overflow-x-auto">
              <Operations />
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