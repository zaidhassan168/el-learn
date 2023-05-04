import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../Firebase";
const PrivateRoute = () => {
  const isAuthenticated = auth.currentUser;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" /> ;
}
export default PrivateRoute;

