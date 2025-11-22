import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else if (!config.headers['Content-Type'] && config.method !== 'get') {
      config.headers['Content-Type'] = 'application/json';
    }
    config.headers.Accept = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const axiosChatbot = axios.create({
  baseURL: 'http://localhost:8001/api/chat',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default axiosInstance;
