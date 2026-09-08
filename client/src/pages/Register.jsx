import { useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import Logo from "../components/Logo";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.errors?.[0]?.msg || data?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <Logo />
        <br />{" "}
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Create an account</h1>
      <p className="text-slate-400 mb-6">Join Slottly today</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition"
            placeholder="you@example.com"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10.5 text-slate-400 hover:text-white transition text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Account Type
          </label>

          <div className="grid grid-cols-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                role === "customer"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("provider")}
              className={`py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                role === "provider"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Provider
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all duration-200"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-slate-400 text-sm text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
