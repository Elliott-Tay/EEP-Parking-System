import { useState } from "react";
import LotStatus from "./ThreeColumnPanel/LotStatus";
import RemoteFunctions from "./ThreeColumnPanel/RemoteFunctions";
import StationStatus from "./ThreeColumnPanel/StationStatus";

const ThreeColumnPanel = () => {
  // LotStatus state
  const [currentZone, setCurrentZone] = useState("main");

  const env_backend = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:5000";

  return (
    <div className="space-y-2 mb-5">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Lot Status */}
        <LotStatus currentZone={currentZone} setCurrentZone={setCurrentZone} />

        {/* Remote Functions */}
        <RemoteFunctions />

        {/* Station Status */}
        <StationStatus env_backend={env_backend} />
      </div>
    </div>
  );
};

export default ThreeColumnPanel;
