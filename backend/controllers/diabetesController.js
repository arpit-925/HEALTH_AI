import axios from "axios";
import { callOllama } from "../utils/ollama.js";

const ML_SERVICE_URL = "http://localhost:8000/predict/diabetes";

export const predictDiabetes = async (req, res) => {
  try {
    const data = req.body;

    // ─── Validate input ────────────────────────────────────────
    const requiredFields = [
      "age", "hypertension", "heart_disease", "bmi",
      "HbA1c_level", "blood_glucose_level",
      "gender_Male", "gender_Other",
      "smoking_history_current", "smoking_history_ever",
      "smoking_history_never", "smoking_history_not_current",
      "is_smoker_Smoker"
    ];

    const missing = requiredFields.filter((f) => data[f] === undefined);
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing fields: ${missing.join(", ")}`
      });
    }

    // ─── Step 1: Call FastAPI ML Service for Prediction ────────
    let mlResult;
    try {
      const mlResponse = await axios.post(ML_SERVICE_URL, {
        age: data.age,
        hypertension: data.hypertension,
        heart_disease: data.heart_disease,
        bmi: data.bmi,
        HbA1c_level: data.HbA1c_level,
        blood_glucose_level: data.blood_glucose_level,
        gender_Male: data.gender_Male,
        gender_Other: data.gender_Other,
        smoking_history_current: data.smoking_history_current,
        smoking_history_ever: data.smoking_history_ever,
        smoking_history_never: data.smoking_history_never,
        smoking_history_not_current: data.smoking_history_not_current,
        is_smoker_Smoker: data.is_smoker_Smoker
      });
      mlResult = mlResponse.data;
    } catch (mlError) {
      console.error("❌ ML Service Error:", mlError.message);
      return res.status(502).json({
        success: false,
        error: "ML prediction service is not reachable. Is uvicorn running?"
      });
    }

    // ─── Step 2: Send prediction + data to Ollama for analysis ─
    const riskLabel = mlResult.prediction === 1 ? "HIGH RISK" : "LOW RISK";

    const prompt = `
You are a medical risk assessment AI assistant.

A machine learning model has analyzed the following patient data and produced a diabetes prediction.

Patient Data:
- Age: ${data.age}
- BMI: ${data.bmi}
- HbA1c Level: ${data.HbA1c_level}
- Blood Glucose Level: ${data.blood_glucose_level}
- Hypertension: ${data.hypertension === 1 ? "Yes" : "No"}
- Heart Disease: ${data.heart_disease === 1 ? "Yes" : "No"}
- Gender: ${data.gender_Male === 1 ? "Male" : data.gender_Other === 1 ? "Other" : "Female"}
- Smoking: ${data.is_smoker_Smoker === 1 ? "Current smoker" : "Non-smoker"}

ML Model Prediction: ${riskLabel}
Risk Probability: ${(mlResult.risk_probability * 100).toFixed(1)}%

Based on this data, please provide:

Risk Level: <Low / Moderate / High>

Explanation:
<2-3 sentence explanation>

Recommendations:
- <bullet 1>
- <bullet 2>
- <bullet 3>
`;

    const analysis = await callOllama(prompt);

    // ─── Return combined result ────────────────────────────────
    res.json({
      success: true,
      prediction: mlResult.prediction,
      risk_probability: mlResult.risk_probability,
      analysis: analysis
    });

  } catch (error) {
    console.error("❌ Diabetes Controller Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Internal server error during diabetes prediction"
    });
  }
};