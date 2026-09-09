import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";
import { formatDisplayDate, toLocalDateString } from "../lib/format";

const Book = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(toLocalDateString);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingProvider, setLoadingProvider] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await api.get(`/providers/${providerId}`);
        setProvider(res.data);
      } catch {
        setError("Failed to load provider details");
      } finally {
        setLoadingProvider(false);
      }
    };
    fetchProvider();
  }, [providerId]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedService || !selectedDate) return;
      setLoadingSlots(true);
      setAvailableSlots([]);
      setSelectedSlot(null);
      setError(null);
      try {
        const res = await api.get("/appointments/available-slots", {
          params: {
            providerId,
            serviceId: selectedService._id,
            date: selectedDate,
          },
        });
        setAvailableSlots(res.data);
      } catch {
        setError("Failed to load available slots");
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedDate, selectedService, providerId]);

  const handleBook = async () => {
    if (!selectedSlot || !selectedService) return;
    setBookingInProgress(true);
    setError(null);
    try {
      await api.post("/appointments", {
        providerId,
        serviceId: selectedService._id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
      });
      navigate("/appointment-confirm", {
        state: {
          providerName: provider.name,
          serviceName: selectedService.name,
          date: formatDisplayDate(selectedDate, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loadingProvider) {
    return (
      <DashboardLayout>
        <div className="h-64 animate-pulse rounded-2xl border border-line bg-white/70" />
      </DashboardLayout>
    );
  }

  if (!provider) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
          <h2 className="font-display text-xl font-bold text-rose-800">
            Provider not found
          </h2>
          <button
            type="button"
            onClick={() => navigate("/providers")}
            className="mt-4 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to providers
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl animate-fade-in">
        <button
          type="button"
          onClick={() => navigate("/providers")}
          className="mb-6 text-sm font-medium text-ink-muted transition hover:text-accent"
        >
          ← Back to providers
        </button>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft font-display text-xl font-bold text-accent-deep">
            {provider.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">
              Book with {provider.name}
            </h1>
            <p className="text-ink-muted">{provider.email}</p>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="font-display text-xl font-bold text-ink">
            1. Select a service
          </h2>
          {provider.services.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">
              No services available from this provider.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {provider.services.map((service) => (
                <button
                  key={service._id}
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selectedService?._id === service._id
                      ? "border-accent bg-accent-soft/60"
                      : "border-line bg-white hover:border-accent/40"
                  }`}
                >
                  <p className="font-semibold text-ink">{service.name}</p>
                  <p className="mt-1 text-sm text-accent">
                    ₹{service.price} · {service.duration} min
                  </p>
                  {service.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-ink-muted">
                      {service.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        {selectedService && (
          <section className="mb-8 animate-fade-in">
            <h2 className="font-display text-xl font-bold text-ink">
              2. Choose a date
            </h2>
            <input
              type="date"
              value={selectedDate}
              min={toLocalDateString()}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-4 max-w-xs rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none focus:border-accent"
            />
          </section>
        )}

        {selectedService && selectedDate && (
          <section className="mb-8 animate-fade-in">
            <h2 className="font-display text-xl font-bold text-ink">
              3. Pick a time
            </h2>
            {loadingSlots ? (
              <div className="mt-6 flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              </div>
            ) : availableSlots.length === 0 ? (
              <p className="mt-4 text-sm text-ink-muted">
                No slots for this date. Try another day.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.startTime}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                      selectedSlot?.startTime === slot.startTime
                        ? "bg-accent text-white"
                        : "border border-line bg-white text-ink hover:border-accent"
                    }`}
                  >
                    {slot.startTime}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {selectedSlot && selectedService && (
          <section className="animate-fade-in rounded-2xl border border-line bg-white p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
              Summary
            </h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Service</dt>
                <dd className="font-medium text-ink">{selectedService.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Date</dt>
                <dd className="font-medium text-ink">
                  {formatDisplayDate(selectedDate, { weekday: "long" })}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Time</dt>
                <dd className="font-medium text-ink">
                  {selectedSlot.startTime}–{selectedSlot.endTime}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-line pt-3">
                <dt className="text-ink-muted">Price</dt>
                <dd className="font-display text-lg font-bold text-accent">
                  ₹{selectedService.price}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={handleBook}
              disabled={bookingInProgress}
              className="mt-6 w-full rounded-xl bg-accent py-3.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
            >
              {bookingInProgress ? "Booking..." : "Confirm booking"}
            </button>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Book;
