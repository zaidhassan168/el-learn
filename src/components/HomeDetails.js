import React, { useState, useEffect } from "react";
import { auth } from "../utils/Firebase";
import firebase from "firebase/compat/app";
import Typography from "@mui/material/Typography";
// import '../css/home.css'

export default function HomeDetails() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [languages, setLanguages] = useState([]);
  const [wordsLearned, setWordsLearned] = useState(0);

  useEffect(() => {
    if (auth.currentUser) {
      firebase.database().ref("users/" + auth.currentUser.uid).on("value", (snapshot) => {
        setFirstName(snapshot.val().firstName);
        setLastName(snapshot.val().lastName);
        setWordsLearned(snapshot.val().wordsLearned);
      });
    }
  }, []);

  useEffect(() => {
    firebase.database().ref("languages").on("value", (snapshot) => {
      const languages = [];
      snapshot.forEach((childSnapshot) => {
        languages.push(childSnapshot.val());
      });
      setLanguages(languages);
    });
  }, []);

  return (
    <div className="home-details-container">
      <Typography variant="h4" component="h2" className="home-details-title">
        Welcome, {firstName} {lastName}!
      </Typography>
      <Typography variant="h6" component="h3" className="home-details-subtitle">
        Languages Offered:
      </Typography>
      <ul>
        {languages.map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <Typography variant="h6" component="h3" className="home-details-subtitle">
        Words Learned: {wordsLearned}

      </Typography>
    </div>
  );
}
