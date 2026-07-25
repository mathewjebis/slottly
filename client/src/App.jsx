import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const ProviderRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === "provider" ? children : <Navigate to="/dashboard" />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<div>Register Page</div>} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <div>Dashboard</div>
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <ProviderRoute>
              <div>Settings</div>
            </ProviderRoute>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};
export default App;
