import { createContext, useContext, useState } from "react";
import api from "./api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );

  const login = (data) => {
    const userProfile = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    setUser(userProfile);
    localStorage.setItem("user", JSON.stringify(userProfile));
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout cookie clearance failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
