import axios from 'axios';

// Create Axios client pointing to the backend API base url
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor to automatically attach JWT token from local storage to outgoing requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
