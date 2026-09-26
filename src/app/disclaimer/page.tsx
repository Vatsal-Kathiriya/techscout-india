import React from 'react';
import Link from 'next/link';
import { AlertCircle, ShieldAlert, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Hardware & Pricing Disclaimer | GenzTech.in',
  description:
    'Legal disclaimer regarding Amazon India pricing fluctuations, hardware specification accuracy, and affiliate link tracking on GenzTech.in.',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 font-sans">
      
      {/* Header */}
      <header className="space-y-3 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block">
          Legal Notice // Compliance
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 dark:text-white tracking-tight">
          Disclaimer
        </h1>
        <p className="text-sm text-zinc-500 font-mono">
          Last Updated: September 2026
        </p>
      </header>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 p-5 rounded-xl text-xs text-amber-950 dark:text-amber-300 leading-relaxed flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold mb-0.5">Critical Amazon Pricing Notice:</strong>
          Product prices, coupon eligibility, and delivery schedules on Amazon.in change rapidly. GenzTech.in provides indicative prices and estimated discounts based on recent automated crawls. The exact price listed on Amazon.in at the time you confirm your order is the legal sale price.
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed space-y-8">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            1. Accuracy of Technical Specifications
          </h2>
          <p>
            While the editorial team at GenzTech.in exercises diligent research to verify processor models, battery capacities, display refresh rates, and sensor dimensions, manufacturers frequently release regional hardware revisions or firmware updates without advance notice.
          </p>
          <p>
            We strongly recommend cross-checking critical hardware compatibility (such as dual-SIM 5G band support or Thunderbolt port specifications) with the official manufacturer documentation before purchasing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            2. No Warranties or Guarantees
          </h2>
          <p>
            The content, comparison matrices, and buying guides published on GenzTech.in are provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis. GenzTech makes no representations or warranties of any kind, express or implied, regarding the completeness, accuracy, or suitability of the information contained on this website for any particular purpose.
          </p>
          <p>
            Any reliance you place on such information is strictly at your own risk. GenzTech.in shall not be liable for any hardware defects, shipping delays, or warranty claim rejections arising from purchases made through merchant links.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            3. External Merchant Links
          </h2>
          <p>
            Our website contains links to third-party merchant platforms (primarily Amazon.in). These external domains are operated by independent third parties. GenzTech has no control over the privacy practices, return policies, or transaction security of third-party platforms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            4. Trademarks &amp; Intellectual Property
          </h2>
          <p>
            All product names, logos, trademarks, and registered trademarks featured on this site are property of their respective owners. Amazon, the Amazon logo, and Amazon.in are trademarks of Amazon.com, Inc. or its affiliates. Their mention on GenzTech.in does not imply endorsement or direct partnership.
          </p>
        </section>

        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
          <Link href="/affiliate-disclosure" className="text-emerald-600 hover:underline flex items-center gap-1 font-bold">
            Read Affiliate Disclosure <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link href="/privacy-policy" className="text-zinc-500 hover:underline">
            Privacy Policy
          </Link>
        </div>

      </div>

    </div>
  );
}
