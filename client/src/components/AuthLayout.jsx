import Logo from "./Logo";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-indigo-600/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-125 h-125 bg-violet-600/30 rounded-full blur-[120px] animate-pulse" />
      <div className="relative z-10 w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-2xl">
        <div className="hidden lg:flex flex-col   w-[45%] bg-indigo-950/80 border border-indigo-500/30 backdrop-blur-sm p-10">
          <Logo size="lg" />
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 leading-tight mt-8">
              Book smarter.
              <br />
              Manage better.
            </h2>
            <p className="text-slate-400 mb-6">
              The all-in-one appointment platform for modern service providers
              and their customers.
            </p>
            <div className="space-y-4  mb-5">
              {[
                { icon: "⚡", text: "Real-time slot generation" },
                { icon: "🔒", text: "Your data stays private" },
                { icon: "📅", text: "Smart scheduling" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-sm">
                    {item.icon}
                  </div>
                  <span className="text-slate-300 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-auto">
            © {new Date().getFullYear()} Slottly. All rights reserved.
          </p>
        </div>
        <div className="flex-1 bg-slate-900 border border-slate-800 lg:border-l-0 p-8 lg:p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
