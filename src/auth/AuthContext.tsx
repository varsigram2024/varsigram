import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  setCurrentPage: (page: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children, setCurrentPage }: { children: React.ReactNode; setCurrentPage: (page: string) => void }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // For development/demo purposes until backend is ready
  const mockAuthCall = async (userData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      userId: 'mock-user-id',
      email: userData.email,
      fullName: userData.fullName || 'Mock User',
      token: 'mock-token'
    };
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // For development, simulate a successful auth check
          const mockUser = {
            id: 'mock-user-id',
            email: 'user@example.com',
            fullName: 'Mock User'
          };
          setUser(mockUser);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      // Mock API call until backend is ready
      const data = await mockAuthCall({ email, fullName });
      
      localStorage.setItem('auth_token', data.token);
      setUser({
        id: data.userId,
        email: data.email,
        fullName: data.fullName
      });
      
      setCurrentPage('email-verification');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      // Initialize Google Sign-In
      const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // You'll need to replace this with your actual client ID
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'email profile',
        prompt: 'select_account'
      });

      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        `${googleAuthUrl}?${params.toString()}`,
        'Google Sign In',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        throw new Error('Failed to open popup');
      }

      const result = await new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            reject(new Error('Popup closed by user'));
          }
        }, 1000);

        window.addEventListener('message', (event) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'google_auth') {
            clearInterval(checkClosed);
            popup.close();
            
            if (event.data.success) {
              resolve(event.data.user);
            } else {
              reject(new Error('Google sign in failed'));
            }
          }
        });
      });

      // Mock successful authentication
      const mockData = await mockAuthCall({ 
        email: 'google-user@example.com',
        fullName: 'Google User'
      });

      localStorage.setItem('auth_token', mockData.token);
      setUser({
        id: mockData.userId,
        email: mockData.email,
        fullName: mockData.fullName
      });
      
      setCurrentPage('email-verification');
    } catch (error) {
      console.error('Google sign in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Mock API call until backend is ready
      const data = await mockAuthCall({ email });
      
      localStorage.setItem('auth_token', data.token);
      setUser({
        id: data.userId,
        email: data.email,
        fullName: data.fullName
      });
      
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('auth_token');
      setUser(null);
      setCurrentPage('welcome');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signUp, 
      signInWithGoogle,
      login, 
      logout, 
      isLoading,
      setCurrentPage 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};