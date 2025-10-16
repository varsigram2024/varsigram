import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar1 from "./Sidebar1";
import BottomNav from "./BottomNav";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showBackButton, setShowBackButton] = useState(false);

  // Restore scroll position per route
  useEffect(() => {
    const savedY = sessionStorage.getItem(`scroll:${location.pathname}`);
    if (savedY) window.scrollTo(0, parseInt(savedY, 10));

    const handleScroll = () => {
      sessionStorage.setItem(`scroll:${location.pathname}`, window.scrollY.toString());
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const noBackPaths = ["/home", "/welcome", "/chat", "/connections", "/notifications"];
    setShowBackButton(!noBackPaths.includes(location.pathname));
  }, [location.pathname]);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/home");
  };

  return (
    <div className="flex items-start justify-center w-full relative bg-[#f6f6f6] min-h-screen">
      {/* Sidebar */}
      <div className="sticky top-0 h-screen hidden md:block">
        <Sidebar1 />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full mx-auto min-h-screen">
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
        <div className="flex-1 w-full pb-20 md:pb-4">
          <Outlet />
        </div>

        {/* Mobile Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
          <BottomNav />
        </div>
      </main>
    </div>
  );
}
