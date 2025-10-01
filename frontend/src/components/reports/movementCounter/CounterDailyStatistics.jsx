import React, { useState, useEffect } from "react";
import { 
  Search, 
  Download, 
  Eye, 
  X, 
  ArrowLeft, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Clock,
  MapPin,
  FileText,
  Filter,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function CounterDailyStatistics() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewRecord, setPreviewRecord] = useState(null);

  const env_backend = process.env.REACT_APP_BACKEND_API_URL;

  useEffect(() => {
    if (!selectedDate) return;

    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${env_backend}/api/movements/day/${selectedDate}`,
          {
            headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "",
            },
          }
        );
        const result = await response.json();
        const mappedRecords = result.data.map((r) => ({ ...r }));
        setRecords(mappedRecords);
      } catch (err) {
        console.error("Error fetching records:", err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, env_backend]);

  const filteredRecords = records.filter((r) =>
    Object.values(r).some((val) =>
      val ? val.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false
    )
  );

  const handleDownloadCSV = (singleRecord = null) => {
    let csvData = [];
    let filename = "counter_daily_records.csv";

    if (singleRecord) {
        // Export only a single record
        csvData = [tableColumns.map(col => singleRecord[col] ?? "")];
        filename = `counter_daily_record_${singleRecord.log_id}.csv`;
    } else {
        // Export all filtered records or placeholder if empty
        if (filteredRecords.length > 0) {
        csvData = filteredRecords.map(record =>
            tableColumns.map(col => record[col] ?? "")
        );
        } else {
        csvData = [tableColumns.map(() => "No records found")];
        }
    }

    // Include headers
    const csvContent = [
        tableColumns.join(","), // header row
        ...csvData.map(row => row.map(val => `"${val}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    };

  const handlePreview = (record) => {
    setPreviewRecord(record);
  };

  const closeModal = () => setPreviewRecord(null);

  // Summary calculations
  const totalParkingCharges = filteredRecords.reduce(
    (sum, r) => sum + (r.parking_charges || 0),
    0
  );
  const totalPaidAmount = filteredRecords.reduce(
    (sum, r) => sum + (r.paid_amount || 0),
    0
  );
  const uniqueCounters = [...new Set(filteredRecords.map((r) => r.entry_station_id))];
  const avgParkingCharge = filteredRecords.length
    ? (totalParkingCharges / filteredRecords.length).toFixed(2)
    : 0;

  const tableColumns = [
    "log_id",
    "vehicle_id", 
    "entry_trans_type",
    "entry_station_id",
    "entry_datetime",
    "entry_datetime_detect",
    "exit_trans_type",
    "exit_station_id", 
    "exit_datetime",
    "exit_datetime_detect",
    "parking_dur",
    "parking_charges",
    "paid_amount",
    "card_type",
    "card_number",
    "vehicle_number",
    "ticket_type",
    "ticket_id",
    "update_datetime",
    "receipt_bit"
  ];

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
              <BarChart3 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl">Counter Daily Statistics</h1>
              <p className="text-muted-foreground">Analyze daily transaction data and parking statistics</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Live Data</span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-8xl mx-auto">
        {/* Controls */}
        <div className="mb-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6 pb-4">
            <h3 className="text-lg leading-none tracking-tight">Data Filters & Search</h3>
            <p className="text-sm text-muted-foreground">Configure date range and search criteria</p>
          </div>
          <div className="p-6 pt-0">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Date Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                  />
                </div>
              </div>

              {/* Search */}
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Search Records</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search all fields..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-input-background pl-10 pr-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                  />
                </div>
              </div>

              {/* Filter Button */}
              <div className="space-y-2">
                <label className="text-sm font-medium invisible">Action</label>
                <button className="h-10 inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
                <button
                  onClick={() => handleDownloadCSV()}
                  className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-sm ml-2"
                  >
                  <Download className="h-4 w-4" />
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {!loading && filteredRecords.length > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Total Records</span>
                </div>
                <p className="text-2xl font-semibold">{filteredRecords.length}</p>
                <p className="text-xs text-muted-foreground">Filtered results</p>
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Data Fields</span>
                </div>
                <p className="text-2xl font-semibold">{Object.keys(filteredRecords[0] || {}).length}</p>
                <p className="text-xs text-muted-foreground">Per record</p>
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Total Charges</span>
                </div>
                <p className="text-2xl font-semibold">${totalParkingCharges.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Parking fees</p>
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Paid Amount</span>
                </div>
                <p className="text-2xl font-semibold">${totalPaidAmount.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Collected</p>
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-800">Unique Counters</span>
                </div>
                <p className="text-lg font-semibold">{uniqueCounters.join(", ") || "N/A"}</p>
                <p className="text-xs text-muted-foreground">Active stations</p>
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-teal-600" />
                  <span className="text-sm font-medium text-teal-800">Avg Charge</span>
                </div>
                <p className="text-2xl font-semibold">${avgParkingCharge}</p>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-none tracking-tight">Transaction Records</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedDate ? `Data for ${selectedDate}` : 'Select a date to view records'}
                </p>
              </div>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 pt-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground animate-spin mb-4" />
                  <p className="text-muted-foreground">Loading transaction records...</p>
                  <p className="text-sm text-muted-foreground mt-1">Please wait while we fetch the data</p>
                </div>
              </div>
            ) : !selectedDate ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Select a Date</h3>
                <p className="text-sm text-muted-foreground">Choose a date above to view transaction records</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        {tableColumns.map((col) => (
                          <th
                            key={col}
                            className="px-4 py-3 text-left text-sm font-medium text-muted-foreground whitespace-nowrap"
                          >
                            {col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground sticky right-0 bg-muted/50">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredRecords.length > 0 ? (
                        filteredRecords.map((record, index) => (
                          <tr key={record.log_id || index} className="hover:bg-muted/25 transition-colors">
                            {tableColumns.map((col) => (
                              <td key={col} className="px-4 py-3 text-sm whitespace-nowrap">
                                <span className="truncate max-w-32 inline-block">
                                  {record[col]?.toString() || "-"}
                                </span>
                              </td>
                            ))}
                            <td className="px-4 py-3 text-sm sticky right-0 bg-background">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handlePreview(record)}
                                  className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
                                  title="Preview Record"
                                >
                                  <Eye className="h-3 w-3" />
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={tableColumns.length + 1} className="text-center py-12">
                            <div className="text-center">
                              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                              <h3 className="text-lg font-medium text-foreground mb-2">No Records Found</h3>
                              <p className="text-sm text-muted-foreground">
                                {searchTerm 
                                  ? 'No records match your search criteria. Try adjusting your search term.'
                                  : 'No transaction records available for the selected date.'
                                }
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
        {previewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dimmed backdrop */}
            <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={closeModal} // close modal if you click outside
            />

            {/* Modal container */}
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="rounded-lg border bg-white text-card-foreground shadow-lg animate-in fade-in-0 zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                    <Eye className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                    <h2 className="text-xl leading-none tracking-tight">
                        Transaction Record Preview
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Log ID: {previewRecord.log_id || 'N/A'}
                    </p>
                    </div>
                </div>
                <button
                    onClick={closeModal}
                    className="p-2 rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    title="Close Preview"
                >
                    <X className="h-5 w-5 text-muted-foreground" />
                </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(previewRecord).map(([key, value]) => (
                    <div key={key} className="rounded-lg border bg-gray-50 p-4">
                        <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <p className="text-sm font-mono break-all">
                            {value?.toString() || "-"}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between p-8 border-t bg-gray-50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Last updated: {previewRecord.update_datetime || 'N/A'}</span>
                </div>
                <div className="flex gap-3">
                    <button
                    onClick={closeModal}
                    className="inline-flex items-center gap-2 rounded-md border border-input bg-white px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                    >
                    Close
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
        )}
    </div>
  );
}

export default CounterDailyStatistics;