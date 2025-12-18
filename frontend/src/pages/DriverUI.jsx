import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../components/MapView";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const DriverUI = () => {
  const navigate = useNavigate();
  const { user, driverStatus, driverStatusLoading, token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(""); // "arrive" | "start" | "complete" | "refresh"
  const [pendingActionLoading, setPendingActionLoading] = useState({}); // { rideId: "accept" | "reject" }
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [paymentNotice, setPaymentNotice] = useState(null); // { rideId, fare, method }
  const [driverRoute, setDriverRoute] = useState(null);
  const [pickupCoord, setPickupCoord] = useState(null);
  const [dropoffCoord, setDropoffCoord] = useState(null);
  const lastRideIdRef = useRef(null);
  const activeStatuses = ["accepted", "arrived", "ongoing"]; // completed handled separately via lastRideId
  
  // 🚨 HARD GUARD
  useEffect(() => {
    if (driverStatusLoading) return;

    if (!user || user.role !== "driver") {
      navigate("/login", { replace: true });
      return;
    }

    if (driverStatus !== "online") {
      navigate("/driver-home", { replace: true });
    }
  }, [user, driverStatus, driverStatusLoading, navigate]);

  // Fetch pending requests for driver with polling
  useEffect(() => {
    if (!token || driverStatus !== "online") return;

    const activeStatuses = ["accepted", "arrived", "ongoing"]; // exclude completed here

    const fetchRequests = async () => {
      try {
        if (!actionLoading) setLoading(true);
        const res = await axios.get("http://localhost:6200/api/rides/driver", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rides = res.data || [];

        // Check if the last active ride was cancelled or paid
        if (lastRideIdRef.current) {
          const lastRide = rides.find((r) => r._id === lastRideIdRef.current);
          if (lastRide?.status === "cancelled") {
            setError("Ride was cancelled by the user");
            setCurrentRide(null);
            lastRideIdRef.current = null;
            setTimeout(() => setError(""), 5000);
            setLoading(false);
            return;
          } else if (lastRide?.status === "paid") {
            setPaymentNotice({ rideId: lastRide._id, fare: lastRide.fare, method: lastRide.paymentMethod });
            setCurrentRide(null);
            lastRideIdRef.current = null;
          }
        }

        // Update current ride and pause new search when active
        let activeRide = rides.find((r) => activeStatuses.includes(r.status));
        if (!activeRide && lastRideIdRef.current) {
          const lastRide = rides.find((r) => r._id === lastRideIdRef.current);
          if (lastRide && lastRide.status === "completed") {
            activeRide = lastRide;
          }
        }

        if (activeRide) {
          setCurrentRide(activeRide);
          if (activeStatuses.includes(activeRide.status)) {
            lastRideIdRef.current = activeRide._id;
          }
          setRequests([]); // pause new incoming rides while on a trip or awaiting payment
        } else {
          setCurrentRide(null);
          setRequests(rides);
        }

      } catch (err) {
        setError(err.response?.data?.message || "Failed to load ride requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    
    // Poll every 5 seconds to detect cancellations and new requests
    const interval = setInterval(fetchRequests, 5000);
    
    return () => clearInterval(interval);
  }, [token, driverStatus, actionLoading]);

  const pendingRequests = useMemo(
    () => requests.filter((r) => ["requested", "searching"].includes(r.status)),
    [requests]
  );

  const pickupPosition = useMemo(() => {
    const ride = currentRide || pendingRequests[0];
    if (ride?.pickup?.lat && ride?.pickup?.lng) {
      return [ride.pickup.lat, ride.pickup.lng];
    }
    return [22.5726, 88.3639]; // default Kolkata
  }, [currentRide, pendingRequests]);

  // Build route for accepted/active ride
  useEffect(() => {
    const makeRoute = async () => {
      const ride = currentRide;
      if (!ride?.pickup?.lat || !ride?.pickup?.lng || !ride?.dropoff?.lat || !ride?.dropoff?.lng) {
        setDriverRoute(null);
        setPickupCoord(null);
        setDropoffCoord(null);
        return;
      }
      setPickupCoord([ride.pickup.lat, ride.pickup.lng]);
      setDropoffCoord([ride.dropoff.lat, ride.dropoff.lng]);

      try {
        const res = await axios.post(
          "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
          {
            coordinates: [
              [ride.pickup.lng, ride.pickup.lat],
              [ride.dropoff.lng, ride.dropoff.lat],
            ],
          },
          {
            headers: {
              Authorization: import.meta.env.VITE_ORS_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        const feature = res.data?.features?.[0];
        if (feature?.geometry?.coordinates) {
          const leafletRoute = feature.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setDriverRoute(leafletRoute);
        } else {
          setDriverRoute(null);
        }
      } catch {
        setDriverRoute(null);
      }
    };

    // Only compute when we have an active ride
    if (currentRide && ["accepted", "arrived", "ongoing", "completed"].includes(currentRide.status)) {
      makeRoute();
    } else {
      setDriverRoute(null);
      setPickupCoord(null);
      setDropoffCoord(null);
    }
  }, [currentRide]);

  const refreshAfterAction = async () => {
    setActionLoading("refresh");
    try {
      const res = await axios.get("http://localhost:6200/api/rides/driver", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rides = res.data || [];
      let active = rides.find((r) => activeStatuses.includes(r.status));
      if (!active && lastRideIdRef.current) {
        const lastRide = rides.find((r) => r._id === lastRideIdRef.current);
        if (lastRide && lastRide.status === "completed") {
          active = lastRide;
        } else if (lastRide && lastRide.status === "paid") {
          setPaymentNotice({ rideId: lastRide._id, fare: lastRide.fare, method: lastRide.paymentMethod });
          lastRideIdRef.current = null;
        }
      }
      if (active) {
        setCurrentRide(active);
        setRequests([]);
      } else {
        setCurrentRide(null);
        setRequests(rides);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to refresh rides");
    }
    setActionLoading("");
  };

  const handlePendingAction = async (type, rideId) => {
    if (!rideId) return;
    const map = {
      accept: `http://localhost:6200/api/rides/${rideId}/accept`,
      reject: `http://localhost:6200/api/rides/${rideId}/reject`,
    };
    try {
      setPendingActionLoading({ [rideId]: type });
      setError("");
      const res = await axios.put(map[type], {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // First refresh the list
      const refreshRes = await axios.get("http://localhost:6200/api/rides/driver", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rides = refreshRes.data || [];

      // Prefer populated data from refreshed list
      const active = rides.find((r) => activeStatuses.includes(r.status));
      if (type === "accept") {
        setCurrentRide(active || res.data);
        lastRideIdRef.current = (active || res.data)?._id || null;
        setRequests(active ? [] : rides);
      } else {
        setRequests(rides);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${type} ride`);
    } finally {
      setPendingActionLoading({});
    }
  };

  // Auto-hide payment toast after a short duration
  useEffect(() => {
    if (!paymentNotice) return;
    const timer = setTimeout(() => setPaymentNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [paymentNotice]);

  const handleLifecycle = async (type) => {
    if (!currentRide) return;
    const map = {
      arrive: `http://localhost:6200/api/rides/${currentRide._id}/arrive`,
      start: `http://localhost:6200/api/rides/${currentRide._id}/start`,
      complete: `http://localhost:6200/api/rides/${currentRide._id}/complete`,
    };

    try {
      setActionLoading(type);
      setError("");
      setStatusMessage("");
      const res = await axios.put(map[type], {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Refresh the requests list and prefer populated active ride
      const refreshRes = await axios.get("http://localhost:6200/api/rides/driver", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rides = refreshRes.data || [];
      let active = rides.find((r) => activeStatuses.includes(r.status));
      if (!active && res.data?.status === "completed") {
        active = res.data;
      }
      setCurrentRide(active || null);
      if (active) {
        lastRideIdRef.current = active._id;
        setRequests([]);
      } else {
        setRequests(rides);
      }
      
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${type} ride`);
    } finally {
      setActionLoading("");
    }
  };

  // ⏳ Loading state
  if (driverStatusLoading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-gray-600">Checking driver status…</p>
      </div>
    );
  }

  if (driverStatus !== "online") return null;

  return (
    <div className="flex h-[calc(100vh-64px)] p-7 gap-7">
      {/* LEFT PANEL (matched Ride.jsx styling) */}
      <div className="bg-white rounded-2xl border border-gray-400 shadow-lg flex w-full max-w-lg overflow-hidden">
        <div className="w-full p-6 bg-white shadow-lg z-10">
          <h2 className="text-xl font-semibold mb-2">Driver Dashboard</h2>

          {/* Driver info */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-600">
                Status: <span className="text-green-600">Online</span>
              </p>
            </div>
            <button
              onClick={refreshAfterAction}
              disabled={actionLoading === "refresh"}
              className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {actionLoading === "refresh" ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Incoming Rides */}
          <div className="rounded-xl border border-gray-300 p-4 mb-4 bg-white">
            <h3 className="font-semibold text-gray-900 mb-2">Incoming Rides ({pendingRequests.length})</h3>
            {loading ? (
              <p className="text-sm text-gray-600">Loading ride requests…</p>
            ) : pendingRequests.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pendingRequests.map((request) => (
                  <div key={request._id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="text-sm text-gray-700 space-y-1 mb-3">
                      <p><span className="font-medium text-gray-600">Rider:</span> {request.user?.name || "Unknown"}</p>
                      <p><span className="font-medium text-gray-600">Pickup:</span> {request.pickup?.address || "Unknown"}</p>
                      <p><span className="font-medium text-gray-600">Dropoff:</span> {request.dropoff?.address || "Unknown"}</p>
                      <p><span className="font-medium text-gray-600">Fare:</span> ₹{request.fare}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePendingAction("accept", request._id)}
                        disabled={pendingActionLoading[request._id] === "accept"}
                        className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                      >
                        {pendingActionLoading[request._id] === "accept" ? "Accepting..." : "Accept"}
                      </button>
                      <button
                        onClick={() => handlePendingAction("reject", request._id)}
                        disabled={pendingActionLoading[request._id] === "reject"}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                      >
                        {pendingActionLoading[request._id] === "reject" ? "Rejecting..." : "Reject"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">No incoming rides right now.</p>
            )}
          </div>

          {/* Current Ride (after acceptance) */}
          {currentRide && (
            <div className="rounded-xl border border-blue-300 p-4 mb-4 bg-blue-50">
              <h3 className="font-semibold text-blue-900 mb-2">Current Ride</h3>
              <div className="text-sm text-gray-700 space-y-1 mb-3">
                <p><span className="font-medium text-gray-600">Rider:</span> {currentRide.user?.name || "Unknown"}</p>
                <p><span className="font-medium text-gray-600">Pickup:</span> {currentRide.pickup?.address || "Unknown"}</p>
                <p><span className="font-medium text-gray-600">Dropoff:</span> {currentRide.dropoff?.address || "Unknown"}</p>
                <p><span className="font-medium text-gray-600">Fare:</span> ₹{currentRide.fare}</p>
                <p><span className="font-medium text-gray-600">Status:</span> <span className="capitalize font-semibold text-blue-700">{currentRide.status}</span></p>
              </div>

              {/* Lifecycle actions */}
              {currentRide.status !== "completed" ? (
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleLifecycle("arrive")}
                    disabled={currentRide.status !== "accepted" || actionLoading === "arrive"}
                    className="px-3 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {actionLoading === "arrive" ? "Arriving..." : "Arrived"}
                  </button>
                  <button
                    onClick={() => handleLifecycle("start")}
                    disabled={(currentRide.status !== "arrived" && currentRide.status !== "accepted") || actionLoading === "start"}
                    className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {actionLoading === "start" ? "Starting..." : "Start"}
                  </button>
                  <button
                    onClick={() => handleLifecycle("complete")}
                    disabled={currentRide.status !== "ongoing" || actionLoading === "complete"}
                    className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    {actionLoading === "complete" ? "Completing..." : "Complete"}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                    ⏳ Ride completed. Awaiting rider payment…
                  </div>
                  <p className="text-xs text-gray-600">New requests are paused until payment is confirmed.</p>
                </div>
              )}
            </div>
          )}
          {statusMessage && (
            <div className="mt-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">
              {statusMessage}
            </div>
          )}
        </div>
      </div>

      {paymentNotice && (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
          <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg min-w-[220px]">
            <p className="font-semibold">Payment completed</p>
            <p className="text-sm">Fare ₹{paymentNotice.fare} received via {paymentNotice.method || "cash"}.</p>
          </div>
        </div>
      )}

      {/* MAP (matched Ride.jsx container) */}
      <div className="bg-white rounded-2xl shadow-lg flex w-full overflow-hidden h-full">
        <div className="w-full h-full">
          <MapView position={pickupPosition} route={driverRoute} pickup={pickupCoord} dropoff={dropoffCoord} />
        </div>
      </div>
    </div>
  );
};

export default DriverUI;
