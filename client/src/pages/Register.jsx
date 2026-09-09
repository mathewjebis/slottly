import { useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

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
    <AuthLayout title="Create an account" subtitle="Join Slottly today">
      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Full name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-accent"
            placeholder="Alex Rivera"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-accent"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 pr-16 outline-none focus:border-accent"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink-muted"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Account type
          </label>
          <div className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-surface p-1">
            {["customer", "provider"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRole(option)}
                className={`rounded-lg py-2 text-sm font-semibold capitalize transition ${
                  role === option
                    ? "bg-accent text-white"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-accent py-3 font-semibold text-white transition hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-accent">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
