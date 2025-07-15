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

// UNIFIED TOKEN STORAGE - Single source of truth
const AUTH_TOKEN_KEY = 'auth_token';

function storeToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// Request: Attach token
API.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: Handle 401/403 by redirecting to login
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear token and redirect to login
      clearToken();
      // Don't redirect if already on login/welcome page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/welcome')) {
        window.location.href = '/welcome';
      }
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(getToken());
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = getToken();
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
              clearToken();
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch (error: any) {
        console.error('Auth check failed:', error);
        if (error.response?.status === 403 || error.response?.status === 401) {
          clearToken();
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

      console.log('Full request data:', JSON.stringify(requestData, null, 2));

      const response = await API.post('/register/', requestData);

      console.log('API Response:', response.data);

      if (response.data) {
        const token = response.data.token;
        if (token) {
          storeToken(token);
          setToken(token);
          
          // Store credentials for auto-login after verification
          sessionStorage.setItem('signup_credentials', JSON.stringify({
            email,
            password
          }));
          
          toast.success('Sign up successful! Please verify your email.');
          navigate('/settings/email-verification');
        }
        return response.data;
      }
    } catch (error: any) {
      console.error('Full error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      console.error('Request data that caused error:', requestData);
      
      if (error.response?.data?.non_field_errors) {
        const errorMessage = error.response.data.non_field_errors[0];
        console.error('API Error Message:', errorMessage);
        toast.error(errorMessage);
      } else if (error.response?.data) {
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
  
      let tokenResponse;
      try {
        tokenResponse = await API.post('/login/', {
          email: email,
          password: password,
        });
      } catch (error: any) {
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

      let finalToken = null;
      if (token) {
        // Single token style
        finalToken = token;
      } else if (access && refresh) {
        // JWT style - use access token
        finalToken = access;
      } else {
        throw new Error('No authentication token received');
      }

      // Store token using unified method
      storeToken(finalToken);
      setToken(finalToken);
      API.defaults.headers.common['Authorization'] = `Bearer ${finalToken}`;
  
      // Get user profile
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
      clearToken();
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
    clearToken();
    setToken(null);
    setUser(null);
    navigate('/');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const refreshUserProfile = async () => {
    try {
      const response = await API.get('/profile/');
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
    } catch (error: any) {
      console.error('Failed to refresh user profile:', error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        clearToken();
        setToken(null);
        setUser(null);
      }
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


