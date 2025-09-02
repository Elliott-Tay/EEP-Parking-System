import LotStatus from "./ThreeColumnPanel/LotStatus";
import RemoteFunctions from "./ThreeColumnPanel/RemoteFunctions";
import StationStatus from "./ThreeColumnPanel/StationStatus";

const ThreeColumnPanel = () => {
  const env_backend = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:5000";

  return (
    <div className="space-y-2 mb-5">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Lot Status */}
        <LotStatus />

        {/* Remote Functions */}
        <RemoteFunctions />

        {/* Station Status */}
        <StationStatus env_backend={env_backend} />
      </div>
    </div>
  );
};

export default ThreeColumnPanel;
