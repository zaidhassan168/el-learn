import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { callDictionaryAPI, callDictionaryExampleAPI, handlePlayAudio, getSelectedLanguage } from '../utils/Functions';

const WordExamples = ({ word }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [response, setResponse] = useState(null);
  const [apiResponse2, setApiResponse2] = useState([]);

  const callApi = useCallback(async () => {
    setIsCalling(true);
    const result = await callDictionaryAPI(word);
    console.log(result[0].displaySource);
    console.log(result[0].translations[0].displayTarget);
    const  result2 =  await callDictionaryExampleAPI(
        result[0].displaySource,
        result[0].translations[0].displayTarget
      )
      // console.log(result2);
    // callTextToSpeechAPI(result[0].displaySource);
        // console.log(result[0].displaySource);
        // console.log(result[0].translations[0].displayTarget);
        // console.log(apiResponse2);
    setResponse(result);
    setApiResponse2(result2);

    console.log(result2);
    setIsCalling(false);
  }, [word]);

  useEffect(() => {
    if (word) {
      callApi();
    }
  }, [word, callApi]);

  const lang = getSelectedLanguage();

  return (
    <div>
      {isCalling && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {!isCalling && (
        <div>
          {/* Render word details here */}
          {word}

          {/* Render examples */}
          <div>
            {/* {apiResponse2.map((example) => (
              <div key={example.normalizedSource}>
                <p>
                  <strong>English:</strong> {example.sourcePrefix}
                  {example.sourceTerm} {example.sourceSuffix}
                </p>
                <p>
                  <strong>{lang}:</strong> {example.targetPrefix}
                  {example.targetTerm} {example.targetSuffix}
                </p>
              </div>
            ))} */}
          </div>
          {/* <Button variant="contained" color="primary" onClick={() => handlePlayAudio(word)}>
            Play Audio
          </Button> */}
        </div>
      )}
    </div>
  );
};

export default WordExamples;
