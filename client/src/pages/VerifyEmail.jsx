import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus("success");
        setTimeout(() => navigate("/login"), 3000);
      } catch {
        setStatus("error");
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <AuthLayout title="Email verification">
      <div className="text-center">
        {status === "verifying" && (
          <>
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-ink-muted">Verifying your email...</p>
          </>
        )}
        {status === "success" && (
          <>
            <h2 className="font-display text-xl font-bold text-ink">
              Email verified
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Redirecting to login in a few seconds...
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="font-display text-xl font-bold text-ink">
              Verification failed
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              The link may be expired or invalid.
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white"
            >
              Go to login
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
