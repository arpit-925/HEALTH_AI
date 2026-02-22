import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function RiskGauge({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const gaugeRef = useRef(null);

  // Determine color based on score
  const getColor = (s) => {
    if (s < 30) return { start: "#22c55e", end: "#16a34a", label: "Low Risk", text: "text-green-400" };
    if (s < 60) return { start: "#eab308", end: "#f59e0b", label: "Moderate Risk", text: "text-yellow-400" };
    if (s < 80) return { start: "#f97316", end: "#ea580c", label: "High Risk", text: "text-orange-400" };
    return { start: "#ef4444", end: "#dc2626", label: "Critical Risk", text: "text-red-400" };
  };

  const colorInfo = getColor(score);

  // SVG arc parameters
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // semi-circle
  const progress = (animatedScore / 100) * circumference;

  // Animate score count-up
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      <div className="relative" ref={gaugeRef}>
        <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorInfo.start} />
              <stop offset="100%" stopColor={colorInfo.end} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress arc */}
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            filter="url(#glow)"
            style={{ transition: "stroke-dashoffset 0.1s ease" }}
          />
        </svg>

        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className={`text-5xl font-bold ${colorInfo.text}`} style={{ fontVariantNumeric: "tabular-nums" }}>
            {animatedScore}%
          </span>
        </div>
      </div>

      {/* Label */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`mt-1 text-sm font-medium ${colorInfo.text} tracking-wide uppercase`}
      >
        {colorInfo.label}
      </motion.span>
    </motion.div>
  );
}