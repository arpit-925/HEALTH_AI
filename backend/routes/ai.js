import express from "express";
import axios from "axios";
import { callOllama } from "../utils/ollama.js";

const router = express.Router();

const ML_SERVICE_URL = "http://localhost:8000";

// ─── Chatbot with ML + Ollama ─────────────────────────────────
router.post("/explain", async (req, res) => {
  try {
    const { prediction, medicalData } = req.body;

    let mlPrediction = null;
    let mlContext = "";

    // ─── Step 1: If structured medical data is provided, call ML service ───
    if (medicalData && medicalData.age !== undefined) {
      try {
        // Detect which ML model to call based on available fields
        if (medicalData.HbA1c_level !== undefined || medicalData.blood_glucose_level !== undefined) {
          // Diabetes prediction
          const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict/diabetes`, {
            age: medicalData.age || 0,
            hypertension: medicalData.hypertension || 0,
            heart_disease: medicalData.heart_disease || 0,
            bmi: medicalData.bmi || 0,
            HbA1c_level: medicalData.HbA1c_level || 0,
            blood_glucose_level: medicalData.blood_glucose_level || 0,
            gender_Male: medicalData.gender_Male || 0,
            gender_Other: medicalData.gender_Other || 0,
            smoking_history_current: medicalData.smoking_history_current || 0,
            smoking_history_ever: medicalData.smoking_history_ever || 0,
            smoking_history_never: medicalData.smoking_history_never || 1,
            smoking_history_not_current: medicalData.smoking_history_not_current || 0,
            is_smoker_Smoker: medicalData.is_smoker_Smoker || 0
          });
          mlPrediction = mlResponse.data;
          const risk = mlPrediction.prediction === 1 ? "HIGH RISK" : "LOW RISK";
          mlContext = `
ML Model Diabetes Prediction Result:
- Prediction: ${risk}
- Risk Probability: ${(mlPrediction.risk_probability * 100).toFixed(1)}%
`;
        }

        if (medicalData.ChestPainType !== undefined || medicalData.Cholesterol !== undefined) {
          // Heart disease prediction
          const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict/heart`, {
            Age: medicalData.Age || medicalData.age || 0,
            Sex: medicalData.Sex || 0,
            ChestPainType: medicalData.ChestPainType || 0,
            RestingBP: medicalData.RestingBP || 0,
            Cholesterol: medicalData.Cholesterol || 0,
            FastingBS: medicalData.FastingBS || 0,
            RestingECG: medicalData.RestingECG || 0,
            MaxHR: medicalData.MaxHR || 0,
            ExerciseAngina: medicalData.ExerciseAngina || 0,
            Oldpeak: medicalData.Oldpeak || 0,
            ST_Slope: medicalData.ST_Slope || 0
          });
          const heartResult = mlResponse.data;
          const heartRisk = heartResult.prediction === 1 ? "HIGH RISK" : "LOW RISK";
          mlContext += `
ML Model Heart Disease Prediction Result:
- Prediction: ${heartRisk}
`;
        }
      } catch (mlError) {
        console.error("⚠ ML Service not available:", mlError.message);
        mlContext = "\n(Note: ML prediction service is currently unavailable)\n";
      }
    }

    // ─── Step 2: Build smart prompt with ML context ───────────
    const prompt = `
You are HealthGuard AI — a medical health assistant powered by machine learning models.

You have access to trained ML models for:
- Diabetes prediction (trained on 100k+ patient records)
- Heart disease prediction (trained on clinical data)

User's message: "${prediction}"
${mlContext}

Instructions:
- If ML prediction results are available above, explain them in simple language
- Provide a risk assessment based on the data
- Suggest precautions and next steps
- Always remind the patient to consult a real doctor
- Keep the response concise and helpful
- If no ML data is provided, answer the health question directly
`;

    const explanation = await callOllama(prompt);

    res.json({
      explanation,
      mlPrediction: mlPrediction || null
    });

  } catch (error) {
    console.error("AI ROUTE ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

export default router;