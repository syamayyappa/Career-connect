import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Sparkles, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-12 dark:border-slate-800/80 dark:bg-slate-950/80 transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-850">
          
          {/* Brand & Mission */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/20">
              <Briefcase className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                  Career<span className="text-indigo-600">Connect</span>
                </span>
                <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-extrabold text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider border border-indigo-200/60 dark:border-indigo-800/60">
                  AI ATS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Deterministic skill matching & intelligent recruitment infrastructure.
              </p>
            </div>
          </div>

          {/* System Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ATS Engine & API: Fully Operational</span>
          </div>
        </div>

        {/* Links & Legal */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-400 dark:text-slate-500 font-medium text-center sm:text-left">
            &copy; {new Date().getFullYear()} CareerConnect AI Inc. Engineered with modern precision.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold text-slate-600 dark:text-slate-400">
            <Link to="/jobs" className="hover:text-indigo-600 transition">Job Directory</Link>
            <Link to="/ats-checker" className="hover:text-indigo-600 transition flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-indigo-500" /> ATS Checker
            </Link>
            <Link to="/about" className="hover:text-indigo-600 transition">About</Link>
            <Link to="/contact" className="hover:text-indigo-600 transition">Contact & Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
