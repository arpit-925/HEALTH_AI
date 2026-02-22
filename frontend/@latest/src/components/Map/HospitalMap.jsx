import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { getNearbyHospitals } from "../../services/api";

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom hospital marker
const hospitalIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// User location marker (teal)
const userIcon = new L.DivIcon({
    className: "user-marker",
    html: `<div style="width:20px;height:20px;background:linear-gradient(135deg,#14b8a6,#22c55e);border-radius:50%;border:3px solid white;box-shadow:0 0 12px rgba(20,184,166,0.5);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

// Component to fly to a position
function FlyTo({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 14, { duration: 1.5 });
        }
    }, [position, map]);
    return null;
}

export default function HospitalMap() {
    const [position, setPosition] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const coords = [pos.coords.latitude, pos.coords.longitude];
                setPosition(coords);

                try {
                    const res = await getNearbyHospitals(coords[0], coords[1]);
                    setHospitals(res.data);
                } catch {
                    setError("Failed to fetch nearby hospitals");
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError("Unable to get your location. Please enable location access.");
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 glass-card rounded-xl border border-white/5">
                <svg className="animate-spin h-10 w-10 text-teal-400 mb-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-gray-400">Detecting your location...</p>
                <p className="text-gray-600 text-sm mt-1">Please allow location access when prompted</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 glass-card rounded-xl border border-white/5">
                <span className="text-4xl mb-4">📍</span>
                <p className="text-red-400 font-medium">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 rounded-lg bg-teal-500/10 text-teal-400 text-sm font-medium hover:bg-teal-500/20 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Map */}
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl" style={{ height: "480px" }}>
                <MapContainer
                    center={position || [20.5937, 78.9629]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    {position && <FlyTo position={position} />}

                    {/* User marker */}
                    {position && (
                        <Marker position={position} icon={userIcon}>
                            <Popup>
                                <div className="text-center font-medium">📍 Your Location</div>
                            </Popup>
                        </Marker>
                    )}

                    {/* Hospital markers */}
                    {hospitals.map((hosp) => (
                        <Marker
                            key={hosp.id}
                            position={[hosp.lat, hosp.lng]}
                            icon={hospitalIcon}
                        >
                            <Popup>
                                <div className="min-w-48">
                                    <h3 className="font-bold text-sm">{hosp.name}</h3>
                                    <p className="text-xs text-gray-500 capitalize mt-1">
                                        {hosp.type === "hospital" ? "🏥 Hospital" : "🏨 Clinic"}
                                        {hosp.emergency && " • 🚨 Emergency"}
                                    </p>
                                    {hosp.address && (
                                        <p className="text-xs text-gray-600 mt-1">📍 {hosp.address}</p>
                                    )}
                                    {hosp.phone && (
                                        <a href={`tel:${hosp.phone}`} className="text-xs text-blue-500 block mt-1">
                                            📞 {hosp.phone}
                                        </a>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Hospital list */}
            {hospitals.length > 0 && (
                <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                        <h3 className="text-white font-bold">
                            {hospitals.length} {hospitals.length === 1 ? "Hospital" : "Hospitals"} Found Nearby
                        </h3>
                    </div>
                    <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                        {hospitals.map((hosp) => (
                            <div key={hosp.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="text-white font-medium text-sm">{hosp.name}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5 capitalize">
                                            {hosp.type === "hospital" ? "🏥 Hospital" : "🏨 Clinic"}
                                            {hosp.emergency && " • 🚨 Emergency Services"}
                                        </p>
                                        {hosp.address && (
                                            <p className="text-xs text-gray-600 mt-0.5">{hosp.address}</p>
                                        )}
                                    </div>
                                    {hosp.phone && (
                                        <a
                                            href={`tel:${hosp.phone}`}
                                            className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 text-xs font-medium hover:bg-teal-500/20 transition-colors flex-shrink-0"
                                        >
                                            📞 Call
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
