import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User as UserIcon, Phone, MapPin, AlertCircle, Briefcase, Sparkles, Building } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    role: 'seeker'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set role from query parameter if provided (e.g. /register?role=recruiter)
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['seeker', 'recruiter'].includes(roleParam)) {
      setForm(f => ({ ...f, role: roleParam }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setErrorMsg('Please fill in all required fields (Name, Email, Password).');
      return;
    }

    if (form.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await register(form);
      if (res.success) {
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
        setErrorMsg(res.message || 'Registration failed. Try again.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[85svh] items-center justify-center bg-mesh-pattern py-14 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg glass-panel p-8 sm:p-10 rounded-3xl shadow-xl shadow-indigo-950/5 relative">
        
        {/* Decorative Top Accent Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-20 w-36 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-full blur-xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 mb-4">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Create Your Account
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Join CareerConnect AI to streamline your hiring or job search
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 flex items-start gap-2.5 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 text-xs font-semibold">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Role Toggle Selector */}
        <div className="mb-6 p-1.5 bg-slate-100 dark:bg-slate-900/80 rounded-2xl flex gap-1 border border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, role: 'seeker' }))}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              form.role === 'seeker'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60 dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <UserIcon className="h-3.5 w-3.5" />
            <span>Job Seeker (Candidate)</span>
          </button>
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, role: 'recruiter' }))}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              form.role === 'recruiter'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60 dark:bg-slate-800 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            <span>Recruiter (Hiring)</span>
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900/90 px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 transition font-medium text-slate-900 dark:text-white"
                placeholder="Alex Turner"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900/90 px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 transition font-medium text-slate-900 dark:text-white"
                placeholder="alex@domain.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Password (6+ characters) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900/90 px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 transition font-medium text-slate-900 dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full pl-10 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900/90 px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 transition font-medium text-slate-900 dark:text-white"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full pl-10 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900/90 px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 transition font-medium text-slate-900 dark:text-white"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3.5 btn-primary-gradient text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md shadow-indigo-600/25 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
