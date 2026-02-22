import { createContext, useContext, useState } from "react";
import { predictSymptoms, getPredictionHistory } from "../services/api";

const HealthContext = createContext();

export function HealthProvider({ children }) {
    const [prediction, setPrediction] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyzeSymptoms = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await predictSymptoms(formData);
            setPrediction(res.data);
            return res.data;
        } catch (err) {
            const message = err.response?.data?.message || "Prediction failed";
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await getPredictionHistory();
            setHistory(res.data);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    const clearPrediction = () => {
        setPrediction(null);
        setError(null);
    };

    return (
        <HealthContext.Provider
            value={{
                prediction,
                history,
                loading,
                error,
                analyzeSymptoms,
                fetchHistory,
                clearPrediction,
            }}
        >
            {children}
        </HealthContext.Provider>
    );
}

export function useHealth() {
    const context = useContext(HealthContext);
    if (!context) {
        throw new Error("useHealth must be used within a HealthProvider");
    }
    return context;
}
