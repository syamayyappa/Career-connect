const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-10 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
              CareerConnect<span className="text-blue-600">.</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} CareerConnect AI Inc. All rights reserved.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <a href="/about" className="hover:text-blue-600 transition">About</a>
            <a href="/contact" className="hover:text-blue-600 transition">Contact Support</a>
            <a href="#" className="hover:text-blue-600 transition">Privacy Notice</a>
            <a href="#" className="hover:text-blue-600 transition">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
