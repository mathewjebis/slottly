import { Link } from "react-router";
import Logo from "./Logo";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 mesh-grid opacity-70" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6">
        <Link to="/" className="mb-10 w-fit">
          <Logo size="md" />
        </Link>

        <div className="grid flex-1 items-center gap-10 lg:grid-cols-2">
          <div className="hidden lg:block">
            <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Appointment OS
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight text-ink">
              Book smarter.
              <br />
              Manage better.
            </h2>
            <p className="mt-4 max-w-md text-ink-muted">
              Real-time slots from your weekly schedule, time off, and existing
              bookings — so double-booking never happens.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-ink-muted">
              {[
                "Duration-aware slot generation",
                "Role-based customer & provider access",
                "Secure cookie-based authentication",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-soft text-xs font-bold text-accent">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-surface-elevated p-6 shadow-[0_20px_60px_-40px_rgba(12,31,28,0.45)] sm:p-8">
            {(title || subtitle) && (
              <div className="mb-6">
                {title && (
                  <h1 className="font-display text-2xl font-bold text-ink">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
                )}
              </div>
            )}
            {children}
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-ink-muted lg:text-left">
          © {new Date().getFullYear()} Slottly
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
