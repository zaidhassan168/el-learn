import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import "../css/App.css";
import LandingPage from "./LandingPage";
import SignUp from "../authentication/SignUp";
import Home from "./Home";
import LogIn from "../authentication/LogIn";
import Typography from "@mui/material/Typography";
import { Zoom } from "@mui/material";

const App = () => {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("user");
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      if (
        location.pathname === "/signup" ||
        location.pathname === "/login" ||
        location.pathname === "/"
      ) {
        navigate("/home");
      }
    } else {
      if (location.pathname === "/home") {
        navigate("/login");
      }
    }
  }, [navigate, location.pathname]);

  return (
    <div className="App">
      {location.pathname === "/" ||
      location.pathname === "/signup" ||
      location.pathname === "/login" ? (
        <header>
          <Zoom in={true} timeout={1000}>
            <Typography variant="h2" animation="wave" color="rgb(22,95,199)">
              El-Learn
            </Typography>
          </Zoom>
        </header>
      ) : null}
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
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

export default App;
