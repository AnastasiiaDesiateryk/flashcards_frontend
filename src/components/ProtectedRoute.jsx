import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  // Get authentication state and loading status from context
  const { isAuth, loading } = useContext(AuthContext);

  // Show loading message while checking authentication
  if (loading) {
    return <div>Loading...</div>; // 🔥 Show a loading indicator while auth check is in progress
  }

  // If user is authenticated, show the protected content
  // Otherwise, redirect them to the login page
  return isAuth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
