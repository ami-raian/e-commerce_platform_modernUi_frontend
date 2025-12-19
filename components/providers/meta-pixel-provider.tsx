'use client';

/**
 * MetaPixel Component
 * Injects the Meta (Facebook) Pixel base script into the document
 *
 * Usage: Place in app/layout.tsx inside <head> or at top of <body>
 */

import Script from 'next/script';
import { useEffect } from 'react';
import { initMetaPixel, cleanupOldTrackingRecords } from '@/lib/metaPixel';

interface MetaPixelProps {
  pixelId?: string;
}

export function MetaPixel({ pixelId }: MetaPixelProps) {
  const pixelID = pixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    // Cleanup old tracking records on mount
    cleanupOldTrackingRecords();
  }, []);

  // Don't render if no Pixel ID
  if (!pixelID) {
    console.warn('[Meta Pixel] NEXT_PUBLIC_META_PIXEL_ID not set. Pixel not loaded.');
    return null;
  }

  return (
    <>
      {/* Meta Pixel Base Code */}
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
          `,
        }}
      />

      {/* Initialize Pixel */}
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            fbq('init', '${pixelID}');
            console.log('[Meta Pixel] Initialized: ${pixelID}');
          `,
        }}
      />

      {/* Noscript fallback (for users with JS disabled) */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
