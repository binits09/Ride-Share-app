import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../components/MapView";
import { useAuth } from "../context/AuthContext";

const DriverUI = () => {
  const navigate = useNavigate();
  const { user, driverStatus, driverStatusLoading } = useAuth();

  // 🚨 HARD GUARD
  useEffect(() => {
    if (driverStatusLoading) return;

    if (!user || user.role !== "driver") {
      navigate("/login", { replace: true });
      return;
    }

    if (driverStatus !== "online") {
      navigate("/driver-home", { replace: true });
    }
  }, [user, driverStatus, driverStatusLoading, navigate]);

  // ⏳ Loading state
  if (driverStatusLoading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-gray-600">Checking driver status…</p>
      </div>
    );
  }

  if (driverStatus !== "online") return null;

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* LEFT PANEL */}
      <div className="w-[380px] bg-white shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-2">
          Driver Dashboard
        </h2>

        <div className="mb-4">
          <p className="font-medium">{user?.name}</p>
          <p className="text-sm text-gray-600">
            Status: <span className="text-green-600">Online</span>
          </p>
        </div>

        <div className="border rounded-lg p-3 mb-4">
          <h3 className="font-medium mb-2">Incoming Ride</h3>
          <p className="text-sm">Pickup: Salt Lake</p>
          <p className="text-sm">Drop: Park Street</p>
          <p className="text-sm">Fare: ₹145</p>

          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-green-600 text-white py-2 rounded">
              Accept
            </button>
            <button className="flex-1 bg-red-500 text-white py-2 rounded">
              Reject
            </button>
          </div>
        </div>

        <p className="text-gray-500 text-sm">
          Waiting for ride requests...
        </p>
      </div>

      {/* MAP */}
      <div className="flex-1 h-full">
        <MapView position={[22.5726, 88.3639]} />
      </div>
    </div>
  );
};

export default DriverUI;
