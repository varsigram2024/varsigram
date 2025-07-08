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
  display_name_slug?: string;
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
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

function storeTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// Request: Attach access token
API.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: Handle 401/403 by trying refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = getRefreshToken();
      if (refresh) {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/token/refresh/`, { refresh });
          const { access } = res.data;
          storeTokens(access, refresh);
          API.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          return API(originalRequest);
        } catch (refreshError) {
          clearTokens();
          window.location.href = '/login';
        }
      } else {
        clearTokens();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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
              followers_count: user.followers_count,
              display_name_slug: profile.display_name_slug
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
      const response = await API.post(
        '/register/',
        requestData
      );

      console.log('API Response:', response.data);

      if (response.data) {
        const token = response.data.token;
        if (token) {
          localStorage.setItem('auth_token', token);
          toast.success('Sign up successful! Please verify your email.');
          navigate('/settings/email-verification');
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
  
      // Try with email
      let tokenResponse;
      try {
        tokenResponse = await API.post('/login/', {
          email: email,
          password: password,
        });
      } catch (error: any) {
        // If 400 and non_field_errors, try with username
        if (error.response?.data?.non_field_errors) {
          tokenResponse = await API.post('/login/', {
            username: email,
            password: password,
          });
        } else {
          throw error;
        }
      }
  
      const { token, access, refresh } = tokenResponse.data;

      if (token) {
        // Old style: single token
        localStorage.setItem('auth_token', token);
        setToken(token);
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else if (access && refresh) {
        // JWT style
        storeTokens(access, refresh);
        setToken(access);
        API.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      } else {
        throw new Error('No authentication token received');
      }
  
      // 3. Get user profile
      const profileResponse = await API.get('/profile/');
      const userData = profileResponse.data;
      const profile = userData.profile || {};
      const user = profile.user || {};
  
      const userIsVerified = user.is_verified;

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
        followers_count: user.followers_count,
        display_name_slug: profile.display_name_slug
      });
  
      if (!userIsVerified) {
        toast('Please verify your email to continue.');
        navigate('/settings/email-verification');
      } else {
        toast.success('Login successful! Welcome back');
        navigate('/home');
      }
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error);
      if (error.response?.data?.non_field_errors) {
        console.error("Backend says:", error.response.data.non_field_errors[0]);
      }
      clearTokens();
      setToken(null);
      setUser(null);
  
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
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
    clearTokens();
    setToken(null);
    setUser(null);
    navigate('/');
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


