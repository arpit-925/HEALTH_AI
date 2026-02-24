import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function SymptomForm({ mode }) {

  const getInitialMessage = (mode) => {
    switch (mode) {
      case "symptom":
        return "🔬 Let's analyze your symptoms. Please describe how you're feeling.";
      case "risk":
        return "📊 Let's calculate your risk score. Please tell me your age, BMI, and glucose level.";
      case "hospital":
        return "🏥 Tell me your location and I will find nearby hospitals.";
      default:
        return "👋 Hey, I am Health Guard AI. How can I help you today?";
    }
  };

  const [messages, setMessages] = useState([
    { role: "assistant", content: getInitialMessage(mode) }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([
      { role: "assistant", content: getInitialMessage(mode) }
    ]);
  }, [mode]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/explain",
        { prediction: input },
        { timeout: 300000 } // 5 min — Ollama can be slow
      );

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: response.data.explanation }
      ]);
    } catch (error) {
      console.error("Chatbot error:", error.message);
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "⚠ Sorry, something went wrong. Please make sure Ollama is running." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 w-full max-w-2xl border border-white/10 flex flex-col h-[500px]"
    >
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl max-w-[80%] ${msg.role === "assistant"
                ? "bg-gray-800 text-white"
                : "bg-teal-500 text-white self-end ml-auto"
              }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">
            Health Guard AI is typing...
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Describe your symptoms..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 input-field"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-teal-500 rounded-xl text-white hover:bg-teal-400"
        >
          Send
        </button>
      </div>
    </motion.div>
  );
}
