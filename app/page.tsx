import { Metadata } from 'next';
import HomeClient from './HomeClient';

// ─────────────────────────────
// ✅ METADATA (SEO + CTR)
// ─────────────────────────────
export const metadata: Metadata = {
  title: 'Free Temp Mail India (No Signup) 🔥 Instant OTP Email — 2026',
  description:
    'Get free temp mail India instantly. No signup. Works for Paytm, Instagram, Flipkart. Receive OTP in seconds. Auto-delete in 24h.',
  keywords: [
    'temp mail india',
    'free temp mail india',
    'temporary email india',
    'disposable email india',
    'temp mail otp india',
    'fake email india',
    'temp mail for instagram india',
    'temp mail paytm otp'
  ],
  alternates: {
    canonical: 'https://tempmailin-psi.vercel.app',
  },
  openGraph: {
    title: 'Free Temp Mail India 🔥 Instant OTP Email (No Signup)',
    description:
      'Instant disposable email for India. No signup. OTP ready in seconds.',
    url: 'https://tempmailin-psi.vercel.app',
    siteName: 'TempMailin.in',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Temp Mail India — Instant Disposable Email',
    description:
      'Free temporary email in India. No signup. Auto-deletes in 24hrs.',
  },
};

// ─────────────────────────────
// ✅ SCHEMA (ENTITY SIGNALS)
// ─────────────────────────────
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TempMailin.in",
  "url": "https://tempmailin-psi.vercel.app",
  "description": "Free disposable temporary email service for India",
  "foundingDate": "2026",
  "areaServed": "IN",
  "serviceType": "Disposable Email Service"
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "TempMailin.in",
  "url": "https://tempmailin-psi.vercel.app",
  "description": "Free temporary email service for India. Instant OTP, no signup.",
  "inLanguage": "en-IN",
  "publisher": {
    "@type": "Organization",
    "name": "TempMailin.in"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://tempmailin-psi.vercel.app/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

// ─────────────────────────────
// ✅ PAGE COMPONENT
// ─────────────────────────────
export default function Home() {
  return (
    <>
      {/* 🔥 JSON-LD SCHEMA INJECTION */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([orgSchema, websiteSchema])
        }}
      />

      <HomeClient />
    </>
  );
}