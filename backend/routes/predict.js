import express from "express";
import protect from "../middleware/auth.js";
import Prediction from "../models/Prediction.js";
import { analyzeSymptoms } from "../utils/predictionEngine.js";

const router = express.Router();

// ─── POST /api/predict ──────────────────────────────────────
// Analyze symptoms and save prediction
router.post("/", protect, async (req, res) => {
    try {
        const { age, gender, symptoms } = req.body;

        if (!age || !gender || !symptoms) {
            return res
                .status(400)
                .json({ message: "Please provide age, gender, and symptoms" });
        }

        // Parse symptoms: accept string (comma-separated) or array
        const symptomArray = Array.isArray(symptoms)
            ? symptoms
            : symptoms.split(",").map((s) => s.trim()).filter(Boolean);

        if (symptomArray.length === 0) {
            return res
                .status(400)
                .json({ message: "Please provide at least one symptom" });
        }

        // Run prediction engine
        const result = analyzeSymptoms({
            age: parseInt(age),
            gender,
            symptoms: symptomArray,
        });

        // Save to database
        const prediction = await Prediction.create({
            userId: req.user._id,
            age: parseInt(age),
            gender,
            symptoms: symptomArray,
            ...result,
        });

        res.status(201).json(prediction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─── GET /api/predict/history ───────────────────────────────
// Get user's prediction history
router.get("/history", protect, async (req, res) => {
    try {
        const predictions = await Prediction.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(predictions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
