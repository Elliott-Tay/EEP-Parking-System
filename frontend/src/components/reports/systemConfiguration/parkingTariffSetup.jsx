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
  Clock,
  Settings,
  TrendingUp,
  BarChart3,
  Search
} from "lucide-react";

export default function ParkingTariffConfiguration() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");

  const getVehicleIcon = (name) => {
    if (name.includes("Car/Van") || name.includes("Hourly")) return Car;
    if (name.includes("Lorry") || name.includes("Season")) return Truck;
    if (name.includes("M/Cycle") || name.includes("Special")) return Bike;
    if (name.includes("Day Season")) return Sun;
    if (name.includes("Night Season")) return Moon;
    if (name.includes("URA Staff") || name.includes("Staff Estate")) return Shield;
    if (name.includes("Block")) return Settings;
    return Car;
  };

  const getVehicleColor = (name, index) => {
    const colors = [
      "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border-blue-200",
      "bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 border-orange-200", 
      "bg-gradient-to-br from-green-50 to-green-100 text-green-600 border-green-200",
      "bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-600 border-yellow-200",
      "bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 border-indigo-200",
      "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 border-purple-200",
      "bg-gradient-to-br from-red-50 to-red-100 text-red-600 border-red-200",
      "bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 border-teal-200",
      "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 border-amber-200",
      "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 border-slate-200"
    ];
    return colors[index % colors.length];
  };

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
    { name: "Tarriff setup for Class 1 Rates", path: "/tariff/edit/class1" },
    { name: "Tariff setup for Hourly (B)", path: "/tariff/edit/car-van-b" },
    { name: "Tariff setup for Season (B)", path: "/tariff/edit/lorry-b" },
    { name: "Tariff setup for Special (B)", path: "/tariff/edit/mcycle-b" },
    { name: "Tariff setup for Day Season (B)", path: "/tariff/edit/day-season-b" },
    { name: "Tariff setup for Night Season (B)", path: "/tariff/edit/night-season-b" },
    { name: "Tariff setup for URA Staff (B)", path: "/tariff/edit/URA-staff-b" },
    { name: "Tariff setup for CSPT (B)", path: "/tariff/edit/CSPT-b" },
    { name: "Tariff setup for Block 1 (B)", path: "/tariff/edit/block-1-b" },
    { name: "Tariff setup for Block 2 (B)", path: "/tariff/edit/block-2-b" },
    { name: "Tariff setup for Block 3 (B)", path: "/tariff/edit/block-3-b" },
    { name: "Tariff setup for Authorized (B)", path: "/tariff/edit/authorized-b" },
    { name: "Tariff setup for Staff Estate (Type A) (B)", path: "/tariff/edit/staff-a-b" },
    { name: "Tariff setup for Staff Estate (Type B) (B)", path: "/tariff/edit/staff-b-b" },
  ];

  const filteredEditableTariffs = editableTariffs.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TariffCard = ({ item, index, isEditMode = false }) => {
    const IconComponent = getVehicleIcon(item.name);
    const colorClass = getVehicleColor(item.name, index);

    return (
      <button
        onClick={() => navigate(item.path)}
        className="group relative w-full rounded-xl border-2 bg-white text-card-foreground transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 hover:border-blue-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-blue-100/0 group-hover:from-blue-50/50 group-hover:via-blue-50/30 group-hover:to-blue-100/50 transition-all duration-300 pointer-events-none" />
        
        <div className="relative p-5">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl border-2 ${colorClass} group-hover:scale-110 transition-all duration-300 shadow-sm`}>
              <IconComponent className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <h4 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors duration-300">
                {item.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {isEditMode ? 'Configure and modify pricing settings' : 'Review current tariff configuration'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`h-1.5 w-1.5 rounded-full ${isEditMode ? 'bg-green-500' : 'bg-blue-500'}`} />
                <span className="text-xs font-medium text-muted-foreground">
                  {isEditMode ? 'Full Access' : 'Read Only'}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                {isEditMode ? (
                  <Edit className="h-5 w-5 text-blue-500" />
                ) : (
                  <Eye className="h-5 w-5 text-blue-500" />
                )}
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/20">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2.5 rounded-xl hover:bg-red-50 transition-all duration-200 hover:shadow-md border border-transparent hover:border-red-200 group"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-red-600 transition-colors" />
              </button>
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-200">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Parking Tariff Configuration
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Configure pricing structures for different vehicle types and categories
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-300" />
              <span className="text-sm font-medium text-green-700">System Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/30 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-blue-500 shadow-md">
                  <Car className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-blue-700">Vehicle Types</span>
              </div>
              <p className="text-3xl font-bold text-blue-900 mb-1">10</p>
              <p className="text-xs text-blue-600">Configured categories</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-5 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/30 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-green-500 shadow-md">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-700">System Status</span>
              </div>
              <p className="text-3xl font-bold text-green-900 mb-1">Active</p>
              <p className="text-xs text-green-600">All tariffs operational</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-5 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/30 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-orange-500 shadow-md">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-orange-700">Last Updated</span>
              </div>
              <p className="text-3xl font-bold text-orange-900 mb-1">Today</p>
              <p className="text-xs text-orange-600">Recent configuration</p>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/30 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-purple-500 shadow-md">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-purple-700">Total Configs</span>
              </div>
              <p className="text-xs text-purple-600">Active configurations</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

          {/* Editable Tariff Setup */}
          <div className="rounded-2xl border-2 bg-white shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                  <Edit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Tariff Setup</h3>
                  <p className="text-sm text-green-100 mt-0.5">Configure and modify tariff settings</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Info Banner */}
              <div className="mb-6 rounded-xl p-4 bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-500 shadow-md">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-green-900">Configuration Access</p>
                    <p className="text-sm text-green-700 mt-1">
                      You can view and modify tariff configurations. Changes will affect the billing system.
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search tariff configurations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-200 outline-none"
                  />
                </div>
              </div>

              {/* Tariff Cards - Scrollable */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar mb-6">
                {filteredEditableTariffs.length > 0 ? (
                  filteredEditableTariffs.map((item, index) => (
                    <TariffCard 
                      key={index} 
                      item={item} 
                      index={index} 
                      isEditMode={true}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No tariff configurations found</p>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Edit className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-slate-700">Edit Mode Statistics</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Configurations</p>
                    <p className="text-xl font-bold text-green-600">{editableTariffs.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Access Level</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <p className="font-semibold text-green-600">Full Edit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border-2 bg-white shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
                <p className="text-sm text-slate-300 mt-0.5">Navigate to different sections quickly</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/")}
                className="group relative overflow-hidden rounded-xl border-2 border-slate-200 bg-white p-6 hover:border-red-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/0 to-red-100/0 group-hover:from-red-50/50 group-hover:to-red-100/50 transition-all duration-300" />
                <div className="relative flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-red-100 group-hover:to-red-200 transition-all duration-300">
                    <Home className="h-6 w-6 text-slate-600 group-hover:text-red-600 transition-colors" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-700 group-hover:text-red-600 transition-colors">Dashboard</p>
                    <p className="text-xs text-muted-foreground">Return home</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => navigate("/configuration")}
                className="group relative overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/0 to-blue-200/0 group-hover:from-blue-100/80 group-hover:to-blue-200/80 transition-all duration-300" />
                <div className="relative flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-blue-700">Configuration</p>
                    <p className="text-xs text-blue-600">System settings</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate("/reports")}
                className="group relative overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 hover:border-purple-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/0 to-purple-200/0 group-hover:from-purple-100/80 group-hover:to-purple-200/80 transition-all duration-300" />
                <div className="relative flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-purple-700">Reports</p>
                    <p className="text-xs text-purple-600">View analytics</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
