import { useState } from 'react';
import { Welcome } from './pages/Welcome';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import ProfilepageOrganizationPage from './pages/ProfilepageOrganization';
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

function AppContent({ currentPage, setCurrentPage }: { currentPage: string; setCurrentPage: (page: string) => void }) {
  const { signUp: originalSignUp } = useAuth();
  
  const adaptedSignUp = async (data: SignUpData) => {
    console.log('App received signup data:', data); // Debug log
    await originalSignUp(data.email, data.password, data.fullName, data);
  };

  const renderPage = () => {
    console.log('Rendering page:', currentPage);
    switch (currentPage) {
      case 'welcome':
        return <Welcome onLogin={() => setCurrentPage('login')} onSignUp={() => setCurrentPage('signup')} onHome={() => setCurrentPage('home')} />;
      case 'login':
        return <Login onSignUp={() => setCurrentPage('signup')} />;
      case 'signup':
        return <MultiStepSignUp onLogin={() => setCurrentPage('login')} />;
      case 'phone-verification':
        return <PhoneVerification onNext={() => setCurrentPage('academic-details')} />;
      case 'academic-details':
        return <AcademicDetails onNext={() => setCurrentPage('about-yourself')} />;
      case 'about-yourself':
        return <AboutYourself onNext={() => setCurrentPage('academic-level')} />;
      case 'academic-level':
        return <AcademicLevel onNext={() => setCurrentPage('home')} />;
      case 'home':
        return <Homepage onComplete={(page) => {
          console.log('Homepage onComplete called with:', page);
          setCurrentPage(page);
        }} />;
      case 'chat':
        return <Chatpage onComplete={(page) => {
          console.log('Chatpage onComplete called with:', page);
          setCurrentPage(page);
        }} />;
      case 'connections':
          return <Connectionspage onComplete={(page) => {
            console.log('connections onComplete called with:', page);
            setCurrentPage(page);
          }} />;
      case 'user-profile':
        return <ProfilepageOrganizationPage onComplete={(page) => setCurrentPage(page)} />;
      default:
        return <Welcome onLogin={() => setCurrentPage('login')} onSignUp={() => setCurrentPage('signup')} />;
    }
  };
  console.log('Current page is:', currentPage);
  
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
      {renderPage()}
    </SignUpProvider>
  );
}
 
function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  return (
    <AuthProvider setCurrentPage={setCurrentPage}>
      <AppContent currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </AuthProvider>
  );
}

export default App;