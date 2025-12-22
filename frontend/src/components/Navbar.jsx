
import { Link, NavLink, useLocation } from "react-router-dom";
import AccDropM from "../layouts/AccDropM";
import React, { useState, useRef, useEffect } from "react";
import { getDriverStatus, updateDriverStatus } from "../services/driverApi";
import { useAuth } from "../context/AuthContext";
import DriverDropM from "../layouts/DriverDropM";
import Toast from "./Toast";
import { useToast } from "../utils/useToast";


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const { toasts, showToast, removeToast } = useToast();

  const { user, token, driverStatus, setDriverStatus } = useAuth();
  const homePath =
    user?.role === "driver" ? "/driver-home" : "/";
  
  // Hide navbar on admin page
  if (location.pathname === "/admin") {
    return null;
  }


  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== "driver") return;

    getDriverStatus()
      .then((res) => {
        setDriverStatus(res.data.isOnline ? "online" : "offline");
      })
      .catch(() => {
        setDriverStatus("offline");
      });

  }, [token, user?.role]);


  const toggleDriverStatus = async () => {
    try {
      setLoadingStatus(true);

      const newStatus = driverStatus === "online";
      const res = await updateDriverStatus(!newStatus);

      const updatedStatus = res.data.isOnline ? "online" : "offline";

      setDriverStatus(updatedStatus);

    } catch (err) {
      showToast("Failed to update status", "error");
    } finally {
      setLoadingStatus(false);
    }
  };



  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    <div className="w-full bg-white shadow-md shadow-gray-400 sticky top-0 z-50 overflow-visible">
      <header className="p-4 max-w-7xl mx-auto flex justify-between items-center">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <Link to={homePath} className="text-xl font-bold text-gray-900">
            Rebu Ride
          </Link>

          {token && (
            <>
              <NavLink
                end
                to={homePath}
                className={({ isActive }) => `text-sm px-3 py-1 rounded-full font-medium transition ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-950 hover:bg-gray-200"}`}
              >
                Home
              </NavLink>

              {user?.role === "user" && (
                <NavLink
                  to="/ride"
                  className={({ isActive }) => `text-sm px-3 py-1 rounded-full font-medium transition ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-950 hover:bg-gray-200"}`}
                >
                  Ride
                </NavLink>
              )}

              {user?.role === "driver" && (
                <NavLink
                  to="/driver"
                  onClick={(e) => {
                    if (driverStatus !== "online") {
                      e.preventDefault();
                      showToast("You need to go online first...", "warning");
                    }
                  }}
                  className={({ isActive }) => `text-sm px-3 py-1 rounded-full font-medium transition ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-950 hover:bg-gray-200"}`}
                >
                  Drive
                </NavLink>
              )}

            </>
          )}



        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-1">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-950 px-3 py-1 rounded-full hover:font-bold hover:bg-gray-200 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-sm text-gray-950 px-3 py-1 rounded-full hover:font-bold hover:bg-gray-200 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>


              {/* Driver Status Toggle */}
              {user?.role === "driver" && (
                <button
                  onClick={toggleDriverStatus}
                  disabled={loadingStatus}
                  className={`text-sm px-3 py-1 rounded-full font-medium transition
      ${driverStatus === "online"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                    } ${loadingStatus && "opacity-60 cursor-not-allowed"}`}
                >
                  {loadingStatus
                    ? "Updating..."
                    : driverStatus === "online"
                      ? "Online"
                      : "Offline"}
                </button>
              )}

              {/* AI Chat Icon - Only for users and admins */}
              {(user?.role === "user" || user?.role === "admin") && (
                <NavLink
                  to="/ai-chat"
                  className={({ isActive }) => `flex items-center gap-1 px-3 py-1 rounded-full font-medium transition ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-950 hover:bg-gray-200"}`}
                  title="AI Assistant"
                >
                  {({ isActive }) => (
                    <>
                      <svg
                        className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-700"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      <span className="text-sm font-medium hidden sm:inline">AI</span>
                    </>
                  )}
                </NavLink>
              )}

              {/* Avatar */}
              <div className="relative ml-2" ref={menuRef}>
                {user?.profilePicture ? (
                  <img
                    src={`http://localhost:6200${user.profilePicture}`}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover cursor-pointer border border-gray-300"
                    onClick={() => setOpen((prev) => !prev)}
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                )}

                {/* Dropdown */}
                {open && user?.role === "user" && (
                  <AccDropM user={user} onClose={() => setOpen(false)} />
                )}

                {open && user?.role === "driver" && (
                  <DriverDropM user={user} onClose={() => setOpen(false)} />
                )}

              </div>

            </>

          )}

        </div>

      </header>

    </div>
    </>
  );
};

export default Navbar;
