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
    <nav className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 h-16 flex items-center">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link
          to="/dashboard"
          className="pr-4 md:pr-0 focus:outline-none focus:ring-2 focus:ring-slate-700 rounded "
        >
          <Logo size="sm" />
        </Link>

        <div className="flex items-center gap-x-3 sm:gap-x-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-semibold text-sm text-white shadow-sm shadow-indigo-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="hidden sm:flex flex-col items-start leading-none gap-y-1">
              <span className="text-slate-100 text-sm font-semibold tracking-wide font-sans">
                {user?.name || "Guest"}
              </span>

              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                {user?.role === "provider"
                  ? "Provider"
                  : user?.role === "admin"
                    ? "Admin"
                    : "Customer"}
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-800" aria-hidden="true"></div>

          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-slate-200 text-sm transition font-medium hover:bg-slate-800/60 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
