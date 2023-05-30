import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import Image from "../assets/pexels.jpg";
import WordCard from "./WordCard";
import { auth } from "../utils/Firebase";
import firebase from "firebase/compat/app";
import Fade from "@mui/material/Fade";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
const HomeContainer = styled(Box)({
  backgroundImage: `url(${Image})`,
  backgroundSize: "cover",
  minHeight: "100vh",
});

const HomeDetailsContainer = styled(Grid)(({ theme }) => ({
  height: "100%",
  padding: theme.spacing(4),
}));

const HomeDetailsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
  boxShadow: theme.shadows[10],
}));
const CustomListItem = styled(ListItem)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "#e0e0e0",
    transform: "scale(1.10)", // Apply zoom effect
    transition: "transform 0.3s", // Add transition animation
  },
}));
const HomeDetails = () => {
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [learningStarted, setLearningStarted] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showWordList, setShowWordList] = useState(false);
  const [showWordDialog, setShowWordDialog] = useState(false);
  const [dialogWordIndex, setDialogWordIndex] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
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

        const chaptersSnapshot = await firebase
          .database()
          .ref("chapters")
          .once("value");
        const chaptersData = chaptersSnapshot.val();
        const chaptersArray = Object.entries(chaptersData).map(
          ([key, value]) => {
            return {
              id: key,
              name: value.name,
              words: value.words,
            };
          }
        );
        setChapters(chaptersArray);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Failed to fetch data.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChapterClick = (chapter) => {
    setSelectedChapter(chapter);
    setSelectedWord(null);
    setShowWordList(true);
  };

  const handleWordClick = async (word) => {
    setSelectedWord(word);
    setShowWordDialog(true);
    setDialogWordIndex(selectedChapter.words.indexOf(word));

    const url =
      "https://api.cognitive.microsofttranslator.com/dictionary/lookup?api-version=3.0&from=en&to=es";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "5b0660e3ccmsh44e5c1389cde10fp1e1b42jsn2d96ee274fca",
        "X-RapidAPI-Host": "microsoft-translator-text.p.rapidapi.com",
      },
      body: [
        {
          Text: "fly",
          Translation: "volar",
        },
      ],
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextWord = async () => {
    const nextIndex = dialogWordIndex + 1;
    if (nextIndex < selectedChapter.words.length) {
      setDialogWordIndex(nextIndex);
      const nextWord = selectedChapter.words[nextIndex];
      try {
        const result = await callDictionaryAPI(nextWord);
        console.log(result[0].translations);
        setApiResponse(result);
        // Update the response state variable for the next word
        // Example: setApiResponse(result);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handlePreviousWord = async () => {
    const previousIndex = dialogWordIndex - 1;
    if (previousIndex >= 0) {
      setDialogWordIndex(previousIndex);
      const previousWord = selectedChapter.words[previousIndex];
      try {
        const result = await callDictionaryAPI(previousWord);
        console.log(result);
        // show output in log by converting to json
        // console.log(result[0]);
        // console.log(apiResponse);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const callDictionaryAPI = async (word) => {
    // const { v4: uuidv4 } = require("uuid");

    let key = "fd71f14f5fb047ee998a71b51665aea3";
    let endpoint = "https://api.cognitive.microsofttranslator.com";
    let location = "eastus";

    const url = `${endpoint}/dictionary/lookup?api-version=3.0&from=en&to=ar`;

    const options = {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Ocp-Apim-Subscription-Region": location,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          text: word,
        },
      ]),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      // console.log(data);
      setApiResponse(data);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleCloseDialog = () => {
    setShowWordDialog(false);
  };

  const handleStartLearning = () => {
    setLearningStarted(true);
    // Navigate to WordCard component
    // You can use your preferred method of navigation here
  };

  return (
    <HomeContainer>
      <HomeDetailsContainer
        container
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={6}>
          <HomeDetailsPaper>
            {learningStarted ? (
              <WordCard />
            ) : (
              <>
                <Typography variant="h4" component="h2">
                  Welcome, {auth.currentUser && auth.currentUser.displayName}!
                </Typography>
                <Typography variant="h6" component="p" sx={{ mt: 2 }}>
                  You have learned {wordCount} words.
                </Typography>
                {loading ? (
                  <Box sx={{ mt: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    {error && (
                      <Typography color="error" sx={{ mt: 4 }}>
                        {error}
                      </Typography>
                    )}
                    {!showWordList ? (
                      // Chapter list section
                      <Fade in={!showWordList}>
                        <Box sx={{ mt: 4 }}>
                          <Typography variant="h6" component="p" sx={{ mt: 4 }}>
                            Select a chapter:
                          </Typography>
                          <Box
                            sx={{
                              width: "300px",
                              mt: 2,
                              mb: isMobileView ? 4 : 0,
                              maxHeight: "200px", // Set a max height to enable scrolling
                              overflow: "auto", // Enable scrolling
                            }}
                          >
                            <List>
                              {chapters.map((chapter) => (
                                <CustomListItem
                                  key={chapter.id}
                                  disablePadding
                                  button
                                  onClick={() => handleChapterClick(chapter)}
                                  sx={{
                                    backgroundColor:
                                      selectedChapter?.id === chapter.id
                                        ? "#e0e0e0"
                                        : "transparent",
                                  }}
                                >
                                  <ListItemText
                                    primary={chapter.id}
                                    sx={{ ml: 2 }}
                                  ></ListItemText>
                                </CustomListItem>
                              ))}
                            </List>
                          </Box>
                        </Box>
                      </Fade>
                    ) : (
                      // Word list section
                      <Fade in={showWordList}>
                        <Box sx={{ mt: 4 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => setShowWordList(false)} // Back button to go back to chapter list
                            sx={{ mt: 2 }}
                          >
                            Back
                          </Button>
                          <Typography variant="h6" component="p" sx={{ mt: 4 }}>
                            Select a word:
                          </Typography>
                          <Box sx={{ width: "100%", mt: 2, mb: 2 }}>
                            {selectedChapter.words.map((word) => (
                              <Button
                                key={word}
                                variant="contained"
                                color={
                                  selectedWord === word
                                    ? "secondary"
                                    : "primary"
                                }
                                size="large"
                                onClick={() => handleWordClick(word)}
                                sx={{
                                  marginRight: 2,
                                  marginBottom: 2,
                                  minWidth: "120px",
                                }}
                              >
                                {word}
                              </Button>
                            ))}
                          </Box>
                        </Box>
                      </Fade>
                    )}
                    {!selectedChapter && !showWordList && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleStartLearning}
                        sx={{ mt: 4 }}
                      >
                        Start Learning
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
          </HomeDetailsPaper>
        </Grid>
      </HomeDetailsContainer>

      {/* Word Dialog */}
      <Dialog
  open={showWordDialog}
  onClose={handleCloseDialog}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Word Details</DialogTitle>
  <DialogContent>
    {/* Render word details here */}
    {selectedChapter && selectedChapter.words[dialogWordIndex]}

    {/* Render translations */}
    {apiResponse && apiResponse.length > 0 && (
      <div>
        <h3>Translations:</h3>
        {apiResponse[0].translations.map((translation) => (
          <div key={translation.normalizedTarget}>
            <p>
              <strong>Source:</strong> {apiResponse[0].displaySource}
            </p>
            <p>
              <strong>Target:</strong> {translation.displayTarget}
            </p>
            <p>
              <strong>Part of Speech:</strong> {translation.posTag}
            </p>
            <p>
              <strong>Confidence:</strong> {translation.confidence}
            </p>
            <p>
              <strong>Back Translations:</strong>
            </p>
            <ul>
              {translation.backTranslations.map((backTranslation) => (
                <li key={backTranslation.normalizedText}>
                  <p>
                    <strong>Text:</strong> {backTranslation.displayText}
                  </p>
                  <p>
                    <strong>Frequency Count:</strong>{' '}
                    {backTranslation.frequencyCount}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}
  </DialogContent>
  <DialogActions>
    <IconButton
      color="primary"
      onClick={handlePreviousWord}
      disabled={dialogWordIndex === 0}
    >
      <ChevronLeftIcon />
    </IconButton>
    <IconButton color="primary" onClick={handleNextWord}>
      <ChevronRightIcon />
    </IconButton>
    <IconButton color="primary" onClick={handleCloseDialog}>
      <CloseIcon />
    </IconButton>
  </DialogActions>
</Dialog>


    </HomeContainer>
  );
};

export default HomeDetails;
