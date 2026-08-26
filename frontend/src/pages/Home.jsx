import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Search, MapPin, Briefcase, Award, Users, ShieldCheck, ArrowRight, Zap } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  // Search parameters to pass to jobs view
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${searchQuery}&location=${locationQuery}`);
  };

  // Fetch recent jobs
  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const { data } = await API.get('/jobs');
        if (data.success) {
          // Display top 3 latest jobs
          setJobs(data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching jobs for Home view:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentJobs();
  }, []);

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950/20 min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-white py-24 px-4 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        {/* Subtle decorative background gradients */}
        <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            <Zap className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
            AI-Powered Talent Matching & ATS Portal
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Connect With Opportunities <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              Engineered For Your Skills
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Accelerate your job search with deterministic AI skill match scoring, integrated ATS resume parsing, and transparent application tracking.
          </p>

          {/* Search Form */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="mx-auto mt-10 max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-none flex flex-col md:flex-row gap-2"
          >
            <div className="flex-1 flex items-center px-3.5 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 py-2.5">
              <Search className="h-5 w-5 text-slate-400 mr-2.5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, skills (e.g. React, Node.js, Python)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 focus:ring-0 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-sm focus:outline-none font-medium"
              />
            </div>
            <div className="flex-1 flex items-center px-3.5 py-2.5">
              <MapPin className="h-5 w-5 text-slate-400 mr-2.5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Location (e.g. San Francisco, Remote)..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full bg-transparent border-0 focus:ring-0 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-sm focus:outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-8 py-3.5 transition shadow-md shadow-blue-500/20 text-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Search className="h-4 w-4" /> Search Vacancies
            </button>
          </form>
        </div>
      </section>

      {/* 2. Platform Statistics */}
      <section className="bg-slate-950 border-b border-slate-800 text-white py-14 px-4">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-black tracking-tight text-white">12,000+</div>
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1.5">Active Job Listings</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black tracking-tight text-blue-400">4,500+</div>
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1.5">Hired Candidates</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black tracking-tight text-indigo-400">850+</div>
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1.5">Verified Companies</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black tracking-tight text-emerald-400">95.4%</div>
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1.5">AI Precision Score</div>
          </div>
        </div>
      </section>

      {/* 3. Latest Jobs Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Featured Opportunities</h2>
            <p className="text-slate-500 text-sm mt-1">Recently published vacancies matching market demand</p>
          </div>
          <Link to="/jobs" className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1.5 transition">
            Browse all openings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-slate-200/80 p-6 rounded-2xl animate-pulse h-52"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center bg-white border border-slate-200/80 p-12 rounded-2xl">
            <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No jobs listed yet</h3>
            <p className="text-slate-400 text-xs mt-1">Check back later or register as a Recruiter to post a job!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900 p-6 rounded-2xl shadow-xs hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition duration-200 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-300">
                      {job.jobType}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 hover:text-blue-600 transition">
                    <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1 mb-3">
                    {job.company?.name || 'Company Registered'}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      ${job.salary.toLocaleString()}/yr
                    </div>
                  </div>
                  <Link 
                    to={`/jobs/${job._id}`}
                    className="w-full flex items-center justify-center gap-1 px-4 py-2.5 bg-slate-50 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition duration-200 border border-slate-200/60 hover:border-transparent"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. How It Works Section */}
      <section className="bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">How It Works</h2>
            <p className="text-slate-500 text-sm mt-1.5">Streamlined hiring and application process powered by explainable AI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-slate-50/80 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-6 border border-blue-100 shadow-xs">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">1. Create Profile</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Set up your candidate or company workspace. Upload resumes and showcase core technologies.
              </p>
            </div>
            <div className="text-center bg-slate-50/80 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-6 border border-indigo-100 shadow-xs">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">2. Get AI Match Scores</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Our algorithm processes job requirements and returns clear, ranked match percentages instantly.
              </p>
            </div>
            <div className="text-center bg-slate-50/80 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-6 border border-emerald-100 shadow-xs">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">3. Apply & Track Pipeline</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Submit applications with custom cover letters and monitor review, shortlist, and interview stages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call To Action (CTA) */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 py-20 px-4 text-white text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-white">
            Ready to Accelerate Your Hiring or Career?
          </h2>
          <p className="text-slate-300 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
            Join thousands of professionals and high-growth technology companies hiring with AI-assisted clarity.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register?role=seeker" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-600/30 text-xs">
              Apply as Job Seeker
            </Link>
            <Link to="/register?role=recruiter" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition border border-slate-700 text-xs">
              Hire as Recruiter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
