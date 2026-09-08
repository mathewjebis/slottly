import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/dashboard" className="shrink-0">
            <Logo className="h-8 w-8 text-emerald-500" />
          </Link>
          <span className="ml-3 text-xl font-bold text-white hidden sm:block">Slottly</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.name || 'Guest'}</p>
              <p className="text-xs text-emerald-400">
                {user?.role === 'provider' ? 'Provider' :
                 user?.role === 'admin' ? 'Admin' : 'Customer'}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
