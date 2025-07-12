import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Welcome } from './pages/Welcome';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import ProfilepageOrganizationPage from './pages/Profilepage';
import Homepage from './pages/Homepage';
import { PhoneVerification } from './pages/PhoneVerification';
import { AcademicDetails } from './pages/AcademicDetails';
import { AboutYourself } from './pages/AboutYourself';
import { AcademicLevel } from './pages/AcademicLevel';
import { EmailVerification } from './pages/EmailVerification.tsx';
import { AuthProvider, useAuth } from './auth/AuthContext';
import './styles/animations.css';
import Chatpage from './pages/Chatpage';
import Connectionspage from './pages/ConnectionsPage';
import { SignUpProvider } from './auth/SignUpContext';
import { MultiStepSignUp } from './pages/MultiStepSignUp';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ProfilePage from './pages/Profilepage/index.tsx';
import EditProfile from "./pages/Settings/EditProfile";
import ChangePassword from "./pages/Settings/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { EmailVerificationBanner } from "./components/EmailVerificationBanner";
import PrivacyPolicy from "./pages/Settings/PrivacyPolicy";
import Marketplace from "./pages/Marketplace";
import Resources from "./pages/Resources";
import PostPage from "./pages/PostPage";
import { VerifiedRoute } from './components/VerifiedRoute';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/welcome" replace />;
};

// Public Route Component (redirects to home if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <Navigate to="/home" replace /> : <>{children}</>;
};

function AppContent() {
  const { signUp: originalSignUp } = useAuth();
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  
  const adaptedSignUp = async (data: SignUpData) => {
    console.log('App received signup data:', data);
    await originalSignUp(data.email, data.password, data.fullName, data);
  };

  return (
    <SignUpProvider signUp={adaptedSignUp}>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Routes location={state?.backgroundLocation || location}>
        {/* Public Routes */}
        <Route path="/welcome" element={<PublicRoute><Welcome /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><MultiStepSignUp /></PublicRoute>} />
        <Route path="/phone-verification" element={<PublicRoute><PhoneVerification /></PublicRoute>} />
        <Route path="/academic-details" element={<PublicRoute><AcademicDetails /></PublicRoute>} />
        <Route path="/about-yourself" element={<PublicRoute><AboutYourself /></PublicRoute>} />
        <Route path="/academic-level" element={<PublicRoute><AcademicLevel /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/home" element={<VerifiedRoute><Homepage /></VerifiedRoute>} />
        <Route path="/chat" element={<VerifiedRoute><Chatpage /></VerifiedRoute>} />
        <Route path="/connections" element={<VerifiedRoute><Connectionspage /></VerifiedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/user-profile/:display_name_slug" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings/edit-profile" element={<EditProfile />} />
        <Route path="/settings/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/settings/email-verification" element={<EmailVerification />} />
        <Route path="/settings/privacy-policy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
        <Route path="/posts/:id" element={<PostPage />} />

        {/* Root route - redirect to welcome */}
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>

      {/* Show the modal route if backgroundLocation is set */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/posts/:id" element={<PostPage isModal />} />
        </Routes>
      )}
    </SignUpProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Analytics />
        <SpeedInsights />
        <EmailVerificationBanner />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;