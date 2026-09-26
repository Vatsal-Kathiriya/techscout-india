import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, Eye, Lock, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy & Cookies | GenzTech.in',
  description:
    'Comprehensive data privacy policy, cookies disclosure, and third-party affiliate tracking transparency for GenzTech.in visitors.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 font-sans">
      
      {/* Header */}
      <header className="space-y-3 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block">
          Legal &amp; Policy // GenzTech.in
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-zinc-500 font-mono">
          Last Updated: September 2026 • Compliant with Indian IT Act 2000 &amp; Global Standards
        </p>
      </header>

      <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed space-y-8">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            1. Overview &amp; Commitment to Privacy
          </h2>
          <p>
            At <strong>GenzTech.in</strong>, accessible from <code>https://genz-tech.in</code>, the privacy of our visitors is of paramount importance. This Privacy Policy documents the types of information that are collected and recorded by GenzTech and how we utilize it.
          </p>
          <p>
            We do not sell, rent, or trade your personally identifiable information to marketing brokers. We collect only what is strictly required to provide our device comparison tools and respond to your direct inquiries.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Cookie className="w-5 h-5 text-emerald-600" />
            2. Cookies &amp; Third-Party Affiliate Tracking
          </h2>
          <p>
            GenzTech.in uses standard HTTP cookies to store information including visitor preferences and the pages on the website that the visitor accessed. This optimizes the user experience by customizing web page content based on browser configuration.
          </p>
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
            <strong className="text-xs font-mono uppercase text-emerald-600 block">
              Amazon Associates Tracking Cookie Disclosure:
            </strong>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              When you click on an external link pointing to <code>Amazon.in</code> via our platform, Amazon installs a tracking cookie on your device. This cookie typically possesses a standard 24-hour expiration window. It identifies GenzTech as the referrer so that qualifying purchases can be attributed to our Amazon Associates account (Store ID: <code>genztech019-21</code>). GenzTech never receives your credit card details, physical address, or account login credentials from Amazon.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-600" />
            3. Log Files &amp; Web Analytics
          </h2>
          <p>
            GenzTech follows a standard procedure of utilizing log files. These files log visitors when they navigate the platform. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and click counts. These are not linked to any information that is personally identifiable. The purpose of this telemetry is for analyzing site performance, preventing DDoS abuse, and administering the comparison platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            4. Direct Inquiries &amp; Newsletter Subscriptions
          </h2>
          <p>
            If you contact our editorial team via our Contact page or opt-in to festive deal price drop alerts, your email address is used solely to reply to your inquiry or dispatch verified deal digests. You may unsubscribe at any time by clicking the opt-out link in any email transmission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            5. User Rights Under Data Protection Laws
          </h2>
          <p>
            You are entitled to request copies of any personal data we hold, request rectification of any inaccurate information, or request the deletion of your contact correspondence. To exercise any of these rights, please email us directly at <code>privacy@genztech.in</code>.
          </p>
        </section>

        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
          <Link href="/affiliate-disclosure" className="text-emerald-600 hover:underline flex items-center gap-1 font-bold">
            Read Affiliate Disclosure <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link href="/disclaimer" className="text-zinc-500 hover:underline">
            Hardware Disclaimer
          </Link>
        </div>

      </div>

    </div>
  );
}
