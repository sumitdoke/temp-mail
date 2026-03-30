'use client';
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookies-accepted');
    if (!accepted) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50
      bg-gray-900 border-t border-gray-700 px-4 py-4">
      <div className="max-w-2xl mx-auto flex items-center
        justify-between gap-4 flex-wrap">
        <p className="text-gray-300 text-sm">
          🍪 We use essential cookies only to keep
          this service running. No tracking. No ads cookies.
        </p>
        <button
          onClick={accept}
          className="bg-blue-600 hover:bg-blue-700
            text-white px-4 py-2 rounded-lg text-sm
            font-medium whitespace-nowrap transition-all"
        >
          Got it ✓
        </button>
      </div>
    </div>
  );
}
