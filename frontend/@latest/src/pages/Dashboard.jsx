import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useHealth } from "../context/HealthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const { history, loading, fetchHistory } = useHealth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchHistory();
  }, [user]);

  const getScoreColor = (score) => {
    if (score < 30) return "text-green-400";
    if (score < 60) return "text-yellow-400";
    if (score < 80) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    if (score < 30) return "from-green-500/20 to-green-500/5";
    if (score < 60) return "from-yellow-500/20 to-yellow-500/5";
    if (score < 80) return "from-orange-500/20 to-orange-500/5";
    return "from-red-500/20 to-red-500/5";
  };

  const stats = {
    totalScans: history.length,
    avgScore: history.length
      ? Math.round(history.reduce((sum, p) => sum + p.riskScore, 0) / history.length)
      : 0,
    latestScore: history.length ? history[0]?.riskScore : null,
    latestDisease: history.length ? history[0]?.disease : null,
  };

  return (
    <div className="min-h-screen px-6 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white">Health Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Welcome back, <span className="text-teal-400">{user?.name}</span>. Here's your health overview.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Scans",
            value: stats.totalScans,
            icon: "📊",
            color: "text-teal-400",
          },
          {
            label: "Average Risk",
            value: stats.avgScore ? `${stats.avgScore}%` : "—",
            icon: "📈",
            color: getScoreColor(stats.avgScore),
          },
          {
            label: "Latest Score",
            value: stats.latestScore !== null ? `${stats.latestScore}%` : "—",
            icon: "🎯",
            color: getScoreColor(stats.latestScore || 0),
          },
          {
            label: "Last Condition",
            value: stats.latestDisease || "—",
            icon: "🩺",
            color: "text-gray-300",
            small: true,
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-5 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{stat.label}</span>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className={`${stat.small ? "text-lg" : "text-3xl"} font-bold ${stat.color} truncate`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Prediction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-xl border border-white/5 overflow-hidden"
      >
        <div className="p-5 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Prediction History</h2>
          <p className="text-sm text-gray-500">Your past health assessments</p>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <svg className="animate-spin h-8 w-8 mx-auto text-teal-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-400 mt-3 text-sm">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl">🔍</span>
            <p className="text-gray-400 mt-3">No predictions yet.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 rounded-lg bg-teal-500/10 text-teal-400 text-sm font-medium hover:bg-teal-500/20 transition-colors"
            >
              Run Your First Analysis
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {history.map((pred, i) => (
              <motion.div
                key={pred._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="p-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getScoreBg(pred.riskScore)} flex items-center justify-center`}>
                      <span className={`text-lg font-bold ${getScoreColor(pred.riskScore)}`}>
                        {pred.riskScore}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{pred.disease}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {pred.symptoms.slice(0, 3).join(", ")}
                        {pred.symptoms.length > 3 ? ` +${pred.symptoms.length - 3} more` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${getScoreColor(pred.riskScore)}`}>
                      {pred.riskScore}% risk
                    </span>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {new Date(pred.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}