import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((data) => {
    const userProfile = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    setUser(userProfile);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout cookie clearance failed:", error);
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
