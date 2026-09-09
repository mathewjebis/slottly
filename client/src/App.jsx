import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Settings from "./pages/Settings";
import Providers from "./pages/Providers";
import Book from "./pages/Book";
import VerifyEmail from "./pages/VerifyEmail";
import AppointmentConfirm from "./pages/AppointmentConfirm";

const Spinner = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
};

const ProviderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user?.role === "provider" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

const CustomerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user?.role === "customer" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

const PublicOnly = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  const { fetchUser } = useAuth();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnly>
            <Register />
          </PublicOnly>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <PrivateRoute>
            <Appointments />
          </PrivateRoute>
        }
      />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
