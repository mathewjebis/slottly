import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setSuccess(res.data.message);
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
      {success ? (
        <div className="flex flex-col items-center justify-center min-h-75 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
            <span className="text-3xl">📧</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Check your email
          </h2>
          <p className="text-slate-400 text-sm mb-8">{success}</p>
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 text-sm"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-white mb-2">
            Forgot password?
          </h1>
          <p className="text-slate-400 mb-8">
            Enter your email and we'll send you a reset link
          </p>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
          <p className="text-slate-400 text-sm text-center mt-6">
            Remember your password?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
