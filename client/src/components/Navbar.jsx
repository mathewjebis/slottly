import { Link, NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? "text-accent" : "text-ink-muted hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-surface-elevated/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to={user ? "/dashboard" : "/"} className="shrink-0">
          <Logo size="sm" />
        </Link>

        {user && (
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/appointments" className={linkClass}>
              Appointments
            </NavLink>
            {user.role === "customer" && (
              <NavLink to="/providers" className={linkClass}>
                Book
              </NavLink>
            )}
            {user.role === "provider" && (
              <NavLink to="/settings" className={linkClass}>
                Settings
              </NavLink>
            )}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-ink">{user.name}</p>
                <p className="text-xs capitalize text-accent">{user.role}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft font-display text-sm font-bold text-accent-deep">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-medium text-ink-muted transition hover:border-accent hover:text-accent"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-ink-muted hover:text-ink"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>

      {user && (
        <nav className="flex gap-4 overflow-x-auto border-t border-line/60 px-4 py-2 md:hidden">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/appointments" className={linkClass}>
            Appointments
          </NavLink>
          {user.role === "customer" && (
            <NavLink to="/providers" className={linkClass}>
              Book
            </NavLink>
          )}
          {user.role === "provider" && (
            <NavLink to="/settings" className={linkClass}>
              Settings
            </NavLink>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
