import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { Briefcase, Users, CheckCircle, FileText, PlusCircle, Settings, Award, MapPin, BarChart3, TrendingUp, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import toast from 'react-hot-toast';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    shortlistedCount: 0,
    selectedCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Chart datasets
  const [jobChartData, setJobChartData] = useState([]);
  const [funnelChartData, setFunnelChartData] = useState([]);
  const [volumeChartData, setVolumeChartData] = useState([]);

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

      // 3. Fetch all recruiter applications to build charts dynamically
      const appsRes = await API.get('/applications/recruiter');
      if (appsRes.data.success) {
        const rawApps = appsRes.data.data;
        setApplications(rawApps);
        buildChartsData(rawApps, jobsRes.data.data || []);
      }
    } catch (err) {
      console.error('Error loading recruiter dashboard data:', err);
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  const buildChartsData = (appsList, jobsList) => {
    // A. Build Applications by Job Chart Data
    const jobCounts = {};
    // Pre-populate with jobs list to show zero-applicant jobs too
    jobsList.forEach(job => {
      jobCounts[job.title] = 0;
    });
    appsList.forEach(app => {
      const title = app.job?.title || 'Unknown Job';
      jobCounts[title] = (jobCounts[title] || 0) + 1;
    });
    const jobData = Object.keys(jobCounts).map(title => ({
      name: title.length > 15 ? title.substring(0, 15) + '...' : title,
      Applications: jobCounts[title]
    }));
    setJobChartData(jobData);

    // B. Build Hiring Funnel Chart Data
    const funnelStages = {
      'Applied': 0,
      'Under Review': 0,
      'Shortlisted': 0,
      'Selected': 0
    };
    appsList.forEach(app => {
      if (funnelStages[app.status] !== undefined) {
        funnelStages[app.status]++;
      }
    });
    const funnelData = Object.keys(funnelStages).map(stage => ({
      stage,
      Candidates: funnelStages[stage]
    }));
    setFunnelChartData(funnelData);

    // C. Build Volume over time (last 7 days / records)
    const dateCounts = {};
    appsList.forEach(app => {
      const dateStr = new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
    });
    // Sort dates chronological
    const sortedDates = Object.keys(dateCounts).sort((a, b) => new Date(a) - new Date(b));
    const volumeData = sortedDates.map(date => ({
      date,
      Applications: dateCounts[date]
    }));
    setVolumeChartData(volumeData);
  };

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-indigo-950 text-white p-8 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-white">Recruiter Workspace 💼</h1>
          <p className="text-sm text-indigo-200 mt-1">
            Post new vacancies, coordinate screening status, and review applicant matching metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Link 
            to="/recruiter/company" 
            className="px-4 py-2 border border-indigo-700 bg-indigo-900/60 hover:bg-indigo-800 rounded-xl text-xs font-semibold text-white transition"
          >
            Company Settings
          </Link>
          <Link 
            to="/recruiter/jobs/create" 
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow shadow-indigo-700/50"
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
          <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 mb-3 border border-indigo-100">
            <Users className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalApplications}</div>
          <div className="text-xs text-gray-450 font-medium mt-1">Applications</div>
        </div>

        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm">
          <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-650 dark:bg-indigo-950/20 mb-3 border border-indigo-100">
            <Award className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.shortlistedCount}</div>
          <div className="text-xs text-gray-450 font-medium mt-1">Shortlisted</div>
        </div>

        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-5 rounded-2xl shadow-sm">
          <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-950/20 mb-3 border border-green-100">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.selectedCount}</div>
          <div className="text-xs text-gray-450 font-medium mt-1">Hired / Placed</div>
        </div>
      </div>

      {/* Visual Analytics Graphs */}
      {!loading && applications.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart 1: Applications by Job */}
          <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-6 rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-1">
              <BarChart3 className="h-4.5 w-4.5 text-indigo-600" /> Submissions by Job
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="Applications" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Hiring Funnel */}
          <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-6 rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-1">
              <Filter className="h-4.5 w-4.5 text-indigo-600" /> Screening Pipeline
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
                  <YAxis dataKey="stage" type="category" tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="Candidates" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Application Trends */}
          <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 p-6 rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-1">
              <TrendingUp className="h-4.5 w-4.5 text-indigo-600" /> Application Trends
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="Applications" stroke="#4f46e5" fillOpacity={0.1} fill="#4f46e5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Posted Jobs Management Table */}
      <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 font-sans">Active Vacancies</h2>

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
                      <Link to={`/jobs/${job._id}`} className="hover:text-indigo-600 transition">
                        {job.title}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-gray-550 dark:text-gray-455 font-semibold">
                      {job.company?.name || 'Company Registered'}
                    </td>
                    <td className="py-4 pr-4 text-gray-450 text-xs font-semibold">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location} &bull; ${job.salary.toLocaleString()}/yr</span>
                    </td>
                    <td className="py-4 pr-4 text-gray-400 text-xs font-semibold">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No Limit'}
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        to={`/recruiter/jobs/${job._id}/applicants`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition"
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
