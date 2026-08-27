import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const upcoming = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed",
  ).length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const pending = appointments.filter((a) => a.status === "pending").length;

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

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-slate-400">Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-white mb-1">
        Welcome back, {user?.name?.split(" ")[0]}
      </h1>
      <p className="text-slate-400 mb-8">
        {user?.role === "provider"
          ? "Here's what's happening with your business today."
          : "Here's a look at your upcoming appointments"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {user?.role === "provider" ? (
          <>
            <div className="group relative bg-linear-to-br from-indigo-500/10 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-xl p-5 overflow-hidden transition-all duration-300 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors duration-300" />
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Upcoming Appointments</p>
                  <p className="text-4xl font-bold text-white mb-1">{upcoming}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="group relative bg-linear-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 rounded-xl p-5 overflow-hidden transition-all duration-300 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors duration-300" />
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Pending Confirmation</p>
                  <p className="text-4xl font-bold text-white mb-1">{pending}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="group relative bg-linear-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-xl p-5 overflow-hidden transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors duration-300" />
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Completed</p>
                  <p className="text-4xl font-bold text-white mb-1">{completed}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="group relative bg-linear-to-br from-indigo-500/10 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-xl p-5 overflow-hidden transition-all duration-300 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors duration-300" />
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Upcoming Bookings</p>
                  <p className="text-4xl font-bold text-white mb-1">{upcoming}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="group relative bg-linear-to-br from-violet-500/10 via-slate-900 to-slate-900 border border-violet-500/20 rounded-xl p-5 overflow-hidden transition-all duration-300 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-colors duration-300" />
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Total Bookings</p>
                  <p className="text-4xl font-bold text-white mb-1">{appointments.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="group relative bg-linear-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-xl p-5 overflow-hidden transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors duration-300" />
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Completed</p>
                  <p className="text-4xl font-bold text-white mb-1">{completed}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {user?.role === "provider" ? (
            <>
              <button
                onClick={() => navigate("/settings")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
              >
                Add Service
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
              >
                Set Availability
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
              >
                Add Time Off
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/providers")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
            >
              Book an Appointment
            </button>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          {user?.role === "provider"
            ? "Recent Appointments"
            : "Your Appointments"}
        </h2>
        {appointments.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
            <p className="text-slate-400 text-sm">No appointments yet</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
            {appointments.slice(0, 5).map((appt) => (
              <div
                key={appt._id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-white text-sm font-medium">
                    {appt.service?.name}
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    {user?.role === "provider"
                      ? appt.customer?.name
                      : appt.provider?.name}
                    {" · "}
                    {new Date(appt.date).toLocaleDateString()} at{" "}
                    {appt.startTime}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    appt.status === "confirmed"
                      ? "bg-green-500/10 text-green-400"
                      : appt.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : appt.status === "cancelled"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-slate-700/50 text-slate-400"
                  }`}
                >
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
