'use client';
import { useEffect, useRef } from 'react';

interface AdUnitProps {
  adKey: string;
  height: number;
  width: number;
}

export default function AdUnit({
  adKey,
  height,
  width
}: AdUnitProps) {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    // Set ad options
    (window as any).atOptions = {
      'key': adKey,
      'format': 'iframe',
      'height': height,
      'width': width,
      'params': {}
    };

    // Load ad script
    const script = document.createElement('script');
    script.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    script.async = true;

    if (ref.current) {
      ref.current.appendChild(script);
    }
  }, [adKey, height, width]);

  return (
    <div
      ref={ref}
      className="flex justify-center my-4"
      style={{ minHeight: height }}
    />
  );
}