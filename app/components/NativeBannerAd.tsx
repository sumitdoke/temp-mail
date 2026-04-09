'use client';
import { useEffect, useRef } from 'react';

export default function NativeBannerAd() {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const script = document.createElement('script');
    script.src = 'https://pl29096623.profitablecpmratenetwork.com/363db0065e45178cfa21464d3889b752/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');

    if (ref.current) {
      ref.current.appendChild(script);
    }
  }, []);

  return (
    <div className="my-4">
      <div
        id="container-363db0065e45178cfa21464d3889b752"
        ref={ref}
      />
    </div>
  );
}