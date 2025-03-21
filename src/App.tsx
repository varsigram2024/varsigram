import { useState } from 'react';
import { Welcome } from './pages/Welcome';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import { EmailVerification } from './pages/EmailVerification';
import { PhoneVerification } from './pages/PhoneVerification';
import { AcademicDetails } from './pages/AcademicDetails';
import { AboutYourself } from './pages/AboutYourself';
import { AcademicLevel } from './pages/AcademicLevel';
import { AuthProvider } from './auth/AuthContext';
import './styles/animations.css';
import Dashboard from './pages/dashboard/dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <Welcome onLogin={() => setCurrentPage('login')} onSignUp={() => setCurrentPage('signup')} />;
      case 'login':
        return <Login onSignUp={() => setCurrentPage('signup')} />;
      case 'signup':
        return <SignUp onLogin={() => setCurrentPage('login')} />;
      case 'email-verification':
        return <EmailVerification onNext={() => setCurrentPage('phone-verification')} />;
      case 'phone-verification':
        return <PhoneVerification onNext={() => setCurrentPage('academic-details')} />;
      case 'academic-details':
        return <AcademicDetails onNext={() => setCurrentPage('about-yourself')} />;
      case 'about-yourself':
        return <AboutYourself onNext={() => setCurrentPage('academic-level')} />;
      case 'academic-level':
        return <AcademicLevel onComplete={() => setCurrentPage('dashboard')} />;
      case 'dashboard':
        return <Dashboard />
      default:
        return <div content='Not Found' />;
    }
  };

  return (
    <AuthProvider setCurrentPage={setCurrentPage}>
      {renderPage()}
    </AuthProvider>
  );
}

export default App;