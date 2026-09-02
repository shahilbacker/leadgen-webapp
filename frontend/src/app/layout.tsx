import type { Metadata } from 'next';
import ThemeRegistry from '../theme/ThemeRegistry';
import { AuthProvider } from '../context/AuthContext';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ApexGrowth | High-Performance Enterprise Growth & Lead Generation',
    template: '%s | ApexGrowth',
  },
  description:
    'Accelerate your revenue engine with ApexGrowth. Enterprise-grade demand generation, bespoke sales funnels, and automated qualification tailored for high-growth B2B companies.',
  keywords: [
    'lead generation',
    'B2B growth',
    'demand generation',
    'sales funnels',
    'revenue operations',
    'enterprise marketing',
    'customer acquisition',
  ],
  authors: [{ name: 'ApexGrowth Team' }],
  creator: 'ApexGrowth Solutions',
  publisher: 'ApexGrowth Solutions',
  formatDetection: {
    email: true,
    address: false,
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'ApexGrowth Lead Engine',
    title: 'ApexGrowth | High-Performance Enterprise Growth & Lead Generation',
    description:
      'Turn high-intent prospects into contracted revenue with precision demand gen and intelligent lead scoring pipelines.',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'ApexGrowth Enterprise Lead Generation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ApexGrowth | Enterprise Lead Engine',
    description: 'Turn high-intent prospects into contracted revenue with precision demand gen.',
    images: [`${SITE_URL}/og-image.png`],
    creator: '@apexgrowth',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>
        <ThemeRegistry>
          <AuthProvider>{children}</AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
