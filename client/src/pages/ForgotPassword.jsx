import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Logo from "../components/Logo";

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl p-8 border border-slate-800 ">
        <div className="mb-6">
          <Logo />
        </div>

        {success ? (
          <div className="text-center">
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-4 rounded-lg mb-6">
              <p className="font-medium mb-1">Check your email</p>
              <p className="text-sm">{success}</p>
            </div>
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
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300"
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
export default ForgotPassword;
