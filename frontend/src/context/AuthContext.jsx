import { createContext, useContext, useState, useEffect } from "react";
import { getDriverStatus } from "../services/driverApi";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored && stored !== "undefined" ? JSON.parse(stored) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token");
    });

    const [authLoading, setAuthLoading] = useState(true);
    useEffect(() => {
        // auth initialization complete
        setAuthLoading(false);
    }, []);


    const [driverStatus, setDriverStatus] = useState(null); // null = unknown
    const [driverStatusLoading, setDriverStatusLoading] = useState(true);

    const login = (token, userData) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(token);
        setUser(userData);
        setDriverStatus(null); // reset on login
        setDriverStatusLoading(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
        setDriverStatus(null);
        setDriverStatusLoading(false);
    };


    useEffect(() => {
        if (!token || user?.role !== "driver") {
            setDriverStatusLoading(false);
            return;
        }

        setDriverStatusLoading(true);

        getDriverStatus()
            .then((res) => {
                setDriverStatus(res.data.isOnline ? "online" : "offline");
            })
            .catch(() => {
                setDriverStatus("offline");
            })
            .finally(() => {
                setDriverStatusLoading(false);
            });
    }, [token, user?.role, user?.id]);



    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                authLoading,
                driverStatus,
                driverStatusLoading,
                setDriverStatus,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
