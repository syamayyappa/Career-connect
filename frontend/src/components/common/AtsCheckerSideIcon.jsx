import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { 
  ScanLine, 
  X, 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Maximize2, 
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

const AtsCheckerSideIcon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'text'
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showJdInput, setShowJdInput] = useState(false);
  
  const [isScanning, setIsScanning] = useState(false);
  const [atsResult, setAtsResult] = useState(null);
  const [copiedKeyword, setCopiedKeyword] = useState(null);

  // If user is already on the dedicated full page, we can hide or keep the drawer accessible
  const isAtsPage = location.pathname === '/ats-checker';

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

  const handleScan = async (e) => {
    if (e) e.preventDefault();

    if (activeTab === 'upload' && !file) {
      toast.error('Please select a resume file (PDF/DOCX)');
      return;
    }
    if (activeTab === 'text' && (!resumeText || resumeText.trim().length < 30)) {
      toast.error('Please paste your resume text (at least 30 characters)');
      return;
    }

    setIsScanning(true);
    setAtsResult(null);

    try {
      let res;
      if (activeTab === 'upload' && file) {
        const formData = new FormData();
        formData.append('resume', file);
        if (jobDescription) formData.append('jobDescription', jobDescription);
        res = await API.post('/ai/ats-check', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await API.post('/ai/ats-check', {
          resumeText,
          jobDescription
        });
      }

      if (res.data.success) {
        setAtsResult(res.data.data);
        toast.success(`ATS Scan Complete! Score: ${res.data.data.overallScore}/100`);
      }
    } catch (err) {
      console.error('ATS Scan Error:', err);
      toast.error(err.response?.data?.message || 'Failed to scan resume. Try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopyKeyword = (kw) => {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    toast.success(`Copied "${kw}" to clipboard!`);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 85) return 'from-emerald-500 to-teal-600 text-white';
    if (score >= 70) return 'from-indigo-600 to-violet-600 text-white';
    if (score >= 50) return 'from-amber-500 to-orange-500 text-white';
    return 'from-rose-500 to-red-600 text-white';
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* FLOATING SIDE DOCK ICON (Anchored on Right Screen Edge)                   */}
      {/* ========================================================================= */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white py-3 px-3.5 rounded-l-2xl shadow-2xl shadow-indigo-950/50 hover:pl-5 hover:pr-4 transition-all duration-300 transform hover:-translate-x-1 cursor-pointer border-t border-b border-l border-indigo-500/40"
          title="Open AI ATS Resume Checker"
          aria-label="Open ATS Checker"
        >
          {/* Glowing pulse aura */}
          <span className="absolute -left-1 -top-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border border-white"></span>
          </span>

          {/* Scanner Icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 backdrop-blur-sm border border-indigo-400/30 shadow-inner group-hover:scale-110 transition-transform">
            <ScanLine className="h-4.5 w-4.5 text-indigo-300 animate-pulse" />
          </div>

          {/* Text with Badge */}
          <div className="flex flex-col items-start pr-1">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-sm tracking-tight text-white whitespace-nowrap">
                ATS Checker
              </span>
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow-xs">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap mt-0.5">
              Instant Scan & Match
            </span>
          </div>

          {/* Hover Arrow Indicator */}
          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SLIDE-OVER QUICK ATS SCANNER DRAWER                                       */}
      {/* ========================================================================= */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-950/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
              
              {/* Drawer Header */}
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-50/70 via-white to-violet-50/70 dark:from-gray-900 dark:to-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
                    <ScanLine className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-base font-bold text-gray-900 dark:text-white">
                        AI ATS Checker
                      </h2>
                      <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        v2.0
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Evaluate ATS compatibility & keyword alignment
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/ats-checker');
                    }}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded-xl transition"
                    title="Open Full ATS Studio"
                  >
                    <Maximize2 className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                
                {/* Mode Selector Tabs */}
                {!atsResult && (
                  <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                        activeTab === 'upload'
                          ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                      }`}
                    >
                      <UploadCloud className="h-3.5 w-3.5" /> Upload File
                    </button>
                    <button
                      onClick={() => setActiveTab('text')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                        activeTab === 'text'
                          ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                      }`}
                    >
                      <FileText className="h-3.5 w-3.5" /> Paste Text
                    </button>
                  </div>
                )}

                {/* Form Input Area */}
                {!atsResult ? (
                  <form onSubmit={handleScan} className="space-y-4">
                    {activeTab === 'upload' ? (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                          Resume Document (PDF or DOCX)
                        </label>
                        <div className="border-2 border-dashed border-gray-250 dark:border-gray-700 hover:border-indigo-500 rounded-2xl p-6 text-center transition bg-gray-50/50 dark:bg-gray-850/30">
                          <UploadCloud className="h-8 w-8 mx-auto text-indigo-500 mb-2" />
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {file ? file.name : 'Click to select or drag & drop'}
                          </p>
                          <p className="text-[11px] text-gray-400">PDF, DOC, DOCX up to 5MB</p>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="mt-3 block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                          Paste Resume Text
                        </label>
                        <textarea
                          rows={7}
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          placeholder="Paste your experience, skills, and education details here..."
                          className="w-full text-xs p-3 rounded-xl border border-gray-250 dark:border-gray-700 dark:bg-gray-950 focus:outline-none focus:border-indigo-600 transition"
                        />
                      </div>
                    )}

                    {/* Optional Job Description Toggle */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowJdInput(!showJdInput)}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <Target className="h-3.5 w-3.5" />
                        {showJdInput ? 'Remove Target Job Description' : '+ Add Target Job Description (Optional)'}
                      </button>

                      {showJdInput && (
                        <div className="mt-2.5">
                          <textarea
                            rows={4}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the target job description to calculate keyword match %..."
                            className="w-full text-xs p-3 rounded-xl border border-gray-250 dark:border-gray-700 dark:bg-gray-950 focus:outline-none focus:border-indigo-600 transition"
                          />
                        </div>
                      )}
                    </div>

                    {/* Submit Scan Button */}
                    <button
                      type="submit"
                      disabled={isScanning}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition disabled:opacity-50"
                    >
                      {isScanning ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Analyzing ATS Compatibility...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Run Quick ATS Scan
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* ========================================================= */
                  /* SCAN RESULTS VIEW                                         */
                  /* ========================================================= */
                  <div className="space-y-5 animate-in fade-in duration-300">
                    
                    {/* Score Card Banner */}
                    <div className={`p-5 rounded-2xl bg-gradient-to-br ${getScoreBadgeColor(atsResult.overallScore)} shadow-lg`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                          Overall ATS Score
                        </span>
                        <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                          {atsResult.grade}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-white">
                          {atsResult.overallScore}
                        </span>
                        <span className="text-sm text-white/80 font-semibold">/ 100</span>
                      </div>

                      <p className="mt-2 text-xs text-white/90 leading-relaxed">
                        {atsResult.gradeDescription}
                      </p>
                    </div>

                    {/* Breakdown Scores */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-750">
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">Format & Structure</div>
                        <div className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                          {atsResult.categoryScores.structure.score} <span className="text-xs text-gray-400">/ 25</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${atsResult.categoryScores.structure.percent}%` }} />
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-750">
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">Keywords & Match</div>
                        <div className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                          {atsResult.categoryScores.keywords.score} <span className="text-xs text-gray-400">/ 35</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-teal-500 h-full rounded-full" style={{ width: `${atsResult.categoryScores.keywords.percent}%` }} />
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-750">
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">Impact & Metrics</div>
                        <div className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                          {atsResult.categoryScores.impact.score} <span className="text-xs text-gray-400">/ 25</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-violet-600 h-full rounded-full" style={{ width: `${atsResult.categoryScores.impact.percent}%` }} />
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-750">
                        <div className="text-[11px] text-gray-500 dark:text-gray-400">Length & Tone</div>
                        <div className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                          {atsResult.categoryScores.brevity.score} <span className="text-xs text-gray-400">/ 15</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${atsResult.categoryScores.brevity.percent}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Missing Keywords to Add */}
                    {atsResult.keywords.missing && atsResult.keywords.missing.length > 0 && (
                      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 mb-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          Recommended Keywords to Add
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {atsResult.keywords.missing.map((kw, i) => (
                            <button
                              key={i}
                              onClick={() => handleCopyKeyword(kw)}
                              className="px-2.5 py-1 bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800 text-amber-850 dark:text-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1 hover:border-amber-400 transition cursor-pointer"
                              title="Click to copy"
                            >
                              {kw}
                              {copiedKeyword === kw ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3 text-gray-400" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Top Actionable Suggestions */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                        Priority Fixes
                      </h4>
                      <div className="space-y-2">
                        {atsResult.suggestions.slice(0, 3).map((sug, i) => (
                          <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800 text-xs">
                            <div className="font-semibold text-gray-900 dark:text-white flex items-start gap-1.5">
                              <span className="h-4 w-4 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              {sug.title}
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 mt-1 pl-5.5 text-[11px] leading-normal">
                              {sug.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Re-Scan / Reset */}
                    <button
                      onClick={() => setAtsResult(null)}
                      className="w-full py-2.5 border border-gray-250 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Scan Another Resume
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Sticky Footer */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-950/40 flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/ats-checker');
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                >
                  <span>Open Full ATS Studio</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AtsCheckerSideIcon;
