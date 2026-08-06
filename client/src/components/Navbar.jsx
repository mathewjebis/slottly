import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/dashboard"
          className="focus:outline-none focus:ring-2 focus:ring-slate-700 rounded"
        >
          <Logo size="sm" />
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-medium tracking-wide">
              {user?.role === "provider"
                ? "Provider"
                : user?.role === "admin"
                  ? "Admin"
                  : "Customer"}
            </span>
            <span className="text-white text-sm font-medium capitalize">
              {user?.name.toLowerCase()}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800" aria-hidden="true"></div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-white text-sm transition hover:bg-slate-800 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
