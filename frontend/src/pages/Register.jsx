import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User as UserIcon, Phone, MapPin, AlertCircle, Briefcase } from 'lucide-react';

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
    <div className="flex min-h-[85svh] items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-950/20">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-150 mb-4">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create Your Account</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Join CareerConnect AI to streamline your hiring or job search
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 flex items-start gap-2.5 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300 p-4 rounded-xl border border-red-100 dark:border-red-900/50 text-sm animate-shake">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <UserIcon className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-10 rounded-xl border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 transition"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Role / Purpose <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 transition"
              >
                <option value="seeker">Job Seeker (Apply for Jobs)</option>
                <option value="recruiter">Recruiter (Post Jobs & Hire)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 rounded-xl border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 transition"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Password (6+ characters) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-4.5 w-4.5" />
              </div>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 rounded-xl border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full pl-10 rounded-xl border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 transition"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="w-full pl-10 rounded-xl border border-gray-250 dark:border-gray-800 dark:bg-gray-950 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 transition"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <UserPlus className="h-4.5 w-4.5" />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
