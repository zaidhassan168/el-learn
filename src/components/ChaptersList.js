import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import Box from '@mui/material/Box';

const ChaptersList = ({ onSelectChapter }) => {
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      const databaseRef = firebase.database().ref('chapters');
      const snapshot = await databaseRef.once('value');
      const chaptersData = snapshot.val();
      if (chaptersData) {
        const chaptersArray = Object.keys(chaptersData).map((key) => ({
          id: key,
          title: chaptersData[key],
        }));
        setChapters(chaptersArray);
      }
    };

    fetchChapters();
  }, []);

  return (
    <Box sx={{ width: '200px', height: '100%', overflowY: 'auto' }}>
      <ul>
        {chapters.map((chapter) => (
          <li key={chapter.id} onClick={() => onSelectChapter(chapter.id)}>
            {chapter.title}
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default ChaptersList;
