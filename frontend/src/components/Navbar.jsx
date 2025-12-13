import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <div className="w-full bg-white shadow-md shadow-gray-400 sticky top-0 z-50">
    <header className="p-4 max-w-400 mx-auto flex justify-between items-center">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <Link to="/" className="text-xl font-bold text-gray-900">
          Rebu Ride
        </Link>
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
            <Link
              to="/"
              className="text-sm text-gray-950 px-3 py-1 rounded-full hover:font-bold hover:bg-gray-200 transition"
            >
              Home
            </Link>

            <Link
              to="/admin"
              className="text-sm text-gray-950 px-3 py-1 rounded-full hover:font-bold hover:bg-gray-200 transition"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
    </div>

  );
};

export default Navbar;
