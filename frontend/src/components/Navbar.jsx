
import { Link, useNavigate, useLocation } from "react-router-dom";
import AccDropM from "../layouts/AccDropM";
import React, { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const storedUser = localStorage.getItem("user");
  const user = storedUser && storedUser !== "undefined"
    ? JSON.parse(storedUser)
    : null;

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");


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
    <div className="w-full bg-white shadow-md shadow-gray-400 sticky top-0 z-50 overflow-visible">
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




              <div className="relative ml-2" ref={menuRef}>
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  {user?.name?.[0]?.toUpperCase()}
                </div>

                {/* Dropdown */}
                {open && <AccDropM user={user} onClose={() => setOpen(false)} />}
              </div>



            </>

          )}


        </div>


      </header>

    </div>

  );
};

export default Navbar;
