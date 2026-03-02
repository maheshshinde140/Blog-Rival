'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteProgress() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (previousPath.current !== pathname) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 650);
      previousPath.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return <div className={`route-progress ${isVisible ? 'active' : ''}`} />;
}
