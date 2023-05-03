import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './LandingPage';
import SignUp from './SignUp';
import Home from './Home';
import Typography from '@mui/material/Typography';

const App = () => {
  return (
    <Router>
      <div className="App">
        <header>
        <Typography variant="h2" animation="wave" color="rgb(22,95,199)">El-Learn</Typography>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
