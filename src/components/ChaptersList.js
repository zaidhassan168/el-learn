import { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItemButton,
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
import { shuffle } from "../utils/Funtions";
import SvgBackground from "../assets/abstract.svg";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { auth } from "../utils/Firebase";
import Lottie from "lottie-react";
import wrong from "../assets/animations/wrong.json";
import correct from "../assets/animations/correct.json";
import Speech from "speak-tts";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import IconButton from "@mui/material/IconButton";

const ChaptersList = () => {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [translation, setTranslation] = useState("");
  const [choices, setChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [error, setError] = useState("");
  const [chapters, setChapters] = useState([]);
  const speech = new Speech();
  const [answer, setAnswer] = useState(null);
  // const [currentUser, setCurrentUser] = useState(null);
  const user = auth.currentUser;
  const uid = user.uid;
  const dbRef = firebase.database().ref("progress").child(uid);
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const databaseRef = firebase.database().ref("chapters");
        const snapshot = await databaseRef.once("value");
        const chaptersData = snapshot.val();

        if (chaptersData) {
          const chaptersArray = Object.keys(chaptersData).map((key) => ({
            id: key,
            title: key,
            words: chaptersData[key].words || [],
          }));

          setChapters(chaptersArray);
        }
      } catch (error) {
        console.error("Failed to fetch chapters:", error);
      }
    };


    fetchChapters();
  }, []);

  useEffect(() => {
    const getTranslation = async (word) => {
      let key = "fd71f14f5fb047ee998a71b51665aea3";
      let endpoint = "https://api.cognitive.microsofttranslator.com";
      let location = "eastus";

      const url = `${endpoint}/translate?api-version=3.0&from=en&to=sv`;

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
        console.log(data[0].translations[0].text);
        setTranslation(data[0].translations[0].text);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    };

    if (selectedChapter) {
      const word = selectedChapter.words[currentWordIndex];
      getTranslation(word);
    }
  }, [selectedChapter, currentWordIndex]);

  useEffect(() => {
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
  });
  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     console.log(user);
  //     if (user) {
  //       const databaseRef = firebase
  //         .database()
  //         .ref("Progress")
  //         .child(uid)
  //       setDbRef(databaseRef);
  //     }
  //   });
  // });
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

  const handlePlayAudio = async (word) => {
    console.log(word);

    speech
      .speak({
        text: translation,
      })
      .then(() => {
        console.log("Success !");
      })
      .catch((e) => {
        console.error("An error occurred :", e);
      });
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
      dbRef.child("learnedWords").push(selectedChapter.words[currentWordIndex]);
      dbRef.child("score").transaction((currentScore) => (currentScore || 0) + 1);
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
    >
      <List
        sx={{
          width: "200px",
          marginRight: "20px",
          maxHeight: "100vh",
          overflowY: "auto",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {chapters.map((chapter) => (
          <ListItemButton
            key={chapter.id}
            onClick={() => handleClickChapter(chapter)}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <ListItemText primary={chapter.title} />
            <Typography variant="body2">
              {chapter.words.length} words
            </Typography>
          </ListItemButton>
        ))}
      </List>
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
                onClick={() =>
                  handlePlayAudio(selectedChapter.words[currentWordIndex])
                }
              >
                <VolumeUpIcon />
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
              disabled={currentWordIndex === selectedChapter.words.length - 1}
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
              <Typography color= "success"  sx={{ mt: 2, textAlign: "center" }}>
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
    </Box>
  );
};
export default ChaptersList;
