import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = `${import.meta.env.VITE_API_URL_BACKEND}/api/admin`;

const API = axios.create({
  baseURL,
  withCredentials: true
});

API.interceptors.request.use(
  config => {
    const token = Cookies.get('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default API;
