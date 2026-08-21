import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Menu, X, User as UserIcon, LogOut, LayoutDashboard, FileText, Compass, Settings, PlusCircle, Building } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
    ${isActive(path) 
      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' 
      : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-400'}
  `;

  return (
    <nav className="border-b border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex flex-shrink-0 items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-200 dark:shadow-none">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                CareerConnect <span className="text-violet-600 font-extrabold text-xs align-super uppercase tracking-widest px-1 bg-violet-50 dark:bg-violet-950/50 rounded ml-1">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/jobs" className={navLinkClass('/jobs')}>Find Jobs</Link>
            <Link to="/about" className={navLinkClass('/about')}>About</Link>
            
            {/* Authenticated Seeker links */}
            {user && user.role === 'seeker' && (
              <>
                <Link to="/seeker/dashboard" className={navLinkClass('/seeker/dashboard')}>
                  <span className="flex items-center gap-1.5"><LayoutDashboard className="h-4 w-4" />Dashboard</span>
                </Link>
                <Link to="/seeker/applications" className={navLinkClass('/seeker/applications')}>
                  <span className="flex items-center gap-1.5"><FileText className="h-4 w-4" />My Applications</span>
                </Link>
                <Link to="/seeker/recommendations" className={navLinkClass('/seeker/recommendations')}>
                  <span className="flex items-center gap-1.5"><Compass className="h-4 w-4" />Recommended Jobs</span>
                </Link>
              </>
            )}

            {/* Authenticated Recruiter links */}
            {user && user.role === 'recruiter' && (
              <>
                <Link to="/recruiter/dashboard" className={navLinkClass('/recruiter/dashboard')}>
                  <span className="flex items-center gap-1.5"><LayoutDashboard className="h-4 w-4" />Dashboard</span>
                </Link>
                <Link to="/recruiter/company" className={navLinkClass('/recruiter/company')}>
                  <span className="flex items-center gap-1.5"><Building className="h-4 w-4" />Company Profile</span>
                </Link>
                <Link to="/recruiter/jobs/create" className={navLinkClass('/recruiter/jobs/create')}>
                  <span className="flex items-center gap-1.5"><PlusCircle className="h-4 w-4" />Post Job</span>
                </Link>
              </>
            )}

            {/* Authenticated Admin links */}
            {user && user.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                  <span className="flex items-center gap-1.5"><Settings className="h-4 w-4" />Admin Panel</span>
                </Link>
              </>
            )}
          </div>

          {/* Desktop Right Panel (Profile, Login/Register buttons) */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {user ? (
              <div className="flex items-center space-x-4 border-l border-gray-100 pl-4 dark:border-gray-800">
                <Link 
                  to={user.role === 'seeker' ? '/seeker/profile' : '#'} 
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold truncate max-w-[120px]">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-l border-gray-100 pl-4 dark:border-gray-800">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 dark:text-gray-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none dark:hover:bg-gray-800"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-2 pt-2 pb-3 space-y-1 shadow-inner dark:bg-gray-950 dark:border-gray-800">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Home
          </Link>
          <Link
            to="/jobs"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Find Jobs
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            About
          </Link>

          {user && user.role === 'seeker' && (
            <>
              <Link
                to="/seeker/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Dashboard
              </Link>
              <Link
                to="/seeker/applications"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                My Applications
              </Link>
              <Link
                to="/seeker/recommendations"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Recommended Jobs
              </Link>
              <Link
                to="/seeker/profile"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-gray-50 dark:text-indigo-400 dark:hover:bg-gray-800"
              >
                My Profile
              </Link>
            </>
          )}

          {user && user.role === 'recruiter' && (
            <>
              <Link
                to="/recruiter/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Dashboard
              </Link>
              <Link
                to="/recruiter/company"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Company Profile
              </Link>
              <Link
                to="/recruiter/jobs/create"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Post a Job
              </Link>
            </>
          )}

          {user && user.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Admin Panel
            </Link>
          )}

          {/* Profile & Auth Buttons for Mobile */}
          <div className="pt-4 pb-2 border-t border-gray-100 dark:border-gray-800">
            {user ? (
              <div className="px-3">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">{user.name}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 text-sm font-semibold transition"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-3 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center py-2 px-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center py-2 px-3 bg-indigo-600 rounded-lg text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
