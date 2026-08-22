import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { Briefcase, Menu, X, User as UserIcon, LogOut, LayoutDashboard, FileText, Compass, Settings, PlusCircle, Building, Bell, Bookmark, Calendar, Check, Circle } from 'lucide-react';
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
          <div className="hidden md:flex md:items-center md:space-x-2">
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/jobs" className={navLinkClass('/jobs')}>Find Jobs</Link>
            <Link to="/about" className={navLinkClass('/about')}>About</Link>
            
            {/* Authenticated Seeker links */}
            {user && user.role === 'seeker' && (
              <>
                <Link to="/seeker/dashboard" className={navLinkClass('/seeker/dashboard')}>
                  <span className="flex items-center gap-1"><LayoutDashboard className="h-3.5 w-3.5" />Dashboard</span>
                </Link>
                <Link to="/seeker/saved-jobs" className={navLinkClass('/seeker/saved-jobs')}>
                  <span className="flex items-center gap-1"><Bookmark className="h-3.5 w-3.5" />Saved</span>
                </Link>
                <Link to="/seeker/interviews" className={navLinkClass('/seeker/interviews')}>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Interviews</span>
                </Link>
                <Link to="/seeker/recommendations" className={navLinkClass('/seeker/recommendations')}>
                  <span className="flex items-center gap-1"><Compass className="h-3.5 w-3.5" />AI Match</span>
                </Link>
              </>
            )}

            {/* Authenticated Recruiter links */}
            {user && user.role === 'recruiter' && (
              <>
                <Link to="/recruiter/dashboard" className={navLinkClass('/recruiter/dashboard')}>
                  <span className="flex items-center gap-1"><LayoutDashboard className="h-3.5 w-3.5" />Dashboard</span>
                </Link>
                <Link to="/recruiter/company" className={navLinkClass('/recruiter/company')}>
                  <span className="flex items-center gap-1"><Building className="h-3.5 w-3.5" />Company</span>
                </Link>
                <Link to="/recruiter/interviews" className={navLinkClass('/recruiter/interviews')}>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Interviews</span>
                </Link>
                <Link to="/recruiter/jobs/create" className={navLinkClass('/recruiter/jobs/create')}>
                  <span className="flex items-center gap-1"><PlusCircle className="h-3.5 w-3.5" />Post Job</span>
                </Link>
              </>
            )}

            {/* Authenticated Admin links */}
            {user && user.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                  <span className="flex items-center gap-1"><Settings className="h-3.5 w-3.5" />Admin Panel</span>
                </Link>
              </>
            )}
          </div>

          {/* Desktop Right Panel (Bell center dropdown, Profile, Logout) */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {user ? (
              <div className="flex items-center space-x-4 border-l border-gray-100 pl-4 dark:border-gray-800 relative">
                
                {/* Notification Bell Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowBellDropdown(!showBellDropdown)}
                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 rounded-xl transition relative"
                    title="System Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-extrabold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showBellDropdown && (
                    <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl shadow-xl z-55 overflow-hidden py-3">
                      <div className="px-4 pb-2 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-900 dark:text-white">Alert Notifications</span>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllNotificationsRead} 
                            className="text-indigo-650 hover:underline font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-60 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-850">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-400 text-xs">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n._id} 
                              onClick={() => markNotificationRead(n._id)}
                              className={`p-3 text-xs transition cursor-pointer flex items-start gap-2.5 hover:bg-gray-55/30 ${!n.read ? 'bg-indigo-50/10 font-medium' : ''}`}
                            >
                              <div className="mt-0.5">
                                {!n.read ? <Circle className="h-2 w-2 text-indigo-600 fill-indigo-600" /> : <Check className="h-3 w-3 text-gray-300" />}
                              </div>
                              <div className="space-y-0.5 flex-grow">
                                <div className="font-bold text-gray-850 dark:text-gray-250">{n.title}</div>
                                <div className="text-gray-500 leading-normal">{n.message}</div>
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
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 dark:text-gray-300 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold truncate max-w-[120px]">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-medium text-red-650 hover:text-red-700 transition"
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
