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
      const [statsResult, jobsResult, appsResult] = await Promise.allSettled([
        API.get('/applications/recruiter/stats'),
        API.get('/jobs/recruiter/my'),
        API.get('/applications/recruiter')
      ]);

      let loadedJobs = [];
      let loadedApps = [];

      if (statsResult.status === 'fulfilled' && statsResult.value.data?.success) {
        setStats(statsResult.value.data.data);
      }

      if (jobsResult.status === 'fulfilled' && jobsResult.value.data?.success) {
        loadedJobs = jobsResult.value.data.data || [];
        setJobs(loadedJobs);
      }

      if (appsResult.status === 'fulfilled' && appsResult.value.data?.success) {
        loadedApps = appsResult.value.data.data || [];
        setApplications(loadedApps);
      }

      buildChartsData(loadedApps, loadedJobs);
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
      
      {/* Executive Header Banner */}
      <div className="mb-10 relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-8 md:p-10 shadow-2xl border border-slate-800/80">
        {/* Subtle radial decorative glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Recruiter Console
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Recruitment Workspace
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Post new vacancies, coordinate screening pipelines, and track candidate engagement metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link 
              to="/recruiter/company" 
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition shadow-sm"
            >
              Company Profile
            </Link>
            <Link 
              to="/recruiter/jobs/create" 
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <PlusCircle className="h-4 w-4" /> Post a Vacancy
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Board Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-blue-200 transition duration-200">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 mb-3 border border-blue-100 dark:border-blue-900/50">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stats.totalJobs}</div>
          <div className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">Jobs Posted</div>
        </div>

        <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-indigo-200 transition duration-200">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 mb-3 border border-indigo-100 dark:border-indigo-900/50">
            <Users className="h-5 w-5" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stats.totalApplications}</div>
          <div className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">Total Applications</div>
        </div>

        <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-amber-200 transition duration-200">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 mb-3 border border-amber-100 dark:border-amber-900/50">
            <Award className="h-5 w-5" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stats.shortlistedCount}</div>
          <div className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">Shortlisted</div>
        </div>

        <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-emerald-200 transition duration-200">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 mb-3 border border-emerald-100 dark:border-emerald-900/50">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stats.selectedCount}</div>
          <div className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">Hired Candidates</div>
        </div>
      </div>

      {/* Visual Analytics Graphs */}
      {!loading && applications.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart 1: Applications by Job */}
          <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 p-6 rounded-3xl shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-blue-600" /> Submissions by Vacancy
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="Applications" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Hiring Funnel */}
          <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 p-6 rounded-3xl shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-indigo-600" /> Screening Pipeline
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                  <YAxis dataKey="stage" type="category" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="Candidates" fill="#6366f1" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Application Trends */}
          <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 p-6 rounded-3xl shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-600" /> Application Activity
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="Applications" stroke="#2563eb" strokeWidth={2} fillOpacity={0.15} fill="#2563eb" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Posted Jobs Management Table */}
      <div className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 rounded-3xl p-6 shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Active Vacancies</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage and review candidates for your published jobs</p>
          </div>
          <Link 
            to="/recruiter/jobs/create" 
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            + Create New Job
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-16 bg-slate-100 rounded-2xl"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-14">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No active vacancies</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Publish your first job vacancy to start receiving applicants.</p>
            <Link 
              to="/recruiter/jobs/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
            >
              <PlusCircle className="h-4 w-4" /> Post a Job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold text-xs uppercase tracking-wider">
                  <th className="pb-3 pr-4">Job Title</th>
                  <th className="pb-3 pr-4">Company</th>
                  <th className="pb-3 pr-4">Location & Salary</th>
                  <th className="pb-3 pr-4">Deadline</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 pr-4 font-bold text-slate-900 dark:text-white">
                      <Link to={`/jobs/${job._id}`} className="hover:text-blue-600 transition flex items-center gap-2">
                        {job.title}
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                          {job.jobType}
                        </span>
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-slate-600 dark:text-slate-300 font-medium text-xs">
                      {job.company?.name || 'Company Registered'}
                    </td>
                    <td className="py-4 pr-4 text-slate-500 text-xs font-medium">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {job.location} &bull; ${job.salary.toLocaleString()}/yr</span>
                    </td>
                    <td className="py-4 pr-4 text-slate-400 text-xs font-medium">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Continuous'}
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        to={`/recruiter/jobs/${job._id}/applicants`}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        <Users className="h-3.5 w-3.5" />
                        Applicants
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
