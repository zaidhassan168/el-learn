import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './LandingPage';
import SignUp from './SignUp';
import Home from './Home';
import LogIn from './LogIn';
import Typography from '@mui/material/Typography';
import { Zoom } from '@mui/material';
const App = () => {
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
