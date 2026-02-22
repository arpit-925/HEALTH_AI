import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useHealth } from "../context/HealthContext";
import { useNavigate } from "react-router-dom";
import RiskResult from "./RiskResult";

export default function SymptomForm() {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    symptoms: "",
  });
  const { user } = useAuth();
  const { prediction, loading, error, analyzeSymptoms, clearPrediction } = useHealth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await analyzeSymptoms(formData);
    } catch {
      // error is handled by context
    }
  };

  const handleReset = () => {
    clearPrediction();
    setFormData({ age: "", gender: "", symptoms: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card rounded-2xl p-8 w-full max-w-lg border border-white/10"
    >
      <AnimatePresence mode="wait">
        {!prediction ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="text-center mb-2">
              <h3 className="text-lg font-semibold text-white">Symptom Analysis</h3>
              <p className="text-sm text-gray-400">Enter your details for AI-powered health assessment</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Age</label>
              <input
                type="number"
                placeholder="Enter your age"
                required
                min="1"
                max="120"
                className="input-field"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Gender</label>
              <select
                required
                className="input-field"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Symptoms */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Symptoms</label>
              <textarea
                placeholder="e.g. headache, fatigue, dizziness, chest pain"
                required
                rows={3}
                className="input-field resize-none"
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 transition-all duration-300 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "🔬 Analyze My Risk"
              )}
            </button>

            {!user && (
              <p className="text-center text-xs text-gray-500">
                You'll need to{" "}
                <button type="button" onClick={() => navigate("/login")} className="text-teal-400 hover:text-teal-300">
                  sign in
                </button>{" "}
                to analyze symptoms
              </p>
            )}
          </motion.form>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RiskResult data={prediction} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}