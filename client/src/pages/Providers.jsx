import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../api/axios';
import DashboardLayout from '../components/DashboardLayout';

const Providers = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await api.get('/providers');
        setProviders(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load providers');
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.services.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="space-y-4">
              <div className="h-10 bg-slate-800/50 rounded-xl w-1/3"></div>
              <div className="h-5 bg-slate-800/30 rounded-lg w-2/3"></div>
              <div className="h-12 bg-slate-800/40 rounded-xl w-full max-w-md"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-slate-800/30 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-white mb-2">Failed to Load Providers</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
            Find Your Service Provider
          </h1>
          <p className="text-slate-400 text-lg mb-6">
            Browse and book appointments with our verified professionals
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search providers or services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/60 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Providers Grid */}
        {filteredProviders.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <svg className="w-20 h-20 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              {searchTerm ? 'No providers found' : 'No providers available yet'}
            </h3>
            <p className="text-slate-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new providers'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <div
                key={provider._id}
                className="group bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/book/${provider._id}`)}
              >
                {/* Provider Avatar */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl flex items-center justify-center text-2xl font-bold text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                    {provider.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {provider.name}
                    </h3>
                    <p className="text-sm text-slate-400 truncate">{provider.email}</p>
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-2 mb-5">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Services Offered</h4>
                  {provider.services.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No services available</p>
                  ) : (
                    <div className="space-y-2">
                      {provider.services.slice(0, 3).map((service) => (
                        <div key={service._id} className="flex items-center justify-between text-sm bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700/40">
                          <span className="text-white font-medium truncate flex-1">{service.name}</span>
                          <span className="text-emerald-400 font-bold ml-2 shrink-0">₹{service.price}</span>
                        </div>
                      ))}
                      {provider.services.length > 3 && (
                        <p className="text-xs text-slate-500 pl-3">+{provider.services.length - 3} more</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Book Button */}
                {provider.services.length > 0 && (
                  <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-emerald-500/20">
                    Book Appointment
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredProviders.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Showing {filteredProviders.length} of {providers.length} provider{providers.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Providers;
