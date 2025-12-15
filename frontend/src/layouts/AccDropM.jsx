import React from "react";
import { useNavigate } from "react-router-dom";
import { updateDriverStatus } from "../services/driverApi";
import { useAuth } from "../context/AuthContext";


const AccDropM = ({ user, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // If driver, set status to offline BEFORE removing token
      if (user?.role === "driver") {
        await updateDriverStatus(false);
      }
    } catch (err) {
      console.warn("Failed to update driver status on logout");
    } finally {
      logout();                 // 🔥 THIS triggers Navbar update
      onClose();
      navigate("/login", { replace: true });
    }

  };


  return (
    <div
      className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-2xl border
             z-9999"
    >
      {/* User Info */}
      <div className="p-4 border-b">
        <p className="font-semibold">{user?.name || "User"}</p>
      </div>

      {/* Menu Items */}
      <div className="p-2 space-y-1">
        <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
          Manage Account
        </button>

        <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
          Activity
        </button>

        <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">
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

export default AccDropM;
