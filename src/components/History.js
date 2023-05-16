import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { auth } from '../utils/Firebase';
// import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

export default function History() {
//   const theme = useTheme();
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [loaded, setLoaded] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchWords = async () => {
      const snapshot = await firebase.database().ref(`users/${auth.currentUser.uid}/history`).once('value');
      const words = snapshot.val();
      setWords(words);
    };

    fetchWords();
  }, []);

  const handleSelectChange = async (event) => {
    setSelectedWord(event.target.value);
    setLoaded(true);

    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${event.target.value}`);
    const responseData = await response.json();
    setResponse(responseData);
    setLoaded(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Card sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flex: '1 0 auto', overflowY: 'auto', maxHeight: '400px' }}>
                <Typography variant="h4" align="center" gutterBottom>
                  Your Learned Words
                </Typography>
                <Select
                  value={selectedWord}
                  onChange={handleSelectChange}
                  sx={{ mb: 2, minWidth: '200px' }}
                  displayEmpty
                  renderValue={(value) => <Typography>{value || 'Select a word'}</Typography>}
                >
                  <MenuItem value={null} disabled>
                    <em>Select a word</em>
                  </MenuItem>
                  {words && Object.keys(words).map((word, index) => (
                    <MenuItem key={index} value={word}>{word}</MenuItem>
                  ))}
                </Select>
                {loaded && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress />
                  </Box>
                )}
                {!loaded && response && (
                  <CardContent>
                    {response && response[0].phonetics.map((phonetic, index) => (
                      <div key={index} sx={{ mb: 2 }}>
                        {phonetic.text && <Typography variant="subtitle1">{phonetic.text}</Typography>}
                        {phonetic.audio && <audio controls src={phonetic.audio} />}
                      </div>
                    ))}
                    {response && response[0].meanings.map((meaning, index) => (
                      <div key={index} sx={{ mb: 2 }}>
                        <Typography variant="h6">{meaning.partOfSpeech}</Typography>
                        {meaning.definitions.map((definition, idx) => (
                          <Typography key={idx} variant="body1">
                            {definition.definition}
                          </Typography>
                        ))}
                      </div>
                    ))}
                  </CardContent>
                )}
              </CardContent>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
