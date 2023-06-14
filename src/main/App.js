// Importing necessary modules from react-router-dom and react
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

// Importing necessary components and styles
import "../css/App.css";
import LandingPage from "./LandingPage";
import SignUp from "../authentication/SignUp";
import Home from "./Home";
import LogIn from "../authentication/LogIn";
import Typography from "@mui/material/Typography";
import { Zoom } from "@mui/material";

// Defining the main component
const App = () => {
  // Initializing necessary hooks
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("user");
  const location = useLocation();

  // useEffect hook to check if user is logged in or not
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // If user is logged in and on signup, login, or home page, navigate to the home page
      if (
        location.pathname === "/signup" ||
        location.pathname === "/login" ||
        location.pathname === "/"
      ) {
        navigate("/home");
      }
    } else {
      // If user is not logged in and on the home page, navigate to the login page
      if (location.pathname === "/home") {
        navigate("/login");
      }
    }
  }, [navigate, location.pathname]);

  // Rendering the main component
  return (
    <div className="App">
      {/* Display the header only on the landing, signup, and login pages */}
      {location.pathname === "/" ||
      location.pathname === "/signup" ||
      location.pathname === "/login" ? (
        <header>
          {/* Add a zoom-in effect to the title */}
          <Zoom in={true} timeout={1000}>
            <Typography variant="h2" animation="wave" color="rgb(22,95,199)">
              e-Learn
            </Typography>
          </Zoom>
        </header>
      ) : null}
      <main>
        {/* Define routes using react-router-dom */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Check if a user is logged in */}
          {currentUser ? (
            <Route path="/home" element={<Home />} />
          ) : (
            <Route path="/home" element={<Navigate to="/login" />} />
          )}
          <Route path="/login" element={<LogIn />} />
        </Routes>
      </main>
    </div>
  );
};

// Exporting the main component
export default App;
