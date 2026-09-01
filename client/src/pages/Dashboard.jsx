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
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;

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
        <div className="animate-pulse space-y-8">
          {/* Header skeleton */}
          <div className="space-y-3">
            <div className="h-10 bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-xl w-2/5"></div>
            <div className="h-5 bg-slate-800/30 rounded-lg w-3/5"></div>
          </div>

          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 bg-gradient-to-br from-slate-800/40 to-slate-800/20 rounded-2xl border border-slate-800/50"></div>
            ))}
          </div>

          {/* Quick actions skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-slate-800/30 rounded-lg w-32"></div>
            <div className="flex gap-3">
              <div className="h-11 bg-slate-800/30 rounded-xl w-40"></div>
              <div className="h-11 bg-slate-800/20 rounded-xl w-36"></div>
            </div>
          </div>

          {/* Appointments list skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-slate-800/30 rounded-lg w-48"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-800/20 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Get today's appointments
  const today = new Date().toDateString();
  const todayAppointments = appointments.filter(
    (a) => new Date(a.date).toDateString() === today && a.status !== "cancelled"
  ).length;

  return (
    <DashboardLayout>
      {/* Hero Header Section */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome back, {user?.name?.split(" ")[0]}
              <span className="inline-block ml-2 animate-wave">👋</span>
            </h1>
            <p className="text-slate-400 text-base md:text-lg">
              {user?.role === "provider"
                ? "Here's what's happening with your business today."
                : "Manage your appointments and book new services."}
            </p>
          </div>
          {todayAppointments > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-400">
                {todayAppointments} today
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {user?.role === "provider" ? (
          <>
            {/* Upcoming Appointments Card */}
            <div className="group relative bg-gradient-to-br from-emerald-500/10 via-slate-900/95 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1 cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/5 rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-emerald-500/10">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Upcoming</p>
                  <p className="text-5xl font-bold text-white mb-1 transition-transform duration-300 group-hover:scale-105">{upcoming}</p>
                  <p className="text-slate-500 text-sm">Active appointments</p>
                </div>
              </div>
            </div>

            {/* Pending Confirmation Card */}
            <div className="group relative bg-gradient-to-br from-amber-500/10 via-slate-900/95 to-slate-900 border border-amber-500/20 rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-1 cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-400/5 rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-amber-500/10">
                    <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  {pending > 0 && (
                    <div className="px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                      <span className="text-xs font-bold text-amber-400">Action needed</span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Pending</p>
                  <p className="text-5xl font-bold text-white mb-1 transition-transform duration-300 group-hover:scale-105">{pending}</p>
                  <p className="text-slate-500 text-sm">Awaiting confirmation</p>
                </div>
              </div>
            </div>

            {/* Completed Card */}
            <div className="group relative bg-gradient-to-br from-blue-500/10 via-slate-900/95 to-slate-900 border border-blue-500/20 rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/5 rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center border border-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-blue-500/10">
                    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Completed</p>
                  <p className="text-5xl font-bold text-white mb-1 transition-transform duration-300 group-hover:scale-105">{completed}</p>
                  <p className="text-slate-500 text-sm">Total finished</p>
                </div>
              </div>
            </div>

            {/* Revenue/Total Card */}
            <div className="group relative bg-gradient-to-br from-violet-500/10 via-slate-900/95 to-slate-900 border border-violet-500/20 rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-1 cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-400/5 rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 flex items-center justify-center border border-violet-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-violet-500/10">
                    <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Total</p>
                  <p className="text-5xl font-bold text-white mb-1 transition-transform duration-300 group-hover:scale-105">{appointments.length}</p>
                  <p className="text-slate-500 text-sm">All appointments</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Customer Stats Cards */}
            <div className="group relative bg-gradient-to-br from-emerald-500/10 via-slate-900/95 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1 cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/5 rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-emerald-500/10">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Upcoming</p>
                  <p className="text-5xl font-bold text-white mb-1 transition-transform duration-300 group-hover:scale-105">{upcoming}</p>
                  <p className="text-slate-500 text-sm">Active bookings</p>
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-violet-500/10 via-slate-900/95 to-slate-900 border border-violet-500/20 rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-1 cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-400/5 rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 flex items-center justify-center border border-violet-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-violet-500/10">
                    <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Total</p>
                  <p className="text-5xl font-bold text-white mb-1 transition-transform duration-300 group-hover:scale-105">{appointments.length}</p>
                  <p className="text-slate-500 text-sm">All bookings</p>
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-blue-500/10 via-slate-900/95 to-slate-900 border border-blue-500/20 rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/5 rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center border border-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-blue-500/10">
                    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Completed</p>
                  <p className="text-5xl font-bold text-white mb-1 transition-transform duration-300 group-hover:scale-105">{completed}</p>
                  <p className="text-slate-500 text-sm">Finished services</p>
                </div>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-rose-500/10 via-slate-900/95 to-slate-900 border border-rose-500/20 rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:border-rose-500/40 hover:shadow-2xl hover:shadow-rose-500/20 hover:-translate-y-1 cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-400/5 rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 flex items-center justify-center border border-rose-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-rose-500/10">
                    <svg className="w-7 h-7 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Cancelled</p>
                  <p className="text-5xl font-bold text-white mb-1 transition-transform duration-300 group-hover:scale-105">{cancelled}</p>
                  <p className="text-slate-500 text-sm">Not completed</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
          <h2 className="text-xl font-bold text-white">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user?.role === "provider" ? (
            <>
              <button
                onClick={() => navigate("/settings")}
                className="group relative bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-4 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <div className="relative text-left">
                  <div className="font-bold text-lg">Add Service</div>
                  <div className="text-emerald-100 text-sm opacity-90">Create new offering</div>
                </div>
                <svg className="relative w-5 h-5 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-4 hover:shadow-xl hover:-translate-y-0.5 overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center border border-slate-600/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="relative text-left">
                  <div className="font-bold text-lg">Set Availability</div>
                  <div className="text-slate-400 text-sm">Manage your schedule</div>
                </div>
                <svg className="relative w-5 h-5 ml-auto opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-4 hover:shadow-xl hover:-translate-y-0.5 overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center border border-slate-600/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div className="relative text-left">
                  <div className="font-bold text-lg">Add Time Off</div>
                  <div className="text-slate-400 text-sm">Block unavailable dates</div>
                </div>
                <svg className="relative w-5 h-5 ml-auto opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/providers")}
                className="group relative bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-4 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 overflow-hidden sm:col-span-2 lg:col-span-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="relative text-left">
                  <div className="font-bold text-lg">Book Appointment</div>
                  <div className="text-emerald-100 text-sm opacity-90">Find and book services</div>
                </div>
                <svg className="relative w-5 h-5 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="group relative bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 flex items-center gap-4 hover:shadow-xl hover:-translate-y-0.5 overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center border border-slate-600/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="relative text-left">
                  <div className="font-bold text-lg">My Profile</div>
                  <div className="text-slate-400 text-sm">Update your details</div>
                </div>
                <svg className="relative w-5 h-5 ml-auto opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Appointments List Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
            <h2 className="text-xl font-bold text-white">
              {user?.role === "provider" ? "Recent Appointments" : "Your Appointments"}
            </h2>
          </div>
          {appointments.length > 5 && (
            <button
              onClick={() => navigate("/appointments")}
              className="text-sm text-slate-400 hover:text-emerald-400 font-medium transition-colors flex items-center gap-1.5 group"
            >
              <span>View all {appointments.length}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {appointments.length === 0 ? (
          <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/80 border border-slate-800/80 rounded-3xl p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

            <div className="relative flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 shadow-xl shadow-emerald-500/10">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>

              <h3 className="text-white text-xl font-bold mb-2">No appointments yet</h3>
              <p className="text-slate-400 text-sm max-w-md mb-6">
                {user?.role === "provider"
                  ? "When clients book services with you, they'll appear here. Set up your services and availability to get started."
                  : "You haven't booked any appointments yet. Browse our service providers to schedule your first appointment."}
              </p>

              <button
                onClick={() => navigate(user?.role === "provider" ? "/settings" : "/providers")}
                className="group bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 hover:shadow-xl hover:shadow-emerald-500/20"
              >
                <span>{user?.role === "provider" ? "Setup Services" : "Browse Providers"}</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
            {appointments.slice(0, 5).map((appt, index) => (
              <div
                key={appt._id}
                className={`group p-5 flex items-center justify-between transition-all duration-200 hover:bg-slate-800/40 gap-4 cursor-pointer ${
                  index !== 0 ? 'border-t border-slate-800/60' : ''
                }`}
                onClick={() => navigate(`/appointments/${appt._id}`)}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Service Icon */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/60 flex items-center justify-center text-slate-300 shrink-0 font-bold text-lg group-hover:scale-105 group-hover:border-emerald-500/30 transition-all duration-300 shadow-lg">
                      {appt.service?.name ? appt.service.name.charAt(0).toUpperCase() : "S"}
                    </div>
                    {/* Status Indicator Dot */}
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                      appt.status === "confirmed" ? "bg-emerald-400" :
                      appt.status === "pending" ? "bg-amber-400 animate-pulse" :
                      appt.status === "cancelled" ? "bg-rose-400" : "bg-slate-400"
                    }`}></div>
                  </div>

                  {/* Appointment Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-white text-base font-bold truncate group-hover:text-emerald-400 transition-colors">
                        {appt.service?.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-400 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-slate-300 font-medium">
                          {user?.role === "provider" ? appt.customer?.name : appt.provider?.name}
                        </span>
                      </div>

                      <span className="text-slate-700">•</span>

                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          {new Date(appt.date).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>

                      <span className="text-slate-700">•</span>

                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-mono text-xs">{appt.startTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge and Arrow */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border transition-all duration-200 ${
                    appt.status === "confirmed"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 group-hover:bg-emerald-500/20" :
                    appt.status === "pending"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30 group-hover:bg-amber-500/20" :
                    appt.status === "cancelled"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/30" :
                      "bg-slate-800 text-slate-400 border-slate-700/50"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      appt.status === "confirmed" ? "bg-emerald-400" :
                      appt.status === "pending" ? "bg-amber-400 animate-pulse" :
                      appt.status === "cancelled" ? "bg-rose-400" : "bg-slate-400"
                    }`}/>
                    <span className="capitalize">{appt.status}</span>
                  </span>

                  <svg className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
