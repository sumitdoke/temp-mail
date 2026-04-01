import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import CookieBanner from './components/CookieBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TempMail.in — Free Disposable Email India',
  description: 'Get instant free temporary email address. No signup required. Auto-deletes in 24 hours. Made for India.',
  keywords: [
    'temp mail',
    'temporary email',
    'disposable email',
    'fake email india',
    'temp mail india',
    'free temp mail'
  ],
  authors: [{ name: 'TempMail.in' }],
  creator: 'TempMail.in',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'TempMail.in — Free Disposable Email India',
    description: 'Get instant free temporary email. No signup. Auto-deletes in 24hrs.',
    url: 'https://tempmailin-psi.vercel.app',
    siteName: 'TempMail.in',
    locale: 'en_IN',
    type: 'website',
  },
  verification: {
    google: '<meta name="google-site-verification" content="tIxniIalpM8zh3gPCVsBQrqc4vhxFrMEaE4YBDA8rBc" />'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}