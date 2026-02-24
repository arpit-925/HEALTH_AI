import { useState, useRef } from "react";
import SymptomForm from "../components/SymptomForm";
import { motion } from "framer-motion";

export default function Home() {
  const [chatMode, setChatMode] = useState(null);
  const chatRef = useRef(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative">

      {/* Hero Section */}
      ...
      {/* Hero Section */}
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="text-center max-w-3xl relative z-10"
>
  <motion.h1
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="text-4xl md:text-6xl font-bold text-white leading-tight"
  >
    AI-Powered{" "}
    <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
      Disease Prediction
    </span>
  </motion.h1>

  <motion.p
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="mt-6 text-gray-400 text-base md:text-lg"
  >
    Analyze symptoms instantly, assess risk levels, and receive intelligent
    healthcare recommendations powered by advanced Machine Learning models.
  </motion.p>

  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6 }}
    className="mt-8 h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-teal-400 to-transparent"
  />
</motion.div>

      {/* Chat */}
      <div ref={chatRef}>
        <SymptomForm mode={chatMode} />
      </div>

      {/* Feature Cards */}
      <motion.div
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full relative z-10"
      >
        {[
          { icon: "🔬", title: "Symptom Analysis", mode: "symptom" },
          { icon: "📊", title: "Risk Scoring", mode: "risk" },
          { icon: "🏥", title: "Find Hospitals", mode: "hospital" },
        ].map((feature, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => {
              setChatMode(feature.mode);
              chatRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="glass-card rounded-xl p-5 border border-white/5 text-center hover:border-teal-500/20 transition-colors duration-300 cursor-pointer"
          >
            <span className="text-2xl">{feature.icon}</span>
            <h3 className="text-white font-semibold mt-2 text-sm">
              {feature.title}
            </h3>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}