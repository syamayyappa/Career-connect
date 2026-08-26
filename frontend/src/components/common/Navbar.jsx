import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { Briefcase, Menu, X, User as UserIcon, LogOut, LayoutDashboard, FileText, Compass, Settings, PlusCircle, Building, Bell, Bookmark, Calendar, Check, Circle, ScanLine, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [showBellDropdown, setShowBellDropdown] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const { data } = await API.get('/notifications');
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 30 seconds for simplicity in local demo
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setShowBellDropdown(false);
    navigate('/login');
  };

  const markNotificationRead = async (id) => {
    try {
      const { data } = await API.put(`/notifications/${id}/read`);
      if (data.success) {
        setNotifications(list => list.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const { data } = await API.put('/notifications/read-all');
      if (data.success) {
        setNotifications(list => list.map(n => ({ ...n, read: true })));
        toast.success('All notifications marked as read');
        setShowBellDropdown(false);
      }
    } catch (err) {
      console.error('Error marking all notifications read:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-150 whitespace-nowrap inline-flex items-center gap-1.5 shrink-0
    ${isActive(path) 
      ? 'bg-blue-50 text-blue-700 border border-blue-200/80 font-bold shadow-xs dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/80' 
      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'}
  `;

  return (
    <nav className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs dark:border-slate-800 dark:bg-slate-950/90 sticky top-0 z-50 transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center shrink-0 mr-2 lg:mr-6">
            <Link to="/" className="flex shrink-0 items-center space-x-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="flex items-center">
                <span className="text-lg lg:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  CareerConnect
                </span>
                <span className="ml-1.5 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-extrabold text-[10px] px-1.5 py-0.5 rounded-md uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                  AI
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:gap-1 lg:gap-1.5 flex-1 overflow-x-auto no-scrollbar py-1">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/jobs" className={navLinkClass('/jobs')}>Find Jobs</Link>
            <Link to="/ats-checker" className={`${navLinkClass('/ats-checker')} relative group`}>
              <ScanLine className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>ATS Checker</span>
              <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider shrink-0 shadow-xs">
                AI
              </span>
            </Link>
            <Link to="/about" className={navLinkClass('/about')}>About</Link>
            
            {/* Divider for authenticated links */}
            {user && <span className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1.5 hidden lg:inline-block shrink-0" />}

            {/* Authenticated Seeker links */}
            {user && user.role === 'seeker' && (
              <>
                <Link to="/seeker/dashboard" className={navLinkClass('/seeker/dashboard')}>
                  <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/seeker/saved-jobs" className={navLinkClass('/seeker/saved-jobs')}>
                  <Bookmark className="h-3.5 w-3.5 shrink-0" />
                  <span>Saved</span>
                </Link>
                <Link to="/seeker/interviews" className={navLinkClass('/seeker/interviews')}>
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>Interviews</span>
                </Link>
                <Link to="/seeker/recommendations" className={navLinkClass('/seeker/recommendations')}>
                  <Compass className="h-3.5 w-3.5 shrink-0" />
                  <span>AI Match</span>
                </Link>
              </>
            )}

            {/* Authenticated Recruiter links */}
            {user && user.role === 'recruiter' && (
              <>
                <Link to="/recruiter/dashboard" className={navLinkClass('/recruiter/dashboard')}>
                  <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/recruiter/company" className={navLinkClass('/recruiter/company')}>
                  <Building className="h-3.5 w-3.5 shrink-0" />
                  <span>Company</span>
                </Link>
                <Link to="/recruiter/interviews" className={navLinkClass('/recruiter/interviews')}>
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>Interviews</span>
                </Link>
                <Link to="/recruiter/jobs/create" className={navLinkClass('/recruiter/jobs/create')}>
                  <PlusCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Post Job</span>
                </Link>
              </>
            )}

            {/* Authenticated Admin links */}
            {user && user.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                  <Settings className="h-3.5 w-3.5 shrink-0" />
                  <span>Admin Panel</span>
                </Link>
              </>
            )}
          </div>

          {/* Desktop Right Panel (Bell center dropdown, Profile, Logout) */}
          <div className="hidden md:flex md:items-center md:gap-3 shrink-0 ml-2">
            {user ? (
              <div className="flex items-center space-x-3 border-l border-slate-200/80 pl-3 dark:border-slate-800 relative">
                
                {/* Notification Bell Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowBellDropdown(!showBellDropdown)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition relative cursor-pointer"
                    title="System Notifications"
                  >
                    <Bell className="h-4.5 w-4.5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showBellDropdown && (
                    <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900/95 rounded-2xl shadow-2xl z-55 overflow-hidden py-3">
                      <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">Alert Notifications</span>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllNotificationsRead} 
                            className="text-blue-600 hover:underline font-semibold cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 text-xs font-medium">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n._id} 
                              onClick={() => markNotificationRead(n._id)}
                              className={`p-3 text-xs transition cursor-pointer flex items-start gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${!n.read ? 'bg-blue-50/40 font-medium' : ''}`}
                            >
                              <div className="mt-0.5">
                                {!n.read ? <Circle className="h-2 w-2 text-blue-600 fill-blue-600" /> : <Check className="h-3 w-3 text-slate-300" />}
                              </div>
                              <div className="space-y-0.5 flex-grow">
                                <div className="font-bold text-slate-900 dark:text-white">{n.title}</div>
                                <div className="text-slate-500 dark:text-slate-400 leading-normal">{n.message}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Link */}
                <Link 
                  to={user.role === 'seeker' ? '/seeker/profile' : '#'} 
                  className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 dark:text-slate-300 transition-colors bg-slate-50 hover:bg-slate-100/80 px-2.5 py-1.5 rounded-xl border border-slate-200/60"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
                    {user.name ? user.name[0].toUpperCase() : <UserIcon className="h-3.5 w-3.5" />}
                  </div>
                  <span className="text-xs font-bold truncate max-w-[120px] text-slate-800">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-l border-slate-200/80 pl-3 dark:border-slate-800">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 dark:text-slate-300 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition duration-200"
                >
                  Register Free
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
            to="/ats-checker"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-md text-base font-bold text-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 dark:text-indigo-300"
          >
            <span className="flex items-center gap-2">
              <ScanLine className="h-5 w-5" />
              ATS Checker
            </span>
            <span className="bg-amber-400 text-gray-950 font-black text-[10px] px-1.5 py-0.5 rounded-full">
              AI
            </span>
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
                to="/seeker/saved-jobs"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Saved Jobs
              </Link>
              <Link
                to="/seeker/interviews"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Scheduled Interviews
              </Link>
              <Link
                to="/seeker/recommendations"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Recommended Jobs
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
                to="/recruiter/interviews"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Schedule Interviews
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
                  className="w-full flex justify-center items-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-red-650 hover:bg-red-50 text-sm font-semibold transition"
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
