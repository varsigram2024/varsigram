import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSignUp } from '../auth/SignUpContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface User {
   id: string;
  email: string;
  fullName: string;
  profile_pic_url?: string;
  username?: string;
  is_verified?: boolean;
  bio?: string;
  account_type: 'student' | 'organization';  // Add this
  following_count?: number;  // Add this
  followers_count?: number;  // Add this
}

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string, fullName: string, signUpData: any) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  token: string | null;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API = axios.create({
  baseURL: 'https://api.varsigram.com/api/v1/',
  headers: { 'Content-Type': 'application/json' },
});

// Add response interceptor to handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('auth_token');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

API.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          setToken(storedToken);
          API.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          try {
            const response = await API.get('/profile/');
            console.log('Profile API response:', response.data);
            const data = response.data;
            const profile = data.profile || {};
            const user = profile.user || {};

            setUser({
              id: user.id,
              email: user.email,
              fullName: user.display_name || profile.name || user.name || user.email,
              profile_pic_url: user.profile_pic_url,
              username: user.username,
              is_verified: user.is_verified,
              bio: user.bio,
              account_type: data.profile_type,
              following_count: user.following_count,
              followers_count: user.followers_count
            });
          } catch (profileError: any) {
            console.error('Profile fetch failed:', profileError);
            if (profileError.response?.status === 403 || profileError.response?.status === 401) {
              localStorage.removeItem('auth_token');
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch (error: any) {
        console.error('Auth check failed:', error);
        if (error.response?.status === 403 || error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
        }
      } finally {
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
          navigate('/home');
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
      
      console.log('Attempting login with:', { email });
      
      const loginResponse = await API.post('/login/', {
        email,
        password
      });

      console.log('Login response:', loginResponse.data);

      const { token } = loginResponse.data;
      
      if (!token) {
        throw new Error('No authentication token received');
      }

      // Clear any existing token first
      localStorage.removeItem('auth_token');
      
      // Store new token
      localStorage.setItem('auth_token', token);
      setToken(token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        const profileResponse = await API.get('/profile/');
        console.log('Profile response:', profileResponse.data);
        
        const userData = profileResponse.data;
        const profile = userData.profile || {};
        const user = profile.user || {};

        setUser({
          id: user.id,
          email: user.email,
          fullName: user.display_name || profile.name || user.name || user.email,
          profile_pic_url: user.profile_pic_url,
          username: user.username,
          is_verified: user.is_verified,
          bio: user.bio,
          account_type: userData.profile_type,
          following_count: user.following_count,
          followers_count: user.followers_count
        });

        toast.success('Login successful! Welcome back');
        navigate('/home');
      } catch (profileError: any) {
        console.error('Profile fetch failed:', profileError);
        if (profileError.response?.status === 403 || profileError.response?.status === 401) {
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
          throw new Error('Failed to fetch user profile');
        }
      }
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error);
      
      // Clear any invalid token
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      
      if (error.response?.data?.non_field_errors) {
        toast.error(error.response.data.non_field_errors[0]);
      } else if (error.response?.status === 401) {
        toast.error('Invalid email or password');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Please try logging in again.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
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
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
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
        token,
        updateUser,
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
