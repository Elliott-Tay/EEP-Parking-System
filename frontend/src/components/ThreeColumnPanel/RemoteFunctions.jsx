import { useState, useEffect } from "react";
import { Unlock, Settings, DollarSign, Power, ArrowRight, X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock lot status data
const lotMockData = {
  main: {
    hourly: { allocated: 20, occupied: 20, available: 0 },
    season: { allocated: 15, occupied: 15, available: 0 },
    total: { allocated: 50, occupied: 45, available: 5 },
  },
  basement: {
    hourly: { allocated: 10, occupied: 7, available: 3 },
    season: { allocated: 10, occupied: 7, available: 3 },
    total: { allocated: 30, occupied: 20, available: 10 },
  },
  roof: {
    hourly: { allocated: 5, occupied: 2, available: 3 },
    season: { allocated: 5, occupied: 1, available: 4 },
    total: { allocated: 10, occupied: 3, available: 7 },
  },
  middle: {
    hourly: { allocated: 5, occupied: 3, available: 2 },
    season: { allocated: 5, occupied: 4, available: 1 },
    total: { allocated: 10, occupied: 7, available: 3 },
  },
  zone_c: {
    hourly: { allocated: 5, occupied: 3, available: 2 },
    season: { allocated: 5, occupied: 5, available: 0 },
    total: { allocated: 10, occupied: 3, available: 7 },
  },
};


function StationControlModal({ onClose }) {
  const [remarks, setRemarks] = useState("");

  // Generic handler for actions
  const handleAction = (action) => {
    if (!remarks.trim()) {
      toast.error("Remarks are required before performing this action.");
      return;
    }

    // ✅ Show success toast with action pressed
    toast.success(`Action performed: ${action}\nRemarks: ${remarks}`);

    console.log(`Action: ${action}, Remarks: ${remarks}`);
    // TODO: call your API here for log and action execution to see who did what

    setRemarks(""); // clear remarks after submit
    onClose?.(); // optionally close modal after action
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-3">Station Control</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Here you can control entry and exit gates remotely.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => handleAction("Open Gate")}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Open Gate
        </button>
        <button
          onClick={() => handleAction("Open and Hold")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Open and Hold
        </button>
        <button
          onClick={() => handleAction("Close Gate")}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Close Gate
        </button>
        <button
          onClick={() => handleAction("Restart App")}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Restart App
        </button>
        <button
          onClick={() => handleAction("Eject Card")}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Eject Card
        </button>
        <button
          onClick={() => handleAction("Restart UPOS")}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Restart UPOS
        </button>
      </div>

      {/* Remarks box */}
      <textarea
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        placeholder="Add remarks"
        className="mt-6 w-full border rounded-md px-3 py-2 text-sm"
        rows={3}
      />
    </div>
  );
}

function LotAdjustmentModal({ onClose }) {
  const [zones, setZones] = useState([]);
  const [zone, setZone] = useState("");
  const [type, setType] = useState("hourly");
  const [allocated, setAllocated] = useState("");
  const [occupied, setOccupied] = useState("");

  const useMockData = true; // toggle this to switch between mock and real API

  // Set zones dynamically from mock data for now
  useEffect(() => {
    const zoneList = Object.keys(lotMockData).map((z) => ({
      name: z,
      active: lotMockData[z].total.available > 0,
    }));
    setZones(zoneList);
  }, []);

  const handleLotUpdate = async () => {
    if (!zone || !type || allocated === "" || occupied === "") {
      toast.error("Please fill in all fields");
      return;
    }

    if (useMockData) {
      // Update mock data locally
      lotMockData[zone][type].allocated = Number(allocated);
      lotMockData[zone][type].occupied = Number(occupied);
      lotMockData[zone][type].available =
        lotMockData[zone][type].allocated - lotMockData[zone][type].occupied;

      toast.success(
        `Updated mock zone ${zone} (${type}) to ${allocated} allocated, ${occupied} occupied`
      );
      setAllocated("");
      setOccupied("");
      onClose?.();
    } else {
      // Call real API
      try {
        const res = await fetch(`/api/remote-control/lot-status/${zone}/${type}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            allocated: Number(allocated),
            occupied: Number(occupied),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to update lot");
        } else {
          toast.success(
            `Updated zone ${zone} (${type}) to ${data.allocated} allocated, ${data.occupied} occupied`
          );
          setAllocated("");
          setOccupied("");
          onClose?.();
        }
      } catch (err) {
        toast.error("Error updating lot");
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-3">Lot Adjustment</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
        Adjust the parking allocations and occupied slots for different zones.
      </p>

      <div className="flex flex-col gap-3">
        {/* Dynamic Zone selector */}
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="">Select zone</option>
          {zones.map((z) => (
            <option key={z.name} value={z.name} disabled={!z.active}>
              {z.name} {z.active ? "" : "(full)"}
            </option>
          ))}
        </select>

        {/* Type selector */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="hourly">Hourly</option>
          <option value="season">Season</option>
        </select>

        {/* Allocated input */}
        <input
          type="number"
          placeholder="Enter new allocated slots"
          value={allocated}
          onChange={(e) => setAllocated(e.target.value)}
          className="border rounded-md px-3 py-2"
        />

        {/* Occupied input */}
        <input
          type="number"
          placeholder="Enter new occupied slots"
          value={occupied}
          onChange={(e) => setOccupied(e.target.value)}
          className="border rounded-md px-3 py-2"
        />

        {/* Submit button */}
        <button
          onClick={handleLotUpdate}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Update Lot
        </button>
      </div>
    </div>
  );
}


function ParkingTariffModal() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Parking Tariff</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Set or update parking tariffs for hourly or season passes.
      </p>
      <input
        type="text"
        placeholder="e.g., $2/hr"
        className="mt-2 w-full border rounded-md px-3 py-2 text-sm"
      />
    </div>
  );
}

export default function RemoteFunctions() {
  const [activeModal, setActiveModal] = useState(null);

  const remoteActions = [
    {
      id: "station-control",
      label: "Station Control",
      icon: Unlock,
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Control entry/exit gates",
      component: StationControlModal,
    },
    {
      id: "lot-adjustment",
      label: "Lot Adjustment",
      icon: Settings,
      color: "bg-green-500 hover:bg-green-600",
      description: "Modify parking allocations",
      component: LotAdjustmentModal,
    },
    {
      id: "parking-tariff",
      label: "Parking Tariff",
      icon: DollarSign,
      color: "bg-orange-500 hover:bg-orange-600",
      description: "Update pricing structure",
      component: ParkingTariffModal,
    },
  ];

  const ActiveModalComponent = remoteActions.find((a) => a.id === activeModal)?.component;

  return (
    <div className="lg:col-span-1 rounded-lg border bg-card text-card-foreground shadow-sm max-w-sm">
      {/* Header */}
      <div className="flex flex-col space-y-2 p-4">
        <div className="flex items-center gap-2">
          <Power className="h-5 w-5 text-primary" />
          <h3 className="text-xl leading-none tracking-tight">Remote Functions</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          System control and management tools
        </p>
      </div>

      {/* Action buttons */}
      <div className="p-4 pt-0">
        <div className="grid gap-3 auto-rows-fr">
          {remoteActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => setActiveModal(action.id)}
                className={`flex items-center gap-3 px-4 py-3 w-full text-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${action.color} group`}
              >
                <IconComponent className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
                <ArrowRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {activeModal && ActiveModalComponent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-20 rounded-xl w-200 shadow-2xl border border-gray-200 dark:border-gray-700 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              onClick={() => setActiveModal(null)}
            >
              <X className="h-10 w-10" />
            </button>
            <ActiveModalComponent onClose={() => setActiveModal(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
