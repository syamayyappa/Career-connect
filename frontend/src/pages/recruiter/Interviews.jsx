import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Calendar, Video, Clock, User, CheckCircle2, AlertCircle, XCircle, Sparkles, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const RecruiterInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      const { data } = await API.get('/interviews/my');
      if (data.success) {
        setInterviews(data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load interview records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { data } = await API.put(`/interviews/${id}`, { status: newStatus });
      if (data.success) {
        toast.success(`Interview status updated to ${newStatus}`);
        setInterviews(list => list.map(item => item._id === id ? { ...item, status: newStatus } : item));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 min-h-screen py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold text-xs uppercase tracking-wider mb-2 border border-violet-200/60 dark:border-violet-800/60">
            <Sparkles className="h-3 w-3" /> Candidate Assessment Pipeline
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="h-7 w-7 text-indigo-600" /> Interviews Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Coordinate upcoming candidate meetings, track technical rounds, and update feedback statuses.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-36 glass-panel rounded-3xl"></div>
            <div className="h-36 glass-panel rounded-3xl"></div>
          </div>
        ) : interviews.length === 0 ? (
          <div className="glass-panel rounded-3xl p-16 text-center shadow-xs">
            <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No interviews scheduled yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Visit your active vacancy applicants management tables to schedule candidate assessments.
            </p>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl p-6 sm:p-7 shadow-xs overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                  <th className="pb-3.5 pr-4">Candidate</th>
                  <th className="pb-3.5 pr-4">Job Posting</th>
                  <th className="pb-3.5 pr-4">Date & Time</th>
                  <th className="pb-3.5 pr-4">Round Type</th>
                  <th className="pb-3.5 pr-4">Status</th>
                  <th className="pb-3.5 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {interviews.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition">
                    <td className="py-4 pr-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User className="h-4 w-4 text-indigo-600" />
                        {item.candidate?.name || 'Candidate'}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">{item.candidate?.email}</span>
                    </td>
                    <td className="py-4 pr-4 text-slate-600 dark:text-slate-300 font-bold text-xs">
                      {item.job?.title || 'Job Deleted'}
                    </td>
                    <td className="py-4 pr-4 font-semibold text-slate-600 dark:text-slate-300 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-indigo-600" />
                        {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <span className="text-[10px] text-slate-400 ml-5 font-normal">{item.time}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                        item.status === 'Completed' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300' 
                          : item.status === 'Cancelled' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300' 
                            : 'bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/50 dark:text-violet-300'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        className="text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-750 dark:bg-slate-900 px-3 py-1.5 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 cursor-pointer text-slate-800 dark:text-slate-200"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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

export default RecruiterInterviews;
