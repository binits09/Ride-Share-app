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
      className="absolute right-0 top-full mt-1 w-72 bg-slate-50 rounded-xl shadow-xl border border-slate-300 z-[9999] overflow-hidden"
    >
      {/* Driver Info */}
      <div className="p-4 border-b bg-slate-100">
        <div className="flex items-center gap-3">
          {user?.profilePicture ? (
            <img
              src={`http://localhost:6200${user.profilePicture}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
              {(user?.name?.[0] || "?")?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 leading-5">{user?.name || "Driver"}</p>
            <p
              className={`text-xs ${
                driverStatus === "online" ? "text-green-600" : "text-red-500"
              }`}
            >
              {driverStatus === "online" ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2 space-y-1" role="menu" aria-label="Driver menu">
        <button
          type="button"
          onClick={() => {
            navigate("/account/driver");
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          role="menuitem"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.749 0-5.353-.624-7.499-1.632Z"/></svg>
          <span className="font-medium">Driver Profile</span>
        </button>

        <button
          type="button"
          onClick={() => {
            navigate("/account/driver/earnings");
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          role="menuitem"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m3 0A7.5 7.5 0 1 1 12 4.5a7.5 7.5 0 0 1 7.5 7.5Z"/></svg>
          <span className="font-medium">Earnings</span>
        </button>

        <button
          type="button"
          onClick={() => {
            navigate("/account/driver/history");
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          role="menuitem"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a8.25 8.25 0 1 0 16.5 0 8.25 8.25 0 0 0-16.5 0Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h3.75"/></svg>
          <span className="font-medium">Ride History</span>
        </button>

        <button
          type="button"
          onClick={() => {
            navigate("/help");
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 text-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          role="menuitem"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.5c1.171-1.171 3.071-1.171 4.242 0 1.172 1.172 1.172 3.071 0 4.243-.573.573-1.278.879-1.879 1.257-.57.36-1.121.77-1.121 1.5v.75m0 3h.008v.008H10.5V18Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 21A9 9 0 1 0 12 3a9 9 0 0 0 0 18Z"/></svg>
          <span className="font-medium">Help</span>
        </button>
      </div>

      {/* Logout */}
      <div className="border-t p-2">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12"/></svg>
          <span className="font-medium">Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default DriverDropM;
