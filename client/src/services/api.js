import axios from 'axios';

// Create Axios client pointing to the backend API base url
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Automatically send and receive HttpOnly cookies in cross-origin requests
});

export default API;
