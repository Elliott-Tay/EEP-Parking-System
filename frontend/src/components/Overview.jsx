import { ArrowRight, ArrowLeft, Clock } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function OverviewTab({ entryEvents, exitEvents, occupancyData }) {
  return (
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
            <ResponsiveContainer width="100%" height={400}>
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
        <StatusCard
          title="Entry Status"
          icon={<ArrowRight className="h-5 w-5 text-green-500" />}
          events={entryEvents}
          type="entry"
        />

        {/* Exit Status */}
        <StatusCard
          title="Exit Status"
          icon={<ArrowLeft className="h-5 w-5 text-red-500" />}
          events={exitEvents}
          type="exit"
        />
      </div>
    </div>
  );
}

// Status Card Subcomponent
function StatusCard({ title, icon, events, type }) {
  const colors = type === 'entry'
    ? { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', subtext: 'text-green-600', pulse: 'bg-green-500' }
    : { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', subtext: 'text-red-600', pulse: 'bg-red-500' };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-2xl leading-none tracking-tight">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">Live vehicle {type === 'entry' ? 'entries' : 'exits'}</p>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Waiting for {type} events...</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className={`flex items-center gap-3 p-3 rounded-lg ${colors.bg} border ${colors.border} animate-in slide-in-from-top-2 duration-300`}>
                <div className={`w-6 h-6 rounded-full ${colors.pulse} animate-pulse`}></div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${colors.text}`}>Vehicle {type === 'entry' ? 'Entered' : 'Exited'}</p>
                  <p className={`text-xs ${colors.subtext} truncate`}>
                    Space {event.space} • {event.timeAgo}
                  </p>
                </div>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-white border-${colors.border.split('-')[1]} text-${colors.text.split('-')[1]} shrink-0`}>
                  {event.vehicleId}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
