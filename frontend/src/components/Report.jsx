import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  DollarSign, 
  BarChart3, 
  History, 
  CreditCard, 
  FileText, 
  Calendar, 
  Car, 
  AlertTriangle,
  Eye,
  Filter,
  Search,
  Clock,
  TrendingUp,
  Activity,
  Shield,
  ExternalLink,
  ChevronDown,
  Settings,
  Wrench
} from "lucide-react";

export default function ReportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const dropdownMenus = [
    // 1️⃣ System Setup
    {
      name: "System Setup",
      icon: Settings,
      color: "bg-blue-100 text-blue-600 border-blue-200",
      items: [
        { name: "Public Holidays", href: "/config/holiday-setup" },
        { name: "Parking Tariffs", href: "/config/parking-tariff" },
        { name: "Upload Tariff Image", href: "/config/tariff-image-upload" },
        { name: "Authorized Cars", href: "/config/authorized-cars"}
      ]
    },

    // 2️⃣ Season Management
    {
      name: "Season Management",
      icon: Calendar,
      color: "bg-indigo-100 text-indigo-600 border-indigo-200",
      items: [
        { name: "Season Pass Master", href: "/config/season-master" },
        { name: "Update Season Pass", href: "/config/season-update" },
        { name: "Change Season Number", href: "/config/change-season-no" },
        { name: "Register Multiple Seasons", href: "/config/multiple-season-register" },
        { name: "Search Season Pass", href: "/config/check-search-season" },
        { name: "Season Master History", href: "/enquiry/season-master-history" }
      ]
    },

    // 3️⃣ Transactions & Enquiry
    {
      name: "Transactions & Enquiry",
      icon: Search,
      color: "bg-green-100 text-green-600 border-green-200",
      items: [
        { name: "Vehicle Movement Log", href: "/enquiry/movement-transaction" },
        { name: "Admin Movement Transactions", href: "/enquiry/admin-movement-transaction" },
        { name: "Entry Records", href: "/enquiry/entry-transaction" },
        { name: "Valid Exit Transactions", href: "/enquiry/exit-valid-transaction" },
        { name: "Invalid Exit Details", href: "/enquiry/exit-invalid-detail" },
        { name: "Complimentary Passes", href: "/enquiry/complimentary" },
        { name: "Redemption Records", href: "/enquiry/redemption" },
        { name: "Vehicles Parked >72 Hours", href: "/enquiry/vehicles-72-hours" }
      ]
    },

    // 4️⃣ Payments & Settlement
    {
      name: "Payments & Settlement",
      icon: CreditCard,
      color: "bg-purple-100 text-purple-600 border-purple-200",
      items: [
        // --- VCC / EZPay ---
        { name: "VCC Config", href: "/vcc-ezpay/vcc-config" },
        { name: "VCC Whitelist", href: "/vcc-ezpay/vcc-whitelist" },
        { name: "VCC Exit Transactions", href: "/vcc-ezpay/vcc-exit-transaction" },
        { name: "VCC Settlement Report", href: "/vcc-ezpay/vcc-settlement-file" },
        { name: "VCC Collection Comparison", href: "/vcc-ezpay/vcc-collection-comparison" },
        { name: "EZPay Whitelist", href: "/vcc-ezpay/ezp-whitelist" },
        { name: "EZPay Exit Transactions", href: "/vcc-ezpay/ezp-exit-transaction" },
        { name: "EZPay Settlement Report", href: "/vcc-ezpay/ezp-settlement-file" },
        { name: "EZPay Collection Comparison", href: "/vcc-ezpay/ezp-collection-comparison" },

        // --- Outstanding ---
        { name: "Settlement Files", href: "/outstanding/settlement-file" },
        { name: "Acknowledgement Files", href: "/outstanding/acknowledge-file" },
        { name: "Summary Files", href: "/outstanding/summary-file" },
        { name: "LTA Collection Files", href: "/outstanding/lta-collection-file" },
        { name: "LTA Acknowledge Files", href: "/outstanding/lta-acknowledge-file" },
        { name: "LTA Result Files", href: "/outstanding/lta-result-file" },
        { name: "Outstanding Movement Transactions", href: "/outstanding/movement-transaction" }
      ]
    },

    // 5️⃣ Reports & Analytics
    {
      name: "Reports & Analytics",
      icon: BarChart3,
      color: "bg-yellow-100 text-yellow-600 border-yellow-200",
      items: [
        { name: "Collection File Report", href: "/enquiry/collection-file-report" },
        { name: "Collection Acknowledgement Summary", href: "/enquiry/collection-file-ack-sum" },
        { name: "LCSC Collection Comparison", href: "/enquiry/lcsc-collection-comparison" },
        { name: "Hourly Occupancy Report", href: "/enquiry/hourly-max-occupancy" },
        { name: "Tailgate Incidents", href: "/enquiry/tailgate-report" },
        { name: "IU Frequency Report", href: "/enquiry/iu-frequency-report" },
        { name: "EPS Performance Report", href: "/enquiry/eps-performance" },
        { name: "UPOS Collection File Report", href: "/enquiry/upos-collection-file" },
        { name: "UPOS Collection Summary", href: "/enquiry/upos-collection-report" }
      ]
    },

    // 6️⃣ Maintenance & Security
    {
      name: "Maintenance & Security",
      icon: Wrench,
      color: "bg-red-100 text-red-600 border-red-200",
      items: [
        { name: "User Access Control", href: "/maintenance/access-control" },
        { name: "Change Password", href: "/maintenance/change-password" },
        { name: "Function Audit Log", href: "/maintenance/function-audit" },
        { name: "System Logs", href: "/maintenance/view-log" }
      ]
    }
  ];


  const handleDropdownClick = (e, dropdownName) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleDropdownItemClick = (href) => {
    navigate(href);
    setOpenDropdown(null);
  };

  const reportCategories = [
    {
      id: 1,
      title: "Payments & Settlements",
      icon: DollarSign,
      color: "bg-green-100 text-green-600 border-green-200",
      description: "Financial reports and payment analysis",
      reports: [
        { id: 1, name: "Daily Settlements", description: "Complete daily payment settlement", icon: FileText, route: "/reports/daily-settlement" },
        { id: 2, name: "Acknowledgment Analysis", description: "Payment acknowledgment analysis", icon: BarChart3, route: "/reports/ack-sum-analysis" },
        { id: 3, name: "Daily Summary", description: "Consolidated daily payment report", icon: TrendingUp, route: "/reports/daily-summary" },
        { id: 4, name: "Cashcard Collections", description: "Cashcard transaction summary", icon: CreditCard, route: "/reports/cashcard-collection" }
      ]
    },
    {
      id: 2,
      title: "Traffic & Transactions",
      icon: Activity,
      color: "bg-blue-100 text-blue-600 border-blue-200",
      description: "Traffic flow and transaction monitoring",
      reports: [
        { id: 5, name: "Daily Counter Stats", description: "Daily vehicle movement statistics", icon: BarChart3, route: "/reports/counter-daily" },
        { id: 6, name: "Monthly Counter Stats", description: "Monthly traffic analysis", icon: Calendar, route: "/reports/counter-monthly" },
        { id: 7, name: "Movement Logs", description: "Detailed vehicle movement logs", icon: Activity, route: "/reports/movement-details" },
        { id: 8, name: "Parking Duration Analysis", description: "Average parking duration analysis", icon: Clock, route: "/reports/parking-duration" },
        { id: 9, name: "Admin Movement Transactions", description: "Admin view of movement transactions", icon: Activity, route: "/reports/movement-transactions-admin" }
      ]
    },
    {
      id: 3,
      title: "Audit & History",
      icon: Shield,
      color: "bg-purple-100 text-purple-600 border-purple-200",
      description: "System audit trails and historical data",
      reports: [
        { id: 10, name: "Remote Control Logs", description: "System control operation logs", icon: History, route: "/reports/remote-control-history" },
        { id: 11, name: "Station Error Logs", description: "Equipment error and maintenance logs", icon: AlertTriangle, route: "/reports/station-errors" },
        { id: 12, name: "Lot Status History", description: "Parking lot status change history", icon: ExternalLink, route: "/reports/lot-status-history" }
      ]
    },
    {
      id: 4,
      title: "Season Parking Reports",
      icon: Car,
      color: "bg-orange-100 text-orange-600 border-orange-200",
      description: "Season parking management reports",
      reports: [
        { id: 13, name: "Season Card Database", description: "Season card holder database", icon: CreditCard, route: "/reports/season-master" },
        { id: 14, name: "Season Transactions", description: "Season parking transaction logs", icon: FileText, route: "/reports/season-transactions" },
        { id: 15, name: "Expiring Seasons", description: "Expiring season card alerts", icon: Calendar, route: "/reports/expiring-season" }
      ]
    },
    {
      id: 5,
      title: "Other Reports",
      icon: FileText,
      color: "bg-gray-100 text-gray-600 border-gray-200",
      description: "Additional system reports",
      reports: [
        { id: 15, name: "Complimentary Tickets", description: "Complimentary ticket usage report", icon: FileText, route: "/reports/ticket-complimentary" },
        { id: 16, name: "NETS Comparison", description: "NETS payment comparison analysis", icon: BarChart3, route: "/reports/nets-comparison" }
      ]
    }
  ];

  const handleGenerateReport = (report) => {
    // Navigate to the specific report route
    navigate(report.route);
  };

  const handlePreviewReport = (report) => {
    // Navigate to preview mode for the report
    navigate(`${report.route}/preview`);
  };

  const filteredCategories = reportCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.reports.some(report => 
      report.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl">Parking Management Reports</h1>
              <p className="text-muted-foreground">Generate and download comprehensive parking system reports</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 h-9 px-3 py-1 rounded-md border border-input bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
            <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1 h-8 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-wrap gap-4">
        {dropdownMenus.map((dropdown) => {
            const IconComponent = dropdown.icon;
            const isOpen = openDropdown === dropdown.name;

            return (
            <div key={dropdown.name} className="relative">
                {/* Dropdown Button */}
                <button
                onClick={(e) => handleDropdownClick(e, dropdown.name)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                >
                <div className={`p-1.5 rounded-md border ${dropdown.color}`}>
                    <IconComponent className="h-4 w-4" />
                </div>
                <span className="font-medium">{dropdown.name}</span>
                <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
                </button>

                {/* Dropdown Items */}
                {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border-2 border-gray-300 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-2">
                    <div className={`p-1.5 rounded-md border ${dropdown.color}`}>
                        <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{dropdown.name}</p>
                        <p className="text-xs text-gray-500">{dropdown.items.length} options</p>
                    </div>
                    </div>

                    <div className="py-1">
                    {dropdown.items.map((item, index) => (
                        <button
                        key={item.name}
                        onClick={() => handleDropdownItemClick(item.href)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-3"
                        >
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0"></div>
                        <span className="flex-1">{item.name}</span>
                        <div className="text-xs text-gray-400">#{index + 1}</div>
                        </button>
                    ))}
                    </div>
                </div>
                )}
            </div>
            );
        })}
        </div>
    
      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Reports</p>
                <p className="text-lg font-semibold">4</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Movement Reports</p>
                <p className="text-lg font-semibold">4</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Shield className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Audit Reports</p>
                <p className="text-lg font-semibold">3</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Car className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Season Reports</p>
                <p className="text-lg font-semibold">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {/* Category Header */}
                <div className="flex flex-col space-y-1.5 p-6 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${category.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg leading-none tracking-tight">{category.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    </div>
                  </div>
                </div>

                {/* Reports List */}
                <div className="p-6 pt-0">
                  <div className="space-y-2">
                    {category.reports.map((report) => {
                      const ReportIcon = report.icon;
                      return (
                        <div
                          key={report.id}
                          className="group p-3 rounded-lg border border-transparent hover:border-border hover:bg-accent/50 transition-all duration-200 cursor-pointer"
                          onClick={() => handleGenerateReport(report)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-md bg-muted group-hover:bg-background transition-colors">
                              <ReportIcon className="h-3.5 w-3.5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm group-hover:text-foreground transition-colors">
                                {report.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {report.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                className="p-1.5 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
                                title="Preview Report"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePreviewReport(report);
                                }}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              <button
                                className="p-1.5 rounded-md hover:bg-green-600 hover:text-white transition-colors"
                                title="View Report"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(report.route);
                                }}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category Footer */}
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
                    <span>{category.reports.length} reports available</span>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      <span>Real-time data</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}