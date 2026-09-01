import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Providers from "./pages/Providers";
import Book from "./pages/Book";
import VerifyEmail from "./pages/VerifyEmail";
import AppointmentConfirm from "./pages/AppointmentConfirm";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  return user ? children : <Navigate to="/login" />;
};

const ProviderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  return user?.role === "provider" ? children : <Navigate to="/dashboard" />;
};

const CustomerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  return user?.role === "customer" ? children : <Navigate to="/dashboard" />;
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
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
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
      <Route
        path="/providers"
        element={
          <PrivateRoute>
            <CustomerRoute>
              <Providers />
            </CustomerRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/book/:providerId"
        element={
          <PrivateRoute>
            <CustomerRoute>
              <Book />
            </CustomerRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/appointment-confirm"
        element={
          <PrivateRoute>
            <AppointmentConfirm />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};
export default App;
