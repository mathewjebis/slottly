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
          : "Here's a look at your upcoming apppointments"}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {user?.role === "provider" ? (
          <>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-400 text-sm mb-1">
                Upcomming Appointments
              </p>
              <p className="text-3xl font-bold text-white">{upcoming}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-400 text-sm mb-1">
                Pending Confirmation
              </p>
              <p className="text-3xl font-bold text-white">{pending}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-400 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold text-white">{completed}</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-400 text-sm mb-1">Upcoming Bookings</p>
              <p className="text-3xl font-bold text-white">{upcoming}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-400 text-sm mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-white">
                {appointments.length}
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <p className="text-slate-400 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold text-white">{completed}</p>
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
    </DashboardLayout>
  );
};
export default Dashboard;
