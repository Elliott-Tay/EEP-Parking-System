import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entry Stations */}
        <StationCard
           title="Entry Stations"
           icon={<ArrowRight className="h-5 w-5 text-green-500" />}
           type="entry"
           apiUrl={`${process.env.REACT_APP_BACKEND_API_URL}/api/stations/entry`}
        />

        {/* Exit Stations */}
        <StationCard
          title="Exit Stations"
          icon={<ArrowLeft className="h-5 w-5 text-red-500" />}
          type="exit"
          apiUrl={`${process.env.REACT_APP_BACKEND_API_URL}/api/stations/exit`}
        />
      </div>
    </div>
  );
}

function StationCard({ title, icon, type, apiUrl }) {
  const [rows, setRows] = useState([]);
  const isEntry = type === "entry";

  // Define headers
  const headers = isEntry
    ? ["Station", "Time", "UI/Card No", "Status"]
    : [
        "Station",
        "Time",
        "UI/Card No",
        "Payment Card No",
        "Fee",
        "Balance",
        "Status",
      ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(apiUrl);
        const json = await res.json();

        if (json.success) {
          // Convert API fields into row values matching headers
          const mappedRows = json.data.map((station) =>
            headers.map((header) => {
              const key = header
                .toLowerCase()
                .replace(/ /g, "_"); // adapt field mapping if needed
              return station[key] ?? "---";
            })
          );
          setRows(mappedRows);
        }
      } catch (err) {
        console.error(`Failed to fetch ${type} station data:`, err);
      }
    };

    fetchData();

    // Optional polling (every 5 seconds)
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [apiUrl, headers, type]);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-2xl leading-none tracking-tight">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {isEntry ? "Entry station details" : "Exit station details"}
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted/50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left font-medium text-muted-foreground"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="px-4 py-6 text-center text-muted-foreground"
                  >
                    Waiting for {isEntry ? "entry" : "exit"} station data...
                  </td>
                </tr>
              ) : (
                rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-muted/10">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
