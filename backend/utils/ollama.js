import axios from "axios";

export const callOllama = async (prompt) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      {
        model: "phi3",
        prompt,
        stream: false,
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 300000, // 5 minutes — llama3 can be slow on first load
      }
    );

    return response.data.response;

  } catch (error) {
    console.error("🔥 FULL OLLAMA ERROR:", error.response?.data || error.message);
    throw error;   // 👈 IMPORTANT (do not create new Error)
  }
};