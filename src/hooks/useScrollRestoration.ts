import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const useScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  const saveScrollPosition = (pageKey: string) => {
    const positions = JSON.parse(localStorage.getItem('scrollPositions') || '{}');
    positions[pageKey] = window.scrollY;
    localStorage.setItem('scrollPositions', JSON.stringify(positions));
  };

  const restoreScrollPosition = (pageKey: string) => {
    const positions = JSON.parse(localStorage.getItem('scrollPositions') || '{}');
    const savedPosition = positions[pageKey];
    
    if (savedPosition && navigationType === 'POP') {
      requestAnimationFrame(() => {
        window.scrollTo(0, savedPosition);
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  return {
    saveScrollPosition,
    restoreScrollPosition
  };
};