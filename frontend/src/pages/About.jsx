import React from 'react';
import { Award, ShieldCheck, Compass } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-gray-50/30 dark:bg-gray-950/10 min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          About CareerConnect AI
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto mb-16 leading-relaxed">
          CareerConnect AI is a modern job portal and applicant tracking platform powered by explainable skill-matching algorithms. Our mission is to bridge candidates and employers with transparency, simplicity, and efficiency.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 mb-6">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Our Vision</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Eliminate application spam and recruiter fatigue by providing explicit match recommendations on job postings.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 mb-6">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Quality Matches</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Empower recruiters to instantly filter candidates based on standardized skill intersection lists.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 mb-6">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Secure & Transparent</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Protect resumes and user credentials using state of the art JWT auth and cryptographic hashing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
