import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';

const Book = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Fetch provider details and services
  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await api.get(`/providers/${providerId}`);
        setProvider(res.data);
      } catch (err) {
        setError('Failed to load provider details');
      } finally {
        setLoadingProvider(false);
      }
    };
    fetchProvider();
  }, [providerId]);

  // Fetch available slots when service and date change
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedService || !selectedDate) return;
      setLoadingSlots(true);
      setAvailableSlots([]);
      setSelectedSlot(null);
      try {
        const res = await api.get('/appointments/available-slots', {
          params: {
            providerId,
            serviceId: selectedService._id,
            date: selectedDate
          }
        });
        setAvailableSlots(res.data);
      } catch (err) {
        setError('Failed to load available slots');
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedDate, selectedService, providerId]);

  const handleBook = async () => {
    if (!selectedSlot) return;
    setBookingInProgress(true);
    setError(null);
    try {
      await api.post('/appointments', {
        providerId,
        serviceId: selectedService._id,
        date: selectedDate,
        startTime: selectedSlot.startTime
      });
      navigate('/appointment-confirm', {
        state: {
          providerName: provider.name,
          serviceName: selectedService.name,
          date: new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          startTime: selectedSlot.startTime
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingInProgress(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (loadingProvider) {
    return (
      <DashboardLayout>
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <div className="animate-pulse space-y-8">
            <div className="space-y-3">
              <div className="h-8 bg-slate-800/50 rounded-lg w-1/3"></div>
              <div className="h-5 bg-slate-800/30 rounded w-1/2"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-slate-800/30 rounded w-40"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-slate-800/30 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!provider) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-white mb-2">Provider Not Found</h2>
            <p className="text-slate-400 mb-6">The provider you're looking for doesn't exist or is unavailable.</p>
            <button
              onClick={() => navigate('/providers')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              ← Back to Providers
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const steps = [
    { number: 1, title: 'Select Service', icon: '🛠️' },
    { number: 2, title: 'Choose Date', icon: '📅' },
    { number: 3, title: 'Pick Time', icon: '⏰' },
    { number: 4, title: 'Confirm', icon: '✓' }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/providers')}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-4 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Providers
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl flex items-center justify-center text-2xl font-bold text-emerald-400 border border-emerald-500/30">
              {provider.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Book with {provider.name}
              </h1>
              <p className="text-slate-400">{provider.email}</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-2xl mx-auto mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all ${
                    currentStep >= step.number
                      ? 'bg-emerald-600 border-emerald-500 text-white scale-110'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}>
                    {currentStep > step.number ? '✓' : step.number}
                  </div>
                  <p className={`text-xs mt-2 font-medium ${currentStep >= step.number ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 transition-all ${currentStep > step.number ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 md:p-8">
          {/* Step 1: Select Service */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <span className="text-xl">🛠️</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Select a Service</h2>
            </div>

            {provider.services.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-700/40 rounded-xl p-8 text-center">
                <p className="text-slate-400">No services available from this provider</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {provider.services.map((service) => (
                  <button
                    key={service._id}
                    onClick={() => {
                      setSelectedService(service);
                      setCurrentStep(2);
                      setSelectedSlot(null);
                    }}
                    className={`relative px-5 py-4 rounded-xl border-2 text-left transition-all group ${
                      selectedService?._id === service._id
                        ? 'bg-emerald-600/20 border-emerald-500 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-700/30 border-slate-600 hover:border-emerald-500/50 hover:bg-slate-700/50'
                    }`}
                  >
                    {selectedService?._id === service._id && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-white text-lg mb-2 group-hover:text-emerald-400 transition-colors">
                        {service.name}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-emerald-400 font-bold text-base">₹{service.price}</span>
                        <span className="text-slate-400">{service.duration} mins</span>
                      </div>
                      {service.description && (
                        <p className="text-slate-400 text-sm mt-2 line-clamp-2">{service.description}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Select Date */}
          {selectedService && (
            <div className="mb-8 animate-fadeIn">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <span className="text-xl">📅</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Choose a Date</h2>
              </div>
              <input
                type="date"
                value={selectedDate}
                min={getTodayDate()}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentStep(3);
                  setSelectedSlot(null);
                }}
                className="w-full max-w-md bg-slate-700/50 border-2 border-slate-600 text-white text-lg rounded-xl px-5 py-4 focus:outline-none focus:border-emerald-500 transition cursor-pointer hover:border-emerald-500/50"
              />
            </div>
          )}

          {/* Step 3: Select Time Slot */}
          {selectedService && selectedDate && (
            <div className="mb-8 animate-fadeIn">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <span className="text-xl">⏰</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Pick a Time</h2>
              </div>

              {loadingSlots ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-700/40 rounded-xl p-8 text-center">
                  <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-slate-400 font-medium">No available time slots for this date</p>
                  <p className="text-slate-500 text-sm mt-2">Try selecting a different date</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.startTime}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setCurrentStep(4);
                      }}
                      className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        selectedSlot?.startTime === slot.startTime
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:scale-105 border border-slate-600 hover:border-emerald-500/50'
                      }`}
                    >
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-xl mb-6 flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Booking Summary & Confirm Button */}
          {selectedSlot && (
            <div className="animate-fadeIn">
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-6 mb-6">
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service:</span>
                    <span className="text-white font-semibold">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date:</span>
                    <span className="text-white font-semibold">
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time:</span>
                    <span className="text-white font-semibold">{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-emerald-500/20">
                    <span className="text-slate-400">Price:</span>
                    <span className="text-emerald-400 font-bold text-lg">₹{selectedService.price}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBook}
                disabled={bookingInProgress}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 flex items-center justify-center gap-3"
              >
                {bookingInProgress ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Book;
