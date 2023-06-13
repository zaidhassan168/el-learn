import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import {
  callDictionaryAPI,
  callDictionaryExampleAPI,
  handlePlayAudio,
  getSelectedLanguage,
} from '../utils/Functions';

function WordExamples({ word }) {
  const [isLoading, setIsLoading] = useState(false);
  const [dictionaryResult, setDictionaryResult] = useState(null);
  const [exampleResult, setExampleResult] = useState(null);
  const [translatedWord, setTranslatedWord] = useState(null);

  const fetchDictionaryData = async (word) => {
    try {
      setIsLoading(true);

      const dictionaryData = await callDictionaryAPI(word);
      // const exampleData = await callDictionaryExampleAPI(
      //   dictionaryData[0].displaySource,
      //   dictionaryData[0].translations[0].displayTarget
      // );

      setExampleResult(
        await callDictionaryExampleAPI(
         dictionaryData[0].displaySource,
         dictionaryData[0].translations[0].displayTarget
        )
      );

      setDictionaryResult(dictionaryData);
      // setExampleResult(exampleData);
      setTranslatedWord(dictionaryData[0].translations[0].displayTarget);

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (word) {
      console.log('WordExamples: useEffect: word: ', word);
      fetchDictionaryData(word);
    }
  }, [word]);

  const lang = getSelectedLanguage();

  return (
    <div>
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {!isLoading && (
        <div>
          {/* Render word details here */}
          <p>{word}</p>

          {/* Render examples */}
          {exampleResult && exampleResult.length > 0 && (
            <div>
              {exampleResult[0].examples.map(async (example) => (
                <div key={example.normalizedSource}>
                  <p>
                    <strong>English:</strong> {example.sourcePrefix}
                    {example.sourceTerm} {example.sourceSuffix}
                  </p>
                  <p>
                    <strong>{lang}:</strong> {await example.targetPrefix}
                    {await example.targetTerm} {await example.targetSuffix}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WordExamples;