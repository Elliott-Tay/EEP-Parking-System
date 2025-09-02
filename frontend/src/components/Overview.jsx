import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { io } from "socket.io-client";

// toggle mock mode ON/OFF
const USE_MOCK = true; // ⬅️ change to false to use backend

const socket = !USE_MOCK ? io(process.env.REACT_APP_BACKEND_API_URL) : null;

// Mock data
const entryMock = [
  { id: "E1", name: "E1", time: "10:05:23", vehicle: "UI123", status: "OK", errors: [] },
  { id: "E2", name: "E2", time: "10:06:11", vehicle: "UI124", status: "OK", errors: ["Simulated error"] },
];

const exitMock = [
  { id: "X1", name: "X1", time: "10:07:02", vehicle: "UI200", card: "PC001", fee: "$2.50", balance: "$50.00", status: "OK", errors: [] },
  { id: "X2", name: "X2", time: "10:08:45", vehicle: "UI201", card: "PC002", fee: "$3.00", balance: "$45.50", status: "OK", errors: ["Simulated error"] },
];

export default function OverviewTab() {
  const [entrances, setEntrances] = useState([]);
  const [exits, setExits] = useState([]);

  useEffect(() => {
    if (USE_MOCK) {
      // ✅ load mock data once
      setEntrances(entryMock);
      setExits(exitMock);
    } else {
      try {
        // ✅ listen for entry success
        socket.on("entry-station", (payload) => {
          try {
            const { msg_type, msg_datetime, msg } = payload;
            const entryData = {
              id: msg?.id || msg_type,
              name: msg?.name || "Unknown",
              time: msg_datetime,
              vehicle: msg?.vehicle || "-",
              status: msg?.status || "OK",
              errors: msg?.errors || [],
            };
            setEntrances((prev) => [...prev, entryData]);
          } catch (err) {
            console.error("Client error parsing entry-station:", err);
          }
        });

        // ✅ listen for exit success
        socket.on("exit-station", (payload) => {
          try {
            const { msg_type, msg_datetime, msg } = payload;
            const exitData = {
              id: msg?.id || msg_type,
              name: msg?.name || "Unknown",
              time: msg_datetime,
              vehicle: msg?.vehicle || "-",
              card: msg?.card || "-",
              fee: msg?.fee || "-",
              balance: msg?.balance || "-",
              status: msg?.status || "OK",
              errors: msg?.errors || [],
            };
            setExits((prev) => [...prev, exitData]);
          } catch (err) {
            console.error("Client error parsing exit-station:", err);
          }
        });

        // ✅ listen for entry error
        socket.on("entry-station-error", (errorPayload) => {
          console.error("Entry station error:", errorPayload);
          setEntrances((prev) => [
            ...prev,
            { id: "ERR", name: "EntryError", time: new Date().toISOString(), status: "ERROR", errors: [errorPayload.message] },
          ]);
        });

        // ✅ listen for exit error
        socket.on("exit-station-error", (errorPayload) => {
          console.error("Exit station error:", errorPayload);
          setExits((prev) => [
            ...prev,
            { id: "ERR", name: "ExitError", time: new Date().toISOString(), status: "ERROR", errors: [errorPayload.message] },
          ]);
        });

      } catch (outerErr) {
        console.error("Socket setup error:", outerErr);
      }

      return () => {
        socket.off("entry-station");
        socket.off("exit-station");
        socket.off("entry-station-error");
        socket.off("exit-station-error");
      };
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StationCard
          title="Entry Stations"
          icon={<ArrowRight className="h-5 w-5 text-green-500" />}
          rows={entrances}
          isEntry
        />
        <StationCard
          title="Exit Stations"
          icon={<ArrowLeft className="h-5 w-5 text-red-500" />}
          rows={exits}
          isEntry={false}
        />
      </div>
    </div>
  );
}


function StationCard({ title, icon, rows, isEntry = true }) {
  const headers = isEntry
    ? ["Station", "Time", "Vehicle No", "Status"]
    : ["Station", "Time", "Vehicle No", "Payment Card No", "Fee", "Balance", "Status"];

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
                rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/10">
                    {isEntry ? (
                      <>
                        <td className="px-4 py-2 text-blue-700">{row.name}</td>
                        <td className="px-4 py-2 text-blue-700">{row.time}</td>
                        <td className="px-4 py-2 text-blue-700">{row.vehicle}</td>
                        <td className="px-4 py-2 text-blue-700">{row.status}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2 text-blue-700">{row.name}</td>
                        <td className="px-4 py-2 text-blue-700">{row.time}</td>
                        <td className="px-4 py-2 text-blue-700">{row.vehicle}</td>
                        <td className="px-4 py-2 text-blue-700">{row.card}</td>
                        <td className="px-4 py-2 text-blue-700">{row.fee}</td>
                        <td className="px-4 py-2 text-blue-700">{row.balance}</td>
                        <td className="px-4 py-2 text-blue-700">{row.status}</td>
                      </>
                    )}
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
