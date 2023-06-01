import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Image from '..//assets/pexels.jpg';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const WordPractice = ({ chapter }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [translation, setTranslation] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getTranslation = async (word) => {
      try {
        const response = await fetch(`https://api.example.com/word/${word}`);
        const data = await response.json();
        // Extract the translation from the API response and set it in state
        const translation = data.translation;
        setTranslation(translation);
      } catch (error) {
        console.error('API call failed:', error);
      }
    };

    const word = chapter.words[currentWordIndex];
    getTranslation(word);
  }, [chapter.words, currentWordIndex]);

  const handleNextWord = () => {
    if (currentWordIndex < chapter.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setAnswer('');
      setError('');
    }
  };

  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setAnswer('');
      setError('');
    }
  };

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
    setError('');
  };

  const handleCheckAnswer = () => {
    if (answer.toLowerCase() === translation.toLowerCase()) {
      handleNextWord();
    } else {
      setError('Incorrect answer. Try again.');
    }
  };

  const handleCloseDialog = () => {
    setCurrentWordIndex(0);
    setAnswer('');
    setError('');
  };

  const word = chapter.words[currentWordIndex];

  return (
    <Dialog open onClose={handleCloseDialog} TransitionComponent={Transition} maxWidth="sm" fullWidth>
      <DialogTitle>{chapter.title}</DialogTitle>
      <DialogContent>
        {chapter.words.length > 0 ? (
          <>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {word}
                </Typography>
              </CardContent>
            </Card>
            <TextField
              label="Translation"
              variant="outlined"
              fullWidth
              value={answer}
              onChange={handleAnswerChange}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleCheckAnswer} sx={{ mb: 2 }}>
              Check Answer
            </Button>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <div>
              <Button variant="contained" onClick={handlePreviousWord} disabled={currentWordIndex === 0}>
                Previous Word
              </Button>
              <Button
                variant="contained"
                onClick={handleNextWord}
                disabled={currentWordIndex === chapter.words.length - 1}
                sx={{ ml: 2 }}
              >
                Next Word
              </Button>
            </div>
          </>
        ) : (
          <DialogContentText>No words found for this chapter.</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const ChaptersList = () => {
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const databaseRef = firebase.database().ref('chapters');
        const snapshot = await databaseRef.once('value');
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
        console.error('Failed to fetch chapters:', error);
      }
    };

    fetchChapters();
  }, []);

  const handleClickChapter = (chapter) => {
    setSelectedChapter(chapter);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedChapter(null);
    setOpenDialog(false);
  };

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
        backgroundPosition: 'center bottom', // Adjust the background position
        backgroundAttachment: 'fixed', // Fix the background image so that it doesn't scroll
      }}
    >
      <List sx={{ width: '200px', marginRight: '20px' }}>
        {chapters.map((chapter) => (
          <ListItemButton key={chapter.id} onClick={() => handleClickChapter(chapter)}>
            <ListItemText primary={chapter.title} />
          </ListItemButton>
        ))}
      </List>
      <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition} maxWidth="sm" fullWidth>
        {selectedChapter && <WordPractice chapter={selectedChapter} />}
      </Dialog>
    </Box>
  );
};

export default ChaptersList;
