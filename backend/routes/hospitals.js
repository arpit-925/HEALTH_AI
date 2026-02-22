import express from "express";
import axios from "axios";

const router = express.Router();

// ─── GET /api/hospitals?lat=X&lng=Y ─────────────────────────
// Find nearby hospitals using OpenStreetMap Overpass API
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
        const radius = 5000; // 5km radius

        // Overpass API query for hospitals
        const overpassQuery = `
      [out:json][timeout:10];
      (
        node["amenity"="hospital"](around:${radius},${latitude},${longitude});
        way["amenity"="hospital"](around:${radius},${latitude},${longitude});
        node["amenity"="clinic"](around:${radius},${latitude},${longitude});
        way["amenity"="clinic"](around:${radius},${latitude},${longitude});
      );
      out center body;
    `;

        const response = await axios.get(
            "https://overpass-api.de/api/interpreter",
            {
                params: { data: overpassQuery },
                timeout: 15000,
            }
        );

        // Parse results
        const hospitals = response.data.elements
            .map((el) => ({
                id: el.id,
                name: el.tags?.name || "Unnamed Hospital/Clinic",
                type: el.tags?.amenity || "hospital",
                lat: el.lat || el.center?.lat,
                lng: el.lon || el.center?.lon,
                phone: el.tags?.phone || el.tags?.["contact:phone"] || null,
                website: el.tags?.website || el.tags?.["contact:website"] || null,
                address: [
                    el.tags?.["addr:street"],
                    el.tags?.["addr:city"],
                    el.tags?.["addr:state"],
                ]
                    .filter(Boolean)
                    .join(", ") || null,
                emergency: el.tags?.emergency === "yes",
            }))
            .filter((h) => h.lat && h.lng)
            .slice(0, 30); // Limit to 30 results

        res.json(hospitals);
    } catch (error) {
        console.error("Hospital search error:", error.message);
        res.status(500).json({
            message: "Failed to fetch nearby hospitals",
            error: error.message,
        });
    }
});

export default router;
