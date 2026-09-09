import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";
import { formatDisplayDate, statusStyles } from "../lib/format";

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await api.get("/appointments/my-appointments");
      setAppointments(res.data);
    } catch {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const runAction = async (id, action) => {
    setActionId(id);
    setError(null);
    try {
      await api.patch(`/appointments/${id}/${action}`);
      await fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    } finally {
      setActionId(null);
    }
  };

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const filters = ["all", "pending", "confirmed", "completed", "cancelled"];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-ink">
          Appointments
        </h1>
        <p className="mt-2 text-ink-muted">
          {user?.role === "provider"
            ? "Confirm, complete, or cancel bookings from your customers."
            : "Track and cancel your bookings."}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                filter === f
                  ? "bg-accent text-white"
                  : "border border-line bg-white text-ink-muted hover:border-accent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl border border-line bg-white/70"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-white/60 px-6 py-12 text-center">
            <p className="font-medium text-ink">No appointments here</p>
            <p className="mt-1 text-sm text-ink-muted">
              Try another filter or book a new slot.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {filtered.map((appt) => (
              <div
                key={appt._id}
                className="rounded-2xl border border-line bg-white p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-bold text-ink">
                        {appt.service?.name || "Service"}
                      </h2>
                      <span
                        className={`rounded-lg border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[appt.status]}`}
                      >
                        {appt.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-ink-muted">
                      {formatDisplayDate(appt.date, {
                        weekday: "short",
                      })}{" "}
                      · {appt.startTime}
                      {appt.endTime ? `–${appt.endTime}` : ""}
                    </p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {user?.role === "provider" ? "Customer" : "Provider"}:{" "}
                      <span className="font-medium text-ink">
                        {user?.role === "provider"
                          ? appt.customer?.name
                          : appt.provider?.name}
                      </span>
                      {appt.service?.price != null && (
                        <> · ₹{appt.service.price}</>
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(appt.status === "pending" ||
                      appt.status === "confirmed") && (
                      <button
                        type="button"
                        disabled={actionId === appt._id}
                        onClick={() => runAction(appt._id, "cancel")}
                        className="rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink-muted transition hover:border-rose-300 hover:text-rose-700 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                    {user?.role === "provider" && appt.status === "pending" && (
                      <button
                        type="button"
                        disabled={actionId === appt._id}
                        onClick={() => runAction(appt._id, "confirm")}
                        className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
                      >
                        Confirm
                      </button>
                    )}
                    {user?.role === "provider" &&
                      appt.status === "confirmed" && (
                        <button
                          type="button"
                          disabled={actionId === appt._id}
                          onClick={() => runAction(appt._id, "complete")}
                          className="rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-50"
                        >
                          Complete
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
