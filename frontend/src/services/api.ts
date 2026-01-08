import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for httpOnly cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized globally
        if (error.response?.status === 401) {
            // Could dispatch logout or redirect here
            console.warn('Unauthorized - session may have expired');
        }
        return Promise.reject(error);
    }
);

export default api;
