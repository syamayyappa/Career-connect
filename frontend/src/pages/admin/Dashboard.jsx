import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Settings, Users, Briefcase, FileText, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, User, BarChart3, PieChart, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    seekersCount: 0,
    recruitersCount: 0,
    jobsCount: 0,
    companiesCount: 0,
    applicationsCount: 0,
    reportsCount: 0
  });

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'users' | 'jobs' | 'applications' | 'reports'

  // Chart datasets
  const [userDistributionData, setUserDistributionData] = useState([]);
  const [platformTotalsData, setPlatformTotalsData] = useState([]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch stats
      const statsRes = await API.get('/admin/stats');
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
        
        // Build user distribution chart
        setUserDistributionData([
          { role: 'Job Seekers', count: statsRes.data.data.seekersCount },
          { role: 'Recruiters', count: statsRes.data.data.recruitersCount }
        ]);

        // Build platform totals chart
        setPlatformTotalsData([
          { name: 'Companies', total: statsRes.data.data.companiesCount },
          { name: 'Jobs', total: statsRes.data.data.jobsCount },
          { name: 'Applications', total: statsRes.data.data.applicationsCount }
        ]);
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

      // 5. Fetch moderation reports
      const reportsRes = await API.get('/admin/reports');
      if (reportsRes.data.success) {
        setReports(reportsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      toast.error('Failed to load administrative management logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user account permanently?')) return;
    try {
      const { data } = await API.delete(`/admin/users/${id}`);
      if (data.success) {
        toast.success('User account deleted successfully.');
        setUsers(list => list.filter(u => u._id !== id));
        fetchAdminData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job vacancy listing?')) return;
    try {
      const { data } = await API.delete(`/jobs/${id}`);
      if (data.success) {
        toast.success('Job vacancy listing deleted successfully.');
        setJobs(list => list.filter(j => j._id !== id));
        fetchAdminData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete job.');
    }
  };

  const handleReportAction = async (id, actionStatus) => {
    try {
      const { data } = await API.put(`/admin/reports/${id}`, { status: actionStatus });
      if (data.success) {
        toast.success(`Report status updated to ${actionStatus}`);
        setReports(list => list.map(item => item._id === id ? { ...item, status: actionStatus } : item));
        fetchAdminData();
      }
    } catch (err) {
      toast.error('Failed to update report status');
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

      {/* Navigation tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto gap-4">
        {[
          { key: 'stats', label: 'Platform Stats' },
          { key: 'users', label: 'Manage Users' },
          { key: 'jobs', label: 'Manage Jobs' },
          { key: 'applications', label: 'Applications Audit' },
          { key: 'reports', label: `Moderation Reports (${stats.reportsCount || 0})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
            }}
            className={`pb-3 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600'
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
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
                <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.applicationsCount}</div>
                  <div className="text-xs text-gray-400 font-medium mt-1">Applications</div>
                </div>
                <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm text-center col-span-2 md:col-span-1">
                  <div className="text-2xl font-bold text-red-650">{stats.reportsCount}</div>
                  <div className="text-xs text-gray-400 font-medium mt-1">Pending Reports</div>
                </div>
              </div>

              {/* Analytics Graphs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-6 rounded-3xl shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-1">
                    <PieChart className="h-4.5 w-4.5 text-indigo-650" /> User Distribution
                  </h3>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="role" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-6 rounded-3xl shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-1">
                    <BarChart3 className="h-4.5 w-4.5 text-indigo-650" /> Platform Totals
                  </h3>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={platformTotalsData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
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
                      <tr key={u._id} className="border-b border-gray-50 dark:border-gray-850 hover:bg-gray-55/30 transition-colors">
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
                      <tr key={j._id} className="border-b border-gray-55 hover:bg-gray-55/30 transition-colors">
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
                      <tr key={app._id} className="border-b border-gray-55 hover:bg-gray-55/30 transition-colors">
                        <td className="py-4 font-bold text-gray-900 dark:text-white">{app.applicant?.name || 'Deleted Seeker'}</td>
                        <td className="py-4 text-gray-500 font-semibold">{app.job?.title || 'Job Deleted'}</td>
                        <td className="py-4 text-gray-455">{app.job?.company?.name || 'Company Details'}</td>
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

          {/* Tab 5: Moderation Reports */}
          {activeTab === 'reports' && (
            <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Moderation Ledger</h2>
              {reports.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-xs font-semibold">
                  <ShieldAlert className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  No reports submitted yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-semibold">
                        <th className="pb-3">Reporter</th>
                        <th className="pb-3">Target</th>
                        <th className="pb-3">Reason</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((rep) => (
                        <tr key={rep._id} className="border-b border-gray-55 hover:bg-gray-55/30 transition-colors">
                          <td className="py-4 font-semibold text-gray-900 dark:text-white">
                            {rep.reporter?.name || 'Deleted Account'}
                            <div className="text-[10px] text-gray-450 font-normal">{rep.reporter?.email}</div>
                          </td>
                          <td className="py-4">
                            <span className="font-bold text-indigo-700">{rep.targetType}</span>
                            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                              {rep.targetDetails ? (rep.targetDetails.title || rep.targetDetails.name) : 'Record Deleted'}
                            </div>
                          </td>
                          <td className="py-4 text-gray-550 max-w-xs truncate" title={rep.reason}>
                            {rep.reason}
                          </td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              rep.status === 'Resolved' 
                                ? 'bg-green-50 text-green-700 border border-green-150' 
                                : rep.status === 'Dismissed'
                                  ? 'bg-gray-55 text-gray-600'
                                  : 'bg-red-50 text-red-750 border border-red-100'
                            }`}>
                              {rep.status}
                            </span>
                          </td>
                          <td className="py-4 text-right space-x-2">
                            {rep.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => handleReportAction(rep._id, 'Resolved')}
                                  className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-[10px] font-bold transition"
                                >
                                  Resolve
                                </button>
                                <button
                                  onClick={() => handleReportAction(rep._id, 'Dismissed')}
                                  className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-[10px] font-bold transition"
                                >
                                  Dismiss
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default AdminDashboard;
