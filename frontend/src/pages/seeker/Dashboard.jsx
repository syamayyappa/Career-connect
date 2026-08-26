import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { FileText, CheckCircle, Clock, AlertTriangle, XCircle, FileUp, Download, Eye, Briefcase, Award } from 'lucide-react';

const SeekerDashboard = () => {
  const { user, updateProfileState } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    review: 0,
    shortlisted: 0,
    rejected: 0,
    selected: 0
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState({ type: '', text: '' });

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await API.get('/applications/my');
        if (data.success) {
          setApplications(data.data);
          
          // Calculate counts
          const appList = data.data;
          setStats({
            total: appList.length,
            review: appList.filter(a => a.status === 'Under Review').length,
            shortlisted: appList.filter(a => a.status === 'Shortlisted').length,
            rejected: appList.filter(a => a.status === 'Rejected').length,
            selected: appList.filter(a => a.status === 'Selected').length
          });
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Handle resume file selection
  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    setUploadMsg({ type: '', text: '' });
  };

  // Upload resume
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setUploadMsg({ type: 'error', text: 'Please select a file to upload.' });
      return;
    }

    setUploading(true);
    setUploadMsg({ type: '', text: '' });

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      // Use standard multipart header configuration
      const { data } = await API.post('/users/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        setUploadMsg({ type: 'success', text: 'Resume uploaded and saved to profile successfully!' });
        // Update user state with the new resume path
        updateProfileState({ ...user, resume: data.data.resumeUrl });
        setResumeFile(null);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to upload resume. Make sure it is a PDF/DOC/DOCX under 5MB.';
      setUploadMsg({ type: 'error', text: msg });
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    const base = 'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ';
    switch (status) {
      case 'Selected':
        return base + 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300';
      case 'Shortlisted':
        return base + 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300';
      case 'Under Review':
        return base + 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
      case 'Rejected':
        return base + 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300';
      default:
        return base + 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Greetings Header */}
      <div className="mb-10 relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-8 shadow-2xl border border-slate-800">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Candidate Workspace
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome Back, {user?.name}
            </h1>
            <p className="text-slate-300 mt-1 text-sm max-w-xl">
              Track your application statuses, review AI matches, and keep your career credentials updated.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/seeker/profile" 
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition shadow-sm"
            >
              Edit Profile & Skills
            </Link>
            <Link 
              to="/jobs" 
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/30"
            >
              Explore Vacancies
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Dashboard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 p-5 rounded-2xl shadow-xs text-center hover:border-blue-200 transition">
          <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3 border border-blue-100">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.total}</div>
          <div className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">Applied</div>
        </div>

        <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 p-5 rounded-2xl shadow-xs text-center hover:border-amber-200 transition">
          <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-3 border border-amber-100">
            <Clock className="h-5 w-5" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.review}</div>
          <div className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">In Review</div>
        </div>

        <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 p-5 rounded-2xl shadow-xs text-center hover:border-indigo-200 transition">
          <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-3 border border-indigo-100">
            <Award className="h-5 w-5" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.shortlisted}</div>
          <div className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">Shortlisted</div>
        </div>

        <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 p-5 rounded-2xl shadow-xs text-center hover:border-emerald-200 transition">
          <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-3 border border-emerald-100">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.selected}</div>
          <div className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">Selected / Hired</div>
        </div>

        <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 p-5 rounded-2xl shadow-xs text-center col-span-2 md:col-span-1 hover:border-rose-200 transition">
          <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 mb-3 border border-rose-100">
            <XCircle className="h-5 w-5" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.rejected}</div>
          <div className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">Not Selected</div>
        </div>
      </div>

      {/* Main Grid: Application List vs Resume Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Application List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 rounded-3xl shadow-xs p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Recent Submissions</h2>
                <p className="text-xs text-slate-500">Live progress tracking of your job applications</p>
              </div>
              <Link to="/jobs" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                + Browse More
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2].map(n => (
                  <div key={n} className="h-14 bg-slate-100 rounded-xl"></div>
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No applications yet</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Browse jobs and apply to see your tracking pipeline here.</p>
                <Link to="/jobs" className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold text-xs uppercase tracking-wider">
                      <th className="pb-3 pr-4">Job Role</th>
                      <th className="pb-3 pr-4">Company</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 pr-4 font-bold text-slate-900 dark:text-white">
                          <Link to={`/jobs/${app.job?._id}`} className="hover:text-blue-600 transition">
                            {app.job?.title || 'Job Unavailable'}
                          </Link>
                        </td>
                        <td className="py-4 pr-4 text-slate-600 dark:text-slate-300 font-medium text-xs">
                          {app.job?.company?.name || 'Registered Company'}
                        </td>
                        <td className="py-4 pr-4 text-slate-400 text-xs font-medium">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-right">
                          <span className={getStatusBadge(app.status)}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Resume Management & Profile Setup */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 rounded-3xl shadow-xs p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Resume Document</h2>
            
            {/* Status indicators */}
            {user?.resume ? (
              <div className="mb-6 p-4 bg-emerald-50/70 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-emerald-900">Active Resume Saved</span>
                    <p className="text-[10px] text-emerald-700 mt-0.5">Used for 1-click ATS applications</p>
                  </div>
                </div>
                <a
                  href={`http://localhost:5000${user.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white hover:bg-emerald-50 rounded-xl shadow-xs border border-emerald-200 text-emerald-700 transition"
                  title="Download File"
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-start gap-2.5">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900">No Resume Uploaded</span>
                  <p className="text-[11px] text-amber-700 mt-0.5">Upload a PDF or DOCX file to enable 1-click applying and AI matching.</p>
                </div>
              </div>
            )}

            {/* Upload form */}
            <form onSubmit={handleResumeUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-250 dark:border-slate-800 rounded-2xl p-5 text-center hover:border-blue-500 bg-slate-50/60 dark:bg-slate-900/60 transition cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FileUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  {resumeFile ? resumeFile.name : 'Select PDF, DOC, DOCX'}
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  Max file size allowed: 5MB
                </span>
              </div>

              {uploadMsg.text && (
                <div className={`p-3 rounded-xl text-xs font-semibold border ${
                  uploadMsg.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {uploadMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !resumeFile}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
              >
                {uploading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : 'Upload Resume File'}
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SeekerDashboard;
