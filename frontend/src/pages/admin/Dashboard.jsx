import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Settings, Users, Briefcase, FileText, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, User } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    seekersCount: 0,
    recruitersCount: 0,
    jobsCount: 0,
    companiesCount: 0,
    applicationsCount: 0
  });

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'users' | 'jobs' | 'applications'

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch stats
      const statsRes = await API.get('/admin/stats');
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      // 2. Fetch users
      const usersRes = await API.get('/admin/users');
      if (usersRes.data.success) {
        setUsers(usersRes.data.data);
      }

      // 3. Fetch all jobs
      const jobsRes = await API.get('/jobs');
      if (jobsRes.data.success) {
        setJobs(jobsRes.data.data);
      }

      // 4. Fetch applications
      const appsRes = await API.get('/admin/applications');
      if (appsRes.data.success) {
        setApplications(appsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setErrorMsg('Failed to load admin management logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Handle user delete
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user account permanently?')) return;
    try {
      const { data } = await API.delete(`/admin/users/${id}`);
      if (data.success) {
        setSuccessMsg('User account deleted successfully.');
        setUsers(list => list.filter(u => u._id !== id));
        // Refresh stats
        fetchAdminData();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  // Handle job delete
  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job vacancy listing?')) return;
    try {
      const { data } = await API.delete(`/jobs/${id}`);
      if (data.success) {
        setSuccessMsg('Job vacancy listing deleted successfully.');
        setJobs(list => list.filter(j => j._id !== id));
        fetchAdminData();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete job.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-10 bg-indigo-950 text-white p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-indigo-400" /> Admin Console
          </h1>
          <p className="text-sm text-indigo-200 mt-1">
            Supervise entire platform activity, manage system users, and moderate job posts
          </p>
        </div>
        <button
          onClick={fetchAdminData}
          className="px-4 py-2 bg-indigo-800 hover:bg-indigo-750 text-white rounded-xl text-xs font-semibold border border-indigo-700 transition"
        >
          Sync Data
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          <AlertTriangle className="h-5 w-5 text-red-650 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto gap-4">
        {[
          { key: 'stats', label: 'Platform Stats' },
          { key: 'users', label: 'Manage Users' },
          { key: 'jobs', label: 'Manage Jobs' },
          { key: 'applications', label: 'Applications Audit' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setSuccessMsg('');
              setErrorMsg('');
            }}
            className={`pb-3 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-indigo-650 text-indigo-600 border-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 bg-white border border-gray-100 rounded-3xl"></div>
          <div className="h-44 bg-white border border-gray-100 rounded-3xl"></div>
        </div>
      ) : (
        <>
          {/* Tab 1: Platform Stats */}
          {activeTab === 'stats' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.seekersCount}</div>
                  <div className="text-xs text-gray-400 font-medium mt-1">Job Seekers</div>
                </div>
                <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.recruitersCount}</div>
                  <div className="text-xs text-gray-400 font-medium mt-1">Recruiters</div>
                </div>
                <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.jobsCount}</div>
                  <div className="text-xs text-gray-400 font-medium mt-1">Total Jobs</div>
                </div>
                <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.companiesCount}</div>
                  <div className="text-xs text-gray-400 font-medium mt-1">Companies</div>
                </div>
                <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm text-center col-span-2 md:col-span-1">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.applicationsCount}</div>
                  <div className="text-xs text-gray-400 font-medium mt-1">Applications</div>
                </div>
              </div>

              {/* Informative info banner for administrators */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 text-indigo-850">
                <h3 className="font-bold text-base mb-2">Administrative Role Overview</h3>
                <p className="text-xs leading-relaxed max-w-3xl">
                  You are viewing simulated platform totals. As an Admin, you are equipped to delete inappropriate job posts or manage candidate user registrations to maintain security and quality across CareerConnect AI.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Manage Users */}
          {activeTab === 'users' && (
            <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">User Accounts</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-semibold">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Location</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-gray-50 dark:border-gray-850 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-150 text-gray-600 font-bold text-xs uppercase">
                            {u.name[0]}
                          </div>
                          {u.name}
                        </td>
                        <td className="py-4 text-gray-500">{u.email}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin' 
                              ? 'bg-red-50 text-red-700' 
                              : u.role === 'recruiter' 
                                ? 'bg-indigo-50 text-indigo-700' 
                                : 'bg-gray-50 text-gray-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 text-gray-450">{u.location || 'N/A'}</td>
                        <td className="py-4 text-right">
                          <button
                            disabled={u.role === 'admin'}
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 border border-red-200 text-red-650 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                            title="Delete user account"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Manage Jobs */}
          {activeTab === 'jobs' && (
            <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Active Jobs listings</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-semibold">
                      <th className="pb-3">Title</th>
                      <th className="pb-3">Company</th>
                      <th className="pb-3">Location</th>
                      <th className="pb-3">Salary</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((j) => (
                      <tr key={j._id} className="border-b border-gray-55 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-bold text-gray-900 dark:text-white">
                          <Link to={`/jobs/${j._id}`} className="hover:underline">{j.title}</Link>
                        </td>
                        <td className="py-4 text-gray-500 font-semibold">{j.company?.name || 'Registered Company'}</td>
                        <td className="py-4 text-gray-450">{j.location}</td>
                        <td className="py-4 font-semibold">${j.salary.toLocaleString()}/yr</td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDeleteJob(j._id)}
                            className="p-1.5 border border-red-200 text-red-650 rounded-lg hover:bg-red-50 transition"
                            title="Delete job vacancy"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Applications Audit */}
          {activeTab === 'applications' && (
            <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Applications Ledger</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-semibold">
                      <th className="pb-3">Candidate</th>
                      <th className="pb-3">Job Posting</th>
                      <th className="pb-3">Company</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Applied Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id} className="border-b border-gray-55 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-bold text-gray-900 dark:text-white">{app.applicant?.name || 'Deleted Seeker'}</td>
                        <td className="py-4 text-gray-500 font-semibold">{app.job?.title || 'Job Deleted'}</td>
                        <td className="py-4 text-gray-450">{app.job?.company?.name || 'Company Details'}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === 'Selected' 
                              ? 'bg-green-50 text-green-700 border border-green-150' 
                              : app.status === 'Shortlisted' 
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-150'
                                : app.status === 'Rejected'
                                  ? 'bg-red-50 text-red-700 border border-red-150'
                                  : 'bg-gray-55 text-gray-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 text-right text-gray-450 text-xs">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default AdminDashboard;
