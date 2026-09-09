import { Link, useLocation } from "react-router";
import DashboardLayout from "../components/DashboardLayout";

const AppointmentConfirm = () => {
  const location = useLocation();
  const details = location.state || {};

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-lg animate-rise text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-2xl font-bold text-accent">
          ✓
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink">
          Appointment booked
        </h1>
        <p className="mt-3 text-ink-muted">
          Your request is pending confirmation from the provider. You can track
          it anytime under Appointments.
        </p>

        {(details.date || details.serviceName) && (
          <div className="mt-8 rounded-2xl border border-line bg-white p-6 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Details
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              {details.providerName && (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Provider</dt>
                  <dd className="font-medium text-ink">{details.providerName}</dd>
                </div>
              )}
              {details.serviceName && (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">Service</dt>
                  <dd className="font-medium text-ink">{details.serviceName}</dd>
                </div>
              )}
              {details.date && (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">When</dt>
                  <dd className="font-medium text-ink">
                    {details.date}
                    {details.startTime ? ` at ${details.startTime}` : ""}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/appointments"
            className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            View appointments
          </Link>
          <Link
            to="/providers"
            className="rounded-xl border border-line bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-accent"
          >
            Book another
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AppointmentConfirm;
