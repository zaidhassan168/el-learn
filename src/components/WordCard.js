import React, { useEffect, useState } from 'react';
import 'firebase/database';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import firebase from "firebase/compat/app";
import "firebase/compat/database";


export default function WordCard() {
  const theme = useTheme();
  const [word, setWord] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchWord = async () => {
      const snapshot = await firebase.database().ref(`words/${currentIndex}`).once('value');
      const wordt = snapshot.val();
      setWord(wordt);
      console.log(wordt);
    };

    fetchWord();
  }, [currentIndex]);

  const handleNextClick = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleApiCall = async () => {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const responseData = await response.json();
    setResponse(responseData);
    };

  if (!response) {
    return null; // Render nothing until the word is fetched
  }

  const wordText = response[0].word;
  const phonetics = response[0].phonetics;
  const meanings = response[0].meanings;
  return (
    <Card>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
          hello
          </Typography>
          {/* {phonetics.map((phonetic, index) => (
            <div key={index}>
              {phonetic.text && <Typography variant="subtitle1">{phonetic.text}</Typography>}
              {phonetic.audio && <audio controls src={phonetic.audio} />}
            </div>
          ))} */}
          {/* {meanings.map((meaning, index) => (
            <div key={index}>
              <Typography variant="h6">{meaning.partOfSpeech}</Typography>
              {meaning.definitions.map((definition, idx) => (
                <Typography key={idx} variant="body1">
                  {definition.definition}
                </Typography>
              ))}
            </div>
          ))} */}
        </CardContent>
        {/* <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="previous">
            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
          </IconButton>
          <IconButton aria-label="play/pause" onClick={handleApiCall}>
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          </IconButton>
          <IconButton aria-label="next" onClick={handleNextClick}>
            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
          </IconButton>
        </Box> */}
      </Box>
    </Card>
  );
}
