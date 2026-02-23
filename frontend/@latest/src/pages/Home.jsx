import SymptomForm from "../components/SymptomForm";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-teal-500/8 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-12 relative z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-xs font-medium text-teal-400 uppercase tracking-wider">AI-Powered Health Analysis</span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
          <span className="text-white">Predict. </span>
          <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Prevent. </span>
          <span className="text-white">Protect.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          Advanced AI engine that analyzes your symptoms, predicts disease risks, and provides personalized preventive care recommendations.
        </p>
      </motion.div>

      <SymptomForm />

      {/* Feature cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full relative z-10"
      >
        {[
          { icon: "🔬", title: "Symptom Analysis", desc: "AI analyzes your symptoms against 15+ conditions" },
          { icon: "📊", title: "Risk Scoring", desc: "Precise risk percentage with confidence levels" },
          { icon: "🏥", title: "Find Hospitals", desc: "Locate nearby hospitals and clinics instantly" },
          { icon: "⚡", title: "Edge AI (Offline)", desc: "Risk predictions with zero internet connection" },
          { icon: "📷", title: "Body Scanner", desc: "Camera-based sclera & skin screening" },
          { icon: "🧠", title: "Explainable AI", desc: "See exactly why the AI made its prediction" },
        ].map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass-card rounded-xl p-5 border border-white/5 text-center hover:border-teal-500/20 transition-colors duration-300"
          >
            <span className="text-2xl">{feature.icon}</span>
            <h3 className="text-white font-semibold mt-2 text-sm">{feature.title}</h3>
            <p className="text-gray-500 text-xs mt-1">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}