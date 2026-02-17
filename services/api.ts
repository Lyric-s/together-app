import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storageService } from './storageService';

/**
 * Determines the base URL for API requests based on the execution environment.
 *
 * The function handles three scenarios:
 */
const getBaseUrl = () => {
  // ---------------------------------------------------------
  // CASE MOBILE (Expo Go ou build standalone)
  // ---------------------------------------------------------
  if (__DEV__ && typeof window === 'undefined') {
<<<<<<< HEAD
<<<<<<< HEAD
    return process.env.EXPO_PUBLIC_API_URL;
=======
    const debuggerHost = Constants.expoConfig?.hostUri || Constants.experienceUrl || '';
    const localhost = debuggerHost.split('//')[1]?.split(':')[0] || 'localhost';
<<<<<<< HEAD
<<<<<<< HEAD
    return process.env.EXPO_PUBLIC_API_URL //`http://${localhost}:8000`;
>>>>>>> b678e8c (fix: TA-132 modif and add env variable)
=======
    return process.env.EXPO_PUBLIC_API_URL || `http://${localhost}:8000`;
>>>>>>> 27d1483 (fix: TA-132 fix missing fallback)
=======
=======
>>>>>>> a64e44b (fix: TA-132 debuggerHost and localhost are computed but never used)
    return process.env.EXPO_PUBLIC_API_URL;
>>>>>>> b6ce861 (fix: TA-132 modif and add env var)
  }

  // ---------------------------------------------------------
  // CASE WEB
  // ---------------------------------------------------------
  if (typeof window !== 'undefined') {
    // CASE A: You are LOCAL (http://localhost:3000)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
       return process.env.EXPO_PUBLIC_API_URL;
=======
       return process.env.EXPO_PUBLIC_API_URL //|| 'http://localhost:8000';
>>>>>>> b678e8c (fix: TA-132 modif and add env variable)
=======
       return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
>>>>>>> 27d1483 (fix: TA-132 fix missing fallback)
=======
       return process.env.EXPO_PUBLIC_API_URL;
>>>>>>> b6ce861 (fix: TA-132 modif and add env var)
    }

    // CASE B: You are in PRODUCTION
    // This is where the magic of the backend happens.
    // Leave the URL blank. Axios will automatically use the current domain.
<<<<<<< HEAD
<<<<<<< HEAD
    return process.env.EXPO_PUBLIC_API_URL; 
  }

  // Security fallback (should not occur on the web)
  return process.env.EXPO_PUBLIC_API_URL;
=======
    return process.env.EXPO_PUBLIC_API_URL || ''; 
  }

  // Security fallback (should not occur on the web)
  return process.env.EXPO_PUBLIC_API_URL || '';
>>>>>>> b678e8c (fix: TA-132 modif and add env variable)
=======
    return process.env.EXPO_PUBLIC_API_URL; 
  }

  // Security fallback (should not occur on the web)
  return process.env.EXPO_PUBLIC_API_URL;
>>>>>>> 27d1483 (fix: TA-132 fix missing fallback)
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

let isRefreshing = false;
let refreshSubscribers: { resolve: (token: string) => void; reject: (error: unknown) => void }[] = [];

function subscribeTokenRefresh(resolve: (token: string) => void, reject: (error: unknown) => void) {
    refreshSubscribers.push({ resolve, reject });
}

/**
 * Invokes all queued subscriber callbacks with the refreshed access token and clears the subscriber queue.
 *
 * @param token - The refreshed access token to supply to each subscriber callback
 */
function onRefreshed(token: string) {
    refreshSubscribers.forEach(({ resolve }) => resolve(token));
    refreshSubscribers = [];
}

function onRefreshFailed(error: unknown) {
    refreshSubscribers.forEach(({ reject }) => reject(error));
    refreshSubscribers = [];
}

// Token interceptor
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await storageService.getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Automatic token expiry management (Refresh)
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        if (!originalRequest) {
            return Promise.reject(error);
        }
        if (error.response?.status === 422) {
            console.warn("API Validation Error:", JSON.stringify(error.response.data, null, 2));
            return Promise.reject(error);
        }
        if (originalRequest.url?.includes('/auth/refresh')) {
            await storageService.clear();
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh(
                        (token: string) => {
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            resolve(api(originalRequest));
                        },
                        reject
                    );
                });
            }

            isRefreshing = true;
            try {
                console.log("🔄 Token expiré. Tentative de refresh...");
                // We import dynamically to avoid import loops
                const { authService } = require('./authService');
                const newToken = await authService.refresh();
                isRefreshing = false;
                onRefreshed(newToken);
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                console.log("✅ Token rafraîchi avec succès, on relance la requête.");
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                onRefreshFailed(refreshError);
                console.error("❌ Échec du refresh token, déconnexion forcée.");
                await storageService.clear();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;