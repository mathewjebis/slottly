import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import DashboardLayout from '../components/DashboardLayout';

const AppointmentConfirm = () => {
  const location = useLocation();
  const appointmentDetails = location.state || {};
  const [showConfetti, setShowConfetti] = useState(true);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Animation Container */}
        <div className="relative">
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-emerald-400 rounded-full animate-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${1 + Math.random()}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Success Card */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900/20 border border-emerald-500/20 rounded-3xl p-8 md:p-12 text-center overflow-hidden shadow-2xl">
            {/* Glow Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-400/5 rounded-full blur-2xl" />

            {/* Success Icon */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 border-2 border-emerald-500/40 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/20">
                <svg className="w-12 h-12 text-emerald-400 animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="relative text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Appointment Booked Successfully!
            </h1>
            <p className="relative text-slate-300 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Your appointment has been confirmed. A confirmation email with all details has been sent to your inbox.
            </p>

            {/* Appointment Details (if available) */}
            {appointmentDetails.date && (
              <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 mb-8 text-left space-y-3">
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Appointment Details</h3>

                {appointmentDetails.providerName && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="text-xs text-slate-500">Provider</p>
                      <p className="text-white font-medium">{appointmentDetails.providerName}</p>
                    </div>
                  </div>
                )}

                {appointmentDetails.serviceName && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-xs text-slate-500">Service</p>
                      <p className="text-white font-medium">{appointmentDetails.serviceName}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-500">Date & Time</p>
                    <p className="text-white font-medium">
                      {appointmentDetails.date} at {appointmentDetails.startTime}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Dashboard
              </Link>
              <Link
                to="/providers"
                className="inline-flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Book Another
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-slate-500 text-sm mt-8">
            Need to make changes? Contact us or manage your appointments in the dashboard.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh + 100px)) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes checkmark {
          0% {
            stroke-dasharray: 0 100;
          }
          100% {
            stroke-dasharray: 100 0;
          }
        }
        .animate-confetti {
          animation: confetti linear infinite;
        }
        .animate-checkmark {
          animation: checkmark 0.6s ease-in-out;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default AppointmentConfirm;
