// Importing necessary components and functions
import { useState, useEffect, useRef, forwardRef } from "react";
import {
  Box,
  List,
  ListItemText,
  Typography,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Radio,
  Button,
  CircularProgress,
} from "@mui/material"; // Importing necessary components from MUI
import {
  shuffle,
  fetchChapters,
  getTranslation,
  handlePlayAudio,
  getSelectedLanguage,
  callDictionaryAPI,
  callDictionaryExampleAPI,
} from "../utils/Functions";
// Importing necessary components from MUI
import Grid from "@mui/material/Grid"; // Grid version 1
import { CustomListItem } from "../utils/ReUseable";
import SvgBackground from "../assets/abstract.svg";
import firebase from "firebase/compat/app";
import Lottie from "lottie-react";
import wrong from "../assets/animations/wrong.json";
import correct from "../assets/animations/correct.json";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import IconButton from "@mui/material/IconButton";
import waiting from "../assets/animations/waiting-pigeon.json";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Slide from "@mui/material/Slide";
import Fade from "@mui/material/Fade";

// Importing necessary components from MUI for the dialog box
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";

// Importing the WordDetails component
import WordDetails from "./WordDetails";

const ChaptersList = () => {
  // State variables
  const [isListOpen, setIsListOpen] = useState(true); // Toggle the list view
  const [dialogOpen, setDialogOpen] = useState(false); // Control the dialog visibility
  const [selectedWord, setSelectedWord] = useState(""); // Track the selected word
  const [selectedChapter, setSelectedChapter] = useState(null); // Track the selected chapter
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // Track the current word index
  const [translation, setTranslation] = useState(""); // Store the translation of a word
  const [choices, setChoices] = useState([]); // Store the choices for the multiple-choice quiz
  const [selectedChoice, setSelectedChoice] = useState(""); // Track the selected choice
  const [error, setError] = useState(""); // Store the error message
  const [isExampleOpen, setIsExampleOpen] = useState(false); // Control the example dialog visibility
  const [chapters, setChapters] = useState([]); // Store the chapters
  const [language, setLanguage] = useState(getSelectedLanguage()); // Track the selected language
  const [answer, setAnswer] = useState(null); // Store the answer result
  const containerRef = useRef(null); // Reference to the container element
  const [isCallingExampleAPI, setIsCallingExampleAPI] = useState(false); // Track whether the dictionary example API is being called
  const [apiResponse2, setApiResponse2] = useState(null); // Store the response from the dictionary example API

  // State variables for managing the component's behavior
  const [isListOpen, setIsListOpen] = useState(true); // boolean state variable to toggle the display of the chapter list
  const [dialogOpen, setDialogOpen] = useState(false); // boolean state variable to toggle the display of a dialog box
  const [selectedWord, setSelectedWord] = useState(""); // string state variable to store the selected word

  const [selectedChapter, setSelectedChapter] = useState(null); // object state variable to store the selected chapter
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // integer state variable to store the index of the current word being displayed
  const [translation, setTranslation] = useState(""); // string state variable to store the translation of the current word
  const [choices, setChoices] = useState([]); // array state variable to store the choices for the multiple choice question
  const [selectedChoice, setSelectedChoice] = useState(""); // string state variable to store the selected choice for the multiple choice question
  const [error, setError] = useState(""); // string state variable to store any error messages
  const [isExampleOpen, setIsExampleOpen] = useState(false); // boolean state variable to toggle the display of an example sentence
  const [chapters, setChapters] = useState([]); // array state variable to store the list of chapters
  const [language, setLanguage] = useState(getSelectedLanguage()); // string state variable to store the selected language
  const [answer, setAnswer] = useState(null); // object state variable to store the answer to the multiple choice question
  const containerRef = useRef(null); // reference to the container element
  const [isCallingExampleAPI, setIsCallingExampleAPI] = useState(false); // boolean state variable to indicate if the example API is being called
  const [apiResponse2, setApiResponse2] = useState(null); // object state variable to store the response from the example API



  // This function defines the transition for the dialog box
  const dialogTransition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  // Fetch the chapters and set the chapters state
  // This useEffect hook is used to fetch the chapters and set them in the state variable
  useEffect(() => {
    getLanguage();
    fetchChapters().then((chaptersArray) => {
      console.log(chaptersArray);
      setChapters(chaptersArray);
    });
  }, []);

  // This useEffect hook is used to get the translation of the current word
  useEffect(() => {
    if (selectedChapter) {
      const word = selectedChapter.words[currentWordIndex];
      getTranslation(word).then((data) => {
        // Fetch translation for the selected word
        setTranslation(data);
        setIsListOpen(false); // Close the choices list
      });
    }
  }, [selectedChapter, currentWordIndex]);

  // This useEffect hook is used to generate the choices for the multiple choice question
  useEffect(() => {
    if (translation) {
      const choices = [translation];
      while (choices.length < 4) {
        // Randomly select additional words as choices
        const randomWord =
          chapters[Math.floor(Math.random() * chapters.length)].words[
          Math.floor(Math.random() * selectedChapter.words.length)
          ];
        if (!choices.includes(randomWord)) {
          choices.push(randomWord);
        }
      }
      setChoices(shuffle(choices)); // Shuffle the choices array
    }
  }, [chapters, selectedChapter, translation]);

  // This function toggles the display of the chapter list
  const toggleList = () => {
    setIsListOpen((prevState) => !prevState); // Toggle the state of choices list
  };


  // This function gets the selected language and sets it in the state variable
  const getLanguage = async () => {
    const language = await getSelectedLanguage();
    setLanguage(language); // Set the language state
  };



  // This function is called when a chapter is clicked and sets the selected chapter, current word index, translation, choices, selected choice, error, and answer state variables
  const handleClickChapter = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentWordIndex(0);
    setTranslation("");
    setChoices([]);
    setSelectedChoice("");
    setError("");
    setAnswer(false);

    // Retrieve the user's unique ID and the progress for the selected chapter and language
    const user = firebase.auth().currentUser;
    const uid = user.uid;
    const selectedChapterRef = firebase.database().ref("userProgress").child(uid).child(chapter.id);
    const languageRef = selectedChapterRef.child(language);

    // Retrieve the current word index for the selected language
    languageRef.once("value", (snapshot) => {
      const progress = snapshot.val();
      if (progress !== null) {
        setCurrentWordIndex(progress);
      } else {
        setCurrentWordIndex(0);
      }
    });
  };

  // This function is called when the "Next" button is clicked and increments the current word index if it is less than the number of words in the selected chapter
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

  // This function is called when the "Previous" button is clicked and decrements the current word index if it is greater than 0
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

  // This function is called when the selected choice is changed and sets the selected choice, error, and answer state variables
  const handleChoiceChange = (event) => {
    setSelectedChoice(event.target.value);
    setError("");
    setAnswer(false);
  };

  // This function is called when the "Examples" button is clicked and sets the isExampleOpen state variable to true
  const handleExamples = () => {
    setIsExampleOpen(true);
  };

  // This function is called when the "Check Answer" button is clicked and checks if the selected choice matches the translation and sets the error and answer state variables accordingly
  const handleCheckAnswer = async () => {
    if (selectedChoice.toLowerCase() === translation.toLowerCase()) {
      setError("");
      setAnswer(true);

      setLanguage(await getSelectedLanguage());

      // Update the user's progress by incrementing the current word index
      const user = firebase.auth().currentUser;
      const uid = user.uid;
      const selectedChapterRef = firebase.database().ref("userProgress").child(uid).child(selectedChapter.id);
      const languageRef = selectedChapterRef.child(language);
      languageRef.set(currentWordIndex + 1); // Store the next word index
    } else {
      setError("Incorrect answer. Try again.");
    }
  };


  // This function is called when the "Close" button is clicked and sets the selected chapter, translation, and answer state variables to null
  const handleClose = () => {
    setSelectedChapter(null);
    setTranslation(null);
    setAnswer(false);
  };

  // This function is called when a word is clicked and sets the selected word and dialogOpen state variables to display the word details dialog
  const handleDetailsClick = (word) => {
    setSelectedWord(word);
    setDialogOpen(true);
  };

  // This function is called when the word details dialog is closed and sets the dialogOpen state variable to false
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // This function is called when the "Close" button in the examples dialog is clicked and sets the isExampleOpen state variable to false
  const handleExamplesClose = () => {
    setIsExampleOpen(false);
  };

  // This function is called when the "Examples" button is clicked and calls the dictionary example API to get examples of the current word
  const handleExampleclick = async () => {
    setIsExampleOpen(true);

    try {
      setIsCallingExampleAPI(true);

      // Call the dictionary API to fetch example sentences
      const result = await callDictionaryAPI(selectedChapter.words[currentWordIndex]);
      setApiResponse2(
        await callDictionaryExampleAPI(
          result[0].displaySource,
          result[0].translations[0].displayTarget
        )
      );

      setIsCallingExampleAPI(false);
      console.log(result[0].translations);
      console.log(apiResponse2);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <Box
      // Set the style of the Box component to display a flex container with a row direction, full height and width, and a background image
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        width: "100%",
        backgroundImage: `url(${SvgBackground})`,
        backgroundSize: "auto",
      }}
      // Set the ref of the Box component to the containerRef variable
      ref={containerRef}
    >
      {/* Chapter List */}
      {isListOpen && (
        <Box
          sx={{
            top: "0",
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
          {/* Slide animation */}
          <Slide
            // Set the direction of the slide animation to "right"
            direction="right"
            // Set the "in" prop to the value of the isListOpen state variable to determine if the slide should be displayed
            in={isListOpen}
            // Set the timeout for the slide animation to 1000 milliseconds
            timeout={1000}
            // Set the container for the slide animation to the containerRef variable
            container={containerRef.current}
          >
            <List>
              {/* Map over the chapters array and create a CustomListItem component for each chapter */}
              {chapters.map((chapter) => (
                <CustomListItem
                  // Set the key prop to the chapter id
                  key={chapter.id}
                  // Set the button prop to true to make the CustomListItem clickable
                  button
                  // Set the onClick prop to a function that calls the handleClickChapter function with the chapter as an argument
                  onClick={() => handleClickChapter(chapter)}
                  sx={{
                    // Set the background color of the CustomListItem to "#e0e0e0" if it is the selected chapter, otherwise set it to "transparent"
                    backgroundColor:
                      selectedChapter?.id === chapter.id ? "#e0e0e0" : "transparent",
                    borderRadius: "10px",
                    margin: "8px",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease-in-out",
                    // Set the transform and boxShadow properties of the CustomListItem on hover
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  {/* Set the direction of the slide animation to "right" */}
                  {/* Slide animation */}
                  <Slide direction="right" in={isListOpen} timeout={2000}>
                    <ListItemText
                      // Set the primary text of the ListItemText to the chapter id
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

      {/* Toggle button for Chapter List */}


      
      <IconButton // This IconButton toggles the visibility of the chapters list
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

      
      {selectedChapter && ( // This Box displays the selected chapter's information and progress bar
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
          {/* Chapter title */}
          <Typography
            style={{ marginBottom: '30px', fontWeight: 'bold', fontSize: 'larger' }}
          >
            {selectedChapter.id} - {selectedChapter.title}
          </Typography>         

          
          <Box  // This Box contains the progress bar
            sx={{
              width: "50%",
              marginBottom: "20px",
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <LinearProgress            // This LinearProgress displays the progress of the user in the selected chapter
              variant="determinate"
              value={
                ((currentWordIndex + 1) / selectedChapter.words.length) * 100
              }
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

          {/* Card displaying word details */}
          <Card
            sx={{
              mb: 2,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "10px",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
              transition: "box-shadow 0.3s ease-in-out",
              "&:hover": {
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                {/* Button to see word details */}
                <Grid item>
                  <Tooltip
                    title="Click to see source word details"
                    placement="left"
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 900 }}
                  >
                    <IconButton
                      onClick={() =>
                        handleDetailsClick(
                          selectedChapter.words[currentWordIndex]
                        )
                      }
                    >
                      <InfoOutlinedIcon sx={{ color: "#1769aa" }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
                {/* Displaying the source word */}
                <Grid item xs={6}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#1769aa",
                    }}
                  >
                    {selectedChapter.words[currentWordIndex]}
                  </Typography>
                </Grid>
                {/* Button to hear pronunciation */}
                <Grid item>
                  <Tooltip
                    title="Click to hear pronunciation of Translated word"
                    placement="right"
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 900 }}
                  >
                    <IconButton
                      color="success"
                      onClick={() => handlePlayAudio(translation)}
                    >
                      <VolumeUpIcon sx={{ color: "#1769aa" }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
                {/* Button to show examples */}
                <Grid item xs={11}>
                  <Box mt={1}>
                    <Button variant="text" onClick={handleExampleclick}>
                      Examples
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Display translation choices */}
          {translation && (
            <FormControl
              component="fieldset"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                opacity: answer ? "0.5" : "0.8",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                padding: "20px",
                marginBottom: "20px",
                transition: "box-shadow 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <Grid container spacing={2}>
                {choices.map((choice, index) => (
                  <Grid item xs={6} sm={6} md={6} lg={6} key={index}>
                    <FormControlLabel
                      value={choice}
                      control={<Radio />}
                      label={choice}
                      onChange={handleChoiceChange}
                      checked={selectedChoice === choice}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormControl>
          )}
          {/* Buttons for navigation and answer checking */}
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
          {/* Display feedback for correct and wrong answers */}
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
            variant="outlined"
            onClick={handleClose}
            color="error"
            sx={{
              mt: 2,
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
      {/* Rendered when no chapter is selected */}
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
      {/* Rendered when the word details dialog is open */}
      {dialogOpen && (
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          TransitionComponent={dialogTransition}
        >
          <DialogTitle>Word Details</DialogTitle>
          <DialogContent>
            <WordDetails word={selectedWord} />
          </DialogContent>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </Dialog>
      )}
      {/* Rendered when the example dialog is open */}
      <Dialog
        open={isExampleOpen}
        onClose={handleExamplesClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>examples</DialogTitle>
        {isCallingExampleAPI && (
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
        {!isCallingExampleAPI && (
          <DialogContent>
            {/* Render word details here */}

            {/* Render translations */}
            {apiResponse2 && apiResponse2.length > 0 && (
              <div>
                {apiResponse2 && apiResponse2.length > 0 && (
                  <div>
                    {apiResponse2[0].examples.map((example) => (
                      <div key={example.normalizedSource}>
                        <p>
                          <strong>English:</strong> {example.sourcePrefix}
                          {example.sourceTerm} {example.sourceSuffix}
                        </p>
                        <p>
                          <strong>{language}:</strong> {example.targetPrefix}
                          {example.targetTerm} {example.targetSuffix}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </DialogContent>
        )}
      </Dialog>

    </Box>
  );
};
export default ChaptersList;
