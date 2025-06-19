import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Welcome } from './pages/Welcome';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import ProfilepageOrganizationPage from './pages/Profilepage';
import Homepage from './pages/Homepage';
import { PhoneVerification } from './pages/PhoneVerification';
import { AcademicDetails } from './pages/AcademicDetails';
import { AboutYourself } from './pages/AboutYourself';
import { AcademicLevel } from './pages/AcademicLevel';
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
      <Routes>
        {/* Public Routes */}
        <Route path="/welcome" element={<PublicRoute><Welcome /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><MultiStepSignUp /></PublicRoute>} />
        <Route path="/phone-verification" element={<PublicRoute><PhoneVerification /></PublicRoute>} />
        <Route path="/academic-details" element={<PublicRoute><AcademicDetails /></PublicRoute>} />
        <Route path="/about-yourself" element={<PublicRoute><AboutYourself /></PublicRoute>} />
        <Route path="/academic-level" element={<PublicRoute><AcademicLevel /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chatpage /></ProtectedRoute>} />
        <Route path="/connections" element={<ProtectedRoute><Connectionspage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/user-profile" element={<ProtectedRoute><ProfilepageOrganizationPage /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Root route - redirect to welcome */}
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </SignUpProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;