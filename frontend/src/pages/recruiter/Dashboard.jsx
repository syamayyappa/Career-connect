import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Briefcase, Users, CheckCircle, FileText, PlusCircle, Settings, Award, MapPin } from 'lucide-react';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    shortlistedCount: 0,
    selectedCount: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchRecruiterData = async () => {
    setLoading(true);
    try {
      // 1. Fetch stats
      const statsRes = await API.get('/applications/recruiter/stats');
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      // 2. Fetch posted jobs
      const jobsRes = await API.get('/jobs/recruiter/my');
      if (jobsRes.data.success) {
        setJobs(jobsRes.data.data);
      }
    } catch (err) {
      console.error('Error loading recruiter dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recruiter Console 💼</h1>
          <p className="text-sm text-gray-550 dark:text-gray-400 mt-0.5">
            Post new vacancies, coordinate screening status, and review applicant matching metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Link 
            to="/recruiter/company" 
            className="px-4 py-2 border border-gray-250 dark:border-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-1.5"
          >
            Company Profile
          </Link>
          <Link 
            to="/recruiter/jobs/create" 
            className="px-4 py-2 bg-indigo-650 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition flex items-center gap-1.5"
          >
            <PlusCircle className="h-4 w-4" /> Post a Job
          </Link>
        </div>
      </div>

      {/* Stats Board Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm">
          <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 dark:bg-gray-850 mb-3 border border-gray-100">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalJobs}</div>
          <div className="text-xs text-gray-450 font-medium mt-1">Jobs Posted</div>
        </div>

        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm">
          <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-indigo-55 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 mb-3 border border-indigo-100">
            <Users className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalApplications}</div>
          <div className="text-xs text-gray-450 font-medium mt-1">Applications Received</div>
        </div>

        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm">
          <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 mb-3 border border-indigo-100">
            <Award className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.shortlistedCount}</div>
          <div className="text-xs text-gray-450 font-medium mt-1">Shortlisted Candidates</div>
        </div>

        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm">
          <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-950/20 mb-3 border border-green-100">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.selectedCount}</div>
          <div className="text-xs text-gray-450 font-medium mt-1">Selected / Hired</div>
        </div>
      </div>

      {/* Posted Jobs Management Table */}
      <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Active Vacancies</h2>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map(n => (
              <div key={n} className="h-12 bg-gray-50 rounded-xl"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">No jobs posted yet</h3>
            <p className="text-sm text-gray-450 mt-1 mb-4">Click the button above to register your first vacancy opening.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-semibold">
                  <th className="pb-3 pr-4">Job Title</th>
                  <th className="pb-3 pr-4">Company Name</th>
                  <th className="pb-3 pr-4">Details</th>
                  <th className="pb-3 pr-4">Deadline</th>
                  <th className="pb-3 text-right">Applicants</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} className="border-b border-gray-50 dark:border-gray-850 hover:bg-gray-50/50 dark:hover:bg-gray-850/50 transition-colors">
                    <td className="py-4 pr-4 font-bold text-gray-900 dark:text-white">
                      <Link to={`/jobs/${job._id}`} className="hover:text-indigo-650">
                        {job.title}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-gray-550 dark:text-gray-450 font-semibold">
                      {job.company?.name || 'Company Registered'}
                    </td>
                    <td className="py-4 pr-4 text-gray-450 text-xs">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location} &bull; ${job.salary.toLocaleString()}/yr</span>
                    </td>
                    <td className="py-4 pr-4 text-gray-400 text-xs">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No Limit'}
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        to={`/recruiter/jobs/${job._id}/applicants`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-750 rounded-xl text-xs font-bold transition"
                      >
                        <Users className="h-3.5 w-3.5" />
                        Manage Applicants
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default RecruiterDashboard;
