import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
        duration: Number(serviceForm.duration),
        price: Number(serviceForm.price),
      });
      setServices([...services, res.data]);
      setShowServiceForm(false);
      setServiceForm({ name: "", description: "", duration: "", price: "" });
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
  const tabs = [
    { id: "services", label: "Services" },
    { id: "availability", label: "Availability" },
    { id: "timeoff", label: "Time Off" },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-slate-400">Loading...</p>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
      <p className="text-slate-400 mb-8">
        Manage your services, availability, and time off
      </p>
      <div className="flex gap-2 border-b border-slate-800 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Your Services</h2>
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
            <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white text-sm font-medium">
                      {service.name}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      {service.duration} min · ₹{service.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-slate-400 hover:text-white text-sm transition">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteService(service._id)}
                      className="text-red-400 hover:text-red-300 text-sm transition"
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
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={serviceForm.duration}
                    onChange={handleFormChange}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition"
                    placeholder="30"
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
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition"
                    placeholder="300"
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
    </DashboardLayout>
  );
};
export default Settings;
