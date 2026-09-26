import React from 'react';
import Link from 'next/link';
import { getGuidesFromDb } from '@/lib/dbService';
import { BookOpen, Clock, User, ArrowRight, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Hardware Buying Guides & Engineering Breakdowns | GenzTech.in',
  description:
    'Independent tech buying guides, GPU TGP benchmarks, camera sensor physics, and active noise cancellation explanations from GenzTech India.',
  alternates: {
    canonical: '/guides',
  },
  openGraph: {
    title: 'Hardware Buying Guides & Engineering Breakdowns | GenzTech.in',
    description:
      'Independent tech buying guides, GPU TGP benchmarks, camera sensor physics, and active noise cancellation explanations from GenzTech India.',
    url: 'https://genz-tech.in/guides',
    type: 'website',
  },
};

export default async function GuidesPage() {
  const guides = await getGuidesFromDb();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      
      {/* Header */}
      <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Independent Technical Journalism</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
          Hardware Buying Guides &amp; Deep-Dives
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-2xl">
          We explain the engineering beneath specifications—so you buy what truly fits your workflow rather than marketing buzzwords.
        </p>
      </div>

      {/* Compliance / Methodology Notice */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl text-xs text-emerald-950 dark:text-emerald-300 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Editorial Independence Guarantee:</strong>
          GenzTech.in maintains strict editorial independence. We do not accept paid manufacturer placements. When readers click through our Amazon.in affiliate links, we earn a commission that funds our hardware testing equipment.
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {guides.map((guide) => (
          <article
            key={guide._id}
            className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-600 hover:shadow-xl transition-all flex flex-col group"
          >
            <Link href={`/guides/${guide.slug}`} className="block h-56 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={guide.heroImage}
                alt={guide.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-zinc-950/80 text-white backdrop-blur-xs">
                {guide.category}
              </span>
            </Link>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {guide.readTime}
                  </span>
                  <span>•</span>
                  <span>{new Date(guide.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <Link href={`/guides/${guide.slug}`}>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 transition-colors leading-snug">
                    {guide.title}
                  </h2>
                </Link>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                  {guide.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                    <User className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 block leading-tight">
                      {guide.author}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {guide.authorRole}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/guides/${guide.slug}`}
                  className="font-bold text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-mono uppercase text-xs"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}
