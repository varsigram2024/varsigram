import { useEffect, useLayoutEffect } from 'react';

export const useScrollPosition = (
  containerRef: React.RefObject<HTMLDivElement>,
  dependencies: any[] = [],
  storageKey: string = 'scrollPosition'
) => {
  // Save scroll position before unmounting
  useEffect(() => {
    const container = containerRef.current;
    
    return () => {
      if (container) {
        sessionStorage.setItem(storageKey, container.scrollTop.toString());
      }
    };
  }, [storageKey]);

  // Restore scroll position on mount
  useLayoutEffect(() => {
    const container = containerRef.current;
    const savedPosition = sessionStorage.getItem(storageKey);

    if (container && savedPosition) {
      setTimeout(() => {
        container.scrollTop = parseInt(savedPosition, 10);
        // Optionally clear the stored position
        sessionStorage.removeItem(storageKey);
      }, 100);
    }
  }, [storageKey, ...dependencies]);
};