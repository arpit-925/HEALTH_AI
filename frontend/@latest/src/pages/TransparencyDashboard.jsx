import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import FeatureImportanceChart from "../components/FeatureImportanceChart";
import RiskGauge from "../components/RiskGauge";

/**
 * Transparency Dashboard — Explainable AI (XAI) page
 * 
 * Can be accessed directly at /transparency
 * or navigated to after a prediction with state data.
 */
export default function TransparencyDashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const predictionData = location.state?.prediction || null;

    // Demo data for direct access
    const [demoData] = useState({
        disease: "Diabetes",
        riskScore: 72,
        confidence: 78,
        featureImportance: [
            { feature: "Frequent Urination", weight: 0.32 },
            { feature: "Excessive Thirst", weight: 0.28 },
            { feature: "Fatigue", weight: 0.18 },
            { feature: "Blurred Vision", weight: 0.14 },
            { feature: "Weight Loss", weight: 0.08 },
        ],
        allDiseases: [
            { disease: "Diabetes", riskScore: 72, confidence: 78 },
            { disease: "Thyroid Disorder", riskScore: 35, confidence: 45 },
            { disease: "Hypertension", riskScore: 28, confidence: 38 },
        ],
    });

    const data = predictionData || demoData;

    return (
        <div className="min-h-screen px-4 py-10 max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                    <span className="text-lg">🧠</span>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                        Explainable AI
                    </span>
                </div>
                <h1 className="text-4xl font-extrabold text-white mb-2">
                    Transparency <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">Dashboard</span>
                </h1>
                <p className="text-gray-400 text-base max-w-lg mx-auto">
                    Understanding <strong className="text-white">why</strong> the AI made its prediction.
                    Every factor is visible and measurable.
                </p>
                {!predictionData && (
                    <p className="text-xs text-amber-400/70 mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/5 border border-amber-500/10">
                        📌 Showing demo data — run an Edge AI prediction for your personalized report
                    </p>
                )}
            </motion.div>

            <div className="space-y-6">
                {/* Risk Score Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card rounded-2xl p-8 border border-white/10 text-center"
                >
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-4">Primary Finding</p>
                    <RiskGauge score={data.riskScore} />
                    <h2 className="text-3xl font-extrabold text-white mt-4">{data.disease}</h2>
                    <div className="mt-3 flex items-center justify-center gap-3 max-w-xs mx-auto">
                        <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${data.confidence}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                            />
                        </div>
                        <span className="text-teal-400 font-bold">{data.confidence}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">AI Confidence</p>
                </motion.div>

                {/* Feature Importance Chart (Main XAI Visualization) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card rounded-2xl p-6 border border-white/10"
                >
                    <FeatureImportanceChart
                        featureImportance={data.featureImportance}
                        title="Why This Prediction?"
                    />
                </motion.div>

                {/* Risk Factors Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card rounded-2xl p-6 border border-white/10"
                >
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg">
                        <span>🔬</span> Risk Factor Cards
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {data.featureImportance.map((item, i) => {
                            const impact = item.weight > 0.25 ? "High" : item.weight > 0.12 ? "Medium" : "Low";
                            const impactColor = item.weight > 0.25
                                ? "text-red-400 bg-red-500/10 border-red-500/20"
                                : item.weight > 0.12
                                    ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                                    : "text-teal-400 bg-teal-500/10 border-teal-500/20";

                            return (
                                <motion.div
                                    key={item.feature}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + i * 0.05 }}
                                    className="glass-card rounded-xl p-4 border border-white/5"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-white">{item.feature}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${impactColor}`}>
                                            {impact}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.weight * 100}%` }}
                                            transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }}
                                            className={`h-full rounded-full ${item.weight > 0.25
                                                    ? "bg-gradient-to-r from-red-500 to-rose-400"
                                                    : item.weight > 0.12
                                                        ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                                                        : "bg-gradient-to-r from-teal-500 to-emerald-400"
                                                }`}
                                        />
                                    </div>
                                    <p className="text-right text-xs text-gray-500 mt-1 tabular-nums">{Math.round(item.weight * 100)}% influence</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Other Diseases */}
                {data.allDiseases && data.allDiseases.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card rounded-2xl p-6 border border-white/10"
                    >
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg">
                            <span>📊</span> Differential Analysis
                        </h3>
                        <div className="space-y-3">
                            {data.allDiseases.map((d, i) => (
                                <div key={d.disease} className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <span className="text-sm font-bold text-gray-200 w-8 text-center">{i + 1}</span>
                                    <span className="text-sm text-gray-300 font-medium flex-1">{d.disease}</span>
                                    <div className="w-24 h-2.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${d.riskScore}%` }}
                                            transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                                            className={`h-full rounded-full ${i === 0 ? "bg-gradient-to-r from-teal-500 to-emerald-400" : "bg-gradient-to-r from-gray-500 to-gray-400"
                                                }`}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-gray-400 tabular-nums w-12 text-right">{d.riskScore}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card rounded-2xl p-6 border border-white/10"
                >
                    <h3 className="font-bold text-white mb-3 flex items-center gap-2 text-lg">
                        <span>ℹ️</span> How Explainable AI Works
                    </h3>
                    <div className="text-sm text-gray-400 space-y-2">
                        <p>Our XAI system ensures complete transparency in health predictions:</p>
                        <ul className="list-disc list-inside space-y-1.5 ml-2">
                            <li>Each symptom is <strong className="text-white">weighted</strong> against known disease profiles</li>
                            <li>Feature importance shows how much each factor <strong className="text-teal-400">influenced</strong> the score</li>
                            <li>Differential analysis compares risk across <strong className="text-purple-400">multiple conditions</strong></li>
                            <li>All processing happens on-device with <strong className="text-violet-400">zero data collection</strong></li>
                        </ul>
                    </div>
                </motion.div>

                {/* Back to predictions */}
                <button
                    onClick={() => navigate("/edge")}
                    className="w-full py-4 rounded-xl font-bold text-lg text-violet-400 border-2 border-violet-500/30 hover:bg-violet-500/10 transition-all duration-300"
                >
                    ⚡ Run New Prediction
                </button>
            </div>
        </div>
    );
}
