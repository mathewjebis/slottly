import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { formatDisplayDate, formatDuration } from "../lib/format";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const emptyServiceForm = {
  name: "",
  description: "",
  durationMinutes: "30",
  price: "",
};

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [availability, setAvailability] = useState(
    DAYS.reduce((acc, day) => {
      acc[day] = { enabled: false, startTime: "09:00", endTime: "17:00" };
      return acc;
    }, {}),
  );
  const [availabilitySaving, setAvailabilitySaving] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState(null);

  const [timeOff, setTimeOff] = useState([]);
  const [showTimeOffForm, setShowTimeOffForm] = useState(false);
  const [timeOffForm, setTimeOffForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [timeOffSubmitting, setTimeOffSubmitting] = useState(false);
  const [timeOffError, setTimeOffError] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    const load = async () => {
      try {
        const [servicesRes, availabilityRes, timeOffRes] = await Promise.all([
          api.get("/services/my-services"),
          api.get(`/availability/${user._id}`).catch(() => ({ data: null })),
          api.get("/timeoff"),
        ]);
        setServices(servicesRes.data);
        setTimeOff(timeOffRes.data);

        if (availabilityRes?.data?.weeklySchedule) {
          const next = DAYS.reduce((acc, day) => {
            const entry = availabilityRes.data.weeklySchedule.find(
              (d) => d.day === day,
            );
            acc[day] = entry
              ? {
                  enabled: true,
                  startTime: entry.startTime,
                  endTime: entry.endTime,
                }
              : { enabled: false, startTime: "09:00", endTime: "17:00" };
            return acc;
          }, {});
          setAvailability(next);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?._id]);

  const openCreateForm = () => {
    setEditingId(null);
    setServiceForm(emptyServiceForm);
    setFormError(null);
    setShowServiceForm(true);
  };

  const openEditForm = (service) => {
    setEditingId(service._id);
    setServiceForm({
      name: service.name,
      description: service.description || "",
      durationMinutes: String(service.duration),
      price: String(service.price),
    });
    setFormError(null);
    setShowServiceForm(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    const payload = {
      name: serviceForm.name,
      description: serviceForm.description,
      duration: Number(serviceForm.durationMinutes),
      price: Number(serviceForm.price),
    };
    try {
      if (editingId) {
        const res = await api.put(`/services/${editingId}`, payload);
        setServices(services.map((s) => (s._id === editingId ? res.data : s)));
      } else {
        const res = await api.post("/services", payload);
        setServices([...services, res.data]);
      }
      setShowServiceForm(false);
      setEditingId(null);
      setServiceForm(emptyServiceForm);
    } catch (err) {
      const data = err.response?.data;
      setFormError(
        data?.errors?.[0]?.msg || data?.message || "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDay = (day) => {
    setAvailability({
      ...availability,
      [day]: { ...availability[day], enabled: !availability[day].enabled },
    });
  };

  const updateDayTime = (day, field, value) => {
    setAvailability({
      ...availability,
      [day]: { ...availability[day], [field]: value },
    });
  };

  const handleSaveAvailability = async () => {
    setAvailabilitySaving(true);
    setAvailabilityMessage(null);
    try {
      const weeklySchedule = DAYS.filter((day) => availability[day].enabled).map(
        (day) => ({
          day,
          startTime: availability[day].startTime,
          endTime: availability[day].endTime,
        }),
      );
      await api.put("/availability", { weeklySchedule });
      setAvailabilityMessage("Availability saved");
      setTimeout(() => setAvailabilityMessage(null), 2500);
    } catch (err) {
      const data = err.response?.data;
      setAvailabilityMessage(
        data?.errors?.[0]?.msg || data?.message || "Failed to save",
      );
    } finally {
      setAvailabilitySaving(false);
    }
  };

  const handleAddTimeOff = async (e) => {
    e.preventDefault();
    setTimeOffSubmitting(true);
    setTimeOffError(null);
    try {
      const res = await api.post("/timeoff", timeOffForm);
      setTimeOff([...timeOff, res.data]);
      setShowTimeOffForm(false);
      setTimeOffForm({ startDate: "", endDate: "", reason: "" });
    } catch (err) {
      const data = err.response?.data;
      setTimeOffError(
        data?.errors?.[0]?.msg || data?.message || "Something went wrong",
      );
    } finally {
      setTimeOffSubmitting(false);
    }
  };

  const handleDeleteTimeOff = async (id) => {
    try {
      await api.delete(`/timeoff/${id}`);
      setTimeOff(timeOff.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: "services", label: "Services" },
    { id: "availability", label: "Availability" },
    { id: "timeoff", label: "Time off" },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="h-64 animate-pulse rounded-2xl border border-line bg-white/70" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-ink">Settings</h1>
        <p className="mt-2 text-ink-muted">
          Manage services, weekly hours, and time off.
        </p>

        <div className="mt-6 flex gap-2 border-b border-line">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "services" && (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-ink">
                Your services
              </h2>
              <button
                type="button"
                onClick={openCreateForm}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                Add service
              </button>
            </div>

            {showServiceForm && (
              <form
                onSubmit={handleSaveService}
                className="mb-6 rounded-2xl border border-line bg-white p-5"
              >
                <h3 className="font-semibold text-ink">
                  {editingId ? "Edit service" : "New service"}
                </h3>
                {formError && (
                  <p className="mt-2 text-sm text-rose-700">{formError}</p>
                )}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    name="name"
                    value={serviceForm.name}
                    onChange={(e) =>
                      setServiceForm({ ...serviceForm, name: e.target.value })
                    }
                    placeholder="Service name"
                    className="rounded-xl border border-line px-3 py-2.5 outline-none focus:border-accent sm:col-span-2"
                  />
                  <textarea
                    name="description"
                    value={serviceForm.description}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Description (optional)"
                    rows={2}
                    className="rounded-xl border border-line px-3 py-2.5 outline-none focus:border-accent sm:col-span-2"
                  />
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Service Duration
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "15 min", val: "15" },
                        { label: "30 min", val: "30" },
                        { label: "45 min", val: "45" },
                        { label: "1 hr", val: "60" },
                        { label: "1 hr 15m", val: "75" },
                        { label: "1.5 hrs", val: "90" },
                        { label: "2 hrs", val: "120" },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() =>
                            setServiceForm({
                              ...serviceForm,
                              durationMinutes: preset.val,
                            })
                          }
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                            serviceForm.durationMinutes === preset.val
                              ? "bg-accent text-white shadow-sm"
                              : "border border-line bg-surface text-ink-muted hover:border-accent/40 hover:text-ink"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Exact Minutes
                    </label>
                    <input
                      required
                      type="number"
                      min="5"
                      step="5"
                      value={serviceForm.durationMinutes}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          durationMinutes: e.target.value,
                        })
                      }
                      placeholder="e.g. 30"
                      className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Price (₹)
                    </label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="1"
                      value={serviceForm.price}
                      onChange={(e) =>
                        setServiceForm({ ...serviceForm, price: e.target.value })
                      }
                      placeholder="e.g. 500"
                      className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:bg-white"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : editingId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowServiceForm(false);
                      setEditingId(null);
                    }}
                    className="rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink-muted"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {services.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line bg-white/60 px-6 py-10 text-center text-sm text-ink-muted">
                No services yet. Add one to start accepting bookings.
              </div>
            ) : (
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold capitalize text-ink">
                        {service.name}
                      </p>
                      <p className="mt-1 text-sm text-ink-muted">
                        {formatDuration(service.duration)} · ₹{service.price}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(service)}
                        className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink-muted hover:border-accent hover:text-accent"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(service._id)}
                        className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink-muted hover:border-rose-300 hover:text-rose-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "availability" && (
          <div className="mt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-ink">
                Weekly availability
              </h2>
              <button
                type="button"
                onClick={handleSaveAvailability}
                disabled={availabilitySaving}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {availabilitySaving ? "Saving..." : "Save changes"}
              </button>
            </div>
            {availabilityMessage && (
              <p className="mb-4 text-sm text-accent">{availabilityMessage}</p>
            )}
            <div className="overflow-hidden rounded-2xl border border-line bg-white divide-y divide-line">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center"
                >
                  <div className="flex w-32 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`relative h-6 w-10 rounded-full transition ${
                        availability[day].enabled
                          ? "bg-accent"
                          : "bg-slate-300"
                      }`}
                      aria-label={`Toggle ${day}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                          availability[day].enabled ? "translate-x-4" : ""
                        }`}
                      />
                    </button>
                    <span className="text-sm font-semibold text-ink">{day}</span>
                  </div>
                  {availability[day].enabled ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={availability[day].startTime}
                        onChange={(e) =>
                          updateDayTime(day, "startTime", e.target.value)
                        }
                        className="rounded-lg border border-line px-2 py-1.5 text-sm"
                      />
                      <span className="text-ink-muted">to</span>
                      <input
                        type="time"
                        value={availability[day].endTime}
                        onChange={(e) =>
                          updateDayTime(day, "endTime", e.target.value)
                        }
                        className="rounded-lg border border-line px-2 py-1.5 text-sm"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-ink-muted">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "timeoff" && (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-ink">
                Time off
              </h2>
              <button
                type="button"
                onClick={() => setShowTimeOffForm(true)}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
              >
                Add time off
              </button>
            </div>

            {showTimeOffForm && (
              <form
                onSubmit={handleAddTimeOff}
                className="mb-6 rounded-2xl border border-line bg-white p-5"
              >
                {timeOffError && (
                  <p className="mb-2 text-sm text-rose-700">{timeOffError}</p>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    required
                    type="date"
                    value={timeOffForm.startDate}
                    onChange={(e) =>
                      setTimeOffForm({
                        ...timeOffForm,
                        startDate: e.target.value,
                      })
                    }
                    className="rounded-xl border border-line px-3 py-2.5"
                  />
                  <input
                    required
                    type="date"
                    value={timeOffForm.endDate}
                    onChange={(e) =>
                      setTimeOffForm({
                        ...timeOffForm,
                        endDate: e.target.value,
                      })
                    }
                    className="rounded-xl border border-line px-3 py-2.5"
                  />
                  <input
                    value={timeOffForm.reason}
                    onChange={(e) =>
                      setTimeOffForm({ ...timeOffForm, reason: e.target.value })
                    }
                    placeholder="Reason (optional)"
                    className="rounded-xl border border-line px-3 py-2.5 sm:col-span-2"
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="submit"
                    disabled={timeOffSubmitting}
                    className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {timeOffSubmitting ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTimeOffForm(false)}
                    className="rounded-xl border border-line px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {timeOff.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line bg-white/60 px-6 py-10 text-center text-sm text-ink-muted">
                No time off blocked.
              </div>
            ) : (
              <div className="space-y-3">
                {timeOff.map((entry) => (
                  <div
                    key={entry._id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4"
                  >
                    <div>
                      <p className="font-medium text-ink">
                        {formatDisplayDate(entry.startDate)} –{" "}
                        {formatDisplayDate(entry.endDate)}
                      </p>
                      {entry.reason && (
                        <p className="text-sm text-ink-muted">{entry.reason}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteTimeOff(entry._id)}
                      className="text-sm font-medium text-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
