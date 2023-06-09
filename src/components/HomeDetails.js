import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import SvgBackground from "../assets/abstract.svg";
// import WordCard from "./WordCard";
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
import Speech from "speak-tts";

const HomeContainer = styled(Box)({
  backgroundImage: `url(${SvgBackground})`,
  backgroundSize: "cover",
  minHeight: "100vh",
  backgroundAttachment: "fixed",
  backgroundPosition: "center bottom", // Adjust the background position
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
  // const [learningStarted, setLearningStarted] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showWordList, setShowWordList] = useState(false);
  const [showWordDialog, setShowWordDialog] = useState(false);
  const [dialogWordIndex, setDialogWordIndex] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
  const [apiResponse2, setApiResponse2] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [translatedWord, setTranslatedWord] = useState(null);
  const speech = new Speech();

  speech
    .init({
      volume: 1,
      lang: "sv-SE",
      rate: 0.8,
      pitch: 1,
      voice: "Alva",
      splitSentences: true,
      // listeners: {
      //   onvoiceschanged: (voices) => {
      //     console.log("Event voiceschanged", voices);
      //   },
      // },
    })
    .then((data) => {
      // The "data" object contains the list of available voices and the voice synthesis params
      console.log("Speech is ready, voices are available", data);
    })
    .catch((e) => {
      console.error("An error occured while initializing : ", e);
    });

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
        console.log(error);
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
    try {
      setIsCalling(true);
      const result = await callDictionaryAPI(word);
      await callDictionaryExampleAPI(
        result[0].displaySource,
        result[0].translations[0].displayTarget
      );
      // callTextToSpeechAPI(result[0].displaySource);

      setIsCalling(false);
      setTranslatedWord(result[0].translations[0].displayTarget);
      console.log(result[0].translations);
      setApiResponse(result);
      // Update the response state variable for the next word
      // Example: setApiResponse(result);
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
        setIsCalling(true);
        const result = await callDictionaryAPI(nextWord);
        // setApiResponse(result);

        await callDictionaryExampleAPI(
          result[0].displaySource,
          result[0].translations[0].displayTarget
        );
        // callTextToSpeechAPI(result[0].displaySource);

        // console.log(result2);
        console.log(apiResponse2[0].examples);
        // setApiResponse2(result2);
        setIsCalling(false);
        setTranslatedWord(result[0].translations[0].displayTarget);

        // console.log(result[0].translations);
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
        setIsCalling(true);
        const result = await callDictionaryAPI(previousWord);
        await callDictionaryExampleAPI(
          result[0].displaySource,
          result[0].translations[0].displayTarget
        );
        // callTextToSpeechAPI(result[0].displaySource);

        setIsCalling(false);
        setTranslatedWord(result[0].translations[0].displayTarget);

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

    const url = `${endpoint}/dictionary/lookup?api-version=3.0&from=en&to=sv`;

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

  const callDictionaryExampleAPI = async (source, target) => {
    // const { v4: uuidv4 } = require("uuid");

    let key = "fd71f14f5fb047ee998a71b51665aea3";
    let endpoint = "https://api.cognitive.microsofttranslator.com";
    let location = "eastus";

    const url = `${endpoint}/dictionary/examples?api-version=3.0&from=en&to=sv`;
    const options = {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Ocp-Apim-Subscription-Region": location,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          text: source,
          translation: target,
        },
      ]),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      // console.log(data);
      setApiResponse2(data);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  };

  const handlePlayAudio = async (word) => {
    console.log(word);

    speech
      .speak({
        text: word,
      })
      .then(() => {
        console.log("Success !");
      })
      .catch((e) => {
        console.error("An error occurred :", e);
      });
  };

  const handleCloseDialog = () => {
    setShowWordDialog(false);
  };

  return (
    <HomeContainer>
      <HomeDetailsContainer
        container
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} md={10}>
          <HomeDetailsPaper>
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
                      <Box sx={{ mt: 5, mb: 5 }}>
                        <Typography
                          variant="h6"
                          component="p"
                          sx={{
                            mt: 4,
                            mb: 10,
                            color: "#757575",
                            animation: "zoom 2s infinite",
                            "@keyframes zoom": {
                              "0%": { transform: "scale(1)" },
                              "50%": { transform: "scale(1.2)" },
                              "100%": { transform: "scale(1)" },
                            },
                          }}
                        >
                          Select a chapter
                        </Typography>
                        <Box
                          sx={{
                            width: "350px",
                            mt: 2,
                            mb: isMobileView ? 4 : 0,
                            maxHeight: "300px", // Set a max height to enable scrolling
                            overflowY: "auto",
                            paddingRight: "20px",
                          }}
                        >
                          <List
                            sx={{
                              width: "100%",
                              padding: "20px",
                            }}
                          >
                            {chapters.map((chapter) => (
                              <CustomListItem
                                key={chapter.id}
                                button
                                onClick={() => handleChapterClick(chapter)}
                                sx={{
                                  backgroundColor:
                                    selectedChapter?.id === chapter.id
                                      ? "#e0e0e0"
                                      : "transparent",
                                  borderRadius: "10px",
                                  margin: "15px",
                                  padding: "15px",
                                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                                  transition: "all 0.3s ease-in-out",
                                  "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow:
                                      "0px 0px 20px rgba(0, 0, 0, 0.2)",
                                  },
                                }}
                              >
                                <ListItemText
                                  primary={chapter.id}
                                  sx={{
                                    ml: 2,
                                  }}
                                />
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
                                selectedWord === word ? "secondary" : "primary"
                              }
                              size="large"
                              onClick={() => handleWordClick(word)}
                              sx={{
                                marginRight: 2,
                                marginBottom: 2,
                                minWidth: "120px",
                                borderRadius: "50px",
                                boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
                                transition: "all 0.3s ease-in-out",
                                "&:hover": {
                                  transform: "scale(1.1)",
                                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                                },
                                "&:active": {
                                  transform: "scale(0.9)",
                                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                                },
                              }}
                            >
                              {word}
                            </Button>
                          ))}
                        </Box>
                      </Box>
                    </Fade>
                  )}
                </>
              )}
            </>
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
        {isCalling && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {!isCalling && (
          <DialogContent>
            {/* Render word details here */}
            {selectedChapter && selectedChapter.words[dialogWordIndex]}

            {/* Render translations */}
            {apiResponse && apiResponse.length > 0 && (
              <div>
                <h3>Translations:</h3>
                {apiResponse[0].translations.length > 0 && (
                  <div>
                    <p>
                      <strong>English:</strong> {apiResponse[0].displaySource}
                    </p>
                    <p>
                      <strong>Swedish:</strong>{" "}
                      {apiResponse[0].translations[0].displayTarget}
                    </p>
                    <p>
                      <strong>Part of Speech:</strong>{" "}
                      {apiResponse[0].translations[0].posTag}
                    </p>
                  </div>
                )}
                {/* <h3>Examples:</h3>
                {apiResponse2 && apiResponse2.length > 0 && (
                  <div>
                    {apiResponse2[0].examples.map((example) => (
                      <div key={example.normalizedSource}>
                        <p>
                          <strong>English:</strong> {example.sourcePrefix}
                          {example.sourceTerm} {example.sourceSuffix}
                        </p>
                        <p>
                          <strong>Swedish:</strong> {example.targetPrefix}
                          {example.targetTerm} {example.targetSuffix}
                        </p>
                      </div>
                    ))}
                  </div>
                )} */}
              </div>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={() => handlePlayAudio(translatedWord)}
            >
              Play Audio
            </Button>
          </DialogContent>
        )}
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
