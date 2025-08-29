import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BACKEND_API_URL);

export default function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entry Stations (mock mode ON for testing) */}
        <StationCard
          title="Entry Stations"
          icon={<ArrowRight className="h-5 w-5 text-green-500" />}
          type="entry"
          useMock={true}
        />

        {/* Exit Stations (mock mode ON for testing) */}
        <StationCard
          title="Exit Stations"
          icon={<ArrowLeft className="h-5 w-5 text-red-500" />}
          type="exit"
          useMock={true}
        />
      </div>
    </div>
  );
}

function StationCard({ title, icon, type, useMock = false }) {
  const [rows, setRows] = useState([]);
  const isEntry = type === "entry";

  // Define headers
  const headers = isEntry
    ? ["Station", "Time", "Vehicle No", "Status"]
    : ["Station", "Time", "Vehicle No", "Payment Card No", "Fee", "Balance", "Status"];

  // Mock data sets
  const mockData = isEntry
    ? [
        ["E1", "10:05:23", "UI123", "OK"],
        ["E2", "10:06:11", "UI124", "ERROR"],
      ]
    : [
        ["X1", "10:07:02", "UI200", "PC001", "$2.50", "$50.00", "OK"],
        ["X2", "10:08:45", "UI201", "PC002", "$3.00", "$45.50", "ERROR"],
      ];

  useEffect(() => {
    if (useMock) {
        // Simulate live updates with mock data
        setRows(mockData);
        return; // stop here if mocking
    }

    // If not mock, connect via socket
    if (isEntry) {
        socket.on("entry-station", (payload) => {
        setRows((prev) => [
            ...prev,
            [payload.msg_type, payload.msg_datetime, payload.msg, "OK"],
        ]);
        });
    } else {
        socket.on("exit-station", (payload) => {
        setRows((prev) => [
            ...prev,
            [payload.msg_type, payload.msg_datetime, payload.msg, "OK"],
        ]);
        });
    }

    return () => {
        socket.off("entry-station");
        socket.off("exit-station");
    };
    }, [useMock, isEntry]);

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
                    className="px-4 py-6 text-center text-muted-foreground text-red-600"
                  >
                    Waiting for {isEntry ? "entry" : "exit"} station data...
                  </td>
                </tr>
              ) : (
                rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-muted/10">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 text-blue-700">
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
