import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'TempMail.in — Free Disposable Email India 2026',
  description: 'Get instant free temporary email address instantly. No signup required. Auto-deletes in 24 hours. Works for Swiggy, Zomato, Instagram and more. Made for India.',
  keywords: [
    'temp mail',
    'temporary email', 
    'disposable email india',
    'fake email india',
    'temp mail india 2026'
  ],
  alternates: {
    canonical: 'https://tempmailin-psi.vercel.app'
  },
  openGraph: {
    title: 'TempMail.in — Free Disposable Email India',
    description: 'Instant disposable email. No signup. Auto-deletes in 24hrs.',
    url: 'https://tempmailin-psi.vercel.app',
    siteName: 'TempMailin.in',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TempMail.in — Free Disposable Email India',
    description: 'Instant disposable email. No signup. Auto-deletes in 24hrs.',
  }
};

export default function Home() {
  return <HomeClient />;
}