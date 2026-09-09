import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";
import {
  formatDisplayDate,
  statusStyles,
  toLocalDateString,
} from "../lib/format";

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments/my-appointments");
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const upcoming = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed",
  );
  const pending = appointments.filter((a) => a.status === "pending").length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const todayStr = toLocalDateString();
  const todayCount = appointments.filter(
    (a) =>
      String(a.date).slice(0, 10) === todayStr && a.status !== "cancelled",
  ).length;

  const stats = [
    { label: "Upcoming", value: upcoming.length },
    { label: "Pending", value: pending },
    { label: "Completed", value: completed },
    { label: "Today", value: todayCount },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
            <p className="mt-2 text-ink-muted">
              {user?.role === "provider"
                ? "Here’s what’s on your schedule."
                : "Book services and keep track of your appointments."}
            </p>
          </div>
          {user?.role === "customer" ? (
            <Link
              to="/providers"
              className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Book appointment
            </Link>
          ) : (
            <Link
              to="/settings"
              className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Manage availability
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl border border-line bg-white/70"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-line bg-white p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-ink">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
              <h2 className="font-display text-lg font-bold text-ink sm:text-xl">
                Upcoming appointments
              </h2>
              <Link
                to="/appointments"
                className="shrink-0 text-sm font-semibold text-accent hover:text-accent-hover"
              >
                View all
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line bg-white/60 px-6 py-12 text-center">
                <p className="font-medium text-ink">No upcoming appointments</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {user?.role === "customer"
                    ? "Browse providers to book your first slot."
                    : "Share your services so customers can book."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.slice(0, 5).map((appt) => (
                  <Link
                    key={appt._id}
                    to="/appointments"
                    className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 transition hover:border-accent/40 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-ink">
                        {appt.service?.name || "Service"}
                      </p>
                      <p className="mt-1 text-sm text-ink-muted">
                        {user?.role === "provider"
                          ? appt.customer?.name
                          : appt.provider?.name}{" "}
                        · {formatDisplayDate(appt.date)} · {appt.startTime}
                        {appt.endTime ? `–${appt.endTime}` : ""}
                      </p>
                    </div>
                    <span
                      className={`inline-flex w-fit rounded-lg border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[appt.status] || statusStyles.pending}`}
                    >
                      {appt.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
