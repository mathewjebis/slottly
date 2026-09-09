import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 mesh-grid" />
        <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl animate-slot-pulse" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6">
          <div className="animate-rise">
            <Logo size="xl" />
          </div>
          <h1 className="mt-8 max-w-3xl animate-rise-delay font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl md:text-6xl">
            Appointments that actually fit.
          </h1>
          <p className="mt-5 max-w-xl animate-rise-delay text-lg text-ink-muted">
            Slottly turns your availability into bookable slots — for salons,
            clinics, consultants, and anyone who schedules for a living.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-rise-delay-2">
            {user ? (
              <Link
                to="/dashboard"
                className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
              >
                Open dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
                >
                  Get started free
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3">
          {[
            {
              title: "Live slot engine",
              body: "Availability, time off, and bookings feed one algorithm — no spreadsheet juggling.",
            },
            {
              title: "Two roles, one flow",
              body: "Providers set the calendar. Customers browse, pick a slot, and book in minutes.",
            },
            {
              title: "Secure by default",
              body: "HTTP-only JWT cookies, rate limits, and ownership checks on every resource.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h2 className="font-display text-xl font-bold text-ink">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
