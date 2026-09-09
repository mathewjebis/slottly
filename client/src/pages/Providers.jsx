import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

const Providers = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await api.get("/providers");
        setProviders(res.data);
      } catch {
        setError("Failed to load providers");
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const filtered = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.services.some((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
          Find a provider
        </h1>
        <p className="mt-2 text-ink-muted">
          Browse services and book an available slot.
        </p>

        <div className="relative mt-6 max-w-md">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search providers or services..."
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-accent"
          />
        </div>

        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl border border-line bg-white/70"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-white/60 px-6 py-12 text-center">
            <p className="font-medium text-ink">No providers found</p>
            <p className="mt-1 text-sm text-ink-muted">
              Try a different search, or check back later.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((provider) => (
              <button
                key={provider._id}
                type="button"
                onClick={() => navigate(`/book/${provider._id}`)}
                className="rounded-2xl border border-line bg-white p-5 text-left transition hover:border-accent/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft font-display text-lg font-bold text-accent-deep">
                    {provider.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-lg font-bold text-ink">
                      {provider.name}
                    </h2>
                    <p className="truncate text-sm text-ink-muted">
                      {provider.email}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {provider.services.length === 0 ? (
                    <p className="text-sm text-ink-muted">No services listed</p>
                  ) : (
                    provider.services.slice(0, 3).map((service) => (
                      <div
                        key={service._id}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <span className="truncate text-ink">{service.name}</span>
                        <span className="shrink-0 font-semibold text-accent">
                          ₹{service.price}
                        </span>
                      </div>
                    ))
                  )}
                  {provider.services.length > 3 && (
                    <p className="text-xs text-ink-muted">
                      +{provider.services.length - 3} more
                    </p>
                  )}
                </div>

                {provider.services.length > 0 && (
                  <span className="mt-5 inline-flex text-sm font-semibold text-accent">
                    Book now →
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Providers;
