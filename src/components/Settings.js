import React, { useState, useEffect } from "react";
import { makeStyles } from '@mui/styles';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { auth } from "../utils/Firebase";
import {  updatePassword, updateProfile } from "@firebase/auth";
import firebase from "firebase/compat/app";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: "5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: "2rem",
    "& > *": {
      margin: "1rem",
    },
  },
  button: {
    alignSelf: "center",
    margin: "1.5rem 0",
  },
}));

export default function Settings() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("currentUser", auth.currentUser.displayName);
    setDisplayName(auth.currentUser.displayName);

  }, []);
  useEffect(() => {
    if (auth.currentUser) {
      firebase.database().ref("users/" + auth.currentUser.uid).on("value", (snapshot) => {
        setFirstName(snapshot.val().firstName);
        setLastName(snapshot.val().lastName);
        console.log(snapshot.val());
      });
    }
  }, [Settings]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName
      });
      firebase
      .database()
      .ref("users/" + auth.currentUser.uid)
      .update({
        firstName: firstName,
        lastName: lastName,
      });
      setLoading(false);
      setError("");
    } catch (error) {
      setLoading(false);
      setError("Failed to update profile information.");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePassword(password);
      setLoading(false);
      setError("");
    } catch (error) {
      setLoading(false);
      setError("Failed to update password.");
    }
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h5" gutterBottom>
              Profile Information
            </Typography>
            <form className={classes.form} onSubmit={handleUpdateProfile}>
              <TextField
                id="firstName"
                label="First Name"
                variant="outlined"
                value={firstName}
                fullWidth
                required
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                id="lastName"
                label="Last Name"
                variant="outlined"
                value={lastName}
                fullWidth
                required
                onChange={(e) => setLastName(e.target.value)}
              />
              <TextField
                id="displayName"
                label="Display Name"
                variant="outlined"
                value={displayName}
                fullWidth
                required
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <Button
                className={classes.button}
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={25} /> : "Update Profile"}
              </Button>
              {error && <Typography color="error">{error}</Typography>}
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h5" gutterBottom>
              Password
            </Typography>
            <form className={classes.form} onSubmit={handleUpdatePassword}>
              <TextField
                id="password"
                label="New Password"
                type="password"
                variant="outlined"
                value={password}
                fullWidth
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                className={classes.button}
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={25} /> : "Update Password"}
              </Button>
              {error && <Typography color="error">{error}</Typography>}
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
