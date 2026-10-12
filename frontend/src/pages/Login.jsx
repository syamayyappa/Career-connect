import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, Briefcase, Sparkles, ArrowRight } from 'lucide-react';

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
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('TIMEOUT_EXCEEDED')), 16000)
      );

      const res = await Promise.race([login(email, password), timeoutPromise]);
      if (res && res.success) {
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
        setErrorMsg(res?.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      if (err.message === 'TIMEOUT_EXCEEDED') {
        setErrorMsg('Server response timed out. If testing locally, please ensure the backend is running on port 5000 (run start_project.bat).');
      } else {
        setErrorMsg(err.message || 'An unexpected error occurred during login.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[85svh] items-center justify-center bg-mesh-pattern py-14 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl shadow-xl shadow-indigo-950/5 relative">
        
        {/* Decorative Top Accent Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-20 w-36 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-full blur-xl pointer-events-none" />

        {/* Brand / Heading */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 mb-4">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Sign in to check matching scores, ATS pipeline, and postings
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 flex items-start gap-2.5 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 text-xs font-semibold">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
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
                className="w-full pl-10 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900/90 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 transition font-medium text-slate-900 dark:text-white"
                placeholder="name@domain.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900/90 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 transition font-medium text-slate-900 dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 btn-primary-gradient text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md shadow-indigo-600/25 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Sign In to CareerConnect</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Pills */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 text-center mb-3 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Sparkles className="h-3 w-3 text-indigo-500" /> Demo Quick Login (Click to Fill)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('alex.turner@example.com');
                setPassword('password123');
                setErrorMsg('');
              }}
              className="px-2 py-2.5 text-xs font-bold bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900 rounded-xl transition text-center border border-indigo-200/80 dark:border-indigo-800 cursor-pointer shadow-2xs flex flex-col items-center gap-0.5"
            >
              <span>Candidate</span>
              <span className="text-[10px] font-normal text-indigo-500">Alex</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('sarah@stripe.com');
                setPassword('password123');
                setErrorMsg('');
              }}
              className="px-2 py-2.5 text-xs font-bold bg-violet-50/80 hover:bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-900 rounded-xl transition text-center border border-violet-200/80 dark:border-violet-800 cursor-pointer shadow-2xs flex flex-col items-center gap-0.5"
            >
              <span>Recruiter</span>
              <span className="text-[10px] font-normal text-violet-500">Sarah</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@careerconnect.ai');
                setPassword('password123');
                setErrorMsg('');
              }}
              className="px-2 py-2.5 text-xs font-bold bg-emerald-50/80 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900 rounded-xl transition text-center border border-emerald-200/80 dark:border-emerald-800 cursor-pointer shadow-2xs flex flex-col items-center gap-0.5"
            >
              <span>Admin</span>
              <span className="text-[10px] font-normal text-emerald-500">System</span>
            </button>
          </div>
        </div>

        {/* Extra Footer Link */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition">
            Create an Account Free
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
