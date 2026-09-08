import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import api from '../api/axios';
import AuthLayout from '../components/AuthLayout';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus('success');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setStatus('error');
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <AuthLayout>
      <div className="text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4" />
            <p className="text-white">Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-4xl text-green-400 mb-4">✓</div>
            <h1 className="text-2xl font-bold text-white mb-2">Email Verified!</h1>
            <p className="text-slate-300">Redirecting to login in 3 seconds...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-4xl text-red-400 mb-4">!</div>
            <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
            <p className="text-slate-300 mb-4">The link may be expired or invalid.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
