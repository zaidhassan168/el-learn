import React, { useEffect, useState, useCallback } from "react"; // Importing necessary modules from React and MUI libraries
import Box from "@mui/material/Box"; // Importing Box component from MUI library
import Grid from "@mui/material/Grid"; // Importing Grid component from MUI library
import Card from "@mui/material/Card"; // Importing Card component from MUI library
import CardContent from "@mui/material/CardContent"; // Importing CardContent component from MUI library
import Typography from "@mui/material/Typography"; // Importing Typography component from MUI library
import CircularProgress from "@mui/material/CircularProgress"; // Importing CircularProgress component from MUI library

export default function WordDetails({ word }) { // Defining a functional component called WordDetails that takes in a prop called word
  const [response, setResponse] = useState(null); // Defining a state variable called response and initializing it to null
  const [loaded, setLoaded] = useState(false); // Defining a state variable called loaded and initializing it to false

  const handleApiCall = useCallback(async () => { // Defining a function called handleApiCall using the useCallback hook
    if (!word) return; // If the word prop is not defined, return

    setResponse(null); // Reset response to null before fetching new data

    const response = await fetch( // Fetching data from the Dictionary API using the fetch function
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const responseData = await response.json(); // Parsing the response data as JSON
    setResponse(responseData); // Setting the response state variable to the parsed response data
    setLoaded(true); // Setting the loaded state variable to true
  }, [word]);

  useEffect(() => { // Defining a side effect using the useEffect hook
    handleApiCall(); // Calling the handleApiCall function
  }, [word, handleApiCall]);

  return (
    <Box // Returning a Box component from MUI library
      sx={{
        flexGrow: 1,
        position: "relative",
        zIndex: 0,
      }}
    >
      <Grid container spacing={2} justifyContent="center"> 
        <Grid item xs={12} sm={1} md={20}> 
          <Card // Returning a Card component from MUI library
            sx={{
              height: "100%",
              backgroundColor: "#F5F5F5",
              borderRadius: "20px",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            <Box // Returning a Box component from MUI library
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Box // Returning a Box component from MUI library
                sx={{
                  flex: "1 0 auto",
                  overflowY: "auto",
                  maxHeight: "400px",
                }}
              >
                {!loaded && ( // If the data is not loaded, return a CircularProgress component from MUI library
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "400px",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                {loaded && ( // If the data is loaded, return a CardContent component from MUI library
                  <CardContent
                    sx={{
                      transition: "transform 0.3s ease-in-out",
                      transform: loaded ? "scale(1)" : "scale(0.8)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography // Returning a Typography component from MUI library
                      component="div"
                      variant="h5"
                      align="center"
                      sx={{ fontWeight: "bold", mb: "20px" }}
                    >
                      {word}
                    </Typography>
                    {response && // If the response data exists, map over the phonetics array and return a div element with text and audio components
                      response[0].phonetics.map((phonetic, index) => (
                        <div
                          key={index}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: "10px",
                          }}
                        >
                          {phonetic.text && (
                            <Typography
                              variant="subtitle1"
                              align="center"
                              sx={{ mr: "10px" }}
                            >
                              {phonetic.text}
                            </Typography>
                          )}
                          {phonetic.audio && (
                            <audio controls src={phonetic.audio} />
                          )}
                        </div>
                      ))}
                    {response && // If the response data exists, map over the meanings array and return a div element with part of speech and definition components
                      response[0].meanings.map((meaning, index) => (
                        <div
                          key={index}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mb: "20px",
                          }}
                        >
                          <Typography
                            variant="h6"
                            align="center"
                            sx={{ fontWeight: "bold", mb: "10px" }}
                          >
                            {meaning.partOfSpeech}
                          </Typography>
                          {meaning.definitions.map((definition, idx) => (
                            <Typography
                              key={idx}
                              variant="body1"
                              align="center"
                              sx={{ mb: "10px" }}
                            >
                              {definition.definition}
                            </Typography>
                          ))}
                        </div>
                      ))}
                  </CardContent>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}