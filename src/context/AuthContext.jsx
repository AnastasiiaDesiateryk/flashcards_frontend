import { createContext, useState, useEffect } from "react";
import API from "../utils/api";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State to store the current user
  const [user, setUser] = useState(null);

  // State to check if user is authenticated
  const [isAuth, setIsAuth] = useState(null); // 🔥 Initially null to avoid flicker

  // State to show if authentication is being checked
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function runs when the component mounts
    const checkAuth = async () => {
      try {
        // Try to get token from localStorage
        const token = localStorage.getItem("accessToken");

        if (token) {
          // Decode the token and set user info
          const decoded = jwtDecode(token);
          setUser({ id: decoded.userId });
          setIsAuth(true);
        } else {
          // If no token, try to refresh
          const { data } = await API.post("/auth/refresh");

          // Save new token in localStorage
          localStorage.setItem("accessToken", data.accessToken);

          // Decode new token and set user info
          const decoded = jwtDecode(data.accessToken);
          setUser({ id: decoded.userId });
          setIsAuth(true);
        }
      } catch {
        // If token is invalid or refresh fails
        setUser(null);
        setIsAuth(false);
      } finally {
        // Stop showing the loading state
        setLoading(false);
      }
    };

    checkAuth(); // Call the function when component mounts
  }, []);

  // Function to log in the user
  const login = (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    setIsAuth(true);
  };

  // Function to log out the user
  const logout = async () => {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("accessToken");
      setIsAuth(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Provide the context values to child components
  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuth, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
