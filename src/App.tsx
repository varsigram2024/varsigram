import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ViewTrackingProvider } from './context/viewTrackingContext.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthRoute } from './components/AuthRoute.tsx';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { FeedProvider } from './context/FeedContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { SignUpProvider } from './auth/SignUpContext';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import './styles/animations.css';
import { useEffect, useState } from "react";

// Pages
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { MultiStepSignUp } from './pages/MultiStepSignUp';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { PhoneVerification } from './pages/PhoneVerification';
import { AcademicDetails } from './pages/AcademicDetails';
import { AboutYourself } from './pages/AboutYourself';
import { AcademicLevel } from './pages/AcademicLevel';
import Homepage from './pages/Homepage';
import Chatpage from './pages/Chatpage';
import Connectionspage from './pages/ConnectionsPage';
import NotificationsPage from './pages/Notifications';
import Marketplace from './pages/Marketplace';
import Resources from './pages/Resources';
import Opportunities from './pages/Opportunities';
import CreateOpportunity from './pages/Opportunities/CreateOpportunity';
import OpportunityDetail from './pages/Opportunities/OpportunityDetail';
import PostPage from './pages/PostPage';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ProfilePage from './pages/Profilepage';
import LinksModal from './modals/LinksModal/index.tsx';
import EditProfile from "./pages/Settings/EditProfile";
import ChangePassword from "./pages/Settings/ChangePassword";
import PrivacyPolicy from "./pages/Settings/PrivacyPolicy";
import { EmailVerificationBanner } from "./components/EmailVerificationBanner";
import { EmailVerification } from "./pages/EmailVerification.tsx";
import MainLayout from "./components/MainLayout";


// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/welcome" replace />;
};

// Public Route Component
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <Navigate to="/home" replace /> : <>{children}</>;
};

// Loading Screen
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen w-full bg-white">
    <div className="flex flex-col items-center space-y-4">
      <svg
        width="64"
        height="45"
        viewBox="0 0 64 45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 md:h-20 md:w-20"
      >
        <path
          d="M31.8142 40.3235C28.8059 38.1083 28.163 33.8738 30.3782 30.8655L48.3636 6.44121C50.9834 2.88345 55.9913 2.12312 59.5491 4.74295L64.0013 8.02142L41.2723 38.8876C39.0571 41.8959 34.8225 42.5388 31.8142 40.3235Z"
          fill="#750015"
          className="animate-pulse delay-[0ms]"
        />
        <path
          d="M18.157 32.0453C15.2635 29.9147 14.6452 25.8419 16.7758 22.9485L27.0562 8.98768C29.676 5.42992 34.684 4.66958 38.2417 7.28941L42.2778 10.2615L27.2538 30.6642C25.1232 33.5576 21.0504 34.176 18.157 32.0453Z"
          fill="#750015"
          className="animate-pulse delay-[300ms]"
        />
        <path
          d="M6.94957 20.7166C5.79993 19.0374 5.58672 16.8876 6.38412 15.0152L7.20593 13.0856C9.18517 8.43821 14.9826 6.85431 19.0499 9.8497L22.7724 12.5911L16.6651 20.8839C14.2323 24.1873 9.2671 24.1017 6.94957 20.7166Z"
          fill="#750015"
          className="animate-pulse delay-[600ms]"
        />
      </svg>
      <p className="text-[#750015] text-lg md:text-xl font-semibold tracking-wide">
        Loading Varsigram...
      </p>
    </div>
  </div>
);

function AppContent() {
  const { isLoading } = useAuth();
  const { requestNotificationPermission } = useNotification();
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("justLoggedIn") === "true") {
      sessionStorage.removeItem("justLoggedIn");
      setShowNotificationPrompt(true);
    }
  }, []);

  const handleEnableNotifications = async () => {
    await requestNotificationPermission();
    setShowNotificationPrompt(false);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#222',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/welcome" element={<PublicRoute><Welcome /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><MultiStepSignUp /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/phone-verification" element={<PublicRoute><PhoneVerification /></PublicRoute>} />
        <Route path="/academic-details" element={<PublicRoute><AcademicDetails /></PublicRoute>} />
        <Route path="/about-yourself" element={<PublicRoute><AboutYourself /></PublicRoute>} />
        <Route path="/academic-level" element={<PublicRoute><AcademicLevel /></PublicRoute>} />

        {/* Protected Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Homepage />} />
          <Route path="chat" element={<Chatpage />} />
          <Route path="connections" element={<Connectionspage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="resources" element={<Resources />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="opportunities/create" element={<CreateOpportunity />} />
          <Route path="opportunities/:id" element={<OpportunityDetail />} />
          <Route path="posts/:id" element={<PostPage />} />
          <Route path="profile/:username" element={<Profile />} />
          <Route path="user-profile/:display_name_slug" element={<ProfilePage />} />

          <Route path="settings" element={<Settings />} />
          <Route path="settings/edit-profile" element={<EditProfile />} />
          <Route path="settings/change-password" element={<ChangePassword />} />
          <Route path="settings/email-verification" element={<EmailVerification />} />
          <Route path="settings/privacy-policy" element={<PrivacyPolicy />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>

      {/* Notification Prompt */}
      {showNotificationPrompt && (
        <div className="xs:hidden fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm w-full">
            <h2 className="text-xl font-bold mb-3 text-[#750015]">Enable Notifications</h2>
            <p className="text-base text-gray-700 mb-6">
              Stay updated with the latest notifications from Varsigram.
            </p>
            <button
              onClick={handleEnableNotifications}
              className="px-5 py-2 bg-[#750015] text-white rounded-lg font-medium shadow hover:bg-[#a0001f] transition-colors"
            >
              Enable Notifications
            </button>
            <button
              onClick={() => setShowNotificationPrompt(false)}
              className="mt-4 text-sm text-gray-500 hover:underline focus:outline-none"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SignUpProvider>
          <NotificationProvider>
            <FeedProvider>
              <ViewTrackingProvider>
                <Analytics />
                <SpeedInsights />
                <EmailVerificationBanner />
                <ErrorBoundary>
                  <AppContent />
                </ErrorBoundary>
              </ViewTrackingProvider>
            </FeedProvider>
          </NotificationProvider>
        </SignUpProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
