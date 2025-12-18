import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const STATUS_STYLES = {
  paid: "bg-green-50 text-green-800 border-green-200",
  completed: "bg-blue-50 text-blue-800 border-blue-200",
  cancelled: "bg-red-50 text-red-800 border-red-200",
};

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleString();
};

const UserHistory = () => {
  const { token } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:6200/api/rides/history/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRides(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load ride history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);


  const grouped = useMemo(() => {
    return rides.reduce(
      (acc, ride) => {
        if (ride.status === "paid") acc.paid.push(ride);
        else if (ride.status === "completed") acc.completed.push(ride);
        else acc.cancelled.push(ride);
        return acc;
      },
      { paid: [], completed: [], cancelled: [] }
    );
  }, [rides]);

  const renderRideCard = (ride) => (
    <div key={ride._id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-600">Ride ID</p>
          <p className="text-base font-semibold text-gray-900 break-all">{ride._id}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_STYLES[ride.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
          {ride.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 text-sm text-gray-800">
        <div>
          <p className="text-gray-500">Pickup</p>
          <p className="font-medium">{ride.pickup?.address || "-"}</p>
        </div>
        <div>
          <p className="text-gray-500">Dropoff</p>
          <p className="font-medium">{ride.dropoff?.address || "-"}</p>
        </div>
        <div>
          <p className="text-gray-500">Fare</p>
          <p className="font-semibold">₹{ride.fare}</p>
        </div>
        <div>
          <p className="text-gray-500">Driver</p>
          <p className="font-medium">{ride.driver?.name || "-"}</p>
        </div>
        <div>
          <p className="text-gray-500">Requested</p>
          <p className="font-medium">{formatDate(ride.createdAt)}</p>
        </div>
        <div>
          <p className="text-gray-500">Last update</p>
          <p className="font-medium">{formatDate(ride.updatedAt)}</p>
        </div>
        {ride.status === "paid" && (
          <div>
            <p className="text-gray-500">Payment</p>
            <p className="font-medium">{ride.paymentMethod || "cash"}</p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <p className="text-gray-700">Loading your ride history…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 shadow-sm">
        {error}
      </div>
    );
  }

  const hasRides = rides.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ride history</h1>
        <p className="text-gray-600 mt-1">Completed, cancelled, and paid rides.</p>
      </div>

      

      {!hasRides && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="text-gray-700">No rides yet.</p>
        </div>
      )}

      {hasRides && (
        <div className="space-y-8">
          {grouped.paid.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <h2 className="text-lg font-semibold text-gray-900">Paid rides</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {grouped.paid.map(renderRideCard)}
              </div>
            </section>
          )}

          {grouped.completed.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">Completed (unpaid)</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {grouped.completed.map(renderRideCard)}
              </div>
            </section>
          )}

          {grouped.cancelled.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <h2 className="text-lg font-semibold text-gray-900">Cancelled</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {grouped.cancelled.map(renderRideCard)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default UserHistory;
