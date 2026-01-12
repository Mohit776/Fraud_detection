import axios from 'axios';

// Auth API (Node.js backend)
const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASEURL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// LLM API (FastAPI backend)
const llmApi = axios.create({
    baseURL: import.meta.env.VITE_LLM_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
const addAuthToken = (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

authApi.interceptors.request.use(addAuthToken);
llmApi.interceptors.request.use(addAuthToken);

// Response interceptor for error handling
const handleError = (error) => {
    if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
};

authApi.interceptors.response.use((response) => response, handleError);
llmApi.interceptors.response.use((response) => response, handleError);

export { authApi, llmApi };
export default authApi;
