import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

const USE_MOCK = false; // toggle mock mode
const backend_API_URL =
  process.env.REACT_APP_BACKEND_API_URL || "http://localhost:5000";

// Mock data
const entryMock = [
  { Station: "E1", Time: "10:05:23", VehicleNo: "UI123", Status: "OK" },
  { Station: "E2", Time: "10:06:11", VehicleNo: "UI124", Status: "OK" },
];

const exitMock = [
  { Station: "X1", Time: "10:07:02", VehicleNo: "UI200", PaymentCard: "PC001", Fee: "$2.50", Balance: "$50.00", Status: "OK" },
  { Station: "X2", Time: "10:08:45", VehicleNo: "UI201", PaymentCard: "PC002", Fee: "$3.00", Balance: "$45.50", Status: "OK" },
];

export default function OverviewTab() {
  const [entrances, setEntrances] = useState(USE_MOCK ? entryMock : []);
  const [exits, setExits] = useState(USE_MOCK ? exitMock : []);
  const [entryError, setEntryError] = useState(null);
  const [exitError, setExitError] = useState(null);

  useEffect(() => {
    if (USE_MOCK) return;

    const updateOrInsert = (prev, newData, key = "Station") => {
      const index = prev.findIndex(item => item[key] === newData[key]);
      if (index !== -1) {
        // Replace existing
        const updated = [...prev];
        updated[index] = newData;
        return updated;
      } else {
        // Prepend new
        return [newData, ...prev];
      }
    };

    // SSE for entries
    const entrySource = new EventSource(`${backend_API_URL}/api/movements/stream/entries`);
    entrySource.onmessage = async (e) => {
      try {
        const data = JSON.parse(e.data);
        setEntrances(prev => updateOrInsert(prev, data));

        // Send to backend for entry
        const response = await fetch(`${backend_API_URL}/api/movements/entry-movements`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            VehicleNo: data.VehicleNo,
            Station: data.Station,
            Time: data.Time,
            Status: data.Status || "OK",
            OBU_number: data.OBU_number || null, // Included OBU_number
            VCC: data.VCC || null,             
            CardNumber: data.CardNumber || null, 
            DSRC: data.DSRC || null,          
          })
        });

        if (!response.ok) {
          console.error("Failed to post new entry", await response.text());
        }

      } catch (err) {
        console.error("Error processing entry SSE:", err);
        setEntryError("Error receiving or sending entry data");
      }
    };

    entrySource.onerror = () => {
      setEntryError("Connection lost to entry station stream. Check the backend");
      entrySource.close();
    };

    // SSE for exits
    const exitSource = new EventSource(`${backend_API_URL}/api/movements/stream/exits`);
    exitSource.onmessage = async (e) => {
      try {
        const data = JSON.parse(e.data);
        setExits(prev => updateOrInsert(prev, data));

        // Send to backend for exit
        const response = await fetch(`${backend_API_URL}/api/movements/exit-movements`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Station: data.Station,
            Time: data.Time,
            VehicleNo: data.VehicleNo,
            PaymentCardNo: data.PaymentCardNo,
            Fee: data.Fee,
            Balance: data.Balance,
            Status: data.Status || "OK",
            OBU_number: data.OBU_number || null
          })
        });

        if (!response.ok) {
          console.error("Failed to post exit movement:", await response.text());
        }
      } catch (err) {
        console.error("Error processing exit SSE:", err);
        setExitError("Error receiving exit data");
      }
    };

    exitSource.onerror = () => {
      setExitError("Connection lost to exit station stream. Check the backend.");
      exitSource.close();
    };
    return () => {
      entrySource.close();
      exitSource.close();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StationCard title="Entry Stations" icon={<ArrowRight className="h-5 w-5 text-green-500" />} rows={entrances} error={entryError} isEntry />
        <StationCard title="Exit Stations" icon={<ArrowLeft className="h-5 w-5 text-red-500" />} rows={exits} error={exitError} isEntry={false} />
      </div>
    </div>
  );
}

function StationCard({ title, icon, rows, error, isEntry = true }) {
  const headers = isEntry
    ? ["Station", "Entry Time", "Vehicle No", "Obu No", "Status", "VCC", "Card Number", "DSRC"]
    : ["Station", "Vehicle No", "Obu No", "Payment Card No", "DSRC", "Deducted Amount", "Payment Time", "Type of Payment", "Entry time", "Exit time"];

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
                {headers.map(header => (
                  <th key={header} className="px-4 py-2 text-left font-medium text-muted-foreground">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {error ? (
                <tr>
                  <td colSpan={headers.length} className="px-4 py-6 text-center text-red-600">{error}</td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="px-4 py-6 text-center text-muted-foreground">
                    No {isEntry ? "entry" : "exit"} station data available.
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => (
                  <tr key={row.Station || row.name || idx} className="hover:bg-muted/10">
                    {isEntry ? (
                      <>
                        <td className="px-4 py-2 text-blue-700">{row.Station || row.name}</td>
                        <td className="px-4 py-2 text-blue-700">{row.Time || row.time}</td>
                        <td className="px-4 py-2 text-blue-700">{row.VehicleNo || row.vehicle}</td>
                        <td className="px-4 py-2 text-blue-700">{row.ObuNo || row.Obu}</td>
                        <td className="px-4 py-2 text-blue-700">{row.Status || row.status}</td>
                        <td className="px-4 py-2 text-blue-700">{row.VCC || row.VCC}</td>
                        <td className="px-4 py-2 text-blue-700">{row.CardNumber || row.CardNumber}</td>
                        <td className="px-4 py-2 text-blue-700">{row.DSRC || row.DSRC}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2 text-blue-700">{row.Station || row.name}</td>
                        <td className="px-4 py-2 text-blue-700">{row.VehicleNo || row.vehicle}</td>
                        <td className="px-4 py-2 text-blue-700">{row.ObuNo || row.Obu}</td>
                        <td className="px-4 py-2 text-blue-700">{row.PaymentCardNo || row.card}</td>
                        <td className="px-4 py-2 text-blue-700">{row.DSRC || row.DSRC}</td>
                        <td className="px-4 py-2 text-blue-700">${row.DeductedAmount || row.DeductedAmount}</td>
                        <td className="px-4 py-2 text-blue-700">{row.PaymentTransactionTime || row.PaymentTransactionTime}</td>
                        <td className="px-4 py-2 text-blue-700">{row.TypeOfPayment|| row.TypeOfPayment}</td>
                        <td className="px-4 py-2 text-blue-700">{row.EntryTime|| null}</td>
                        <td className="px-4 py-2 text-blue-700">{row.ExitTime|| row.ExitTime}</td>
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
