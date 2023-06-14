// Import React and Material-UI components, Firebase modules, and LanguageSelector component
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
import LanguageSelector from "../utils/LanguageSelector";

// Define styled components for the container, paper, section title, form, text field, button, and error message
// StyledContainer component: Represents a styled container for the content
const StyledContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(2), // Adds padding around the container
}));

// StyledPaper component: Represents a styled paper/card
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4), // Adds padding inside the paper
  background: "#fff", // Sets the background color to white
  boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.1)", // Adds a box shadow effect
  borderRadius: "8px", // Sets the border radius to create rounded corners
}));

// StyledSectionTitle component: Represents a styled section title
const StyledSectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4), // Adds bottom margin to create spacing below the title
  fontWeight: "bold", // Sets the font weight to bold
}));

// StyledForm component: Represents a styled form
const StyledForm = styled("form")(({ theme }) => ({
  width: "100%", // Sets the width of the form to 100% of the parent container
}));

// StyledTextField component: Represents a styled text field
const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2), // Adds bottom margin to create spacing between text fields
  "& .MuiOutlinedInput-root": {
    // Overrides the styles for the outlined input element
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main, // Changes the border color on hover to the primary color defined in the theme
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main, // Changes the border color when the input is focused to the primary color defined in the theme
    },
  },
}));

// StyledButton component: Represents a styled button
const StyledButton = styled(Button)(({ theme }) => ({
  width: "100%", // Sets the width of the button to 100% of the parent container
  marginTop: theme.spacing(2), // Adds top margin to create spacing above the button
}));

// StyledErrorMessage component: Represents a styled error message
const StyledErrorMessage = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2), // Adds top margin to create spacing above the error message
  color: theme.palette.error.main, // Sets the text color to the error color defined in the theme
}));

// Define the Settings component
export default function Settings() {
  // Define state variables for loading, first name, last name, display name, password, and error
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Fetch the current user's display name from Firebase authentication on component mount
  useEffect(() => {
    setDisplayName(auth.currentUser.displayName);
  }, []);

  // Fetch the current user's first name and last name from Firebase database on component mount
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

  // Handle updating the user's profile information
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update the user's display name in Firebase authentication
      await updateProfile(auth.currentUser, {
        displayName,
      });
      // Update the user's first name and last name in Firebase database
      let user = localStorage.getItem("user");
      user = JSON.parse(user);
      user.displayName = displayName;
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

  // Handle updating the user's password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update the user's password in Firebase authentication
      await updatePassword(auth.currentUser, password);
      setLoading(false);
      setError("");
    } catch (error) {
      setLoading(false);
      setError("Failed to update password.");
    }
  };

  // Render the Settings component
  return (
    <StyledContainer>
      <Grid container spacing={4} justifyContent="center">
        {/* Left-side column */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            {/* Section title */}
            <StyledSectionTitle variant="h5" component="h2">
              Profile Information
            </StyledSectionTitle>
            {/* Form for updating profile information */}
            <StyledForm onSubmit={handleUpdateProfile}>
              {/* First Name field */}
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
              {/* Last Name field */}
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
              {/* Display Name field */}
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
              {/* Button for updating profile */}
              <StyledButton
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {/* Show loading spinner or "Update Profile" text */}
                {loading ? <CircularProgress size={25} /> : "Update Profile"}
              </StyledButton>
              {/* Show error message if there is an error */}
              {error && (
                <StyledErrorMessage color="error">
                  {error}
                </StyledErrorMessage>
              )}
            </StyledForm>
          </StyledPaper>
        </Grid>
        {/* Right-side column */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            {/* Section title */}
            <StyledSectionTitle variant="h5" component="h2">
              Password
            </StyledSectionTitle>
            {/* Form for updating password */}
            <StyledForm onSubmit={handleUpdatePassword}>
              {/* New Password field */}
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
              {/* Button for updating password */}
              <StyledButton
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {/* Show loading spinner or "Update Password" text */}
                {loading ? <CircularProgress size={25} /> : "Update Password"}
              </StyledButton>
              {/* Show error message if there is an error */}
              {error && (
                <StyledErrorMessage color="error">
                  {error}
                </StyledErrorMessage>
              )}
            </StyledForm>
          </StyledPaper>
          {/* Change Language section */}
          <Typography variant="h5" component="h2" style={{ marginTop: "20px" }}>
            Change Language
          </Typography>
          {/* Language Selector component */}
          <LanguageSelector />
        </Grid>
      </Grid>
    </StyledContainer>
  );  
}