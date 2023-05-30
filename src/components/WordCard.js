import React, { useEffect, useState, useCallback } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { auth } from "../utils/Firebase";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "..//assets/pexels.jpg";

export default function WordCard() {
  const [word, setWord] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [response, setResponse] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const handleApiCall = useCallback(async () => {
    if (!word) return;

    setResponse(null); // reset response to null before fetching new data

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const responseData = await response.json();
    setResponse(responseData);
    setLoaded(true);

    // Record the word in the user's history
    const historyRef = firebase
      .database()
      .ref("users/" + auth.currentUser.uid + "/history/" + word);
    historyRef.set({
      learned: true,
      timestamp: Date.now(),
    });
  }, [word]);

  useEffect(() => {
    const fetchWord = async () => {
      const snapshot = await firebase
        .database()
        .ref(`words/${currentIndex}`)
        .once("value");
      const word = snapshot.val();
      setWord(word);
    };

    fetchWord();
  }, [currentIndex]);

  const handleNextClick = async () => {
    setLoaded(false);
    setWord(null);
    setCurrentIndex(currentIndex + 1);
  };

  const handlePrevClick = async () => {
    setLoaded(false);
    setWord(null);
    setCurrentIndex(currentIndex - 1);
  };

  useEffect(() => {
    handleApiCall();
  }, [word, handleApiCall]);

  return (
    <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      borderRadius: '10px',
      backgroundImage: `url(${Image})`,
      backgroundSize: 'cover',
      minHeight: '120vh',
      backgroundPosition: "center bottom", // Adjust the background position
      backgroundAttachment: "fixed", // Fix the background image so that it doesn't scroll

    }}
    >
      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          zIndex: 0,
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#F5F5F5",
                borderRadius: "20px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    flex: "1 0 auto",
                    overflowY: "auto",
                    maxHeight: "400px",
                  }}
                >
                  {!loaded && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "400px",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  )}
                  {loaded && (
                    <CardContent
                      sx={{
                        transition: "transform 0.3s ease-in-out",
                        transform: loaded ? "scale(1)" : "scale(0.8)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        component="div"
                        variant="h5"
                        align="center"
                        sx={{ fontWeight: "bold", mb: "20px" }}
                      >
                        {word}
                      </Typography>
                      {response &&
                        response[0].phonetics.map((phonetic, index) => (
                          <div
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: "10px",
                            }}
                          >
                            {phonetic.text && (
                              <Typography
                                variant="subtitle1"
                                align="center"
                                sx={{ mr: "10px" }}
                              >
                                {phonetic.text}
                              </Typography>
                            )}
                            {phonetic.audio && (
                              <audio controls src={phonetic.audio} />
                            )}
                          </div>
                        ))}
                      {response &&
                        response[0].meanings.map((meaning, index) => (
                          <div
                            key={index}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              mb: "20px",
                            }}
                          >
                            <Typography
                              variant="h6"
                              align="center"
                              sx={{ fontWeight: "bold", mb: "10px" }}
                            >
                              {meaning.partOfSpeech}
                            </Typography>
                            {meaning.definitions.map((definition, idx) => (
                              <Typography
                                key={idx}
                                variant="body1"
                                align="center"
                                sx={{ mb: "10px" }}
                              >
                                {definition.definition}
                              </Typography>
                            ))}
                          </div>
                        ))}
                    </CardContent>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pl: 1,
                    pb: 1,
                  }}
                >
                  <Button
                    aria-label="previous"
                    onClick={handlePrevClick}
                    disabled={currentIndex === 0}
                    sx={{
                      color: "blue",
                      textTransform: "none",
                    }}
                  >
                    <SkipPreviousIcon sx={{ mr: 1 }} />
                    Previous Word
                  </Button>
                  <Button
                    aria-label="next"
                    onClick={handleNextClick}
                    disabled={currentIndex === 999}
                    sx={{
                      color: "blue",
                      textTransform: "none",
                    }}
                  >
                    Next Word
                    <SkipNextIcon sx={{ ml: 1 }} />
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
