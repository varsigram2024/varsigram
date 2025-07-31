import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const ScrollManager = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Get current route's base path
    const currentPath = location.pathname.split('/')[1];
    
    // On forward navigation, scroll to top
    if (navigationType === 'PUSH') {
      window.scrollTo(0, 0);
    }
    
    // On back navigation, restore position
    if (navigationType === 'POP') {
      const positions = JSON.parse(localStorage.getItem('scrollPositions') || '{}');
      const savedPosition = positions[currentPath];
      
      if (savedPosition) {
        requestAnimationFrame(() => {
          window.scrollTo(0, savedPosition);
        });
      }
    }
  }, [location.pathname, navigationType]);

  return null;
};