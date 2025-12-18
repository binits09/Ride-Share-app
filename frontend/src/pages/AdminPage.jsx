import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SectionHeader = ({ title, count }) => (
  <div className="flex items-center justify-between mb-3">
    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    <span className="text-sm text-gray-600">{count} items</span>
  </div>
);

const AdminPage = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [rides, setRides] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driverStats, setDriverStats] = useState(null);

  useEffect(() => {
    if (!token) return;
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [u, d, r, h] = await Promise.all([
          axios.get("http://localhost:6200/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:6200/api/admin/drivers", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:6200/api/admin/rides", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:6200/api/admin/help-requests", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setUsers(u.data || []);
        setDrivers(d.data || []);
        setRides(r.data || []);
        setHelpRequests(h.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  const toggleBlockUser = async (id) => {
    try {
      setActionLoading(id);
      await axios.put(`http://localhost:6200/api/admin/block/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setUsers((prev) => prev.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setActionLoading("");
    }
  };

  const toggleBlockDriver = async (id) => {
    try {
      setActionLoading(id);
      await axios.put(`http://localhost:6200/api/admin/block-driver/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setDrivers((prev) => prev.map(d => d._id === id ? { ...d, isBlocked: !d.isBlocked } : d));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update driver");
    } finally {
      setActionLoading("");
    }
  };

  const openDriverProfile = async (driver) => {
    try {
      setSelectedDriver(driver);
      // Fetch driver rides from admin endpoint
      const res = await axios.get(`http://localhost:6200/api/admin/driver/${driver._id}/rides`, { headers: { Authorization: `Bearer ${token}` } });
      const driverRides = res.data || [];
      console.log("Driver rides:", driverRides);
      
      const completedRides = driverRides.filter(r => (r.status === "completed" || r.status === "paid") && r.fare);
      console.log("Completed rides:", completedRides);
      
      const totalEarnings = completedRides.reduce((sum, r) => sum + (r.fare || 0), 0);
      const earningsByDay = {};
      
      completedRides.forEach(r => {
        const date = new Date(r.createdAt).toLocaleDateString();
        earningsByDay[date] = (earningsByDay[date] || 0) + (r.fare || 0);
      });
      
      setDriverStats({
        totalRides: driverRides.length,
        completedRides: completedRides.length,
        totalEarnings: Math.round(totalEarnings),
        earningsByDay: Object.entries(earningsByDay).slice(-7).map(([date, earnings]) => ({ date, earnings: Math.round(earnings) })),
      });
    } catch (err) {
      console.error("Failed to fetch driver stats:", err);
      setDriverStats({
        totalRides: 0,
        completedRides: 0,
        totalEarnings: 0,
        earningsByDay: [],
      });
    }
  };

  const updateHelpStatus = async (id, status) => {
    try {
      setActionLoading(id);
      await axios.put(`http://localhost:6200/api/admin/help-request/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      setHelpRequests((prev) => prev.map(h => h._id === id ? { ...h, status } : h));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update help request");
    } finally {
      setActionLoading("");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Admin access only.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Loading admin dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  const NavButton = ({ label, value, count }) => (
    <button
      onClick={() => setTab(value)}
      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center justify-between ${
        tab === value
          ? "bg-blue-600 text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <span>{label}</span>
      <span className={`text-xs px-2 py-1 rounded-full ${tab === value ? "bg-blue-700" : "bg-gray-300"}`}>
        {count}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 shadow-sm flex flex-col">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Panel</h1>
          <div className="space-y-3">
            <NavButton label="Users" value="users" count={users.length} />
            <NavButton label="Drivers" value="drivers" count={drivers.length} />
            <NavButton label="Rides" value="rides" count={rides.length} />
            <NavButton label="Help Requests" value="help" count={helpRequests.length} />
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          className="w-full mt-auto px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">
        {tab === "users" && (
          <div className="space-y-3">
            <SectionHeader title="Users" count={users.length} />
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {users.map((u) => (
                <div key={u._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <p className="font-semibold text-gray-900">{u.name}</p>
                  <p className="text-sm text-gray-600">{u.email}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full border ${u.isAdmin ? "bg-purple-50 text-purple-700 border-purple-200" : u.isBlocked ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
                      {u.isAdmin ? "Admin" : u.isBlocked ? "Blocked" : "Active"}
                    </span>
                    {!u.isAdmin && (
                      <button
                        onClick={() => toggleBlockUser(u._id)}
                        disabled={actionLoading === u._id}
                        className="px-3 py-1 text-sm rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-60"
                      >
                        {actionLoading === u._id ? "Updating…" : u.isBlocked ? "Unblock" : "Block"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "drivers" && (
          <div className="space-y-3">
            <SectionHeader title="Drivers" count={drivers.length} />
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {drivers.map((d) => (
                <div key={d._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  {d.profilePicture && (
                    <div className="flex justify-center mb-3">
                      <img
                        src={`http://localhost:6200${d.profilePicture}`}
                        alt={d.name}
                        className="w-20 h-20 object-cover rounded-full border-2 border-gray-300"
                      />
                    </div>
                  )}
                  <p className="font-semibold text-gray-900">{d.name}</p>
                  <p className="text-sm text-gray-600">{d.email}</p>
                  <p className="text-xs text-gray-600 mt-1">Vehicle: {d.vehicleModel || "-"} • {d.vehicleNumber || "-"}</p>
                  <p className="text-xs text-gray-600">License: {d.licenseNumber || "-"}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${d.isBlocked ? "bg-red-50 text-red-700 border-red-200" : d.isApproved ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}>
                      {d.isBlocked ? "Blocked" : d.isApproved ? "Approved" : "Pending"}
                    </span>
                    <button
                      onClick={() => openDriverProfile(d)}
                      className="px-3 py-1 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => toggleBlockDriver(d._id)}
                      disabled={actionLoading === d._id}
                      className="px-3 py-1 text-sm rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-60"
                    >
                      {actionLoading === d._id ? "Updating…" : d.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "rides" && (
          <div className="space-y-3">
            <SectionHeader title="Rides" count={rides.length} />
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rides.map((r) => (
                <div key={r._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-700">User: {r.user?.name || "-"}</p>
                  <p className="text-sm text-gray-700">Driver: {r.driver?.name || "-"}</p>
                  <p className="text-sm text-gray-700">Status: <span className="font-semibold capitalize">{r.status}</span></p>
                  <p className="text-sm text-gray-700">Fare: ₹{r.fare}</p>
                  <p className="text-xs text-gray-500 mt-1">Pickup: {r.pickup?.address || "-"}</p>
                  <p className="text-xs text-gray-500">Dropoff: {r.dropoff?.address || "-"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "help" && (
          <div className="space-y-3">
            <SectionHeader title="Help Requests" count={helpRequests.length} />
            <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {helpRequests.map((h) => (
                <div key={h._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{h.user?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500">{h.user?.email || "-"}</p>
                      <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {h.userType}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${h.status === "resolved" ? "bg-green-50 text-green-700 border-green-200" : h.status === "closed" ? "bg-gray-50 text-gray-700 border-gray-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"}`}>
                      {h.status}
                    </span>
                  </div>
                  <p className="font-medium text-gray-800 text-sm mt-2">{h.subject}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{h.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(h.createdAt).toLocaleString()}</p>
                  <div className="flex gap-2 mt-3">
                    {h.status === "pending" && (
                      <button
                        onClick={() => updateHelpStatus(h._id, "resolved")}
                        disabled={actionLoading === h._id}
                        className="px-3 py-1 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                      >
                        Resolve
                      </button>
                    )}
                    {h.status !== "closed" && (
                      <button
                        onClick={() => updateHelpStatus(h._id, "closed")}
                        disabled={actionLoading === h._id}
                        className="px-3 py-1 text-sm rounded-lg bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-60"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DRIVER PROFILE MODAL */}
      {selectedDriver && driverStats && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-5xl w-full max-h-screen overflow-y-auto shadow-2xl border-2 border-gray-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {selectedDriver.profilePicture && (
                  <img
                    src={`http://localhost:6200${selectedDriver.profilePicture}`}
                    alt={selectedDriver.name}
                    className="w-16 h-16 object-cover rounded-full border-2 border-gray-300"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDriver.name}</h2>
                  <p className="text-gray-600">{selectedDriver.email}</p>
                  <p className="text-sm text-gray-500">License: {selectedDriver.licenseNumber}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedDriver(null);
                  setDriverStats(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Total Rides</p>
                <p className="text-2xl font-bold text-blue-600">{driverStats.totalRides}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-600">{driverStats.completedRides}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold text-purple-600">₹{driverStats.totalEarnings}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Earnings Last 7 Days</h3>
              <div className="flex items-end justify-between gap-3 h-48 px-2">
                {driverStats.earningsByDay.length > 0 ? (
                  driverStats.earningsByDay.map((item, idx) => {
                    const maxEarnings = Math.max(...driverStats.earningsByDay.map(d => d.earnings), 1);
                    const height = maxEarnings > 0 ? (item.earnings / maxEarnings) * 100 : 10;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-3 group">
                        <div className="relative w-full flex flex-col items-center">
                          <span className="text-xs font-bold text-blue-700 mb-1 opacity-0 group-hover:opacity-100 transition">₹{item.earnings}</span>
                          <div 
                            className="w-full bg-gradient-to-t from-blue-500 via-blue-600 to-purple-600 rounded-t-lg shadow-lg transition-all hover:shadow-xl hover:scale-105" 
                            style={{ height: `${height}%`, minHeight: '20px', maxWidth: '60px' }} 
                          />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-medium text-gray-700">{item.date.split('/')[1]}/{item.date.split('/')[0]}</span>
                          <span className="text-xs font-semibold text-blue-600">₹{item.earnings}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <p className="text-gray-500 text-sm">No earning data available</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-600 text-sm">Vehicle</p>
                <p className="font-semibold text-gray-900">{selectedDriver.vehicleModel} • {selectedDriver.vehicleNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className={`font-semibold ${selectedDriver.isApproved ? "text-green-600" : "text-yellow-600"}`}>
                  {selectedDriver.isApproved ? "Approved" : "Pending"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}    </div>
  );
};

export default AdminPage;