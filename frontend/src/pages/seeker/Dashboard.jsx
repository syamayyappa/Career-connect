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
    const base = 'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ';
    switch (status) {
      case 'Selected':
        return base + 'bg-green-50 text-green-700 border border-green-100';
      case 'Shortlisted':
        return base + 'bg-indigo-50 text-indigo-700 border border-indigo-100';
      case 'Under Review':
        return base + 'bg-amber-50 text-amber-700 border border-amber-100';
      case 'Rejected':
        return base + 'bg-red-50 text-red-700 border border-red-100';
      default:
        return base + 'bg-gray-50 text-gray-700 border border-gray-150';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Greetings Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hello, {user?.name} 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">
            Track your applied jobs, view matches, and manage your documents
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/seeker/profile" className="px-4 py-2 border border-gray-250 dark:border-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Update Profile
          </Link>
          <Link to="/jobs" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition">
            Browse Jobs
          </Link>
        </div>
      </div>

      {/* Stats Dashboard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm text-center">
          <div className="mx-auto h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 dark:bg-gray-850 mb-3 border border-gray-100 dark:border-gray-800">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-xs text-gray-400 font-medium mt-1">Total Applied</div>
        </div>

        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm text-center">
          <div className="mx-auto h-9 w-9 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/20 mb-3 border border-amber-100 dark:border-amber-900/30">
            <Clock className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.review}</div>
          <div className="text-xs text-gray-400 font-medium mt-1">Under Review</div>
        </div>

        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm text-center">
          <div className="mx-auto h-9 w-9 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 mb-3 border border-indigo-100 dark:border-indigo-900/30">
            <Award className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.shortlisted}</div>
          <div className="text-xs text-gray-400 font-medium mt-1">Shortlisted</div>
        </div>

        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm text-center">
          <div className="mx-auto h-9 w-9 flex items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-950/20 mb-3 border border-green-100 dark:border-green-900/30">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.selected}</div>
          <div className="text-xs text-gray-400 font-medium mt-1">Hired / Selected</div>
        </div>

        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm text-center col-span-2 md:col-span-1">
          <div className="mx-auto h-9 w-9 flex items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/20 mb-3 border border-red-100 dark:border-red-900/30">
            <XCircle className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</div>
          <div className="text-xs text-gray-400 font-medium mt-1">Not Selected</div>
        </div>
      </div>

      {/* Main Grid: Application List vs Resume Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Application List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Applications</h2>

            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2].map(n => (
                  <div key={n} className="h-14 bg-gray-50 dark:bg-gray-800 rounded-xl"></div>
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">No applications submitted</h3>
                <p className="text-sm text-gray-400 mt-1">Browse jobs and apply to see your tracking pipeline here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-semibold">
                      <th className="pb-3 pr-4">Job Role</th>
                      <th className="pb-3 pr-4">Company</th>
                      <th className="pb-3 pr-4">Date</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app._id} className="border-b border-gray-50 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="py-4 pr-4 font-bold text-gray-900 dark:text-white">
                          <Link to={`/jobs/${app.job?._id}`} className="hover:text-indigo-650">
                            {app.job?.title || 'Job Unavailable'}
                          </Link>
                        </td>
                        <td className="py-4 pr-4 text-gray-500 dark:text-gray-400">
                          {app.job?.company?.name || 'Registered Company'}
                        </td>
                        <td className="py-4 pr-4 text-gray-400 text-xs">
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
          <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Resume Document</h2>
            
            {/* Status indicators */}
            {user?.resume ? (
              <div className="mb-6 p-4 bg-green-50/50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/30 rounded-xl text-green-700 dark:text-green-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <span className="font-bold">Active Resume Saved</span>
                    <p className="text-[10px] text-green-500 mt-0.5">Use this file to auto-fill applications</p>
                  </div>
                </div>
                <a
                  href={`http://localhost:5000${user.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-white hover:bg-green-50 rounded-lg shadow-sm border border-green-200 text-green-700 transition"
                  title="Download File"
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-amber-700 text-xs flex items-start gap-2.5">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div>
                  <span className="font-bold">No Resume Found</span>
                  <p className="text-[10px] text-amber-600 mt-0.5">You must upload a resume before applying to jobs.</p>
                </div>
              </div>
            )}

            {/* Upload form */}
            <form onSubmit={handleResumeUpload} className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center hover:border-indigo-400 transition cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <FileUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {resumeFile ? resumeFile.name : 'Select PDF, DOC, DOCX'}
                </span>
                <span className="block text-[10px] text-gray-400 mt-0.5">
                  Max file size allowed: 5MB
                </span>
              </div>

              {uploadMsg.text && (
                <div className={`p-3 rounded-lg text-xs font-semibold border ${
                  uploadMsg.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-700' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {uploadMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !resumeFile}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                {uploading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : 'Upload Resume'}
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SeekerDashboard;
