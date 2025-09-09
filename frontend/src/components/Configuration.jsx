import { useState } from 'react';
import { 
  Settings, 
  Wifi, 
  MessageSquare, 
  FileText, 
  DollarSign, 
  Calendar, 
  Car,
  Send,
  Check,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

function ConfigurationPage() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activityLog, setActivityLog] = useState([]);

  const stations = [
    { id: 1, name: "Station 1", status: "online", location: "Main Entrance" },
    { id: 2, name: "Station 2", status: "online", location: "Side Gate" },
    { id: 3, name: "Station 3", status: "maintenance", location: "Exit Gate" }
  ];

  const options = [
    { id: 1, name: "Parameter", icon: Settings, description: "System parameters and settings" },
    { id: 2, name: "Message", icon: MessageSquare, description: "Configure display messages" },
    { id: 3, name: "TR Format", icon: FileText, description: "Transaction report formatting" },
    { id: 4, name: "Station Setup", icon: Wifi, description: "Hardware configuration" },
    { id: 5, name: "Tariff", icon: DollarSign, description: "Pricing and fee structure" },
    { id: 6, name: "Holiday", icon: Calendar, description: "Holiday schedules" },
    { id: 7, name: "X_Tariff", icon: DollarSign, description: "Extended tariff options" },
    { id: 8, name: "Vehicle Type", icon: Car, description: "Vehicle classification settings" }
  ];

  const handleSend = async () => {
    if (!selectedStation || !selectedOption) {
        alert("Please select both a station and an option before sending.");
        return;
    }

    setIsLoading(true);

    try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const timestamp = new Date().toLocaleTimeString();
        const newEntry = {
        station: selectedStation,
        option: selectedOption,
        time: timestamp
        };
        
        // call API ending point to store config changes in database

        // append to activity log
        setActivityLog(prev => [newEntry, ...prev]);

        // reset selections
        setSelectedStation(null);
        setSelectedOption(null);
    } catch (error) {
        console.error('Send failed:', error);
    } finally {
        setIsLoading(false);
    }
    };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-muted-foreground" />
          <div>
            <h1 className="text-2xl">Configuration Management</h1>
            <p className="text-muted-foreground">Configure station parameters and system settings</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Status Summary */}
        {activityLog.length > 0 && (
            <div className="mb-6 rounded-lg border bg-green-50 border-green-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                <Check className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-800">Configuration Sent Successfully</h3>
                </div>
                <p className="text-sm text-green-700">
                Sent "{activityLog[0].option.name}" configuration to {activityLog[0].station.name} at {activityLog[0].time}
                </p>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stations to Operate */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl leading-none tracking-tight">Stations to Operate</h3>
              <p className="text-sm text-muted-foreground">
                Select the target station for configuration
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-3">
                {stations.map((station) => (
                  <div
                    key={station.id}
                    onClick={() => setSelectedStation(station)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedStation?.id === station.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{station.name}</h4>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(station.status)}`}>
                            {station.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{station.location}</p>
                      </div>
                      {selectedStation?.id === station.id && (
                        <ChevronRight className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration Options */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl leading-none tracking-tight">Configuration Options</h3>
              <p className="text-sm text-muted-foreground">
                Choose the configuration type to send
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-2">
                {options.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <div
                      key={option.id}
                      onClick={() => setSelectedOption(option)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm ${
                        selectedOption?.id === option.id
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border bg-background hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md ${
                          selectedOption?.id === option.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{option.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{option.description}</p>
                        </div>
                        {selectedOption?.id === option.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl leading-none tracking-tight">Send Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Review and send the selected configuration
              </p>
            </div>
            <div className="p-6 pt-0 space-y-4">
              {/* Selection Summary */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-1">Selected Station:</p>
                  {selectedStation ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedStation.name}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(selectedStation.status)}`}>
                        {selectedStation.status}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No station selected</p>
                  )}
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium mb-1">Selected Option:</p>
                  {selectedOption ? (
                    <div className="flex items-center gap-2">
                      <selectedOption.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedOption.name}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No option selected</p>
                  )}
                </div>
              </div>

              {/* Warning */}
              {(!selectedStation || !selectedOption) && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Selection Required</p>
                    <p className="text-xs text-yellow-700">Please select both a station and configuration option before sending.</p>
                  </div>
                </div>
              )}

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!selectedStation || !selectedOption || isLoading}
                className={`w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  !selectedStation || !selectedOption || isLoading
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700 shadow hover:shadow-md'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Configuration
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl leading-none tracking-tight">Recent Configuration Activity</h3>
            <p className="text-sm text-muted-foreground">
              Latest configuration changes sent to stations
            </p>
          </div>
          <div className="p-6 pt-0">
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Station</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Configuration</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                    {activityLog.length > 0 ? (
                        activityLog.map((entry, index) => (
                        <tr key={index}>
                            <td className="px-4 py-3 text-sm">{entry.time}</td>
                            <td className="px-4 py-3 text-sm font-medium">{entry.station.name}</td>
                            <td className="px-4 py-3 text-sm">{entry.option.name}</td>
                            <td className="px-4 py-3">
                            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                                <Check className="h-3 w-3 mr-1" />
                                Sent
                            </span>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No recent configuration activity
                        </td>
                        </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigurationPage;