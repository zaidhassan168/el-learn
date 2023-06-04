import React, { useState, useEffect } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import firebase from "firebase/compat/app";
import { setLanguageCode, initializeSpeech } from './Functions';

const LanguageSelector = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    // Retrieve the current selected language from Firebase
    const user = JSON.parse(localStorage.getItem("user"));
    const userRef = firebase.database().ref('users/' + user.uid);
    userRef.child('selectedLanguage').on('value', (snapshot) => {
      setSelectedLanguage(snapshot.val() || '');
    });
    setLanguageCode(selectedLanguage);
    initializeSpeech(selectedLanguage);
    // Clean up the Firebase listener when component unmounts
    return () => {
      userRef.child('selectedLanguage').off('value');
    };
  }, [selectedLanguage]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (language) => {
    // Save the selected language to Firebase
    // const userId = auth.currentUser.uid;
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.uid) {
        console.log("user.uid", user.uid);
    }
   const userRef = firebase.database().ref('users/' + user.uid);
    userRef.update({ selectedLanguage: language });

    // Set the language code for the selected language
    setLanguageCode(language);
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button
        color="inherit"
        aria-controls={anchorEl ? 'language-menu' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        Language ({selectedLanguage})
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-selector',
        }}
      >
        <MenuItem onClick={() => handleLanguageSelect('Swedish')}>Swedish</MenuItem>
        <MenuItem onClick={() => handleLanguageSelect('Spanish')}>Spanish</MenuItem>
        <MenuItem onClick={() => handleLanguageSelect('French')}>French</MenuItem>
        <MenuItem onClick={() => handleLanguageSelect('German')}>German</MenuItem>
        <MenuItem onClick={() => handleLanguageSelect('Italian')}>Italian</MenuItem>
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
