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
  Download,
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
    {
      name: "System Configuration",
      icon: Settings,
      color: "bg-blue-100 text-blue-600 border-blue-200",
      items: [
        { name: "Holiday Setup", href: "/config/holiday-setup" },
        { name: "Parking Tariff Setup", href: "/config/parking-tariff" },
        { name: "Season Master", href: "/config/season-master" },
        { name: "Season Update", href: "/config/season-update" },
        { name: "Change Season No", href: "/config/change-season-no" },
        { name: "Multiple Season Register", href: "/config/multiple-season-register" },
        { name: "Check/Search Season", href: "/config/check-search-season" }
      ]
    },
    {
      name: "Enquiry",
      icon: Search,
      color: "bg-green-100 text-green-600 border-green-200",
      items: [
        { name: "Movement Transaction", href: "/enquiry/movement-transaction" },
        { name: "Entry Transaction", href: "/enquiry/entry-transaction" },
        { name: "Exit Valid Transaction", href: "/enquiry/exit-valid-transaction" },
        { name: "Exit Invalid Transaction Detail", href: "/enquiry/exit-invalid-detail" },
        { name: "Exit Invalid Transaction Summary", href: "/enquiry/exit-invalid-summary" },
        { name: "Complimentary", href: "/enquiry/complimentary" },
        { name: "Season Master History", href: "/enquiry/season-master-history" },
        { name: "Collection File Report", href: "/enquiry/collection-file-report" },
        { name: "Collection File Ack/Sum", href: "/enquiry/collection-file-ack-sum" },
        { name: "LCSC Collection Comparison", href: "/enquiry/lcsc-collection-comparison" },
        { name: "Hourly Max Occupancy Report", href: "/enquiry/hourly-max-occupancy" },
        { name: "Tailgate Report", href: "/enquiry/tailgate-report" },
        { name: "IU Frequency Report", href: "/enquiry/iu-frequency-report" },
        { name: "Vehicles Parked More Than 72 Hours", href: "/enquiry/vehicles-72-hours" },
        { name: "EPS Performance Report", href: "/enquiry/eps-performance" },
        { name: "UPOS Collection File Report", href: "/enquiry/upos-collection-file" },
        { name: "UPOS Collection Report", href: "/enquiry/upos-collection-report" }
      ]
    },
    {
      name: "VCC/EZPay",
      icon: CreditCard,
      color: "bg-purple-100 text-purple-600 border-purple-200",
      items: [
        { name: "VCC Whitelist", href: "/vcc-ezpay/vcc-whitelist" },
        { name: "VCC Exit Transaction", href: "/vcc-ezpay/vcc-exit-transaction" },
        { name: "VCC Settlement File Report", href: "/vcc-ezpay/vcc-settlement-file" },
        { name: "VCC Collection Comparison", href: "/vcc-ezpay/vcc-collection-comparison" },
        { name: "EZP Whitelist", href: "/vcc-ezpay/ezp-whitelist" },
        { name: "EZP Exit Transaction", href: "/vcc-ezpay/ezp-exit-transaction" },
        { name: "EZP Settlement File Report", href: "/vcc-ezpay/ezp-settlement-file" },
        { name: "EZP Collection Comparison", href: "/vcc-ezpay/ezp-collection-comparison" }
      ]
    },
    {
      name: "Outstanding",
      icon: FileText,
      color: "bg-orange-100 text-orange-600 border-orange-200",
      items: [
        { name: "Settlement File", href: "/outstanding/settlement-file" },
        { name: "Acknowledge File", href: "/outstanding/acknowledge-file" },
        { name: "Summary File", href: "/outstanding/summary-file" },
        { name: "LTA Collection File", href: "/outstanding/lta-collection-file" },
        { name: "LTA Acknowledge File", href: "/outstanding/lta-acknowledge-file" },
        { name: "LTA Result File", href: "/outstanding/lta-result-file" },
        { name: "Movement Transaction", href: "/outstanding/movement-transaction" }
      ]
    },
    {
      name: "System Maintenance",
      icon: Wrench,
      color: "bg-red-100 text-red-600 border-red-200",
      items: [
        { name: "Access Control", href: "/maintenance/access-control" },
        { name: "Change Password", href: "/maintenance/change-password" },
        { name: "Function Audit", href: "/maintenance/function-audit" },
        { name: "View Log", href: "/maintenance/view-log" }
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
      title: "Payment Collection",
      icon: DollarSign,
      color: "bg-green-100 text-green-600 border-green-200",
      description: "Financial reports and payment analysis",
      reports: [
        { id: 1, name: "Daily Settlement File", description: "Complete daily payment settlement", icon: FileText, route: "/reports/daily-settlement" },
        { id: 2, name: "Analysis of Ack/Sum File", description: "Payment acknowledgment analysis", icon: BarChart3, route: "/reports/ack-sum-analysis" },
        { id: 3, name: "Daily Consolidated Summary", description: "Consolidated daily payment report", icon: TrendingUp, route: "/reports/daily-summary" },
        { id: 4, name: "Daily Cashcard Collection", description: "Cashcard transaction summary", icon: CreditCard, route: "/reports/cashcard-collection" }
      ]
    },
    {
      id: 2,
      title: "Movement Counter & Transactions",
      icon: Activity,
      color: "bg-blue-100 text-blue-600 border-blue-200",
      description: "Traffic flow and transaction monitoring",
      reports: [
        { id: 5, name: "Counter Daily Statistics", description: "Daily vehicle movement statistics", icon: BarChart3, route: "/reports/counter-daily" },
        { id: 6, name: "Counter Monthly Statistics", description: "Monthly traffic analysis", icon: Calendar, route: "/reports/counter-monthly" },
        { id: 7, name: "Daily Movement Details", description: "Detailed vehicle movement logs", icon: Activity, route: "/reports/movement-details" },
        { id: 8, name: "Daily Parking Duration", description: "Average parking duration analysis", icon: Clock, route: "/reports/parking-duration" }
      ]
    },
    {
      id: 3,
      title: "History & Audit",
      icon: Shield,
      color: "bg-purple-100 text-purple-600 border-purple-200",
      description: "System audit trails and historical data",
      reports: [
        { id: 9, name: "Remote Control History", description: "System control operation logs", icon: History, route: "/reports/remote-control-history" },
        { id: 10, name: "Station Error History", description: "Equipment error and maintenance logs", icon: AlertTriangle, route: "/reports/station-errors" }
      ]
    },
    {
      id: 4,
      title: "Season Master & Details",
      icon: Car,
      color: "bg-orange-100 text-orange-600 border-orange-200",
      description: "Season parking management reports",
      reports: [
        { id: 11, name: "Season Card Master", description: "Season card holder database", icon: CreditCard, route: "/reports/season-master" },
        { id: 12, name: "Season Transaction Details", description: "Season parking transaction logs", icon: FileText, route: "/reports/season-transactions" },
        { id: 13, name: "To Be Expired Season", description: "Expiring season card alerts", icon: Calendar, route: "/reports/expiring-season" }
      ]
    },
    {
      id: 5,
      title: "Miscellaneous Reports",
      icon: FileText,
      color: "bg-gray-100 text-gray-600 border-gray-200",
      description: "Additional system reports",
      reports: [
        { id: 14, name: "Ticket Complimentary", description: "Complimentary ticket usage report", icon: FileText, route: "/reports/ticket-complimentary" },
        { id: 15, name: "NETS Collection Comparison", description: "NETS payment comparison analysis", icon: BarChart3, route: "/reports/nets-comparison" }
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
                <p className="text-lg font-semibold">2</p>
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
                <p className="text-lg font-semibold">5</p>
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

        {/* Quick Actions */}
        <div className="mt-8 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl leading-none tracking-tight">Quick Actions</h3>
            <p className="text-sm text-muted-foreground">
              Frequently used report operations
            </p>
          </div>
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => navigate("/reports/bulk-generate")}
                className="flex items-center gap-3 p-4 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <div className="p-2 rounded-lg bg-blue-100">
                  <Download className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Generate All Reports</p>
                  <p className="text-xs text-muted-foreground">Bulk generate all available reports</p>
                </div>
              </button>
              
              <button 
                onClick={() => navigate("/reports/scheduler")}
                className="flex items-center gap-3 p-4 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <div className="p-2 rounded-lg bg-green-100">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Schedule Reports</p>
                  <p className="text-xs text-muted-foreground">Set up automated report generation</p>
                </div>
              </button>
              
              <button 
                onClick={() => navigate("/reports/history")}
                className="flex items-center gap-3 p-4 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <div className="p-2 rounded-lg bg-purple-100">
                  <History className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Report History</p>
                  <p className="text-xs text-muted-foreground">View previously generated reports</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}