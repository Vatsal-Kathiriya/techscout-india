'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function AdSense({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
  style,
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  useEffect(() => {
    if (!pubId || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.error('AdSense push error:', err);
    }
  }, [pubId]);

  if (!pubId) return null;

  return (
    <div className="w-full overflow-hidden my-4">
      <span className="block text-[10px] text-zinc-400 dark:text-zinc-600 font-mono uppercase tracking-wider mb-1 text-center">
        Advertisement
      </span>
      <ins
        ref={adRef}
        className={`adsbygoogle ${className}`}
        style={{ display: 'block', ...style }}
        data-ad-client={pubId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
}
