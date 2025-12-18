import React, { useState, useEffect } from "react";
import axios from "axios";
import MapView from "../components/MapView";
import { useAuth } from "../context/AuthContext";


const Ride = () => {
    const { token, user } = useAuth();
    const [route, setRoute] = useState([]);
    const [pickupCoord, setPickupCoord] = useState(null);
    const [dropoffCoord, setDropoffCoord] = useState(null);
    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [position, setPosition] = useState([22.5726, 88.3639]); // Kolkata
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [fare, setFare] = useState(null);
    const [rideType, setRideType] = useState("bike");
    const [options, setOptions] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [requesting, setRequesting] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [error, setError] = useState("");
    const [myRide, setMyRide] = useState(null);
    const [cancelling, setCancelling] = useState(false);
    const [dismissed, setDismissed] = useState(false);


    const searchLocation = async (query) => {
        const res = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: {
                    q: query,
                    format: "json",
                    limit: 1,
                },
            }
        );

        if (res.data.length > 0) {
            return {
                lat: parseFloat(res.data[0].lat),
                lon: parseFloat(res.data[0].lon),
            };
        }
    };



    const getRoute = async (from, to) => {
        const res = await axios.post(
            "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
            {
                coordinates: [
                    [from.lon, from.lat],
                    [to.lon, to.lat],
                ],
            },
            {
                headers: {
                    Authorization: import.meta.env.VITE_ORS_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!res.data.features || res.data.features.length === 0) {
            throw new Error("No route found");
        }


        const feature = res.data.features[0]; // DEFINE feature

        return {
            coordinates: feature.geometry.coordinates,
            distance: feature.properties.summary.distance,
            duration: feature.properties.summary.duration,
        };
    };


    const RIDE_CONFIG = {
        bike: {
            label: "Bike",
            baseFare: 20,
            perKm: 8,
            speedKmH: 22,
        },
        car: {
            label: "Car",
            baseFare: 40,
            perKm: 12,
            speedKmH: 35,
        },
    };



    const handleSearch = async () => {
        if (!pickup || !dropoff) return;
        setLoading(true);
        try {
            const pickupCoords = await searchLocation(pickup);
            const dropoffCoords = await searchLocation(dropoff);

            if (!pickupCoords || !dropoffCoords) return;

            const data = await getRoute(pickupCoords, dropoffCoords);

            const leafletRoute = data.coordinates.map(([lng, lat]) => [lat, lng]);
            setRoute(leafletRoute);

            const km = Number((data.distance / 1000).toFixed(2));
            const mins = Math.ceil(data.duration / 60);

            const results = Object.entries(RIDE_CONFIG).map(([key, cfg]) => {
                const time = Math.max(1, Math.ceil((km / cfg.speedKmH) * 60));
                return {
                    type: key,
                    label: cfg.label,
                    time,
                    price: Math.round(cfg.baseFare + km * cfg.perKm),
                };
            });
            setOptions(results);
            setDistance(km);
            setDuration(mins);


            setPosition([pickupCoords.lat, pickupCoords.lon]);
            setPickupCoord([pickupCoords.lat, pickupCoords.lon]);
            setDropoffCoord([dropoffCoords.lat, dropoffCoords.lon]);

            setHasSearched(true);
            setSelectedOption(null);
        } finally {
            setLoading(false);
        }

    };

    const handleRequestRide = async () => {
        if (!selectedOption || !pickupCoord || !dropoffCoord) return;
        if (!token) {
            setError("Please log in to request a ride.");
            return;
        }

        try {
            setRequesting(true);
            setError("");
            setStatusMessage("");

            const payload = {
                pickup: {
                    address: pickup,
                    lat: pickupCoord[0],
                    lng: pickupCoord[1],
                },
                dropoff: {
                    address: dropoff,
                    lat: dropoffCoord[0],
                    lng: dropoffCoord[1],
                },
                fare: selectedOption.price,
                driverId: null, // assignment not implemented; backend handles searching state
            };

            await axios.post("http://localhost:6200/api/rides/request", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setDismissed(false);
            setStatusMessage("Ride requested. Searching for a driver...");
            await fetchMyRide();

        } catch (err) {
            setError(err.response?.data?.message || "Failed to request ride");
        } finally {
            setRequesting(false);
        }
    };

    const fetchMyRide = async () => {
        if (!token) return;
        try {
            const res = await axios.get("http://localhost:6200/api/rides/my", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const activeStatuses = ["searching", "requested", "accepted", "arrived", "ongoing"];
            const status = res.data?.status;

            if (res.data && activeStatuses.includes(status)) {
                setMyRide(res.data);
            } else if (res.data && status === "completed" && !dismissed) {
                // Keep completed ride visible until user dismisses with OK
                setMyRide(res.data);
            } else {
                setMyRide(null);
            }
        } catch (err) {
            // swallow errors quietly
        }
    };

    const handleCancelRide = async () => {
        if (!myRide || !token) return;
        try {
            setCancelling(true);
            setError("");
            await axios.put(`http://localhost:6200/api/rides/${myRide._id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchMyRide();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to cancel ride");
        } finally {
            setCancelling(false);
        }
    };

    const handleClearRide = () => {
        setMyRide(null);
        setDismissed(true);
        setRoute([]);
        setPickupCoord(null);
        setDropoffCoord(null);
        setPickup("");
        setDropoff("");
        setOptions(null);
        setSelectedOption(null);
        setHasSearched(false);
        setDistance(null);
        setDuration(null);
        setPosition([22.5726, 88.3639]);
    };

    // When ride reaches completed, clear search results so the panel is clean
    useEffect(() => {
        if (myRide?.status === "completed") {
            setRoute([]);
            setPickupCoord(null);
            setDropoffCoord(null);
            setPickup("");
            setDropoff("");
            setOptions(null);
            setSelectedOption(null);
            setHasSearched(false);
            setDistance(null);
            setDuration(null);
            setPosition([22.5726, 88.3639]);
        }
    }, [myRide?.status]);

    useEffect(() => {
        // Don't fetch if user dismissed the completed ride
        if (dismissed) return;

        // Fetch on mount or when we don't have a ride cached
        if (!myRide) {
            fetchMyRide();
        }

        // Poll for ride status while there is an active ride
        const activeStatuses = ["searching", "requested", "accepted", "arrived", "ongoing"];
        const interval = setInterval(() => {
            if (myRide && activeStatuses.includes(myRide.status)) {
                fetchMyRide();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [token, myRide?.status, dismissed]);



    return (
        <div className="flex h-[calc(100vh-64px)] p-7 gap-7">

            <div className="bg-white rounded-2xl border border-gray-400 shadow-lg flex w-full max-w-xl overflow-hidden">

                {/* LEFT PANEL */}
                <div className="w-full p-6 bg-white shadow-lg z-10">
                    <h2 className="text-xl font-semibold mb-4">Get a ride</h2>

                    {/* Only show search inputs when no active ride */}
                    {!myRide?.status?.match(/searching|requested|accepted|arrived|ongoing/) && (
                        <>
                            <input
                                value={pickup}
                                onChange={(e) => setPickup(e.target.value)}
                                placeholder="Pickup location"
                                className="w-full p-3 mb-3 border rounded"
                            />

                            <input
                                value={dropoff}
                                onChange={(e) => setDropoff(e.target.value)}
                                placeholder="Dropoff location"
                                className="w-full p-3 mb-3 border rounded"
                            />

                            <button
                                className={`w-full bg-black text-white py-3 ${loading ? "rounded-full" : "rounded"} transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60`}
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                {loading && (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                )}
                                <span>{loading ? "Searching..." : "Search"}</span>
                            </button>
                        </>
                    )}

                    {hasSearched && options && !myRide?.status?.match(/searching|requested|accepted|arrived|ongoing/) && (
                        <div className="mt-4 space-y-3">
                            {options.map((opt) => (
                                <button
                                    key={opt.type}
                                    onClick={() => { setRideType(opt.type); setSelectedOption(opt); }}
                                    className={`w-full flex justify-between items-center p-3 rounded-lg border
          ${rideType === opt.type ? "border-black bg-gray-100" : "hover:bg-gray-50"}`} >
                                    <div>
                                        <p className="font-semibold">
                                            {opt.type === "bike" ? "🏍 Bike" : "🚗 Car"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {distance} km • {opt.time} mins
                                        </p>
                                    </div>

                                    <div className="text-lg font-semibold">
                                        ₹{opt.price}
                                    </div>
                                </button>
                            ))}
                            {selectedOption && (
                                <button
                                    onClick={handleRequestRide}
                                    disabled={requesting}
                                    className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {requesting ? "Requesting..." : "Request Ride"}
                                </button>
                            )}
                        </div>
                    )}

                    {myRide && ["searching", "requested", "accepted", "arrived", "ongoing", "completed"].includes(myRide.status) && (
                        <div className="mt-4 rounded-xl border-2 border-blue-400 bg-linear-to-br from-blue-50 to-white p-5 shadow-md">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-bold text-gray-900">Your Ride</h3>
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                                    ${myRide.status === "searching" ? "bg-yellow-100 text-yellow-800" : ""}
                                    ${myRide.status === "requested" ? "bg-orange-100 text-orange-800" : ""}
                                    ${myRide.status === "accepted" ? "bg-blue-100 text-blue-800" : ""}
                                    ${myRide.status === "arrived" ? "bg-purple-100 text-purple-800" : ""}
                                    ${myRide.status === "ongoing" ? "bg-green-100 text-green-800" : ""}
                                    ${myRide.status === "completed" ? "bg-green-200 text-green-900" : ""}
                                `}>
                                    {myRide.status}
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-500
                                        ${myRide.status === "searching" ? "bg-yellow-500 w-1/6" : ""}
                                        ${myRide.status === "requested" ? "bg-orange-500 w-2/6" : ""}
                                        ${myRide.status === "accepted" ? "bg-blue-500 w-3/6" : ""}
                                        ${myRide.status === "arrived" ? "bg-purple-500 w-4/6" : ""}
                                        ${myRide.status === "ongoing" ? "bg-green-500 w-5/6" : ""}
                                        ${myRide.status === "completed" ? "bg-green-600 w-full" : ""}
                                    `}
                                />
                            </div>

                            {/* Status message */}
                            <div className="mb-3 text-sm font-medium text-gray-700">
                                {myRide.status === "searching" && "🔍 Searching for a driver..."}
                                {myRide.status === "requested" && "📞 Driver assigned, waiting for acceptance..."}
                                {myRide.status === "accepted" && "✅ Driver accepted! They're on the way..."}
                                {myRide.status === "arrived" && "📍 Driver has arrived at pickup location"}
                                {myRide.status === "ongoing" && "🚗 Ride in progress..."}
                                {myRide.status === "completed" && "✅ Ride completed!"}
                            </div>

                            {/* Driver info when accepted or later */}
                            {myRide.driver && ["accepted", "arrived", "ongoing", "completed"].includes(myRide.status) && (
                                <div className="flex items-center gap-3 mb-3">
                                    {(() => {
                                        const pic = myRide.driver.profilePicture;
                                        let avatarUrl = null;
                                        if (pic) {
                                            if (/^https?:\/\//.test(pic)) {
                                                avatarUrl = pic;
                                            } else if (pic.startsWith('/uploads/') || pic.startsWith('uploads/')) {
                                                const p = pic.startsWith('/') ? pic : `/${pic}`;
                                                avatarUrl = `http://localhost:6200${p}`;
                                            } else {
                                                avatarUrl = `http://localhost:6200/uploads/${pic}`;
                                            }
                                        }
                                        return avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt="Driver"
                                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold border border-gray-300">
                                                {(myRide.driver.name || "D").charAt(0).toUpperCase()}
                                            </div>
                                        );
                                    })()}
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Driver</p>
                                        <p className="text-gray-900 font-semibold">{myRide.driver.name}</p>
                                        {(myRide.driver.vehicleModel || myRide.driver.vehicleNumber) && (
                                            <p className="text-sm text-gray-700">
                                                {myRide.driver.vehicleModel ? myRide.driver.vehicleModel : "Vehicle"}
                                                {myRide.driver.vehicleNumber ? ` • ${myRide.driver.vehicleNumber}` : ""}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Ride details */}
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <span className="text-green-600 font-bold">📍</span>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Pickup</p>
                                        <p className="text-gray-800 font-medium">{myRide.pickup?.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-red-600 font-bold">🎯</span>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Dropoff</p>
                                        <p className="text-gray-800 font-medium">{myRide.dropoff?.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200">
                                    <span className="text-gray-600 font-medium">Total Fare</span>
                                    <span className="text-xl font-bold text-green-600">₹{myRide.fare}</span>
                                </div>
                            </div>

                            {/* Cancel button - only show before ride starts */}
                            {["searching", "requested", "accepted", "arrived"].includes(myRide.status) && (
                                <button
                                    onClick={handleCancelRide}
                                    disabled={cancelling}
                                    className="w-full mt-3 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {cancelling ? "Cancelling..." : "Cancel Ride"}
                                </button>
                            )}

                            {/* OK button - only show when completed */}
                            {myRide.status === "completed" && (
                                <button
                                    onClick={handleClearRide}
                                    className="w-full mt-3 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-medium transition"
                                >
                                    OK
                                </button>
                            )}
                        </div>
                    )}



                </div>
            </div>


            {/* MAP */}
            <div className="bg-white rounded-2xl shadow-lg flex w-full overflow-hidden h-full">
                <div className="w-full h-full">
                    <MapView
                        position={position}
                        route={route}
                        pickup={pickupCoord}
                        dropoff={dropoffCoord}
                    />
                </div>
            </div>
        </div>
    );
};

export default Ride;
