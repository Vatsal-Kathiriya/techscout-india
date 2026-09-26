import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Cpu,
  Target,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'About Us & Editorial Standards | GenzTech.in',
  description:
    'Discover our mission: Smart Tech. Better Choices. Learn how GenzTech tests, benchmarks, and independently reviews electronics in India.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 font-sans">
      
      {/* Header */}
      <header className="space-y-3 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block">
          Platform Mission // GenzTech.in
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 dark:text-white tracking-tight">
          Smart Tech. Better Choices.
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
          India&apos;s independent consumer hardware testing and comparison platform. We cut through marketing hype to deliver laboratory-grade telemetry and transparent purchasing advice.
        </p>
      </header>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            100% Editorial Independence
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            We never accept paid sponsored product placements from manufacturers. Devices earn their score strictly based on objective test metrics.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            Hardware Telemetry
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            We test sustained GPU TGP wattage, thermal throttling, real battery drain, and acoustic frequency response curves.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            Verified Amazon Pricing
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Every product card connects to live Amazon.in inventory with timestamped price verification to prevent misleading deals.
          </p>
        </div>
      </div>

      {/* Main Narrative Section */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 space-y-6 shadow-xs leading-relaxed text-sm text-zinc-700 dark:text-zinc-300">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Why GenzTech Was Founded
        </h2>
        <p>
          The consumer electronics market in India has become saturated with paid influencer content, deceptive spec sheets, and unverified &ldquo;deals.&rdquo; Consumers are routinely sold 45W restricted gaming laptops under the guise of flagship silicon or cheap audio drivers tuned with bloated bass to hide missing acoustic clarity.
        </p>
        <p>
          At <strong>GenzTech.in</strong>, our mission is simple: provide honest, engineering-grounded buying advice. When we review a smartphone, we measure sensor surface area and shutter latency. When we test ANC headphones, we graph acoustic phase cancellation across subway and flight frequencies.
        </p>

        <h3 className="text-base font-bold text-zinc-900 dark:text-white pt-4 border-t border-zinc-100 dark:border-zinc-800">
          How We Fund Our Lab Work
        </h3>
        <p>
          To maintain zero obligations to hardware manufacturers, GenzTech is reader-supported through the <strong>Amazon Associates Program</strong>. When you decide to purchase a product through one of our curated links, Amazon pays us a small affiliate referral fee at zero additional cost to you. This funds our test instruments and full-time engineering researchers.
        </p>

        <div className="pt-4 flex flex-wrap items-center gap-4">
          <Link
            href="/affiliate-disclosure"
            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 font-mono uppercase"
          >
            Read Our Full Affiliate Disclosure Policy <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/contact"
            className="text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:underline flex items-center gap-1 font-mono uppercase"
          >
            Contact Editorial Team <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
