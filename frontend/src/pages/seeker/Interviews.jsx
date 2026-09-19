import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Calendar, Video, Clock, FileText, ChevronRight, CheckCircle2, XCircle, Sparkles, Building2, User, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const SeekerInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'

  const fetchInterviews = async () => {
    try {
      const { data } = await API.get('/interviews/my');
      if (data.success) {
        setInterviews(data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load interview schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const getFilteredInterviews = () => {
    const now = new Date().getTime();
    return interviews.filter(item => {
      const interviewTime = new Date(item.date).getTime();
      const isScheduled = item.status === 'Scheduled';
      
      if (activeTab === 'upcoming') {
        return isScheduled && interviewTime >= now - 12 * 60 * 60 * 1000;
      } else {
        return !isScheduled || interviewTime < now - 12 * 60 * 60 * 1000;
      }
    });
  };

  const filtered = getFilteredInterviews();
  const upcomingCount = interviews.filter(i => i.status === 'Scheduled' && new Date(i.date).getTime() >= new Date().getTime() - 12 * 60 * 60 * 1000).length;
  const pastCount = interviews.filter(i => i.status !== 'Scheduled' || new Date(i.date).getTime() < new Date().getTime() - 12 * 60 * 60 * 1000).length;

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider mb-2 border border-indigo-200/60 dark:border-indigo-800/60">
            <Sparkles className="h-3 w-3 text-indigo-600" /> ATS Interview Schedule
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="h-7 w-7 text-indigo-600" /> Scheduled Interviews
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review your upcoming technical, behavioral, and recruiter rounds with meeting coordinates.
          </p>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 gap-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'upcoming' 
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <span>Upcoming Rounds</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
              activeTab === 'upcoming' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}>
              {upcomingCount}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'past' 
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <span>Past History</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
              activeTab === 'past' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}>
              {pastCount}
            </span>
          </button>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-36 glass-panel rounded-3xl"></div>
            <div className="h-36 glass-panel rounded-3xl"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel rounded-3xl p-16 text-center shadow-xs">
            <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No interviews found</h3>
            <p className="text-xs text-slate-400 mt-1">
              You do not have any interviews listed in this tab at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((item) => (
              <div 
                key={item._id} 
                className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden"
              >
                {/* Left vertical status accent */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  item.status === 'Completed' 
                    ? 'bg-emerald-500' 
                    : item.status === 'Cancelled' 
                      ? 'bg-rose-500' 
                      : 'bg-gradient-to-b from-indigo-500 to-violet-600'
                }`} />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                  <div className="space-y-3 flex-1">
                    
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800">
                        {item.type} Round
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                        item.status === 'Completed' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300' 
                          : item.status === 'Cancelled' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300' 
                            : 'bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/50 dark:text-violet-300'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    {/* Job Title & Company */}
                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                        {item.job?.title || 'Job Opening'}
                      </h2>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                        <Building2 className="h-3.5 w-3.5 text-indigo-600" />
                        <span>{item.job?.company?.name || 'Verified Company'}</span>
                        <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>With {item.recruiter?.name || 'Recruiter'}</span>
                      </div>
                    </div>

                    {/* Schedule Time & Video Link */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300 pt-1">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                        <Clock className="h-4 w-4 text-indigo-600" />
                        {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {item.time}
                      </span>
                    </div>

                    {/* Organizer Notes */}
                    {item.notes && (
                      <div className="bg-slate-50/80 dark:bg-slate-900/80 p-3.5 rounded-2xl text-xs text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 max-w-xl">
                        <strong className="text-indigo-600 dark:text-indigo-400 font-bold mr-1.5">Recruiter Agenda:</strong>
                        {item.notes}
                      </div>
                    )}
                  </div>

                  {/* Right Side Action Button */}
                  {item.meetingLink && item.status === 'Scheduled' && (
                    <div className="w-full md:w-auto shrink-0">
                      <a 
                        href={item.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 btn-primary-gradient text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/20 cursor-pointer"
                      >
                        <Video className="h-4 w-4" />
                        <span>Join Meeting Call</span>
                        <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                      </a>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default SeekerInterviews;
