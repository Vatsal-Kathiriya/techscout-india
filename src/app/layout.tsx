import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ComparisonProvider } from '@/context/ComparisonContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComparisonDrawer from '@/components/ComparisonDrawer';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://genz-tech.in';

export const metadata: Metadata = {
  title: {
    default: 'GenzTech.in | Smart Tech. Better Choices.',
    template: '%s | GenzTech.in',
  },
  description:
    'Discover useful technology, compare products and find smarter buying options on Amazon India. Authoritative hardware specs, benchmarks and verified festive deals.',
  keywords: [
    'best smartphones under 20000 India',
    'best laptops under 50000',
    'best gaming laptop India 2026',
    'best earbuds under 5000',
    'best ANC headphones India',
    'smartwatch comparison India',
    'Amazon affiliate tech India',
    'laptop comparisons India',
    'best 5G smartphones 2026',
    'ANC headphones reviews',
    'GenzTech India',
    'smart tech reviews',
    'Great Indian Festival deals',
    'Amazon India tech deals',
    'best tech gadgets India',
    'phone comparison tool India',
    'gaming accessories India',
    'best wireless earbuds India',
    'budget smartphones India 2026',
    'flagship phone comparison',
  ],
  authors: [{ name: 'GenzTech Editorial Lab' }],
  creator: 'GenzTech.in',
  publisher: 'GenzTech.in',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'GenzTech.in | Smart Tech. Better Choices.',
    description:
      'Discover useful technology, compare products and find smarter buying options with GenzTech India.',
    url: siteUrl,
    siteName: 'GenzTech.in',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GenzTech.in | Smart Tech. Better Choices.',
    description:
      'Discover useful technology, compare products and find smarter buying options on Amazon India.',
    site: '@genztech_in',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  other: {
    'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-4413078926879014',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'GenzTech.in',
      url: siteUrl,
      logo: `${siteUrl}/favicon.svg`,
      description:
        'Smart Tech. Better Choices. Independent hardware benchmarks, comparison matrix, and Amazon India affiliate price tracking.',
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'GenzTech.in',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/products?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="font-sans bg-[#FAFAFA] dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 flex flex-col min-h-screen transition-colors duration-300 antialiased"
      >
        {/* Google AdSense — active with publisher ID */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-4413078926879014'}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ComparisonProvider>
            {/* Amazon-Grade 3-Tier Header */}
            <Header />

            {/* Main Page Area */}
            <main className="flex-1 w-full">{children}</main>

            {/* Sticky Interactive Comparison Drawer */}
            <ComparisonDrawer />

            {/* Multi-Column Amazon-Style Footer */}
            <Footer />
          </ComparisonProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
