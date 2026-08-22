import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Calendar, Video, Clock, FileText, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
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
        return isScheduled && interviewTime >= now - 12 * 60 * 60 * 1000; // show scheduled soon or today
      } else {
        return !isScheduled || interviewTime < now - 12 * 60 * 60 * 1000;
      }
    });
  };

  const filtered = getFilteredInterviews();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="h-6 w-6 text-indigo-650" /> Scheduled Interviews
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review your technical, behavioral, and HR interview timelines
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-800 mb-8 gap-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-sm font-semibold border-b-2 transition ${
            activeTab === 'upcoming' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Upcoming Rounds ({interviews.filter(i => i.status === 'Scheduled' && new Date(i.date).getTime() >= new Date().getTime() - 12 * 60 * 60 * 1000).length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 text-sm font-semibold border-b-2 transition ${
            activeTab === 'past' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Past / History ({interviews.filter(i => i.status !== 'Scheduled' || new Date(i.date).getTime() < new Date().getTime() - 12 * 60 * 60 * 1000).length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 bg-white rounded-3xl border border-gray-50"></div>
          <div className="h-32 bg-white rounded-3xl border border-gray-50"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-16 text-center shadow-sm">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No interviews scheduled</h3>
          <p className="text-sm text-gray-450 mt-1">
            You do not have any interviews listed in this tab at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((item) => (
            <div 
              key={item._id} 
              className="bg-white border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rounded-3xl p-6 shadow-sm relative overflow-hidden"
            >
              {/* Left highlight type bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                item.status === 'Completed' 
                  ? 'bg-green-500' 
                  : item.status === 'Cancelled' 
                    ? 'bg-red-500' 
                    : 'bg-indigo-600'
              }`}></div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-150">
                      {item.type} Round
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.status === 'Completed' 
                        ? 'bg-green-50 text-green-700 border border-green-150' 
                        : item.status === 'Cancelled' 
                          ? 'bg-red-50 text-red-700 border border-red-150' 
                          : 'bg-indigo-50/50 text-indigo-650'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    {item.job?.title || 'Job Deleted'}
                  </h2>
                  
                  <p className="text-xs font-semibold text-gray-500">
                    With {item.recruiter?.name || 'Hiring Manager'} &bull; {item.job?.company?.name || 'Company Registered'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-semibold text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-indigo-600" /> {new Date(item.date).toLocaleDateString()} at {item.time}</span>
                    {item.meetingLink && (
                      <span className="flex items-center gap-1">
                        <Video className="h-4 w-4 text-indigo-600" /> 
                        <a 
                          href={item.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:underline"
                        >
                          Join Call Link
                        </a>
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl text-xs text-gray-650 max-w-xl">
                      <span className="font-bold text-gray-800 dark:text-gray-300">Organizer Notes:</span> {item.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default SeekerInterviews;
