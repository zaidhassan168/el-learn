// Importing necessary components and functions
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import SvgBackground from "../assets/abstract.svg";
import { PieChart } from 'react-minimal-pie-chart';

// Importing utility functions
import {
  fetchChapters,
  callDictionaryAPI,
  callDictionaryExampleAPI,
  handlePlayAudio,
  getSelectedLanguage,
} from "../utils/Functions";

import { useNavigate } from 'react-router-dom';

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
import ChaptersList from "./ChaptersList";
// Styling components
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
  backgroundColor: "transparent",
  backdropFilter: "blur(10px)",
  boxShadow: theme.shadows[10],
}));

const HomeDetails = ({ sendDataToParent }) => {
  // State variables
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isChapterSelected, setIsChapterSelected] = useState(false)
  // Data for the pie chart
  const data = [
    { title: "Learned Words", value: wordCount, color: "#E38627" },
    { title: "Remaining Words", value: 25 - wordCount, color: "#6A2135" },
  ]

  const navigate = useNavigate();

  useEffect(() => {
    // Fetching data
    const fetchData = async () => {
      try {
        // Fetching word count from Firebase
        const snapshot = await firebase
          .database()
          .ref(`users/${auth.currentUser.uid}/history`)
          .once("value");
        const words = snapshot.val();
        if (words) {
          // Count the number of words
          const count = Object.keys(words).length;
          // Set the word count state
          setWordCount(count);
        }

        // Fetching chapters
        fetchChapters().then((chapters) => {
          // Set the chapters state
          setChapters(chapters);
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
        setError("Failed to fetch data.");
      }
    };

    fetchData();
  }, [selectedLanguage]);

  useEffect(() => {
    // Function to handle window resize event
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };

    // Initial handling of window resize
    handleResize();

    // Event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClickChild = (chapter) => {
    // const data = 'Example Data';
    // navigate("/chaptersList");
    setIsChapterSelected(true);
    sendDataToParent(chapter); // Call the callback function in the parent component with the data

  };
  // Function to handle chapter click
  const handleChapterClick = (chapter) => {
    handleClickChild(chapter);
    setSelectedChapter(chapter);
    setSelectedWord(null);
    setShowWordList(true);

  };

  // Function to handle word click
  const handleWordClick = async (word) => {
    setSelectedWord(word);
    setShowWordDialog(true);
    setDialogWordIndex(selectedChapter.words.indexOf(word));

    try {
      setIsCalling(true);
      const result = await callDictionaryAPI(word);
      setApiResponse2(
        await callDictionaryExampleAPI(
          result[0].displaySource,
          result[0].translations[0].displayTarget
        )
      );
      setIsCalling(false);
      setTranslatedWord(result[0].translations[0].displayTarget);
      setApiResponse(result);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle next word click
  const handleNextWord = async () => {
    const nextIndex = dialogWordIndex + 1;

    if (nextIndex < selectedChapter.words.length) {
      setDialogWordIndex(nextIndex);
      const nextWord = selectedChapter.words[nextIndex];

      try {
        setIsCalling(true);
        const result = await callDictionaryAPI(nextWord);
        setApiResponse(result);
        setApiResponse2(
          await callDictionaryExampleAPI(
            result[0].displaySource,
            result[0].translations[0].displayTarget
          )
        );
        setIsCalling(false);
        setTranslatedWord(result[0].translations[0].displayTarget);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handlePreviousWord = async () => {
    // Calculate the index of the previous word
    const previousIndex = dialogWordIndex - 1;
    if (previousIndex >= 0) {
      // Update the dialog word index
      setDialogWordIndex(previousIndex);
      // Get the previous word from the selected chapter
      const previousWord = selectedChapter.words[previousIndex];
      try {
        setIsCalling(true);
        // Call the dictionary API for the previous word
        const result = await callDictionaryAPI(previousWord);
        setApiResponse(result);
        // Call the dictionary example API with the appropriate parameters
        setApiResponse2(
          await callDictionaryExampleAPI(
            result[0].displaySource,
            result[0].translations[0].displayTarget
          )
        );
        setIsCalling(false);
        // Update the translated word state
        setTranslatedWord(result[0].translations[0].displayTarget);
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCloseDialog = () => {
    // Close the word dialog by setting the showWordDialog state to false
    setShowWordDialog(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the selected language
        const lang = await getSelectedLanguage();
        // Set the selected language state
        setSelectedLanguage(lang);
      } catch (error) {
        setLoading(false);
        console.log(error);
        setError("Failed to fetch data.");
      }
    };

    fetchData();
  }, [dialogWordIndex]);

  return (
    <HomeContainer>
      {isChapterSelected ? (
        <ChaptersList />
      ) : (
        <>
          {/* Home details container */}
          <HomeDetailsContainer container justifyContent="center" alignItems="center">
            <Grid item xs={12} md={10}>
              {/* Home details paper */}
              <HomeDetailsPaper>
                <>
                  <Typography variant="h4" component="h2">
                    Welcome, {auth.currentUser && auth.currentUser.displayName}!
                  </Typography>
                  {/* Display word count */}
                  {wordCount === 0 ? (
                    <Typography variant="h6" component="p" sx={{ mt: 2 }}>
                      You have not started your journey!
                    </Typography>
                  ) : (
                    <Box sx={{ width: '180px', marginTop: '10px' }}>
                      <Typography>
                        Your Progress
                      </Typography>
                      {/* Render progress chart */}
                      <PieChart
                        data={data}
                        expandOnHover
                        onSectorHover={(d, i, e) => {
                          if (d) {
                            console.log("Mouse enter - Index:", i, "Data:", d, "Event:", e)
                          } else {
                            console.log("Mouse leave - Index:", i, "Event:", e)
                          }
                        }}
                      />
                    </Box>
                  )}

                  {/* Render loading spinner */}
                  {loading ? (
                    <Box sx={{ mt: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      {/* Render error message */}
                      {error && (
                        <Typography color="error" sx={{ mt: 4 }}>
                          {error}
                        </Typography>
                      )}
                      {/* Check if word list is shown */}
                      {!showWordList ? (
                        // Chapter list section
                        <Fade in={!showWordList}>
                          <Box sx={{ mt: 2, mb: 3 }}>
                            <Typography
                              variant="h6"
                              component="p"
                              sx={{
                                mt: 3,
                                mb: 4,
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
                            {/* Render chapter buttons */}
                            <Box
                              sx={{
                                gridTemplateColumns:
                                  "repeat(auto-fit, minmax(120px, 1fr))",
                                gridGap: "15px",
                                paddingRight: "20px",
                              }}
                            >
                              {chapters.map((chapter) => (
                                <Button
                                  key={chapter.id}
                                  variant="outlined"
                                  color={
                                    selectedChapter?.id === chapter.id
                                      ? "secondary"
                                      : "primary"
                                  }
                                  size="large"
                                  onClick={() => handleChapterClick(chapter)}
                                  sx={{
                                    borderRadius: "10px",
                                    boxShadow:
                                      "0px 0px 10px rgba(0, 0, 0, 0.1)",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": {
                                      transform: "scale(1.05)",
                                      boxShadow:
                                        "0px 0px 20px rgba(0, 0, 0, 0.2)",
                                    },
                                    m: 1,
                                  }}
                                >
                                  {chapter.id}
                                </Button>
                              ))}
                            </Box>
                          </Box>
                        </Fade>
                      ) : (
                        // Word list section
                        <Fade in={showWordList}>
                          <Box sx={{ mt: 4 }}>
                            {/* Back button to go back to chapter list */}
                            <Button
                              variant="contained"
                              color="primary"
                              size="large"
                              onClick={() => setShowWordList(false)}
                              sx={{ mt: 2 }}
                            >
                              Back
                            </Button>
                            <Typography
                              variant="h6"
                              component="p"
                              sx={{ mt: 4 }}
                            >
                              Select a word:
                            </Typography>
                            {/* Render word buttons */}
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
                                    borderRadius: "50px",
                                    boxShadow:
                                      "0px 5px 10px rgba(0, 0, 0, 0.2)",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": {
                                      transform: "scale(1.1)",
                                      boxShadow:
                                        "0px 10px 20px rgba(0, 0, 0, 0.2)",
                                    },
                                    "&:active": {
                                      transform: "scale(0.9)",
                                      boxShadow:
                                        "0px 2px 5px rgba(0, 0, 0, 0.2)",
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
            {/* Render loading spinner */}
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
                {/* Render word details */}
                {selectedChapter && selectedChapter.words[dialogWordIndex]}

                {/* Render translations */}
                {apiResponse && apiResponse.length > 0 && (
                  <div>
                    <h3>Translations:</h3>
                    {apiResponse[0].translations.length > 0 && (
                      <div>
                        <p>
                          <strong>English:</strong>{" "}
                          {apiResponse[0].displaySource}
                        </p>
                        <p>
                          <strong>{selectedLanguage}:</strong>{" "}
                          {
                            apiResponse[0].translations[0].displayTarget
                          }
                        </p>
                        <p>
                          <strong>Part of Speech:</strong>{" "}
                          {
                            apiResponse[0].translations[0].posTag
                          }
                        </p>
                      </div>
                    )}
                    <h3>Examples:</h3>
                    {/* Render examples */}
                    {apiResponse2 && apiResponse2.length > 0 && (
                      <div>
                        {apiResponse2[0].examples.map((example) => (
                          <div key={example.normalizedSource}>
                            <p>
                              <strong>English:</strong>{" "}
                              {example.sourcePrefix}
                              {example.sourceTerm} {example.sourceSuffix}
                            </p>
                            <p>
                              <strong>{selectedLanguage}:</strong>{" "}
                              {example.targetPrefix}
                              {example.targetTerm} {example.targetSuffix}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Play audio button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePlayAudio(translatedWord)}
                >
                  Play Audio
                </Button>
              </DialogContent>
            )}
            {/* Dialog actions */}
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
        </>
      )
      };

    </HomeContainer>
  );
};

export default HomeDetails;
