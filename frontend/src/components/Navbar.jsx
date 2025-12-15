
import { Link, useNavigate } from "react-router-dom";
import AccDropM from "../layouts/AccDropM";
import React, { useState, useRef, useEffect } from "react";
import { getDriverStatus, updateDriverStatus } from "../services/driverApi";
import { useAuth } from "../context/AuthContext";
import DriverDropM from "../layouts/DriverDropM";


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const { user, token, driverStatus, setDriverStatus } = useAuth();
  const homePath =
    user?.role === "driver" ? "/driver-home" : "/";


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

  }, [token, user?.role, user?.id]);


  const toggleDriverStatus = async () => {
    try {
      setLoadingStatus(true);

      const newStatus = driverStatus === "online";
      const res = await updateDriverStatus(!newStatus);

      const updatedStatus = res.data.isOnline ? "online" : "offline";

      setDriverStatus(updatedStatus);

    } catch (err) {
      alert("Failed to update status");
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

  const navigate = useNavigate();

  return (
    <div className="w-full bg-white shadow-md shadow-gray-400 sticky top-0 z-50 overflow-visible">
      <header className="p-4 max-w-400 mx-auto flex justify-between items-center">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <Link to={homePath} className="text-xl font-bold text-gray-900">
            Rebu Ride
          </Link>

          {token && (
            <>
              <Link
                to={homePath}
                className="text-sm text-gray-950 px-3 py-1 rounded-full hover:font-bold hover:bg-gray-200 transition"
              >
                Home
              </Link>

              {user?.role === "user" && (
                <Link
                  to="/ride"
                  className="text-sm text-gray-950 px-3 py-1 rounded-full hover:font-bold hover:bg-gray-200 transition"
                >
                  Ride
                </Link>
              )}

              {user?.role === "driver" && (
                <button
                  onClick={() => {
                    if (driverStatus !== "online") {
                      alert("You need to go online first...");
                      return;
                    }
                    navigate("/driver");
                  }}
                  className="text-sm text-gray-950 px-3 py-1 rounded-full hover:font-bold hover:bg-gray-200 transition"
                >
                  Drive
                </button>
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

              {/* Avatar */}
              <div className="relative ml-2" ref={menuRef}>
                <div
                  className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </div>

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

  );
};

export default Navbar;
