import axios from "axios";

const AUTH_TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

const getAccessToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

const setAccessToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

const setRefreshToken = (token?: string) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

const clearStoredTokens = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refresh = getRefreshToken();
  if (!refresh) {
    return null;
  }

  refreshPromise = (async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/token/refresh/`,
        { refresh },
        { headers: { "Content-Type": "application/json" } }
      );

      const nextAccess = response.data?.access || response.data?.token;
      const nextRefresh = response.data?.refresh;

      if (nextAccess) {
        setAccessToken(nextAccess);
      }
      if (nextRefresh) {
        setRefreshToken(nextRefresh);
      }

      return nextAccess || null;
    } catch {
      clearStoredTokens();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config as any;
    const status = error?.response?.status;
    const url = originalRequest?.url || "";

    const isAuthRoute =
      url.includes("/login/") ||
      url.includes("/register/") ||
      url.includes("/token/refresh/") ||
      url.includes("/token/logout/");

    if (status === 401 && !originalRequest?._retry && !isAuthRoute) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { api as API };
