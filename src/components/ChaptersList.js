import { useState, useEffect, useRef } from "react";
import {
  Box,
  List,
  ListItemText,
  Typography,
  Card,
  CardContent,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
// import { styled } from "@mui/material/styles";
import {
  shuffle,
  fetchChapters,
  getTranslation,
  handlePlayAudio,
} from "../utils/Functions";
import { CustomListItem } from "../utils/ReUseable";
import SvgBackground from "../assets/abstract.svg";
// import firebase from "firebase/compat/app";
import "firebase/compat/database";
// import { auth } from "../utils/Firebase";
import Lottie from "lottie-react";
import wrong from "../assets/animations/wrong.json";
import correct from "../assets/animations/correct.json";
// import Speech from "speak-tts";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import IconButton from "@mui/material/IconButton";
// import ListItem from "@mui/material/ListItem";
import waiting from "../assets/animations/waiting-pigeon.json";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Slide from "@mui/material/Slide";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const ChaptersList = () => {
  const [isListOpen, setIsListOpen] = useState(true);

  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [translation, setTranslation] = useState("");
  const [choices, setChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [error, setError] = useState("");
  const [chapters, setChapters] = useState([]);
  // const speech = new Speech();
  const [answer, setAnswer] = useState(null);
  const containerRef = useRef(null);

  // const [currentUser, setCurrentUser] = useState(null);
  // const user = firebase.auth().currentUser;
  // const uid = user.uid;
  // const dbRef = firebase.database().ref("progress").child(uid);
  useEffect(() => {
    fetchChapters().then((chaptersArray) => {
      console.log(chaptersArray);
      setChapters(chaptersArray);
    });
  }, []);

  useEffect(() => {
    if (selectedChapter) {
      const word = selectedChapter.words[currentWordIndex];
      getTranslation(word).then((data) => {
        // console.log(data);
        setTranslation(data);
      });
    }
  }, [selectedChapter, currentWordIndex]);
  useEffect(() => {
    if (translation) {
      const choices = [translation];
      while (choices.length < 4) {
        const randomWord =
          chapters[Math.floor(Math.random() * chapters.length)].words[
            Math.floor(Math.random() * selectedChapter.words.length)
          ];
        if (!choices.includes(randomWord)) {
          choices.push(randomWord);
        }
      }
      setChoices(shuffle(choices));
    }
  }, [chapters, selectedChapter, translation]);

  const toggleList = () => {
    setIsListOpen((prevState) => !prevState);
  };

  const handleClickChapter = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentWordIndex(0);
    setTranslation("");
    setChoices([]);
    setSelectedChoice("");
    setError("");
    setAnswer(false);
  };

  const handleNextWord = () => {
    if (currentWordIndex < selectedChapter.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setTranslation("");
      setChoices([]);
      setSelectedChoice("");
      setError("");
      setAnswer(false);
    }
  };

  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setTranslation("");
      setChoices([]);
      setSelectedChoice("");
      setError("");
      setAnswer(false);
    }
  };

  const handleChoiceChange = (event) => {
    setSelectedChoice(event.target.value);
    setError("");
    setAnswer(false);
  };

  const handleCheckAnswer = () => {
    if (selectedChoice.toLowerCase() === translation.toLowerCase()) {
      setError("");
      // dbRef.child("learnedWords").push(selectedChapter.words[currentWordIndex]);
      // dbRef
      //   .child("score")
      //   .transaction((currentScore) => (currentScore || 0) + 1);
      setAnswer(true);
      // handleNextWord();
    } else {
      setError("Incorrect answer. Try again.");
    }
  };
  const handleClose = () => {
    setSelectedChapter(null);
    setTranslation(null);
    setAnswer(false);
  };
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        width: "100%",
        backgroundImage: `url(${SvgBackground})`,
        backgroundSize: "auto",
      }}
      ref={containerRef}
    >
      {isListOpen && (
        <Box
          sx={{
            // position: "fixed",
            top: "0",
            // left: isListOpen ? "0" : "-30%",
            zIndex: "1",
            width: "20%",
            p: 1.5,
            maxHeight: "100vh",
            overflowY: "auto",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
            transition: "left 0.3s ease-in-out",
          }}
        >
          <Slide
            direction="right"
            in={isListOpen}
            timeout={1000}
            container={containerRef.current}
          >
            <List>
              {chapters.map((chapter) => (
                  <CustomListItem
                    key={chapter.id}
                    button
                    onClick={() => handleClickChapter(chapter)}
                    sx={{
                      backgroundColor:
                        selectedChapter?.id === chapter.id
                          ? "#e0e0e0"
                          : "transparent",
                      borderRadius: "10px",
                      margin: "8px",
                      paddingTop: "5px",
                      paddingBottom: "5px",
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <Slide direction="right" in={isListOpen} timeout={2000}>
                      <ListItemText
                        primary={chapter.id}
                        sx={{
                          color: "#1769aa",
                          ml: 2,
                        }}
                      />
                    </Slide>
                  </CustomListItem>
              ))}
            </List>
          </Slide>
        </Box>
      )}
      <IconButton
        sx={{
          position: "relative",
          top: "50%",
          zIndex: "1",
          transform: "translateY(-50%)",
          transition: "left 0.3s ease-in-out",
        }}
        onClick={toggleList}
      >
        {isListOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
      {selectedChapter && (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          <Box
  sx={{
    width: "50%",
    marginBottom: "20px",
    backgroundColor: "transparent",
    boxShadow: "none",
  }}
>
  <LinearProgress
    variant="determinate"
    value={((currentWordIndex + 1) / selectedChapter.words.length) * 100}
    sx={{
      height: "10px",
      borderRadius: "5px",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      "& .MuiLinearProgress-bar": {
        backgroundColor: "#1769aa",
      },
    }}
  />
</Box>

          <Typography variant="body1" sx={{ textAlign: "center", mb: "10px" }}>
            Words Learned: {currentWordIndex + 1} /{" "}
            {selectedChapter.words.length}
          </Typography>

          <Card
            sx={{
              mb: 2,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "10px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{ textAlign: "center" }}
              >
                {selectedChapter.words[currentWordIndex]}
              </Typography>
              <IconButton
                color="success"
                onClick={() => handlePlayAudio(translation)}
              >
                <VolumeUpIcon sx={{color: "#1769aa"}} ></VolumeUpIcon>


              </IconButton>
            </CardContent>
          </Card>
          {translation && (
            <FormControl
              component="fieldset"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <RadioGroup
                aria-label="choices"
                name="choices"
                value={selectedChoice}
                onChange={handleChoiceChange}
              >
                {choices.map((choice, index) => (
                  <FormControlLabel
                    key={index}
                    value={choice}
                    control={<Radio />}
                    label={choice}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
          <div>
            <Button
              variant="contained"
              onClick={handlePreviousWord}
              disabled={currentWordIndex === 0}
              sx={{ marginRight: "10px" }}
            >
              Previous Word
            </Button>
            <Button
              variant="contained"
              onClick={handleNextWord}
              disabled={
                currentWordIndex === selectedChapter.words.length - 1 || !answer
              }
              sx={{ marginLeft: "10px" }}
            >
              Next Word
            </Button>
          </div>
          <Button
            color="success"
            variant="contained"
            onClick={handleCheckAnswer}
            disabled={!selectedChoice}
            sx={{ mt: 2 }}
          >
            Check Answer
          </Button>
          {error && (
            <Box>
              <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
                {error}
              </Typography>
              <Lottie
                animationData={wrong}
                style={{ width: "100px", height: "100px", margin: "auto" }}
              />
            </Box>
          )}

          {answer && (
            <Box>
              <Typography color="success" sx={{ mt: 2, textAlign: "center" }}>
                Hurray..Correct answer!
              </Typography>
              <Lottie
                animationData={correct}
                style={{ width: "100px", height: "100px", margin: "auto" }}
              />
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              mt: 2,
              backgroundColor: "rgba(255, 152, 0, 1)",
              borderRadius: "10px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            Close
          </Button>
        </Box>
      )}
      {!selectedChapter && (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          <Lottie
            animationData={waiting}
            style={{ width: "300px", height: "300px" }}
          />
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              animation: "zoom 3s infinite",
              "@keyframes zoom": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.1)" },
                "100%": { transform: "scale(1)" },
              },
            }}
          >
            Select a chapter to start learning
          </Typography>
        </Box>
      )}
    </Box>
  );
};
export default ChaptersList;
