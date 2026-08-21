import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-gray-50/30 dark:bg-gray-950/10 min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Get in Touch</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Have questions about our AI-assisted job matching scoring or encounter a technical bug? We'd love to hear from you. Fill out the form or reach out directly.
          </p>

          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase">Email Us</div>
                <div className="text-sm font-semibold">support@careerconnect.ai</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase">Call Us</div>
                <div className="text-sm font-semibold">+1 (555) 019-2834</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase">Our Office</div>
                <div className="text-sm font-semibold">100 Tech Square, Suite 400, SF, CA</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          {submitted ? (
            <div className="h-full flex flex-col justify-center items-center text-center p-6 bg-indigo-50/50 dark:bg-indigo-950/10 rounded-2xl border border-indigo-100/50">
              <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Send className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Message Sent!</h3>
              <p className="text-sm text-gray-500 mt-1">Thank you for reaching out. We will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 transition"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 transition"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 transition"
                  placeholder="Tell us what you'd like to discuss..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
