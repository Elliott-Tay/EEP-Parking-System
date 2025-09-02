import { useState } from "react";
import { Unlock, Settings, DollarSign, Power, ArrowRight, X } from "lucide-react";

function StationControlModal({ onClose }) {
  const [remarks, setRemarks] = useState("");

  const handleSubmit = () => {
    if (!remarks.trim()) return; // safety check
    console.log("Submitted remarks:", remarks);
    setRemarks(""); // clear input
    onClose?.(); // close modal if provided
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Station Control</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Here you can control entry and exit gates remotely.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="px-3 py-2 bg-green-500 text-white rounded-md">
          Open Gate
        </button>
        <button className="px-3 py-2 bg-blue-500 text-white rounded-md">
          Open and Hold
        </button>
        <button className="px-3 py-2 bg-red-500 text-white rounded-md">
          Close Gate
        </button>
        <button className="px-3 py-2 bg-red-500 text-white rounded-md">
          Restart App
        </button>
        <button className="px-3 py-2 bg-red-500 text-white rounded-md">
          Eject Card
        </button>
        <button className="px-3 py-2 bg-red-500 text-white rounded-md">
          Restart UPOS
        </button>
      </div>

      {/* Remarks box */}
      <textarea
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        placeholder="Add remarks"
        className="mt-4 w-full border rounded-md px-3 py-2 text-sm"
        rows={3}
      />

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!remarks.trim()}
        className={`mt-4 w-full px-4 py-2 rounded-md text-white ${
          remarks.trim()
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Submit
      </button>
    </div>
  );
}

function LotAdjustmentModal() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Lot Adjustment</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Adjust the parking allocations for different zones.
      </p>
      <input
        type="number"
        placeholder="Enter new lot count"
        className="mt-2 w-full border rounded-md px-3 py-2 text-sm"
      />
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
