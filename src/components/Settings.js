import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { auth } from "../utils/Firebase";
import { updatePassword, updateProfile } from "@firebase/auth";
import firebase from "firebase/compat/app";
import { styled } from "@mui/material/styles";

const StyledContainer = styled("div")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "#fff",
  boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
}));

const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
}));

const StyledErrorMessage = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.error.main,
}));

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setDisplayName(auth.currentUser.displayName);
  }, []);

  useEffect(() => {
    if (auth.currentUser) {
      firebase
        .database()
        .ref("users/" + auth.currentUser.uid)
        .on("value", (snapshot) => {
          setFirstName(snapshot.val().firstName);
          setLastName(snapshot.val().lastName);
        });
    }
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName,
      });
      firebase
        .database()
        .ref("users/" + auth.currentUser.uid)
        .update({
          firstName,
          lastName,
        });
      setLoading(false);
      setError("");
    } catch (error) {
      setLoading(false);
      setError("Failed to update profile information: invalid input.");
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePassword(auth.currentUser, password);
      setLoading(false);
      setError("");
    } catch (error) {
      setLoading(false);
      setError("Failed to update password.");
    }
  };

  return (
    <StyledContainer>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <StyledSectionTitle variant="h5" component="h2">
              Profile Information
            </StyledSectionTitle>
            <StyledForm onSubmit={handleUpdateProfile}>
              <StyledTextField
                id="firstName"
                label="First Name"
                variant="outlined"
                value={firstName}
                required
                onChange={(e) => setFirstName(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <StyledTextField
                id="lastName"
                label="Last Name"
                variant="outlined"
                value={lastName}
                required
                onChange={(e) => setLastName(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <StyledTextField
                id="displayName"
                label="Display Name"
                variant="outlined"
                value={displayName}
                required
                onChange={(e) => setDisplayName(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <StyledButton
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={25} /> : "Update Profile"}
              </StyledButton>
              {error && (
                <StyledErrorMessage color="error">
                  {error}
                </StyledErrorMessage>
              )}
            </StyledForm>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <StyledSectionTitle variant="h5" component="h2">
              Password
            </StyledSectionTitle>
            <StyledForm onSubmit={handleUpdatePassword}>
              <StyledTextField
                id="password"
                label="New Password"
                type="password"
                variant="outlined"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <StyledButton
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={25} /> : "Update Password"}
              </StyledButton>
              {error && (
                <StyledErrorMessage color="error">
                  {error}
                </StyledErrorMessage>
              )}
            </StyledForm>
          </StyledPaper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}
