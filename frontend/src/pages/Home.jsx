import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import ResumeCareerMatcher from '../components/seeker/ResumeCareerMatcher';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Building2,
  Cpu
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const trendingTags = ['React', 'Node.js', 'Python', 'AWS', 'FastAPI', 'Remote'];

  // Search parameters to pass to jobs view
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`);
  };

  const handleQuickTagClick = (tag) => {
    navigate(`/jobs?search=${encodeURIComponent(tag)}`);
  };

  // Fetch recent jobs
  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const { data } = await API.get('/jobs');
        if (data.success) {
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
    <div className="bg-slate-50/60 dark:bg-slate-950 min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-mesh-pattern pt-20 pb-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800">
        
        {/* Ambient Decorative Glow Elements */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 -z-10 h-[450px] w-[750px] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-cyan-400/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 -z-10 h-72 w-72 rounded-full bg-violet-400/10 blur-2xl pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center">
          
          {/* Executive AI Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-indigo-200/90 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide mb-8 shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Next-Gen Deterministic AI Talent Matching & ATS</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Connect With Careers <br className="hidden sm:inline" />
            <span className="text-gradient-brand">
              Engineered For Your Skills
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Accelerate your hiring journey with explainable AI skill intersection scoring, instant ATS resume parsing, and transparent application tracking.
          </p>

          {/* Search Console Card */}
          <div className="mx-auto mt-10 max-w-4xl glass-panel p-3 rounded-2xl shadow-xl shadow-indigo-950/5">
            <form 
              onSubmit={handleSearchSubmit} 
              className="flex flex-col md:flex-row gap-2"
            >
              <div className="flex-1 flex items-center px-4 py-3 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-slate-200/70 dark:border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition">
                <Search className="h-5 w-5 text-indigo-500 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, role, or core skills (e.g. React, Node.js)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none font-medium"
                />
              </div>

              <div className="flex-1 flex items-center px-4 py-3 bg-white/70 dark:bg-slate-900/70 rounded-xl border border-slate-200/70 dark:border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition">
                <MapPin className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Location or 'Remote'..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full bg-transparent border-0 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="btn-primary-gradient text-white font-bold rounded-xl px-8 py-3.5 text-sm flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-lg shadow-indigo-600/25"
              >
                <Search className="h-4 w-4" />
                <span>Search Jobs</span>
              </button>
            </form>

            {/* Trending Tags Bar */}
            <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center gap-2 px-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-indigo-600" /> Popular:
              </span>
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTagClick(tag)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100/80 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 transition font-medium cursor-pointer border border-transparent hover:border-indigo-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 2. Executive Floating Metric Ribbon */}
      <section className="relative z-20 px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="max-w-6xl mx-auto glass-panel rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-950/5 border border-slate-200/90 dark:border-slate-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-850">
            <div className="pt-2 sm:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">12,500+</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-indigo-600" /> Active Openings
              </div>
            </div>
            <div className="pt-4 sm:pt-0 sm:pl-4">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">4,850+</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-indigo-600" /> Placed Candidates
              </div>
            </div>
            <div className="pt-4 sm:pt-0 sm:pl-4">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">850+</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-violet-600" /> Verified Companies
              </div>
            </div>
            <div className="pt-4 sm:pt-0 sm:pl-4">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">96.8%</div>
              <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-emerald-600" /> AI Skill Precision
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core AI Innovation Showcase: Resume Matcher & Career Path Engine */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6">
        <ResumeCareerMatcher />
      </section>

      {/* 3. Featured Opportunities Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2 border border-indigo-200/60 dark:border-indigo-800/60">
              <Sparkles className="h-3 w-3 text-indigo-600" /> Market Spotlight
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Opportunities
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Hand-picked verified openings with high candidate engagement
            </p>
          </div>
          <Link 
            to="/jobs" 
            className="group text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-bold text-sm flex items-center gap-1.5 transition"
          >
            Browse all openings <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-panel p-6 rounded-3xl animate-pulse h-64"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center glass-panel p-16 rounded-3xl">
            <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No jobs listed yet</h3>
            <p className="text-slate-400 text-xs mt-1">Check back later or register as a Recruiter to publish openings!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div 
                key={job._id} 
                className="glass-panel glass-panel-hover p-6 rounded-3xl flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/80">
                      {job.jobType}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-slate-100 to-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-700 text-sm shadow-xs shrink-0 dark:bg-slate-800 dark:border-slate-700 dark:text-indigo-300">
                      {job.company?.name ? job.company.name[0] : 'C'}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition">
                        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {job.company?.name || 'Company Registered'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed font-normal">
                    {job.description}
                  </p>

                  {/* Skills preview */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.skills.slice(0, 3).map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium dark:bg-slate-800 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="text-[11px] px-1.5 py-0.5 text-slate-400 font-semibold">
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3.5">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                      ${job.salary.toLocaleString()}<span className="text-xs font-normal text-slate-400">/yr</span>
                    </div>
                  </div>

                  <Link 
                    to={`/jobs/${job._id}`}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-50 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 hover:text-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition duration-200 border border-slate-200/80 dark:border-slate-700 hover:border-transparent cursor-pointer shadow-xs"
                  >
                    View Details <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. How It Works Section */}
      <section className="bg-white/80 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold text-xs uppercase tracking-wider mb-3 border border-violet-200/60 dark:border-violet-800/60">
              <Cpu className="h-3.5 w-3.5" /> Deterministic Pipeline
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Hiring Engineered for Speed & Accuracy
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xl mx-auto">
              Our explainable AI matches verified skills to vacancies, cutting candidate review cycles in half.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative glass-panel p-8 rounded-3xl group hover:border-indigo-300 transition-all duration-300">
              <span className="absolute top-6 right-8 text-4xl font-black text-slate-200/60 dark:text-slate-800 select-none">
                01
              </span>
              <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white mb-6 shadow-md shadow-indigo-500/20">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Build Dynamic Profile</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Upload your resume to automatically parse core technologies, experience levels, and verified projects.
              </p>
            </div>

            <div className="relative glass-panel p-8 rounded-3xl group hover:border-violet-300 transition-all duration-300">
              <span className="absolute top-6 right-8 text-4xl font-black text-slate-200/60 dark:text-slate-800 select-none">
                02
              </span>
              <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-violet-500 text-white mb-6 shadow-md shadow-violet-500/20">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Match Scoring</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Our algorithm processes job requirements and provides transparent, deterministic match scores with skill gap analysis.
              </p>
            </div>

            <div className="relative glass-panel p-8 rounded-3xl group hover:border-emerald-300 transition-all duration-300">
              <span className="absolute top-6 right-8 text-4xl font-black text-slate-200/60 dark:text-slate-800 select-none">
                03
              </span>
              <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white mb-6 shadow-md shadow-emerald-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Track & Interview</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Manage applications across real-time stages (Review, Shortlist, Selected) and coordinate recruiter interview invites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Executive Call To Action (CTA) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 py-24 px-4 text-white text-center border-t border-slate-800">
        
        {/* Glow Spotlights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Start Exploring Today
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-5 text-white">
            Ready to Accelerate Your Hiring or Career?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of modern engineers, product leaders, and hiring managers building high-performing teams with CareerConnect AI.
          </p>

          <div className="flex flex-wrap justify-center gap-3.5">
            <Link 
              to="/register?role=seeker" 
              className="btn-primary-gradient px-7 py-3.5 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition cursor-pointer"
            >
              Get Started as Candidate
            </Link>
            <Link 
              to="/register?role=recruiter" 
              className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm transition border border-white/20 backdrop-blur-sm cursor-pointer"
            >
              Publish Vacancies as Recruiter
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
