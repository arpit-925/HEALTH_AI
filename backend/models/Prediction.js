import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"],
    },
    symptoms: {
        type: [String],
        required: true,
    },
    disease: {
        type: String,
        required: true,
    },
    riskScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    preventive: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Prediction", predictionSchema);
