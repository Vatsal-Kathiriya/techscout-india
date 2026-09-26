import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ComparisonProvider } from '@/context/ComparisonContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComparisonDrawer from '@/components/ComparisonDrawer';

export const metadata: Metadata = {
  title: {
    default: 'GenzTech.in | Smart Tech. Better Choices.',
    template: '%s | GenzTech.in',
  },
  description:
    'Discover useful technology, compare products and find smarter buying options on Amazon India. Authoritative hardware specs, benchmarks and verified festive deals.',
  keywords: [
    'Amazon affiliate tech',
    'laptop comparisons India',
    'best 5G smartphones',
    'ANC headphones reviews',
    'GenzTech India',
    'smart tech reviews',
    'Great Indian Festival deals',
  ],
  authors: [{ name: 'GenzTech Editorial Lab' }],
  creator: 'GenzTech.in',
  publisher: 'GenzTech.in',
  metadataBase: new URL('https://genz-tech.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'GenzTech.in | Smart Tech. Better Choices.',
    description:
      'Discover useful technology, compare products and find smarter buying options with GenzTech India.',
    url: 'https://genz-tech.in',
    siteName: 'GenzTech.in',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GenzTech.in | Smart Tech. Better Choices.',
    description:
      'Discover useful technology, compare products and find smarter buying options on Amazon India.',
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
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://genz-tech.in/#organization',
      name: 'GenzTech.in',
      url: 'https://genz-tech.in',
      logo: 'https://genz-tech.in/favicon.svg',
      description:
        'Smart Tech. Better Choices. Independent hardware benchmarks, comparison matrix, and Amazon India affiliate price tracking.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://genz-tech.in/#website',
      url: 'https://genz-tech.in',
      name: 'GenzTech.in',
      publisher: {
        '@id': 'https://genz-tech.in/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://genz-tech.in/products?q={search_term_string}',
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
