import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-8 tracking-tight">Account Menu</h2>

        <nav className="space-y-2">
          <NavLink end to="" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition font-medium ${isActive ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"}`}>
            Home
          </NavLink>
          <NavLink to="personal-info" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition font-medium ${isActive ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"}`}>
            Personal info
          </NavLink>
          <NavLink to="security" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition font-medium ${isActive ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"}`}>
            Security
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
