import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,

  // ─────────────────────────────
  // 🔁 REDIRECTS (SEO FIX)
  // ─────────────────────────────
  async redirects() {
    return [

      // 🔥 Instagram cluster → main page
      {
        source: '/temp-mail-for-instagram-india-1775318012520',
        destination: '/temp-mail-for-instagram-india',
        permanent: true,
      },
      {
        source: '/temp-mail-multiple-instagram-accounts',
        destination: '/temp-mail-for-instagram-india',
        permanent: true,
      },
      {
        source: '/multiple-instagram-accounts-india',
        destination: '/temp-mail-for-instagram-india',
        permanent: true,
      },
      {
        source: '/temp-mail-instagram-verification-india',
        destination: '/temp-mail-for-instagram-india',
        permanent: true,
      },
      {
        source: '/instagram-verification-temp-mail-india',
        destination: '/temp-mail-for-instagram-india',
        permanent: true,
      },
      {
        source: '/instagram-reels-temp-mail-india',
        destination: '/temp-mail-for-instagram-india',
        permanent: true,
      },
      {
        source: '/temp-mail-instagram-reels-india-2026',
        destination: '/temp-mail-for-instagram-india',
        permanent: true,
      },
      {
        source: '/fake-email-instagram-signup-india',
        destination: '/temp-mail-for-instagram-india',
        permanent: true,
      },
      {
        source: '/instagram-signup-india-temp-email',
        destination: '/temp-mail-for-instagram-india',
        permanent: true,
      },
      {
        source: '/instagram-disposable-email-india-free',
        destination: '/temp-mail-for-instagram-india',
        permanent: true,
      },
      {
        source: '/instagram-business-temp-mail-india',
        destination: '/temp-mail-for-instagram-india',
        permanent: true,
      },

      // 🇺🇸 USA duplicates (SAFE ONLY)
      {
        source: '/temp-mail-usa-no-registration',
        destination: '/temp-mail-no-registration-usa',
        permanent: true,
      },
      {
        source: '/fake-email-generator-usa-tempmailin',
        destination: '/fake-email-generator-usa-2026',
        permanent: true,
      },
      {
        source: '/temp-mail-netflix-usa-free',
        destination: '/temp-mail-for-netflix-usa',
        permanent: true,
      },
      {
        source: '/throwaway-email-usa-instant-tempmailin',
        destination: '/throwaway-email-address-usa',
        permanent: true,
      },
      {
        source: '/burner-email-usa-temp-mail-india',
        destination: '/burner-email-usa-free-tempmailin',
        permanent: true,
      },
      {
        source: '/disposable-email-for-amazon-usa',
        destination: '/temp-mail-for-amazon-usa-shopping',
        permanent: true,
      },

      // 🇬🇧 UK cleanup
      {
        source: '/fake-email-uk-free',
        destination: '/temporary-email-address-uk',
        permanent: true,
      },
      {
        source: '/disposable-email-uk-no-signup-tempmailin',
        destination: '/temporary-email-address-uk',
        permanent: true,
      },
      {
        source: '/temp-mail-uk-free-2026',
        destination: '/temporary-email-address-uk',
        permanent: true,
      },
      {
        source: '/temporary-email-uk-free-instant',
        destination: '/temporary-email-address-uk',
        permanent: true,
      },

      // 🌍 Europe (light merge)
      {
        source: '/temp-mail-france-free',
        destination: '/best-temp-mail-europe-2026',
        permanent: true,
      },

      // 🇮🇳 India deleted pages → OTP page
      {
        source: '/temp-mail-swiggy-india-secure-anonymous',
        destination: '/disposable-email-otp-india',
        permanent: true,
      },
      {
        source: '/temp-mail-for-meesho-india-privacy-security',
        destination: '/disposable-email-otp-india',
        permanent: true,
      },
      {
        source: '/temp-mail-for-zomato-india-zomato-ke-liye-temporary-email',
        destination: '/disposable-email-otp-india',
        permanent: true,
      },
      {
        source: '/temp-mail-for-jiocinema-india',
        destination: '/disposable-email-otp-india',
        permanent: true,
      },
      {
        source: '/temp-mail-cred-india',
        destination: '/disposable-email-otp-india',
        permanent: true,
      },
      {
        source: '/temp-mail-for-rapido-india',
        destination: '/disposable-email-otp-india',
        permanent: true,
      },
      {
        source: '/temp-mail-myntra-india',
        destination: '/disposable-email-otp-india',
        permanent: true,
      },
      {
        source: '/temp-mail-phonepe-india',
        destination: '/disposable-email-otp-india',
        permanent: true,
      },
      {
        source: '/temp-mail-gpay-india-privacy-security',
        destination: '/disposable-email-otp-india',
        permanent: true,
      },
      {
        source: '/temp-mail-blinkit-india',
        destination: '/disposable-email-otp-india',
        permanent: true,
      },

    ];
  },

  // ─────────────────────────────
  // 🔐 HEADERS (UNCHANGED + GOOD)
  // ─────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ]
      },
      {
        source: '/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400'
          }
        ]
      }
    ];
  }
};

export default nextConfig;