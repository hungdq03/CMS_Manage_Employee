import axios from 'axios';
import ConstantList from '../appConfig';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: ConstantList.API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
