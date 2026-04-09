'use client';
import { useEffect, useRef } from 'react';

interface AdUnitProps {
  adKey: string;
  height: number;
  width: number;
  uniqueId: string;
}

export default function AdUnit({
  adKey,
  height,
  width,
  uniqueId
}: AdUnitProps) {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    if (!ref.current) return;
    loaded.current = true;

    // Different delay for each ad!
    const delay = uniqueId.includes('2') ? 2000 : 1000;

    setTimeout(() => {
      (window as any).atOptions = {
        key: adKey,
        format: 'iframe',
        height: height,
        width: width,
        params: {}
      };

      const script = document.createElement('script');
      script.src = 'https://www.highperformanceformat.com/'
        + adKey + '/invoke.js';
      script.async = true;

      if (ref.current) {
        ref.current.appendChild(script);
      }
    }, delay);

  }, [adKey, height, width, uniqueId]);

  return (
    <div
      id={'ad-' + uniqueId}
      ref={ref}
      className="flex justify-center my-4"
      style={{
        minHeight: height + 'px',
        width: '100%',
        overflow: 'hidden'
      }}
    />
  );
}