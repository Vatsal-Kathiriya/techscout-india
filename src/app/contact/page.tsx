'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Clock, MapPin, CheckCircle2, Send, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'editorial',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', topic: 'editorial', message: '' });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 font-sans">
      
      {/* Header */}
      <header className="space-y-3 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block">
          Editorial &amp; Business Inquiry // GenzTech.in
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 dark:text-white tracking-tight">
          Contact Editorial Lab
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
          Have a question regarding our hardware testing methodology, found a pricing discrepancy, or interested in a business inquiry? Reach out directly.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Contact Info (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-6">
            
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-zinc-400">Direct Email</h3>
                <a href="mailto:editorial@genztech.in" className="text-sm font-bold text-zinc-900 dark:text-white hover:text-emerald-600 transition-colors">
                  editorial@genztech.in
                </a>
                <p className="text-[11px] text-zinc-500 mt-0.5">Response turnaround within 24 to 48 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-zinc-400">Testing Lab Hours</h3>
                <p className="text-xs font-bold text-zinc-900 dark:text-white">Monday – Friday: 10:00 AM – 7:00 PM IST</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Automated Amazon price crawlers run 24/7</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-zinc-400">Research Bureau</h3>
                <p className="text-xs font-bold text-zinc-900 dark:text-white">GenzTech Consumer Media Lab</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Bengaluru &amp; Mumbai, India</p>
              </div>
            </div>

          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 p-5 rounded-xl text-xs text-emerald-950 dark:text-emerald-300 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Note on Sponsored Reviews:
            </span>
            <p className="text-[11px] leading-relaxed">
              We decline all requests for paid editorial scoring or embargoed biased write-ups. Devices are evaluated strictly according to our transparent testing criteria.
            </p>
          </div>
        </div>

        {/* Validated Contact Form (7 cols) */}
        <div className="md:col-span-7 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Message Dispatched Successfully
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                Thank you for contacting GenzTech.in. An engineering reviewer or editorial team member will respond to your inquiry shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-xl text-xs font-bold font-mono uppercase"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Dispatch an Inquiry
              </h2>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikramaditya Sen"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@organization.com"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Inquiry Topic
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="editorial">Editorial Question / Spec Correction</option>
                  <option value="deal">Price Discrepancy / Broken Amazon Link</option>
                  <option value="business">Business / Press Inquiries</option>
                  <option value="general">General Feedback</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  Message Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your hardware inquiry or provide the relevant ASIN/device title..."
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider font-mono rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Transmitting...' : 'Dispatch Message'}</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
