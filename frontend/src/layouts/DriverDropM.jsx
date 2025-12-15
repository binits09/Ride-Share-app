import React from "react";
import { useNavigate } from "react-router-dom";
import { updateDriverStatus } from "../services/driverApi";
import { useAuth } from "../context/AuthContext";

const DriverDropM = ({ user, onClose }) => {
  const navigate = useNavigate();
  const { logout, driverStatus, setDriverStatus } = useAuth();

  const handleLogout = async () => {
    try {
      // 🔴 Always set driver offline before logout
      await updateDriverStatus(false);
      setDriverStatus("offline");
    } catch (err) {
      console.warn("Failed to update driver status on logout");
    } finally {
      logout();
      onClose();
      navigate("/login", { replace: true });
    }
  };

  return (
    <div
      className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-2xl border z-9999"
    >
      {/* Driver Info */}
      <div className="p-4 border-b">
        <p className="font-semibold">{user?.name || "Driver"}</p>
        <p
          className={`text-sm ${
            driverStatus === "online"
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {driverStatus === "online" ? "Online" : "Offline"}
        </p>
      </div>

      {/* Menu Items */}
      <div className="p-2 space-y-1">
        <button
          onClick={() => {
            navigate("/account/driver");
            onClose();
          }}
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
        >
          Driver Profile
        </button>

        <button
          onClick={() => {
            navigate("/account/driver/earnings");
            onClose();
          }}
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
        >
          Earnings
        </button>

        <button
          onClick={() => {
            navigate("/driver/history");
            onClose();
          }}
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
        >
          Ride History
        </button>

        <button
          onClick={() => {
            navigate("/help");
            onClose();
          }}
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
        >
          Help
        </button>
      </div>

      {/* Logout */}
      <div className="border-t p-2">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded text-red-600 hover:bg-red-50"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default DriverDropM;
