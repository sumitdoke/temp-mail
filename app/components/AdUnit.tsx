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

    setTimeout(() => {
      // Set options directly on window
      (window as any).atOptions = {
        key: adKey,
        format: 'iframe',
        height: height,
        width: width,
        params: {}
      };

      // Load invoke script
      const script = document.createElement('script');
      script.src = 'https://www.highperformanceformat.com/' 
        + adKey + '/invoke.js';
      script.async = true;
      script.onerror = () => console.log('Ad blocked');

      if (ref.current) {
        ref.current.appendChild(script);
      }
    }, 1000);

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