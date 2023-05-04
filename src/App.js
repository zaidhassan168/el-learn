import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { auth } from "./Firebase";
import './App.css';
import LandingPage from './LandingPage';
import SignUp from './SignUp';
import Home from './Home';
import LogIn from './LogIn';
import Typography from '@mui/material/Typography';
import { Zoom } from '@mui/material';

const App = () => {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       navigate("/home");
  //     }
  //   });
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     navigate("/home");
  //   }
  // }, [navigate]);
  return (
    <Router>
      <div className="App">
        <header>
          <Zoom in={true} timeout={1000}>
        <Typography variant="h2" animation="wave" color="rgb(22,95,199)">El-Learn</Typography>
        </Zoom>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LogIn/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
