import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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

const API = axios.create({
  baseURL: '/api/v1/',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const AuthProvider = ({ children, setCurrentPage }: { children: React.ReactNode; setCurrentPage: (page: string) => void }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await API.get('/profile/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = response.data;
          setUser({ 
            id: data.id, 
            email: data.email, 
            fullName: data.full_name || data.name 
          });
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token'); // Clear invalid token
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      const response = await API.post('/register/', {
        email,
        password,
        bio: "",
        student: {
          name: fullName,
          faculty: "",
          department: "",
          year: "",
          religion: "",
          phone_number: "",
          sex: "",
          university: "",
          date_of_birth: null
        },
        organization: {
          organization_name: ""
        }
      });

      const { token, user } = response.data;
      localStorage.setItem('auth_token', token);
      setUser({ id: user.id, email: user.email, fullName: user.full_name });
      setCurrentPage('email-verification');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    console.warn('signInWithGoogle: Not implemented');
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // First, get the token from login
      const loginResponse = await API.post('/login/', {
        email,
        password
      });

      const { token } = loginResponse.data;
      
      if (!token) {
        throw new Error('No authentication token received');
      }

      // Store the token
      localStorage.setItem('auth_token', token);

      // Set the token in the API headers for subsequent requests
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Then fetch the user profile
      const profileResponse = await API.get('/profile/');
      const userData = profileResponse.data;

      // Set the user data
      setUser({
        id: userData.id,
        email: userData.email,
        fullName: userData.full_name || userData.name
      });

      // Redirect to dashboard
      setCurrentPage('dashboard');
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      
      if (error.response?.data?.non_field_errors) {
        throw new Error(error.response.data.non_field_errors[0]);
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 400) {
        const errorMessage = error.response.data.message || 
                            error.response.data.detail || 
                            'Invalid login credentials';
        throw new Error(errorMessage);
      } else {
        throw new Error('Login failed. Please try again later.');
      }
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
    <AuthContext.Provider
      value={{
        user,
        signUp,
        signInWithGoogle,
        login,
        logout,
        isLoading,
        setCurrentPage,
      }}
    >
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
