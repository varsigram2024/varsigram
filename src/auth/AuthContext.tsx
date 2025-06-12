import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSignUp } from '../auth/SignUpContext';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, fullName: string, signUpData: any) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  setCurrentPage: (page: string) => void;
  token: string | null;
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
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));

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

  
  const signUp = async (email: string, password: string, fullName: string, signUpData: any) => {
    let requestData;
    try {
      setIsLoading(true);
      
      // First, let's log the incoming data
      console.log('Incoming signUpData:', signUpData);
      
      requestData = {
        email,
        password,
        bio: "",
        student: {
          name: fullName,
          faculty: signUpData?.faculty || '',
          department: signUpData?.department || '',
          year: signUpData?.year || '',
          religion: signUpData?.religion || '',
          phone_number: signUpData?.phoneNumber || '',
          sex: signUpData?.sex || '',
          university: signUpData?.university || '',
          date_of_birth: signUpData?.dateOfBirth || null
        },
        organization: null
      };

      // Log the exact data being sent
      console.log('Full request data:', JSON.stringify(requestData, null, 2));

      // Make the API call
      const response = await axios.post(
        'https://api.varsigram.com/api/v1/register/',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      console.log('API Response:', response.data);

      if (response.data) {
        const token = response.data.token;
        if (token) {
          localStorage.setItem('auth_token', token);
          toast.success('Sign up successful! Welcome to Varsigram');
          setCurrentPage('home');
        }
        return response.data;
      }
    } catch (error: any) {
      // More detailed error logging
      console.error('Full error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      console.error('Request data that caused error:', requestData);
      
      if (error.response?.data?.non_field_errors) {
        const errorMessage = error.response.data.non_field_errors[0];
        console.error('API Error Message:', errorMessage);
        toast.error(errorMessage);
      } else if (error.response?.data) {
        // Log each field error
        Object.entries(error.response.data).forEach(([field, errors]) => {
          console.error(`${field} errors:`, errors);
        });
        toast.error('Please check all required fields');
      } else {
        toast.error('Signup failed. Please try again.');
      }
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
      
      const loginResponse = await API.post('/login/', {
        email,
        password
      });

      const { token } = loginResponse.data;
      
      if (!token) {
        throw new Error('No authentication token received');
      }

      localStorage.setItem('auth_token', token);
      setToken(token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const profileResponse = await API.get('/profile/');
      const userData = profileResponse.data;

      setUser({
        id: userData.id,
        email: userData.email,
        fullName: userData.full_name || userData.name
      });

      toast.success('Login successful! Welcome back', {
        duration: 3000,
        style: {
          background: '#4CAF50',
          color: '#fff',
          fontSize: '16px',
          padding: '16px',
        },
      });
      
      setCurrentPage('home');
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      
      if (error.response?.data?.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0]);
      } else if (error.response?.status === 401) {
        toast.error('Invalid email or password');
      } else {
        toast.error('Login failed. Please try again later.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('auth_token');
      setToken(null);
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
        token,
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
