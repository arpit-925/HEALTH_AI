import { motion } from "framer-motion";

/**
 * FeatureImportanceChart — Animated horizontal bar chart
 * 
 * Displays how much each symptom/feature influenced the risk score.
 * Uses pure CSS + framer-motion, no chart library needed.
 * High-contrast colors for accessibility.
 */
export default function FeatureImportanceChart({ featureImportance = [], title = "Feature Importance" }) {
    if (!featureImportance || featureImportance.length === 0) return null;

    const getBarColor = (weight, index) => {
        if (weight > 0.3) return { bg: "from-red-500 to-rose-400", text: "text-red-400", label: "High Impact" };
        if (weight > 0.15) return { bg: "from-amber-500 to-yellow-400", text: "text-amber-400", label: "Medium Impact" };
        return { bg: "from-teal-500 to-emerald-400", text: "text-teal-400", label: "Low Impact" };
    };

    const maxWeight = Math.max(...featureImportance.map((f) => f.weight));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <p className="text-xs text-gray-500">How each factor influenced the prediction</p>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-4 text-xs">
                {[
                    { color: "bg-red-500", label: "High Impact" },
                    { color: "bg-amber-500", label: "Medium Impact" },
                    { color: "bg-teal-500", label: "Low Impact" },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                        <span className="text-gray-400">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Bars */}
            <div className="space-y-3">
                {featureImportance.map((item, index) => {
                    const barPercentage = Math.max((item.weight / maxWeight) * 100, 8);
                    const displayPercentage = Math.round(item.weight * 100);
                    const colorInfo = getBarColor(item.weight, index);

                    return (
                        <motion.div
                            key={item.feature}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + index * 0.08 }}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-medium text-gray-200 truncate max-w-[60%]">
                                    {item.feature}
                                </span>
                                <span className={`text-xs font-bold ${colorInfo.text} tabular-nums`}>
                                    {displayPercentage}%
                                </span>
                            </div>
                            <div className="h-5 bg-white/[0.04] rounded-lg overflow-hidden relative border border-white/[0.06]">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${barPercentage}%` }}
                                    transition={{ duration: 0.8, delay: 0.2 + index * 0.08, ease: "easeOut" }}
                                    className={`h-full bg-gradient-to-r ${colorInfo.bg} rounded-lg relative`}
                                >
                                    <div className="absolute inset-0 bg-white/10 rounded-lg" />
                                </motion.div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
