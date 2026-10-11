import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  TrendingUp, 
  Target, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  RefreshCw, 
  Check, 
  BookOpen, 
  Award,
  Zap,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const ResumeCareerMatcher = () => {
  const { user } = useAuth();

  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'text'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState('fullstack');

  // Automatically run with user profile if seeker has skills and no file chosen yet
  useEffect(() => {
    if (user && user.skills && user.skills.length > 0 && !analysisResult) {
      handleAutoAnalyzeProfile();
    }
  }, [user]);

  const handleAutoAnalyzeProfile = async () => {
    try {
      setIsAnalyzing(true);
      const { data } = await API.post('/ai/resume-career-match', {});
      if (data.success) {
        setAnalysisResult(data.data);
      }
    } catch (err) {
      console.warn('Auto profile analysis note:', err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        toast.error('File size must be under 5MB');
        return;
      }
      setFile(selected);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.size > 5 * 1024 * 1024) {
        toast.error('File size must be under 5MB');
        return;
      }
      setFile(dropped);
    }
  };

  const handleRunMatch = async (e) => {
    if (e) e.preventDefault();

    if (activeTab === 'upload' && !file && (!user || !user.resume)) {
      toast.error('Please upload a resume file (PDF/DOCX) or paste text');
      return;
    }
    if (activeTab === 'text' && (!resumeText || resumeText.trim().length < 20)) {
      toast.error('Please paste resume text with your skills & experience');
      return;
    }

    setIsAnalyzing(true);

    try {
      let res;
      if (activeTab === 'upload' && file) {
        const formData = new FormData();
        formData.append('resume', file);
        res = await API.post('/ai/resume-career-match', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await API.post('/ai/resume-career-match', {
          resumeText: activeTab === 'text' ? resumeText : undefined
        });
      }

      if (res.data.success) {
        setAnalysisResult(res.data.data);
        toast.success('Resume analyzed! Found matching jobs and career skill gaps.');
      }
    } catch (err) {
      console.error('Career match error:', err);
      toast.error(err.response?.data?.message || 'Failed to match resume. Try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const activeTrackData = analysisResult?.careerTracks?.find(t => t.roleId === selectedTrack) || analysisResult?.fullStackFocus;

  return (
    <div className="space-y-8">
      
      {/* ===================================================================== */}
      {/* 1. HERO UPLOAD SECTION ("Keep your resume, I search a job")             */}
      {/* ===================================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 p-6 sm:p-9 text-white border border-indigo-800/60 shadow-xl shadow-indigo-950/20">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Core AI Aim & Placement Matching
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-400/30">
              <CheckCircle2 className="h-3 w-3" /> Interview Readiness Evaluator
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Keep Your Resume Here — I'll Search Your Jobs & Analyze Skill Gaps
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-indigo-150/90 max-w-3xl leading-relaxed">
            Upload your resume document. Our explainable AI instantly extracts your verified skills, checks against active vacancies to present the jobs you are <strong>capable of interviewing for right now</strong>, and highlights exactly what skills you must learn to qualify for high-tier roles like <strong>Full-Stack Developer</strong>.
          </p>

          {/* Mode Tabs */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white/10 text-indigo-200 hover:bg-white/15'
              }`}
            >
              <UploadCloud className="h-4 w-4" /> Upload Document (PDF/DOCX)
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'text'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white/10 text-indigo-200 hover:bg-white/15'
              }`}
            >
              <FileText className="h-4 w-4" /> Paste Text
            </button>
            {user && (user.resume || (user.skills && user.skills.length > 0)) && (
              <button
                onClick={handleAutoAnalyzeProfile}
                disabled={isAnalyzing}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 text-indigo-200 hover:bg-white/15 border border-white/15 transition flex items-center gap-2 cursor-pointer ml-auto"
              >
                <Zap className="h-4 w-4 text-amber-300" />
                Analyze Stored Profile Resume
              </button>
            )}
          </div>

          {/* Upload Input Box */}
          <form onSubmit={handleRunMatch} className="mt-4 space-y-4">
            {activeTab === 'upload' ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition ${
                  file
                    ? 'border-indigo-400 bg-indigo-950/40'
                    : 'border-indigo-800/80 hover:border-indigo-500 bg-slate-900/50'
                }`}
              >
                <UploadCloud className="h-10 w-10 mx-auto text-indigo-400 mb-2" />
                {file ? (
                  <div>
                    <p className="text-sm font-bold text-white">{file.name}</p>
                    <p className="text-xs text-indigo-300 mt-0.5">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze
                    </p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="mt-2 text-xs text-rose-400 hover:underline font-semibold cursor-pointer"
                    >
                      Remove & choose another file
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">
                      Drag and drop your resume file here, or{' '}
                      <label className="text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer">
                        browse files
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports PDF, DOC, DOCX up to 5MB
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <textarea
                rows={4}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content, skills, work experience, projects, or core competencies here..."
                className="w-full text-xs p-3.5 rounded-2xl bg-slate-900/80 border border-indigo-800/80 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition"
              />
            )}

            <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
              <span className="text-xs text-indigo-300">
                ⚡ Automatically extracts technical skills and checks against 20+ active job openings
              </span>
              <button
                type="submit"
                disabled={isAnalyzing}
                className="px-7 py-3 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Extracting Skills & Matching Vacancies...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Keep Resume & Search My Jobs
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. RESULTS CONTAINER                                                 */}
      {/* ===================================================================== */}
      {analysisResult && (
        <div className="space-y-8 animate-in fade-in duration-400">
          
          {/* 2.1 THIS IS YOUR RESUME & EXTRACTED SKILLS CARD */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      This is Your Resume
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                      {analysisResult.skillCount} Skills Detected
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    Document: <span className="font-bold text-slate-700 dark:text-slate-300">{analysisResult.resumeName}</span>
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Verified & normalized skills inventory
              </div>
            </div>

            {/* Extracted Skills Badges */}
            <div className="pt-4">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                Skills Extracted From Your Resume:
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.extractedSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-200 text-xs font-bold border border-indigo-100 dark:border-indigo-800 flex items-center gap-1.5 shadow-2xs"
                  >
                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 2.2 SECTION 1: JOBS YOU ARE DIRECTLY CAPABLE OF (READY TO INTERVIEW)*/}
          {/* ================================================================= */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-100 dark:border-emerald-900/50 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  SECTION 1: DIRECTLY CAPABLE FOR INTERVIEWS
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Jobs Available For Your Current Resume Right Now
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Based on the verified skills present in your uploaded resume, you are <strong>fully capable to participate in the interview and further selection rounds</strong> for these openings.
                </p>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-right">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  {analysisResult.capableJobs.length} Eligible Vacancies
                </span>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Ready to apply today</p>
              </div>
            </div>

            {analysisResult.capableJobs.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No high-overlap vacancies found matching only these skills.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Check out the Skill Gap section below to learn the required skills!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {analysisResult.capableJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-5 rounded-2xl border border-emerald-150 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/15 hover:shadow-md transition space-y-3.5 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500" />

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                          <CheckCircle2 className="h-3 w-3" /> {job.skillMatchPercent}% Match • Capable for Interview
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                          <Link to={`/jobs/${job._id}`} className="hover:text-indigo-600 transition">
                            {job.title}
                          </Link>
                        </h4>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                          {job.company?.name || 'Registered Company'}
                        </p>
                      </div>

                      <span className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {job.jobType}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-slate-400" /> ${job.salary?.toLocaleString()}/yr
                      </span>
                    </div>

                    {/* Matched skills highlight */}
                    <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/40">
                      <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                        Matched Skills in Your Resume ({job.matchedSkills?.length}):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {job.matchedSkills?.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 text-[10px] font-bold"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Direct Apply CTA */}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {job.readinessStatus}
                      </span>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="btn-primary-gradient px-4 py-2 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition flex items-center gap-1"
                      >
                        <span>Apply & Interview</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* 2.3 SECTION 2: SKILL GAP & TARGET ROLE ADVISOR (FULL STACK DEV)   */}
          {/* ================================================================= */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200/90 dark:border-amber-900/60 p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-extrabold border border-amber-200 dark:border-amber-800 mb-2">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                  SECTION 2: MISSING SKILLS & CAREER UPGRADE ADVISOR
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  If You Learn These Skills, You Can Unlock These High-Tier Jobs Also
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Target aspirational positions like <strong>Full-Stack Developer</strong>. See exactly what percentage of skills are in your resume, and what missing skills you must learn to qualify.
                </p>
              </div>

              {/* Role Switcher Tabs */}
              <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                {analysisResult.careerTracks?.map((track) => (
                  <button
                    key={track.roleId}
                    onClick={() => setSelectedTrack(track.roleId)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedTrack === track.roleId
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {track.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Track Spotlight Card (Features Full Stack Developer prominently) */}
            {activeTrackData && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 dark:from-slate-900 dark:via-amber-950/20 dark:to-slate-900 border border-amber-200 dark:border-amber-800/80 shadow-sm space-y-5">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-100 dark:border-amber-900/40">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">
                        Target Role: {activeTrackData.title}
                      </h4>
                      {activeTrackData.isFullStack && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase">
                          Featured Aim
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {activeTrackData.description} • Average Salary: <strong className="text-emerald-600">{activeTrackData.salaryRange}</strong>
                    </p>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div className="text-center px-4 py-2 bg-white dark:bg-slate-950 rounded-2xl border border-amber-200 dark:border-amber-800 shadow-2xs">
                      <span className="text-xl font-black text-amber-700 dark:text-amber-400">
                        {activeTrackData.matchPercentage}%
                      </span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Current Match</p>
                    </div>
                  </div>
                </div>

                {/* Clear Math / Ratio explanation requested by user */}
                <div className="p-4 rounded-2xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                  <strong>💡 Career Advisor Analysis: </strong>
                  {activeTrackData.advice}
                </div>

                {/* Skills Present vs Skills To Learn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Left: Skills already in resume */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" /> Skills Present In Your Resume ({activeTrackData.presentCount}):
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">Half Ready</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeTrackData.presentSkills.length > 0 ? (
                        activeTrackData.presentSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold"
                          >
                            ✓ {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">None detected from this specific track.</span>
                      )}
                    </div>
                  </div>

                  {/* Right: Skills to learn */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-amber-200 dark:border-amber-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" /> Skills You Need To Learn ({activeTrackData.missingSkillsToLearn?.length}):
                      </span>
                      <span className="text-[10px] text-amber-600 font-bold">Action Needed</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeTrackData.missingSkillsToLearn?.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-850 dark:text-amber-200 text-xs font-bold"
                        >
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* List of Aspirational Job Openings with Skill Gaps */}
            {analysisResult.growthJobs && analysisResult.growthJobs.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                  Openings On Platform That You Can Unlock By Learning These Missing Skills:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.growthJobs.slice(0, 4).map((job) => (
                    <div
                      key={job._id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 hover:border-amber-400 transition space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            {job.skillMatchPercent}% Match • Missing Skills
                          </span>
                          <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                            <Link to={`/jobs/${job._id}`} className="hover:text-indigo-600 transition">
                              {job.title}
                            </Link>
                          </h5>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {job.company?.name || 'Company'} • ${job.salary?.toLocaleString()}/yr
                          </p>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-amber-700 dark:text-amber-400">Missing to learn: </span>
                        {job.skillsToLearn?.join(', ')}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">
                          {job.matchedSkills?.length} present / {job.totalRequiredCount} required
                        </span>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          View Vacancy <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default ResumeCareerMatcher;
