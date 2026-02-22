import { motion } from "framer-motion";
import RiskGauge from "./RiskGauge";

export default function RiskResult({ data, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <RiskGauge score={data.riskScore} />

      {/* Disease + Confidence */}
      <div className="glass-card rounded-xl p-5 border border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-emerald-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Predicted Condition</p>
            <h3 className="text-lg font-bold text-white">{data.disease}</h3>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.confidence}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
            />
          </div>
          <span className="text-sm text-teal-400 font-medium">{data.confidence}%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">AI Confidence Level</p>
      </div>

      {/* Preventive Measures */}
      <div className="glass-card rounded-xl p-5 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-white">Preventive Measures</h3>
        </div>
        <ul className="space-y-2">
          {data.preventive.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-start gap-3 text-gray-300 text-sm"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                {index + 1}
              </span>
              {item}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Analyze Again button */}
      {onReset && (
        <button
          onClick={onReset}
          className="w-full py-3 rounded-xl font-semibold text-teal-400 border border-teal-500/30 hover:bg-teal-500/10 transition-all duration-300"
        >
          Analyze Again
        </button>
      )}
    </motion.div>
  );
}