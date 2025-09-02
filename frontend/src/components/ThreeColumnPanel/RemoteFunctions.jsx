import { useState } from "react";
import { Unlock, Settings, DollarSign, Power, ArrowRight, X } from "lucide-react";

export default function RemoteFunctions() {
  const [activeModal, setActiveModal] = useState(null);

  const remoteActions = [
    {
      id: "station-control",
      label: "Station Control",
      icon: Unlock,
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Control entry/exit gates",
      content: "Here you can control entry and exit gates remotely.",
    },
    {
      id: "lot-adjustment",
      label: "Lot Adjustment",
      icon: Settings,
      color: "bg-green-500 hover:bg-green-600",
      description: "Modify parking allocations",
      content: "Adjust the parking allocations for different zones.",
    },
    {
      id: "parking-tariff",
      label: "Parking Tariff",
      icon: DollarSign,
      color: "bg-orange-500 hover:bg-orange-600",
      description: "Update pricing structure",
      content: "Set or update parking tariffs for hourly or season passes.",
    },
  ];

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
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-2xl border border-gray-200 dark:border-gray-700 relative">
            {/* Close button */}
            <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                onClick={() => setActiveModal(null)}
            >
                <X className="h-5 w-5" />
            </button>

            {/* Modal content */}
            <h2 className="text-lg font-semibold mb-3">
                {remoteActions.find((a) => a.id === activeModal)?.label}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">
                {remoteActions.find((a) => a.id === activeModal)?.content}
            </p>

            {/* Optional footer / actions */}
            <div className="mt-6 flex justify-end">
                <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                Close
                </button>
            </div>
            </div>
        </div>
     )}
    </div>
  );
}
