// hooks/useNavigation.ts
import { useNavigate, useLocation } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => navigate(-1);
  const goForward = () => navigate(1);
  const goTo = (path: string, replace = false) => navigate(path, { replace });
  
  // Smart redirect - return to previous page or fallback
  const redirectBack = (fallback = '/home') => {
    const from = location.state?.from || fallback;
    navigate(from, { replace: true });
  };

  // Store current location for later return
  const storeCurrentLocation = () => {
    sessionStorage.setItem('returnTo', location.pathname);
  };

  const returnToStoredLocation = (fallback = '/home') => {
    const returnTo = sessionStorage.getItem('returnTo') || fallback;
    sessionStorage.removeItem('returnTo');
    navigate(returnTo, { replace: true });
  };

  return {
    goBack,
    goForward,
    goTo,
    redirectBack,
    storeCurrentLocation,
    returnToStoredLocation,
    currentPath: location.pathname
  };
};