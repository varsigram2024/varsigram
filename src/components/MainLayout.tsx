// src/components/MainLayout.tsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar1 from './Sidebar1';
import BottomNav from './BottomNav';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showBackButton, setShowBackButton] = useState(false);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const pathsWithoutBackButton = ['/home', '/welcome', '/chat', '/connections', '/notifications'];
    setShowBackButton(!pathsWithoutBackButton.includes(location.pathname));
    
    // Store current path for back navigation
    if (isMobile) {
      const visitedPaths = JSON.parse(sessionStorage.getItem('mobileVisitedPaths') || '[]');
      visitedPaths.push(location.pathname);
      sessionStorage.setItem('mobileVisitedPaths', JSON.stringify(visitedPaths));
    }
  }, [location.pathname, isMobile]);

  const handleBack = () => {
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // Try browser back first, then fallback to home
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/home');
    }
  } else {
    // Desktop - use React Router navigation
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  }
};

  return (
    <div className="flex items-start justify-center w-full relative bg-[#f6f6f6] min-h-screen">
      {/* Desktop Sidebar */}
      <div className="sticky top-0 h-screen">
        <Sidebar1 />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full mx-auto min-h-screen">
        {/* Back Button for nested pages */}
        {showBackButton && (
          <div className="sticky top-0 z-10 bg-white border-b p-4">
            <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[#750015] font-medium hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
          </div>
        )}
        
        {/* Page Content */}
        <div className="flex-1 w-full pb-20 md:pb-4"> {/* Padding for bottom nav */}
          <Outlet />
        </div>
        
        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          <BottomNav />
        </div>
      </main>
    </div>
  );
}