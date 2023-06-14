import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../utils/Firebase";

// PrivateRoute component
const PrivateRoute = () => {
  // Check if user is authenticated
  const isAuthenticated = auth.currentUser;

  // Render Outlet if user is authenticated, otherwise redirect to login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
