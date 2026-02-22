import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("healthguard_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Auth ───────────────────────────────────────────────────
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// ─── Predictions ────────────────────────────────────────────
export const predictSymptoms = (data) => API.post("/predict", data);
export const getPredictionHistory = () => API.get("/predict/history");

// ─── Hospitals ──────────────────────────────────────────────
export const getNearbyHospitals = (lat, lng) =>
    API.get(`/hospitals?lat=${lat}&lng=${lng}`);

export default API;
