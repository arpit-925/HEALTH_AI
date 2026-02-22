import { motion } from "framer-motion";
import HospitalMap from "../components/Map/HospitalMap";

export default function Hospitals() {
    return (
        <div className="min-h-screen px-6 py-10 max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-white">Nearby Hospitals</h1>
                <p className="text-gray-400 mt-1">
                    Find hospitals and clinics near your current location
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <HospitalMap />
            </motion.div>
        </div>
    );
}
