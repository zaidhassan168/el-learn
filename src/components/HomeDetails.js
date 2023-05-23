import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { auth } from "../utils/Firebase";
import firebase from "firebase/compat/app";
import CircularProgress from "@mui/material/CircularProgress";
import WordCard from "./WordCard";

export default function HomeDetails() {
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [learningStarted, setLearningStarted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await firebase
          .database()
          .ref(`users/${auth.currentUser.uid}/history`)
          .once("value");
        const words = snapshot.val();
        if (words) {
          const count = Object.keys(words).length;
          setWordCount(count);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Failed to fetch data.");
      }
    };

    fetchData();
  }, []);

  const handleStartLearning = () => {
    setLearningStarted(true);
  };

  return (
    <Box className="home-container">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={6}>
          {learningStarted ? (
            <WordCard />
          ) : (
            <Paper className="home-paper">
              <Typography variant="h4" component="h2" className="section-title">
                Welcome, {auth.currentUser.displayName}!
              </Typography>
              <Typography variant="h6" component="p" className="word-count">
                You have learned {wordCount} words.
              </Typography>
              {loading ? (
                <Box className="loader-container">
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {error && (
                    <Typography color="error" className="error-message">
                      {error}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleStartLearning}
                    className="start-learning-button"
                  >
                    Start Learning
                  </Button>
                </>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
