import { createContext, useContext, useState, useEffect } from "react";
import { registerUser, loginUser, getMe } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, check if token exists and load user
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("healthguard_token");
            if (token) {
                try {
                    const res = await getMe();
                    setUser(res.data);
                } catch {
                    localStorage.removeItem("healthguard_token");
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const register = async (name, email, password) => {
        const res = await registerUser({ name, email, password });
        localStorage.setItem("healthguard_token", res.data.token);
        setUser({ _id: res.data._id, name: res.data.name, email: res.data.email });
        return res.data;
    };

    const login = async (email, password) => {
        const res = await loginUser({ email, password });
        localStorage.setItem("healthguard_token", res.data.token);
        setUser({ _id: res.data._id, name: res.data.name, email: res.data.email });
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem("healthguard_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
