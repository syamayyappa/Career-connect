import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  ScanLine, 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Copy, 
  Check, 
  Target, 
  Download, 
  Printer, 
  Award, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  FileCheck, 
  ArrowRight,
  Briefcase,
  Layers,
  ChevronDown,
  Info,
  Wand2
} from 'lucide-react';
import toast from 'react-hot-toast';

const AtsChecker = () => {
  const { user } = useAuth();

  // Input states
  const [inputTab, setInputTab] = useState('upload'); // 'upload' | 'text' | 'profile'
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [availableJobs, setAvailableJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  
  // Scanning states
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [atsResult, setAtsResult] = useState(null);
  const [copiedItem, setCopiedItem] = useState(null);

  // Bullet Enhancer states
  const [bulletInput, setBulletInput] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedBullets, setEnhancedBullets] = useState([]);

  // Fetch active platform jobs for easy targeting
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get('/jobs');
        if (data.success) {
          setAvailableJobs(data.data || []);
        }
      } catch (err) {
        console.error('Failed to load platform jobs:', err);
      }
    };
    fetchJobs();
  }, []);

  // Handle file select
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

  // Drag & drop handlers
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

  // Run ATS Scan
  const handleScan = async (e) => {
    if (e) e.preventDefault();

    if (inputTab === 'upload' && !file) {
      toast.error('Please upload a resume file (PDF/DOCX)');
      return;
    }
    if (inputTab === 'text' && (!resumeText || resumeText.trim().length < 30)) {
      toast.error('Please paste your resume text (at least 30 characters)');
      return;
    }

    setIsScanning(true);
    setScanStep(1);
    setAtsResult(null);

    // Simulation animation intervals for realistic AI scanning feel
    const stepTimer1 = setTimeout(() => setScanStep(2), 500);
    const stepTimer2 = setTimeout(() => setScanStep(3), 1000);

    try {
      let res;
      if (inputTab === 'upload' && file) {
        const formData = new FormData();
        formData.append('resume', file);
        if (jobDescription) formData.append('jobDescription', jobDescription);
        if (selectedJobId) formData.append('jobId', selectedJobId);
        if (targetRole) formData.append('targetRole', targetRole);

        res = await API.post('/ai/ats-check', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await API.post('/ai/ats-check', {
          resumeText: inputTab === 'profile' ? undefined : resumeText,
          jobDescription,
          jobId: selectedJobId || undefined,
          targetRole
        });
      }

      if (res.data.success) {
        setAtsResult(res.data.data);
        toast.success(`ATS Scan Complete! Overall Score: ${res.data.data.overallScore}/100`);
      }
    } catch (err) {
      console.error('ATS Scan Error:', err);
      toast.error(err.response?.data?.message || 'Failed to analyze resume.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsScanning(false);
      setScanStep(0);
    }
  };

  // Copy helper
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(key);
    toast.success(`Copied to clipboard!`);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Enhance Bullet Point
  const handleEnhanceBullet = async () => {
    if (!bulletInput || bulletInput.trim().length < 5) {
      toast.error('Please enter a bullet point to enhance');
      return;
    }

    setIsEnhancing(true);
    try {
      const { data } = await API.post('/ai/bullet-enhance', {
        originalBullet: bulletInput
      });
      if (data.success) {
        setEnhancedBullets(data.data.improvedBullets);
        toast.success('Generated 3 enhanced bullet variations!');
      }
    } catch (err) {
      console.error('Bullet Enhance Error:', err);
      toast.error('Failed to enhance bullet point');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Helper for score gauge color
  const getScoreTheme = (score) => {
    if (score >= 85) return { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500', stroke: '#10b981', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200' };
    if (score >= 70) return { text: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-600', stroke: '#6366f1', badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200' };
    if (score >= 50) return { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500', stroke: '#f59e0b', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200' };
    return { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500', stroke: '#f43f5e', badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200' };
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* =================================================================== */}
        {/* HEADER HERO SECTION                                                */}
        {/* =================================================================== */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 p-8 sm:p-10 text-white shadow-xl">
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Next-Gen Applicant Tracking System Evaluator
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              AI ATS Resume Scanner & Optimizer
            </h1>
            <p className="mt-3 text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Test your resume against modern Applicant Tracking System (ATS) parsing algorithms. Uncover missing keywords, evaluate action verbs, detect formatting flaws, and boost your interview callback rate.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-indigo-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> 100% Private & Instant
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-400" /> Multi-Factor ATS Scoring
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="h-4 w-4 text-cyan-400" /> Target Job Matching
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* MAIN INPUT / STUDIO CARD                                           */}
        {/* =================================================================== */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm overflow-hidden">
          
          {/* Input Tabs Header */}
          <div className="border-b border-gray-100 dark:border-gray-800 px-6 pt-5 pb-3 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-950/40">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInputTab('upload')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-2 ${
                  inputTab === 'upload'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <UploadCloud className="h-4 w-4" /> Upload Document
              </button>
              <button
                onClick={() => setInputTab('text')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-2 ${
                  inputTab === 'text'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <FileText className="h-4 w-4" /> Paste Text
              </button>
              {user && user.role === 'seeker' && (
                <button
                  onClick={() => setInputTab('profile')}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition flex items-center gap-2 ${
                    inputTab === 'profile'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Award className="h-4 w-4" /> Use My Profile
                </button>
              )}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              Supports: <span className="font-semibold text-gray-700 dark:text-gray-300">PDF, DOC, DOCX, TXT</span> (Max 5MB)
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleScan} className="space-y-6">
              
              {/* TAB 1: Upload File */}
              {inputTab === 'upload' && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition ${
                    file
                      ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20'
                      : 'border-gray-250 dark:border-gray-700 hover:border-indigo-500 bg-gray-50/40 dark:bg-gray-850/20'
                  }`}
                >
                  <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-300 mb-4 shadow-sm">
                    {file ? <FileCheck className="h-8 w-8" /> : <UploadCloud className="h-8 w-8" />}
                  </div>

                  {file ? (
                    <div className="space-y-2">
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for deep ATS analysis
                      </p>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="mt-2 text-xs text-red-600 hover:underline font-semibold"
                      >
                        Remove & Select Another
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        Drag and drop your resume file here, or{' '}
                        <label className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer">
                          browse files
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </p>
                      <p className="text-xs text-gray-400">
                        Our parser automatically extracts sections, contact info, skills, and metrics
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Paste Text */}
              {inputTab === 'text' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Paste Complete Resume Content
                    </label>
                    <span className="text-xs text-gray-400">
                      {resumeText.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste the full text of your resume (Contact information, Summary, Experience, Education, Technical Skills, Projects)..."
                    className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-gray-250 dark:border-gray-700 dark:bg-gray-950 focus:outline-none focus:border-indigo-600 transition"
                  />
                </div>
              )}

              {/* TAB 3: Load Profile */}
              {inputTab === 'profile' && user && (
                <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                  <div className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        Analyze Active Seeker Profile: {user.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        We will evaluate your registered profile skills ({(user.skills || []).length} items), education, and work experience against industry ATS benchmarks.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(user.skills || []).slice(0, 8).map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white dark:bg-gray-900 text-indigo-700 dark:text-indigo-300 rounded text-[11px] font-medium border border-indigo-100 dark:border-indigo-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Target Job Matcher (Optional) */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-850/40 border border-gray-150 dark:border-gray-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                    Target Job Alignment (Optional - for Keyword Match Rate)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Platform Job */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Compare Against Active Job Opening
                    </label>
                    <select
                      value={selectedJobId}
                      onChange={(e) => {
                        setSelectedJobId(e.target.value);
                        if (e.target.value) setJobDescription('');
                      }}
                      className="w-full text-xs rounded-xl border border-gray-250 dark:border-gray-700 dark:bg-gray-950 px-3.5 py-2.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-indigo-600 transition"
                    >
                      <option value="">-- General Software / ATS Benchmark --</option>
                      {availableJobs.map((job) => (
                        <option key={job._id} value={job._id}>
                          {job.title} • {job.company?.name || 'Company'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Or Target Role / Title */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Or Target Position Title
                    </label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g. Senior Full Stack Engineer, Data Scientist"
                      className="w-full text-xs rounded-xl border border-gray-250 dark:border-gray-700 dark:bg-gray-950 px-3.5 py-2.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-indigo-600 transition"
                    />
                  </div>
                </div>

                {/* Custom JD Paste Area */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Or Paste Custom Target Job Description (JD)
                  </label>
                  <textarea
                    rows={3}
                    value={jobDescription}
                    onChange={(e) => {
                      setJobDescription(e.target.value);
                      if (e.target.value) setSelectedJobId('');
                    }}
                    placeholder="Paste required skills and qualifications from any job posting to calculate exact keyword coverage..."
                    className="w-full text-xs p-3 rounded-xl border border-gray-250 dark:border-gray-700 dark:bg-gray-950 focus:outline-none focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isScanning}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl text-sm flex items-center gap-2.5 shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Scanning ATS Compliance...
                    </>
                  ) : (
                    <>
                      <ScanLine className="h-4.5 w-4.5" />
                      Run Deep ATS Scan & Audit
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SCANNING PROGRESS ANIMATION                                         */}
        {/* =================================================================== */}
        {isScanning && (
          <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-indigo-100 dark:border-indigo-900 shadow-xl text-center space-y-4 animate-pulse">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <ScanLine className="h-7 w-7 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {scanStep === 1 && 'Extracting text and verifying document layout...'}
                {scanStep === 2 && 'Parsing technical keywords & cross-referencing JD...'}
                {scanStep === 3 && 'Evaluating power action verbs & quantifiable metrics...'}
                {scanStep === 0 && 'Computing ATS overall score and recommendations...'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">Applying industry standard ATS parsing rules...</p>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* ATS AUDIT REPORT RESULTS VIEW                                       */}
        {/* =================================================================== */}
        {atsResult && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 1. TOP SCORE HERO SUMMARY */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-sm p-6 sm:p-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                
                {/* Score Dial & Grade */}
                <div className="flex items-center gap-6 sm:gap-8">
                  {/* Radial SVG Gauge */}
                  <div className="relative flex h-32 w-32 sm:h-36 sm:w-36 items-center justify-center flex-shrink-0">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="stroke-gray-100 dark:stroke-gray-800"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke={getScoreTheme(atsResult.overallScore).stroke}
                        strokeWidth="10"
                        strokeDasharray={264}
                        strokeDashoffset={264 - (264 * atsResult.overallScore) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className={`text-3xl sm:text-4xl font-black ${getScoreTheme(atsResult.overallScore).text}`}>
                        {atsResult.overallScore}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        out of 100
                      </span>
                    </div>
                  </div>

                  {/* Verdict Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getScoreTheme(atsResult.overallScore).badge}`}>
                        Grade: {atsResult.grade}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        Target: {atsResult.targetJobTitle}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      ATS Compatibility Verdict
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
                      {atsResult.gradeDescription}
                    </p>
                  </div>
                </div>

                {/* Print / Actions */}
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    <Printer className="h-4 w-4" /> Print / Save PDF
                  </button>
                  <button
                    onClick={() => {
                      setAtsResult(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className="h-4 w-4" /> Scan Another
                  </button>
                </div>

              </div>
            </div>

            {/* 2. FOUR CATEGORY SCORE CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Structure */}
              <div className="p-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    <Layers className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-black text-gray-900 dark:text-white">
                    {atsResult.categoryScores.structure.score} <span className="text-xs text-gray-400 font-normal">/ 25</span>
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Format & Sections</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Contact info & standard headers</p>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-700" style={{ width: `${atsResult.categoryScores.structure.percent}%` }} />
                </div>
                <div className="text-[10px] text-gray-400 flex items-center justify-between">
                  <span>{atsResult.stats.sectionsDetected.length} Sections Found</span>
                  <span>{atsResult.stats.hasEmail && atsResult.stats.hasPhone ? 'Contact OK' : 'Missing Info'}</span>
                </div>
              </div>

              {/* Card 2: Keywords */}
              <div className="p-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                    <Target className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-black text-gray-900 dark:text-white">
                    {atsResult.categoryScores.keywords.score} <span className="text-xs text-gray-400 font-normal">/ 35</span>
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Skills & Keywords</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Domain competency match</p>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full transition-all duration-700" style={{ width: `${atsResult.categoryScores.keywords.percent}%` }} />
                </div>
                <div className="text-[10px] text-gray-400 flex items-center justify-between">
                  <span>{atsResult.keywords.matched.length} Matched Skills</span>
                  <span>{atsResult.keywords.missing.length} Missing</span>
                </div>
              </div>

              {/* Card 3: Impact */}
              <div className="p-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                    <Zap className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-black text-gray-900 dark:text-white">
                    {atsResult.categoryScores.impact.score} <span className="text-xs text-gray-400 font-normal">/ 25</span>
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Action Verbs & Metrics</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Quantified measurable results</p>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-violet-600 h-full rounded-full transition-all duration-700" style={{ width: `${atsResult.categoryScores.impact.percent}%` }} />
                </div>
                <div className="text-[10px] text-gray-400 flex items-center justify-between">
                  <span>{atsResult.stats.powerVerbsCount} Power Verbs</span>
                  <span>{atsResult.stats.metricsCount} Metrics</span>
                </div>
              </div>

              {/* Card 4: Brevity */}
              <div className="p-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    <TrendingUp className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-sm font-black text-gray-900 dark:text-white">
                    {atsResult.categoryScores.brevity.score} <span className="text-xs text-gray-400 font-normal">/ 15</span>
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">Length & Clarity</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Word count & tone health</p>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-700" style={{ width: `${atsResult.categoryScores.brevity.percent}%` }} />
                </div>
                <div className="text-[10px] text-gray-400 flex items-center justify-between">
                  <span>{atsResult.stats.wordCount} Words</span>
                  <span>{atsResult.buzzwordsFound.length === 0 ? 'No Clichés' : `${atsResult.buzzwordsFound.length} Clichés`}</span>
                </div>
              </div>

            </div>

            {/* 3. KEYWORDS & MISSING SKILLS INSPECTOR */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Matched Keywords */}
              <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Matched Skills & Keywords ({atsResult.keywords.matched.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                    ATS Detected
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {atsResult.keywords.matched.length > 0 ? (
                    atsResult.keywords.matched.map((kw, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        {kw}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">No matching keywords found from target job.</p>
                  )}
                </div>
              </div>

              {/* Missing Keywords To Inject */}
              <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Missing High-Impact Keywords ({atsResult.keywords.missing.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                    Recommended to Add
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {atsResult.keywords.missing.length > 0 ? (
                    atsResult.keywords.missing.map((kw, i) => (
                      <button
                        key={i}
                        onClick={() => handleCopy(kw, `missing-${i}`)}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 hover:border-amber-400 transition cursor-pointer"
                        title="Click to copy keyword"
                      >
                        <span>+ {kw}</span>
                        {copiedItem === `missing-${i}` ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-gray-400" />
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-emerald-600 font-semibold">
                      Awesome! You have matched all required keywords in the target description.
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* 4. ACTIONABLE SUGGESTIONS & STRENGTHS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Actionable Suggestions */}
              <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-600" /> Actionable Fixes to Increase Score
                </h3>

                <div className="space-y-3">
                  {atsResult.suggestions.map((sug, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                        sug.type === 'high'
                          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50'
                          : 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white">
                        <span>{sug.title}</span>
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                          sug.type === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {sug.type} priority
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1.5">
                        {sug.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What You Did Well */}
              <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-800 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" /> Resume Strengths Detected
                </h3>

                <div className="space-y-3">
                  {atsResult.strengths.map((str, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                        {str}
                      </span>
                    </div>
                  ))}

                  {/* Power Verbs Badge List */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                      Power Action Verbs Identified ({atsResult.powerVerbs.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {atsResult.powerVerbs.map((v, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium">
                          ⚡ {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* =============================================================== */}
            {/* 5. INTERACTIVE AI BULLET POINT REWRITE STUDIO                   */}
            {/* =============================================================== */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-indigo-900 via-indigo-850 to-violet-900 rounded-3xl text-white shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-amber-300">
                  <Wand2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    AI Bullet Point Enhancer Studio
                  </h3>
                  <p className="text-xs text-indigo-200">
                    Paste any weak resume bullet point to transform it into high-impact, ATS-optimized metric statements
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={bulletInput}
                  onChange={(e) => setBulletInput(e.target.value)}
                  placeholder="e.g. Worked on backend APIs and helped fix database bugs..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 text-xs sm:text-sm focus:outline-none focus:border-amber-300 transition backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={handleEnhanceBullet}
                  disabled={isEnhancing}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isEnhancing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Transform Bullet
                </button>
              </div>

              {enhancedBullets.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Enhanced ATS Bullet Variants (Click to copy):
                  </h4>
                  {enhancedBullets.map((b, i) => (
                    <div
                      key={i}
                      onClick={() => handleCopy(b, `enhanced-${i}`)}
                      className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition flex items-start justify-between gap-4 text-xs sm:text-sm leading-relaxed"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-amber-300 font-bold mt-0.5">•</span>
                        <span>{b}</span>
                      </div>
                      <div className="flex-shrink-0">
                        {copiedItem === `enhanced-${i}` ? (
                          <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> Copied
                          </span>
                        ) : (
                          <Copy className="h-4 w-4 text-indigo-300 hover:text-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AtsChecker;
