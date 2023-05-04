import React from 'react';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import Zoom from "@mui/material/Zoom";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Zoom in={true} timeout={1000}>
      <AppBar position="static">
        <Toolbar className="nav">
          <div className="nav-left"></div>
          <div className="nav-right">
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/signup">Sign up</Button>
          </div>
        </Toolbar>
      </AppBar>
      </Zoom>
      <div className="hero">
        <h1>Learn a New Language Today</h1>
        <p>Start your language learning journey with our interactive tool.</p>
        <Button variant="contained" color="primary">
          Get Started
        </Button>
      </div>
      <div className="features">
        <div className="feature">
          <h2>Interactive Flashcards</h2>
          <p>Practice vocabulary and study efficiently with our interactive flashcards.</p>
        </div>
        <div className="feature">
          <h2>Verb Conjugation</h2>
          <p>Improve your grammar skills and learn verb conjugation with our easy-to-use tools.</p>
        </div>
        <div className="feature">
          <h2>Pronunciation Guides</h2>
          <p>Master language pronunciation with our in-depth guides and audio resources.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
