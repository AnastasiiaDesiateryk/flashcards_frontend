import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// ✅ Request interceptor to automatically add accessToken to headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Add token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error) // Handle request errors
);

// ✅ Response interceptor to automatically refresh accessToken on 401 errors
API.interceptors.response.use(
  (response) => response, // If response is OK, just return it
  async (error) => {
    const originalRequest = error.config;

    // If the request failed with 401 and hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request as retried

      try {
        // Try to refresh the token
        const { data } = await axios.post(
          "http://localhost:5000/auth/refresh",
          {},
          { withCredentials: true } // Send cookies
        );

        // Save new token to localStorage
        localStorage.setItem("accessToken", data.accessToken);

        // Add new token to original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        // Retry original request with new token
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear token and reject
        localStorage.removeItem("accessToken");
        // Optionally redirect to login page:
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // If it's not a 401 or already retried — just reject the error
    return Promise.reject(error);
  }
);

export default API;
