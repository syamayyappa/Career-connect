import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, Briefcase } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await login(email, password);
      if (res.success) {
        // Redirect based on user role (retrieve from localStorage as context update might be async)
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo.role === 'seeker') {
          navigate('/seeker/dashboard');
        } else if (userInfo.role === 'recruiter') {
          navigate('/recruiter/dashboard');
        } else if (userInfo.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setErrorMsg(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80svh] items-center justify-center bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-slate-950/20">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-none">
        
        {/* Brand/Heading */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 mb-4">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Sign in to check matching scores, applications, and openings
          </p>
        </div>

        {/* Error alert */}
        {errorMsg && (
          <div className="mb-6 flex items-start gap-2.5 bg-rose-50 text-rose-750 dark:bg-rose-950/30 dark:text-rose-300 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 text-xs font-semibold">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 rounded-xl border border-slate-250 dark:border-slate-800 dark:bg-slate-950 px-4 py-3 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition font-medium"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 rounded-xl border border-slate-250 dark:border-slate-800 dark:bg-slate-950 px-4 py-3 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md shadow-blue-500/20 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Pills */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 text-center mb-2.5 uppercase tracking-wider">
            ⚡ Quick Demo Auto-Fill
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('alex.turner@example.com');
                setPassword('password123');
                setErrorMsg('');
              }}
              className="px-2 py-2 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900 rounded-xl transition text-center border border-blue-200/60 dark:border-blue-900 cursor-pointer shadow-2xs"
            >
              👤 Seeker
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('sarah@stripe.com');
                setPassword('password123');
                setErrorMsg('');
              }}
              className="px-2 py-2 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900 rounded-xl transition text-center border border-indigo-200/60 dark:border-indigo-900 cursor-pointer shadow-2xs"
            >
              🏢 Recruiter
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@careerconnect.ai');
                setPassword('password123');
                setErrorMsg('');
              }}
              className="px-2 py-2 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900 rounded-xl transition text-center border border-emerald-200/60 dark:border-emerald-900 cursor-pointer shadow-2xs"
            >
              👑 Admin
            </button>
          </div>
        </div>

        {/* Extra Footer */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          New to CareerConnect AI?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
