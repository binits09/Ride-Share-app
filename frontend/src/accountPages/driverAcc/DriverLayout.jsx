import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const DriverLayout = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="font-semibold mb-4">Driver Account</h2>

        <nav className="space-y-1 text-sm">
          <NavLink end to="" className="block px-3 py-2 rounded hover:bg-gray-100">
            Home
          </NavLink>
          <NavLink to="personal-info" className="block px-3 py-2 rounded hover:bg-gray-100">
            Personal info
          </NavLink>
          <NavLink to="vehicle" className="block px-3 py-2 rounded hover:bg-gray-100">
            Vehicle details
          </NavLink>
          <NavLink to="earnings" className="block px-3 py-2 rounded hover:bg-gray-100">
            Earnings
          </NavLink>
          <NavLink to="security" className="block px-3 py-2 rounded hover:bg-gray-100">
            Security
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DriverLayout;
