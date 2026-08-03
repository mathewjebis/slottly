import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import api from "../api/axios";


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      navigate("/login");
    }
  };
  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/dashboard">
          <Logo size="sm" />
        </Link>

        <div className="flex items-center gap-6">
          <span className="text-slate-400 text-sm">
            {user?.role === "provider"
              ? "Provider"
              : user?.role === "admin"
                ? "Admin"
                : "Customer"}
          </span>
          <span className="text-white text-sm font-medium">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-white text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
