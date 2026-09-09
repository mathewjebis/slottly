import { Link, useLocation } from "react-router";
import DashboardLayout from "../components/DashboardLayout";

const AppointmentConfirm = () => {
  const location = useLocation();
  const details = location.state || {};

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-md animate-rise text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-2xl font-bold text-emerald-700 shadow-xs">
          ✓
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink sm:text-3xl">
          Appointment Booked!
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Your booking request has been submitted successfully.
        </p>

        {(details.date || details.serviceName) && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-sm text-left">
            <div className="border-b border-line bg-surface-elevated/60 px-5 py-3.5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Booking Summary
              </span>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                Pending Confirmation
              </span>
            </div>

            <div className="p-5 space-y-4 text-sm">
              {details.serviceName && (
                <div>
                  <span className="text-xs text-ink-muted block uppercase font-medium tracking-wide">
                    Service
                  </span>
                  <p className="font-display text-lg font-bold text-ink mt-0.5">
                    {details.serviceName}
                  </p>
                </div>
              )}

              {details.providerName && (
                <div className="flex items-center gap-3 pt-2 border-t border-line/60">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft font-display text-sm font-bold text-accent-deep">
                    {details.providerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs text-ink-muted block">Provider</span>
                    <p className="font-semibold text-ink">{details.providerName}</p>
                  </div>
                </div>
              )}

              {details.date && (
                <div className="rounded-xl bg-surface p-3.5 border border-line/70 pt-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted block mb-1">
                    Date & Time
                  </span>
                  <p className="font-semibold text-ink">
                    {details.date}
                  </p>
                  {details.startTime && (
                    <p className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent-deep">
                      ⏰ {details.startTime}{details.endTime ? ` – ${details.endTime}` : ""}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/appointments"
            className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover shadow-xs"
          >
            View My Appointments
          </Link>
          <Link
            to="/providers"
            className="rounded-xl border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent"
          >
            Book Another
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentConfirm;
