import express from "express";
import axios from "axios";

const router = express.Router();

// ─── Overpass API mirrors (fallback list) ────────────────────
const OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];

/**
 * Try fetching from multiple Overpass mirrors.
 * Returns the first successful response.
 */
async function queryOverpass(overpassQuery) {
    let lastError = null;
    for (const endpoint of OVERPASS_ENDPOINTS) {
        try {
            const response = await axios.get(endpoint, {
                params: { data: overpassQuery },
                timeout: 20000, // 20s per attempt
            });
            return response;
        } catch (err) {
            console.warn(`⚠️  Overpass mirror failed (${endpoint}):`, err.message);
            lastError = err;
        }
    }
    throw lastError;
}

/**
 * Parse Overpass API elements into a clean hospital array.
 */
function parseHospitals(elements) {
    return elements
        .map((el) => {
            // For 'way' elements, coordinates are in el.center; for nodes, in el directly
            const lat = el.lat ?? el.center?.lat ?? null;
            const lng = el.lon ?? el.center?.lon ?? null;

            return {
                id: el.id,
                name: el.tags?.name || "Unnamed Hospital/Clinic",
                type: el.tags?.amenity || "hospital",
                lat,
                lng,
                phone: el.tags?.phone || el.tags?.["contact:phone"] || null,
                website: el.tags?.website || el.tags?.["contact:website"] || null,
                address:
                    [
                        el.tags?.["addr:street"],
                        el.tags?.["addr:city"],
                        el.tags?.["addr:state"],
                    ]
                        .filter(Boolean)
                        .join(", ") || null,
                emergency: el.tags?.emergency === "yes",
            };
        })
        .filter((h) => h.lat != null && h.lng != null) // Filter out entries missing coordinates
        .slice(0, 30);
}

/**
 * Fallback: use Nominatim to search for hospitals when Overpass is down.
 */
async function nominatimFallback(latitude, longitude, radius) {
    console.log("🔄 Falling back to Nominatim API for hospital search...");

    const viewbox = getBoundingBox(latitude, longitude, radius);
    const results = [];

    for (const query of ["hospital", "clinic"]) {
        try {
            const response = await axios.get(
                "https://nominatim.openstreetmap.org/search",
                {
                    params: {
                        q: query,
                        format: "json",
                        limit: 15,
                        viewbox: `${viewbox.minLng},${viewbox.maxLat},${viewbox.maxLng},${viewbox.minLat}`,
                        bounded: 1,
                        addressdetails: 1,
                    },
                    headers: {
                        "User-Agent": "HealthGuard-AI/1.0",
                    },
                    timeout: 15000,
                }
            );

            const parsed = response.data.map((place) => ({
                id: parseInt(place.place_id),
                name: place.display_name.split(",")[0],
                type: query,
                lat: parseFloat(place.lat),
                lng: parseFloat(place.lon),
                phone: null,
                website: null,
                address: place.display_name.split(",").slice(1, 4).join(",").trim() || null,
                emergency: false,
            }));

            results.push(...parsed);
        } catch (err) {
            console.warn(`⚠️  Nominatim "${query}" search failed:`, err.message);
        }
    }

    return results.slice(0, 30);
}

/**
 * Get a bounding box around a point.
 */
function getBoundingBox(lat, lng, radiusMeters) {
    const latDelta = radiusMeters / 111320;
    const lngDelta = radiusMeters / (111320 * Math.cos((lat * Math.PI) / 180));
    return {
        minLat: lat - latDelta,
        maxLat: lat + latDelta,
        minLng: lng - lngDelta,
        maxLng: lng + lngDelta,
    };
}

// ─── GET /api/hospitals?lat=X&lng=Y ─────────────────────────
// Find nearby hospitals using OpenStreetMap Overpass API (with fallback)
router.get("/", async (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res
                .status(400)
                .json({ message: "Please provide lat and lng query parameters" });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res
                .status(400)
                .json({ message: "lat and lng must be valid numbers" });
        }

        const radius = 5000; // 5km radius

        // Overpass API query for hospitals & clinics
        const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${latitude},${longitude});
        way["amenity"="hospital"](around:${radius},${latitude},${longitude});
        node["amenity"="clinic"](around:${radius},${latitude},${longitude});
        way["amenity"="clinic"](around:${radius},${latitude},${longitude});
      );
      out body center;
    `;

        let hospitals = [];

        try {
            // Primary: Overpass API with multi-mirror fallback
            const response = await queryOverpass(overpassQuery);
            hospitals = parseHospitals(response.data.elements || []);
            console.log(`✅ Overpass returned ${hospitals.length} hospitals`);
        } catch (overpassError) {
            console.error("❌ All Overpass mirrors failed:", overpassError.message);

            // Fallback: Nominatim
            hospitals = await nominatimFallback(latitude, longitude, radius);
            console.log(`✅ Nominatim fallback returned ${hospitals.length} hospitals`);
        }

        res.json(hospitals);
    } catch (error) {
        console.error("❌ Hospital search error:", error.message);
        res.status(500).json({
            message: "Failed to fetch nearby hospitals",
            error: error.message,
        });
    }
});

export default router;
