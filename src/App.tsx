import { useState } from 'react';

import { Welcome } from './pages/Welcome';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import ProfilepageOrganizationPage from './pages/ProfilepageOrganization';
import HomepageFollowingPage from './pages/Homepage/HomepageFollowing';
import Homepage from './pages/Homepage';
import { EmailVerification } from './pages/EmailVerification';
import { PhoneVerification } from './pages/PhoneVerification';
import { AcademicDetails } from './pages/AcademicDetails';
import { AboutYourself } from './pages/AboutYourself';
import { AcademicLevel } from './pages/AcademicLevel';
import { AuthProvider } from './auth/AuthContext';
import './styles/animations.css';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <Welcome onLogin={() => setCurrentPage('login')} onSignUp={() => setCurrentPage('signup')} onHome={() => setCurrentPage('home')} />;
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
        return <AcademicLevel onNext={() => setCurrentPage('home')} />;
      case 'home':
        return <Homepage onComplete={(page) => setCurrentPage(page)} />;
      case 'user-profile':
        return <ProfilepageOrganizationPage />;
      default:
        return <Welcome onLogin={() => setCurrentPage('login')} onSignUp={() => setCurrentPage('signup')} />;
    }
  };
  console.log('Current page is:', currentPage);
  

  return (
    <AuthProvider setCurrentPage={setCurrentPage}>
      {renderPage()}
    </AuthProvider>
  );
}

export default App;
