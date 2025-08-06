import axios from "axios";
import { REST_API_BASE_URL } from "./services/base_services";

const axiosInstance = axios.create({
  baseURL: REST_API_BASE_URL ,
  headers: {
    "Content-Type": "application/json", // Default header
  },
  withCredentials: true,
});


axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url && config.url.includes("/auth/login")) {
      return config;
    }
    const token = sessionStorage.getItem("jwt_token");
    const location = sessionStorage.getItem("location");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
     if (location) {
      config.headers["X-User-Location"] = location;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear session data
      sessionStorage.clear();
      // Redirect to login page
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;