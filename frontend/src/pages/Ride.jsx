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
        const res = await axios.get(
            `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}`,
            {
                params: {
                    overview: "full",
                    geometries: "geojson",
                },
            }
        );

        return res.data.routes[0].geometry.coordinates;
    };

    const handleSearch = async () => {
        const pickupCoords = await searchLocation(pickup);
        const dropoffCoords = await searchLocation(dropoff);

        if (!pickupCoords || !dropoffCoords) return;

        const coords = await getRoute(pickupCoords, dropoffCoords);
        setRoute(coords);

        setPosition([pickupCoords.lat, pickupCoords.lon]);

       setPickupCoord([pickupCoords.lat, pickupCoords.lon]);
setDropoffCoord([dropoffCoords.lat, dropoffCoords.lon]);


    };



    return (
        <div className="flex h-[calc(100vh-64px)] p-7 gap-7">

            <div className="bg-white rounded-2xl border border-gray-400 shadow-lg flex max-w-2xl max-h-2/4 overflow-hidden">

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
                </div>
            </div>

            {/* MAP */}
            <div className="bg-white rounded-2xl shadow-lg flex w-full overflow-hidden">
                <div className="hidden md:block w-full h-full">
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
