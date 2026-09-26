import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Info, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Amazon Affiliate Disclosure Policy | GenzTech.in',
  description:
    'Full transparency policy regarding our participation in the Amazon Associates Program. Learn how GenzTech.in operates as an independent review publisher.',
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 font-sans">
      
      {/* Header */}
      <header className="space-y-3 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block">
          Legal &amp; Policy // Compliance
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 dark:text-white tracking-tight">
          Amazon Affiliate Disclosure
        </h1>
        <p className="text-sm text-zinc-500 font-mono">
          Last Updated: September 2026 • Effective Date: January 1, 2026
        </p>
      </header>

      {/* Mandatory Amazon Associates Statement Callout Box */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-600 p-6 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Mandatory Operating Agreement Disclosure</span>
        </div>
        <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-relaxed">
          &ldquo;GenzTech.in is a participant in the Amazon Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in.&rdquo;
        </p>
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          &ldquo;As an Amazon Associate, GenzTech.in earns from qualifying purchases.&rdquo;
        </p>
      </div>

      {/* Comprehensive Narrative Breakdown */}
      <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed space-y-8">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            1. What Is an Affiliate Link?
          </h2>
          <p>
            Throughout our platform, you will encounter buttons and links marked <strong>&ldquo;View on Amazon&rdquo;</strong>, <strong>&ldquo;Check Latest Price &amp; Offers on Amazon.in&rdquo;</strong>, or <strong>&ldquo;[ Proceed to Amazon.in ]&rdquo;</strong>. These links contain an encoded tracking parameter (specifically associated with our Amazon Associate Store ID: <code>genztech019-21</code>).
          </p>
          <p>
            When you click on one of these links and complete a qualifying purchase on Amazon.in, Amazon pays GenzTech.in a small referral fee (typically ranging from 1% to 8% depending on the specific product category).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            2. Does This Cost You Extra?
          </h2>
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1">
            <span className="font-bold text-emerald-600 block">
              Absolute Transparency Guarantee:
            </span>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              <strong>No, never.</strong> The retail price you pay on Amazon.in is 100% identical whether you purchase through our links, search directly on Amazon, or click through another source. Any promotional bank discounts, lightning coupons, or exchange bonuses remain fully applicable to your checkout cart.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            3. Editorial Independence &amp; Scoring Integrity
          </h2>
          <p>
            Our product scoring, benchmark verdicts, and hardware comparisons are conducted with complete editorial independence. We do not accept monetary compensation or sponsored gifts from brands to artificially inflate our GenzTech Spec Score.
          </p>
          <p>
            If a flagship smartphone has disappointing camera low-light performance or a gaming laptop throttles its GPU wattage, our review will explicitly document it—regardless of whether the product is available on Amazon.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            4. Dynamic Pricing &amp; Stock Availability
          </h2>
          <p>
            Product prices and availability on Amazon.in fluctuate continuously based on merchant inventories, lightning deals, and currency values. While our servers run automated verification routines, the live price displayed on Amazon.in at the moment of checkout always takes legal precedence over any indicative price displayed on our platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            5. Trademarks
          </h2>
          <p>
            Amazon, the Amazon logo, Amazon Prime, and all related marks are trademarks of Amazon.com, Inc. or its affiliates.
          </p>
        </section>

        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
          <Link href="/disclaimer" className="text-emerald-600 hover:underline flex items-center gap-1 font-bold">
            Read Product Disclaimer <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link href="/privacy-policy" className="text-zinc-500 hover:underline">
            Privacy Policy
          </Link>
        </div>

      </div>

    </div>
  );
}
