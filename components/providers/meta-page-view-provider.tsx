'use client';

/**
 * MetaPageView Component
 * Automatically tracks PageView events on route changes
 *
 * Usage: Place in app/layout.tsx inside <body> after MetaPixel
 */

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/metaPixel';

export function MetaPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track PageView on route change
    trackPageView();
  }, [pathname, searchParams]);

  // This component doesn't render anything
  return null;
}
