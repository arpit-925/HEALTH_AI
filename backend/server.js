import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import predictRoutes from "./routes/predict.js";
import hospitalRoutes from "./routes/hospitals.js";
import aiRoutes from "./routes/ai.js";
import diabetesRoutes from "./routes/diabetesRoutes.js";

dotenv.config();

const app = express();

// ─── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/predict", predictRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/diabetes", diabetesRoutes);

// ─── Health Check ───────────────────────────────────────────
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Connect to MongoDB & Start Server ──────────────────────
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });
