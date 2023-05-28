import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import Box from '@mui/material/Box';
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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const WordItem = ({ word, apiEndpoint }) => {
  const handleClick = async () => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
      // Handle the API response here
      console.log(data);
    } catch (error) {
      // Handle error if API call fails
      console.error('API call failed:', error);
    }
  };

  return (
    <ListItem button onClick={handleClick}>
      <ListItemText primary={word} />
    </ListItem>
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

  const handleClickCard = (chapter) => {
    setSelectedChapter(chapter);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedChapter(null);
    setOpenDialog(false);
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {chapters.map((chapter) => (
        <Card
          key={chapter.id}
          sx={{
            width: '200px',
            margin: '10px',
            backgroundColor: selectedChapter?.id === chapter.id ? 'lightgreen' : 'lightblue',
            cursor: 'pointer',
            animation: selectedChapter?.id === chapter.id ? 'shake 0.5s ease-in-out' : 'none',
            animationIterationCount: selectedChapter?.id === chapter.id ? 'infinite' : '1',
          }}
          onClick={() => handleClickCard(chapter)}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              {chapter.title}
            </Typography>
            <Typography variant="body2">
              Words: {chapter.words.length}
            </Typography>
          </CardContent>
        </Card>
      ))}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedChapter?.title}</DialogTitle>
        <DialogContent>
          {selectedChapter?.words.length > 0 ? (
            <List sx={{ maxHeight: '400px', overflowY: 'auto' }}>
              {selectedChapter.words.map((word) => (
                <WordItem
                  key={word}
                  word={word}
                  apiEndpoint="https://api.example.com/word" // Replace with your actual API endpoint
                />
              ))}
            </List>
          ) : (
            <DialogContentText>No words found for this chapter.</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChaptersList;
