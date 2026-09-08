const ServiceProviderCard = ({ provider, onBook }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col gap-4 hover:border-slate-600 transition">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-2xl font-semibold text-emerald-400">
          {provider.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{provider.name}</h3>
          <p className="text-slate-400 text-sm">{provider.email}</p>
        </div>
      </div>
      <div className="border-t border-slate-700 pt-4">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Services Offered</h4>
        {provider.services.length === 0 ? (
          <p className="text-slate-500 text-xs">No services available</p>
        ) : (
          <ul className="space-y-2">
            {provider.services.map((service) => (
              <li key={service._id} className="text-white text-sm flex justify-between">
                <span>{service.name}</span>
                <span className="text-emerald-400 font-semibold">₹{service.price}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {provider.services.length > 0 && (
        <button
          onClick={onBook}
          className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition"
        >
          Book Appointment
        </button>
      )}
    </div>
  );
};

export default ServiceProviderCard;
