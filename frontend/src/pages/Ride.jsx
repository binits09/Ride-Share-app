import React, { useState } from "react";
import axios from "axios";
import MapView from "../components/MapView";


const Ride = () => {
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




    console.log("ORS KEY:", import.meta.env.VITE_ORS_KEY);


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
            speedFactor: 1.1, // slightly faster
        },
        car: {
            label: "Car",
            baseFare: 40,
            perKm: 12,
            speedFactor: 1,
        },
    };



    const handleSearch = async () => {
        const pickupCoords = await searchLocation(pickup);
        const dropoffCoords = await searchLocation(dropoff);

        if (!pickupCoords || !dropoffCoords) return;

        const data = await getRoute(pickupCoords, dropoffCoords);

        const leafletRoute = data.coordinates.map(([lng, lat]) => [lat, lng]);
        setRoute(leafletRoute);

        const km = Number((data.distance / 1000).toFixed(2));
        const mins = Math.ceil(data.duration / 60);

        const results = Object.entries(RIDE_CONFIG).map(([key, cfg]) => ({
            type: key,
            label: cfg.label,
            time: Math.ceil(mins / cfg.speedFactor),
            price: Math.round(cfg.baseFare + km * cfg.perKm),
        }));
        setOptions(results);
        setDistance(km);
        setDuration(mins);


        setPosition([pickupCoords.lat, pickupCoords.lon]);
        setPickupCoord([pickupCoords.lat, pickupCoords.lon]);
        setDropoffCoord([dropoffCoords.lat, dropoffCoords.lon]);

        setHasSearched(true);

    };



    return (
        <div className="flex h-[calc(100vh-64px)] p-7 gap-7">

            <div className="bg-white rounded-2xl border border-gray-400 shadow-lg flex max-w-2xl max-h-110 overflow-hidden">

                {/* LEFT PANEL */}
                <div className="w-full p-6 bg-white shadow-lg z-10">
                    <h2 className="text-xl font-semibold mb-4">Get a ride</h2>

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
                        className="w-full bg-black text-white py-3 rounded"
                        onClick={handleSearch}
                    >
                        Search
                    </button>

                    

                    {hasSearched && options && (
                        <div className="mt-4 space-y-3">
                            {options.map((opt) => (
                                <button
                                    key={opt.type}
                                    onClick={() => setRideType(opt.type)}
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
