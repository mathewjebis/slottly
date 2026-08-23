import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        Loading...
      </div>
    );
  return user ? children : <Navigate to="/login" />;
};

const ProviderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        Loading...
      </div>
    );
  return user?.role === "provider" ? children : <Navigate to="/dashboard" />;
};

const App = () => {
  const { fetchUser } = useAuth();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <ProviderRoute>
              <Settings />
            </ProviderRoute>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};
export default App;
