import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  ArrowLeft, 
  DollarSign, 
  Car, 
  Truck, 
  Bike, 
  Sun, 
  Moon,
  Eye,
  Edit,
  ExternalLink,
  Shield,
  Clock
} from "lucide-react";

export default function ParkingTariffConfiguration() {
  const navigate = useNavigate();

  const getVehicleIcon = (name) => {
    if (name.includes("Car/Van")) return Car;
    if (name.includes("Lorry")) return Truck;
    if (name.includes("M/Cycle")) return Bike;
    if (name.includes("Day Season")) return Sun;
    if (name.includes("Night Season")) return Moon;
    return Car;
  };

  const getVehicleColor = (name, index) => {
    const colors = [
      "bg-blue-100 text-blue-600 border-blue-200",
      "bg-orange-100 text-orange-600 border-orange-200", 
      "bg-green-100 text-green-600 border-green-200",
      "bg-yellow-100 text-yellow-600 border-yellow-200",
      "bg-indigo-100 text-indigo-600 border-indigo-200",
      "bg-purple-100 text-purple-600 border-purple-200",
      "bg-red-100 text-red-600 border-red-200",
      "bg-teal-100 text-teal-600 border-teal-200",
      "bg-amber-100 text-amber-600 border-amber-200",
      "bg-slate-100 text-slate-600 border-slate-200"
    ];
    return colors[index % colors.length];
  };

  const viewOnlyTariffs = [
    { name: "Tariff setup for Hourly", path: "/tariff/view/car-van" },
    { name: "Tariff setup for Season", path: "/tariff/view/lorry" },
    { name: "Tariff setup for M/Cycle", path: "/tariff/view/mcycle" },
    { name: "Tariff setup for Day Season", path: "/tariff/view/day-season" },
    { name: "Tariff setup for Night Season", path: "/tariff/view/night-season" },
    { name: "Tariff setup for Car/Van (B)", path: "/tariff/view/car-van-b" },
    { name: "Tariff setup for Lorry (B)", path: "/tariff/view/lorry-b" },
    { name: "Tariff setup for M/Cycle (B)", path: "/tariff/view/mcycle-b" },
    { name: "Tariff setup for Day Season (B)", path: "/tariff/view/day-season-b" },
    { name: "Tariff setup for Night Season (B)", path: "/tariff/view/night-season-b" },
  ];

  const editableTariffs = [
    { name: "Tariff setup for Hourly", path: "/tariff/edit/car-van" },
    { name: "Tariff setup for Season", path: "/tariff/edit/lorry" },
    { name: "Tariff setup for Special", path: "/tariff/edit/mcycle" },
    { name: "Tariff setup for Day Season", path: "/tariff/edit/day-season" },
    { name: "Tariff setup for Night Season", path: "/tariff/edit/night-season" },
    { name: "Tariff setup for URA Staff", path: "/tariff/edit/URA-staff" },
    { name: "Tariff setup for CSPT", path: "/tariff/edit/CSPT" },
    { name: "Tariff setup for Block 1", path: "/tariff/edit/Block-1" },
    { name: "Tariff setup for Block 2", path: "/tariff/edit/Block-2" },
    { name: "Tariff setup for Block 3", path: "/tariff/edit/Block-3" },
    { name: "Tariff setup for Authorized", path: "/tariff/edit/authorized" },
    { name: "Tariff setup for Staff Estate (Type A)", path: "/tariff/edit/staff-a" },
    { name: "Tariff setup for Staff Estate (Type B)", path: "/tariff/edit/staff-b" },
    { name: "Tariff setup for Hourly (B)", path: "/tariff/edit/car-van-b" },
    { name: "Tariff setup for Season (B)", path: "/tariff/edit/lorry-b" },
    { name: "Tariff setup for Special (B)", path: "/tariff/edit/mcycle-b" },
    { name: "Tariff setup for Day Season (B)", path: "/tariff/edit/day-season-b" },
    { name: "Tariff setup for Night Season (B)", path: "/tariff/edit/night-season-b" },
    { name: "Tariff setup for URA Staff (B)", path: "/tariff/edit/URA-staff-b" },
    { name: "Tariff setup for CSPT (B)", path: "/tariff/edit/CSPT-b" },
    { name: "Tariff setup for Block 1 (B)", path: "/tariff/edit/block-1-b" },
  ];

  const TariffCard = ({ item, index, isEditMode = false }) => {
    const IconComponent = getVehicleIcon(item.name);
    const colorClass = getVehicleColor(item.name, index);
    
    return (
      <button
        onClick={() => navigate(item.path)}
        className="group relative w-full rounded-lg border bg-card text-card-foreground transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:scale-[1.02] cursor-pointer"
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg border ${colorClass} group-hover:scale-110 transition-transform duration-200`}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {item.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {isEditMode ? 'Configure pricing settings' : 'View current configuration'}
              </p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {isEditMode ? (
                <Edit className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
          
          {/* Action indicator */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="p-2 rounded-lg bg-red-100 border border-red-200">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl">Parking Tariff Configuration</h1>
              <p className="text-muted-foreground">Configure pricing structures for different vehicle types</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>System Configuration</span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* View Only Tariff Setup */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 border-blue-200">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg leading-none tracking-tight">Tariff Setup (View Only)</h3>
                  <p className="text-sm text-muted-foreground">Review current tariff configurations</p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              {/* Info Banner */}
              <div className="mb-6 rounded-lg p-4 bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Read-Only Access</p>
                    <p className="text-sm text-blue-700 mt-1">
                      You can view current tariff settings but cannot make changes in this mode.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tariff Cards */}
              <div className="space-y-3">
                {viewOnlyTariffs.map((item, index) => (
                  <TariffCard 
                    key={index} 
                    item={item} 
                    index={index} 
                    isEditMode={false}
                  />
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">View Mode Statistics</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Configurations</p>
                    <p className="font-semibold">{viewOnlyTariffs.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Access Level</p>
                    <p className="font-semibold text-blue-600">Read-Only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Tariff Setup */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 border-green-200">
                  <Edit className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg leading-none tracking-tight">Tariff Setup (Editable)</h3>
                  <p className="text-sm text-muted-foreground">Configure and modify tariff settings</p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              {/* Info Banner */}
              <div className="mb-6 rounded-lg p-4 bg-green-50 border border-green-200">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Configuration Access</p>
                    <p className="text-sm text-green-700 mt-1">
                      You can view and modify tariff configurations. Changes will affect the billing system.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tariff Cards */}
              <div className="space-y-3">
                {editableTariffs.map((item, index) => (
                  <TariffCard 
                    key={index} 
                    item={item} 
                    index={index} 
                    isEditMode={true}
                  />
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2 mb-2">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Edit Mode Statistics</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Configurations</p>
                    <p className="font-semibold">{editableTariffs.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Access Level</p>
                    <p className="font-semibold text-green-600">Full Edit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="mt-8 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6 pb-4">
            <h3 className="text-lg leading-none tracking-tight">System Overview</h3>
            <p className="text-sm text-muted-foreground">Current tariff system statistics and quick actions</p>
          </div>
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Vehicle Types</span>
                </div>
                <p className="text-2xl font-semibold text-blue-900">10</p>
                <p className="text-xs text-blue-700">Configured categories</p>
              </div>
              
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">System Status</span>
                </div>
                <p className="text-lg font-semibold text-green-900">Active</p>
                <p className="text-xs text-green-700">All tariffs operational</p>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Last Updated</span>
                </div>
                <p className="text-lg font-semibold text-yellow-900">Today</p>
                <p className="text-xs text-yellow-700">Recent configuration</p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Total Configs</span>
                </div>
                <p className="text-2xl font-semibold text-purple-900">20</p>
                <p className="text-xs text-purple-700">View + Edit modes</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-6 py-3 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 flex-1 sm:flex-none"
              >
                <Home className="h-4 w-4" />
                Return to Dashboard
              </button>
              
              <button
                onClick={() => navigate("/configuration")}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow hover:shadow-md flex-1 sm:flex-none"
              >
                <DollarSign className="h-4 w-4" />
                System Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}