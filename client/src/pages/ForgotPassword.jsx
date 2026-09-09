import { useState } from "react";
import { Link } from "react-router";
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
    <AuthLayout
      title={success ? "Check your email" : "Forgot password?"}
      subtitle={
        success
          ? undefined
          : "Enter your email and we’ll send a reset link"
      }
    >
      {success ? (
        <div className="text-center">
          <p className="text-sm text-ink-muted">{success}</p>
          <Link
            to="/login"
            className="mt-6 inline-block text-sm font-semibold text-accent"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-accent py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-ink-muted">
            Remember your password?{" "}
            <Link to="/login" className="font-semibold text-accent">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
