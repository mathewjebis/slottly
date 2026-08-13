import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  const display = hours % 1 === 0 ? hours : hours.toFixed(1);
  return `${display} hr${hours === 1 ? "" : "s"}`;
};
const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    durationHours: "",
    price: "",
  });
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

  const handleFormChange = (e) => {
    setServiceForm({ ...serviceForm, [e.target.name]: e.target.value });
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await api.post("/services", {
        name: serviceForm.name,
        description: serviceForm.description,
        duration: Math.round(Number(serviceForm.durationHours) * 60),
        price: Number(serviceForm.price),
      });
      setServices([...services, res.data]);
      setShowServiceForm(false);
      setServiceForm({
        name: "",
        description: "",
        durationHours: "",
        price: "",
      });
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
      const weeklySchedule = DAYS.filter(
        (day) => availability[day].enabled,
      ).map((day) => ({
        day,
        startTime: availability[day].startTime,
        endTime: availability[day].endTime,
      }));
      await api.put("/availability", { weeklySchedule });
      setAvailabilityMessage("Availability saved");
    } catch (err) {
      const data = err.response?.data;
      setAvailabilityMessage(
        data?.errors?.[0]?.msg || data?.message || "Something went wrong",
      );
    } finally {
      setAvailabilitySaving(false);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services/my-services");
        setServices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await api.get(`/availability/${user._id}`);
        const merged = { ...availability };
        res.data.weeklySchedule.forEach((entry) => {
          merged[entry.day] = {
            enabled: true,
            startTime: entry.startTime,
            endTime: entry.endTime,
          };
        });
        setAvailability(merged);
      } catch (err) {
        if (err.response?.status != 404) {
          console.error(err);
        }
      }
    };
    fetchAvailability();
  }, []);

  const tabs = [
    { id: "services", label: "Services" },
    { id: "availability", label: "Availability" },
    { id: "timeoff", label: "Time Off" },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full max-w-5xl mx-auto px-4 py-6">
          <p className="text-slate-400">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
          <p className="text-slate-400">
            Manage your services, availability, and time off
          </p>
        </div>

        <div className="flex gap-4 sm:gap-6 overflow-x-auto border-b border-slate-800 [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-3 py-2.5 text-sm font-medium border-b-2 transition md:px-5 ${
                activeTab === tab.id
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "services" && (
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <h2 className="text-lg font-semibold text-white">
                Your Services
              </h2>
              <button
                onClick={() => setShowServiceForm(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                + Add Service
              </button>
            </div>
            {services.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                <p className="text-slate-400 text-sm">
                  No services yet. Add your first service to start accepting
                  bookings.
                </p>
              </div>
            ) : (
              <div className="space-y-3 lg:space-y-0 lg:bg-slate-900 lg:border lg:border-slate-800 lg:rounded-xl lg:divide-y lg:divide-slate-800 lg:overflow-hidden">
                <div className="hidden lg:grid px-4 py-3 bg-slate-950/30 grid-cols-[3fr_1.5fr_1.5fr_1fr] gap-3 items-center">
                  <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                    Service Name
                  </span>
                  <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                    Duration
                  </span>
                  <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                    Price
                  </span>
                  <span></span>
                </div>

                {services.map((service) => (
                  <div
                    key={service._id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 lg:bg-transparent lg:border-0 lg:rounded-none lg:px-4 lg:py-3 flex flex-col lg:grid lg:grid-cols-[3fr_1.5fr_1.5fr_1fr] gap-4 lg:gap-3 max-lg:items-start lg:items-center transition-all duration-200 hover:bg-slate-800/30"
                  >
                    <div className="flex justify-between items-center w-full lg:block">
                      <p className="text-white text-sm font-medium capitalize">
                        {service.name}
                      </p>

                      <p className="text-emerald-400 text-sm font-semibold tracking-wide lg:hidden">
                        ₹{service.price}
                      </p>
                    </div>

                    <div className="flex justify-start">
                      <span className="inline-block bg-slate-800/60 border border-slate-700/50 text-slate-400 text-xs px-2.5 py-1 rounded-md font-medium">
                        {formatDuration(service.duration)}
                      </span>
                    </div>

                    <div className="hidden lg:block">
                      <p className="text-emerald-400 text-sm font-semibold tracking-wide">
                        ₹{service.price}
                      </p>
                    </div>

                    <div className="flex items-center w-full lg:w-auto mt-4 lg:mt-0 border-t border-slate-800/60 pt-3 lg:border-none lg:pt-0 gap-3">
                      <button className="flex-1 lg:flex-none text-center justify-center text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/40 bg-slate-800/40 lg:bg-transparent hover:border-indigo-900/50 border border-slate-800 lg:border-transparent px-3 py-2 lg:px-2.5 lg:py-1 rounded-lg lg:rounded-md text-sm font-medium transition-all duration-200 cursor-pointer">
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteService(service._id)}
                        className="flex-1 lg:flex-none text-center justify-center text-slate-400 hover:text-red-300 hover:bg-red-950/50 bg-slate-800/40 lg:bg-transparent hover:border-red-900/60 border border-slate-800 lg:border-transparent px-3 py-2 lg:px-2.5 lg:py-1 rounded-lg lg:rounded-md text-sm font-medium transition-all duration-200 cursor-pointer"
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
          <div>
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <h2 className="md:text-lg font-bold text-white whitespace-nowrap">
                Weekly Availability
              </h2>

              <button
                onClick={handleSaveAvailability}
                disabled={availabilitySaving}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-2 py-2 md:px-4 md:py-2 rounded-lg transition whitespace-nowrap"
              >
                {availabilitySaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
            {availabilityMessage && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-4 py-3 rounded-lg mb-4 text-sm">
                {availabilityMessage}
              </div>
            )}
            <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800 overflow-hidden">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 px-3 py-4"
                >
                  <div className="flex items-center gap-3 md:w-32">
                    <button
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`relative w-10 h-6 rounded-full transition ${availability[day].enabled ? "bg-indigo-600" : "bg-slate-700"}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          availability[day].enabled ? "translate-x-4" : ""
                        }`}
                      />
                    </button>
                    <span className="text-white text-sm font-medium">
                      {day}
                    </span>
                  </div>
                  {availability[day].enabled ? (
                    <div className="flex items-center flex-wrap gap-2 md:gap-3">
                      <input
                        type="time"
                        value={availability[day].startTime}
                        onChange={(e) =>
                          updateDayTime(day, "startTime", e.target.value)
                        }
                        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 transition"
                      />
                      <span className="text-slate-500 text-sm">to</span>
                      <input
                        type="time"
                        value={availability[day].endTime}
                        onChange={(e) =>
                          updateDayTime(day, "endTime", e.target.value)
                        }
                        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  ) : (
                    <span className="text-slate-500 text-sm">Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {showServiceForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Add Service</h3>
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                  {formError}
                </div>
              )}
              <form onSubmit={handleAddService} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={serviceForm.name}
                    onChange={handleFormChange}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition"
                    placeholder="Haircut"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={serviceForm.description}
                    onChange={handleFormChange}
                    rows={2}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition resize-none"
                    placeholder="Classic haircut with wash"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Duration (hours)
                    </label>
                    <input
                      type="number"
                      name="durationHours"
                      step="0.5"
                      min="0"
                      value={serviceForm.durationHours}
                      onChange={handleFormChange}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition "
                      placeholder="e.g. 1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={serviceForm.price}
                      onChange={handleFormChange}
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowServiceForm(false);
                      setFormError(null);
                    }}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-medium py-2.5 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition"
                  >
                    {submitting ? "Adding..." : "Add Service"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
