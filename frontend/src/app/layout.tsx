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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'YOUR_GOOGLE_VERIFICATION_TOKEN',
  },
};

// JSON-LD Structured Data Schema for Google Search Console & Google Business Profile (LocalBusiness / Organization)
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'ApexGrowth',
  alternateName: 'ApexGrowth Technologies',
  description:
    'Accelerate your revenue engine with ApexGrowth. Enterprise-grade demand generation, bespoke sales funnels, and automated lead qualification.',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/og-image.png`,
  telephone: '+1-555-234-5678',
  email: 'contact@apexgrowth.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '100 Montgomery St, Suite 1800',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    postalCode: '94104',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 37.7912,
    longitude: -122.4021,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  sameAs: [
    'https://twitter.com/apexgrowth',
    'https://www.linkedin.com/company/apexgrowth',
    'https://maps.google.com/?cid=YOUR_GOOGLE_BUSINESS_CID',
  ],
  priceRange: '$$$$',
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
        {/* Google Business Profile & Rich Snippets JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeRegistry>
          <AuthProvider>{children}</AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
