import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../Firebase";
const PrivateRoute = () => {
  const isAuthenticated = auth.currentUser;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" /> ;
}
export default PrivateRoute;

// import { Route, Navigate } from "react-router-dom";
// import { auth } from "../Firebase";

// const PrivateRoute = ({ element: Component, ...rest }) => {
//   const currentUser = auth.currentUser;
//   return (
//     <Route
//       {...rest}
//       element={currentUser ? <Component /> : <Navigate to="/login" />}
//     />
//   );
// };

// export default PrivateRoute;
