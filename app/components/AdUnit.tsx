'use client';
import { useEffect, useRef } from 'react';

interface AdUnitProps {
  adKey: string;
  height: number;
  width: number;
  uniqueId: string; // ← Add this!
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
    loaded.current = true;

    const container = document.createElement('div');
    container.id = `ad-container-${uniqueId}`;
    
    // Create inline script for options
    const optionsScript = document.createElement('script');
    optionsScript.innerHTML = `
      var atOptions_${uniqueId} = {
        'key': '${adKey}',
        'format': 'iframe',
        'height': ${height},
        'width': ${width},
        'params': {}
      };
      atOptions = atOptions_${uniqueId};
    `;

    // Create invoke script
    const invokeScript = document.createElement('script');
    invokeScript.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    invokeScript.async = true;

    if (ref.current) {
      ref.current.appendChild(optionsScript);
      ref.current.appendChild(invokeScript);
    }
  }, [adKey, height, width, uniqueId]);

  return (
    <div
      ref={ref}
      className="flex justify-center my-6"
      style={{ minHeight: height }}
    />
  );
}