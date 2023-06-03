import firebase from "firebase/compat/app";
import Speech from "speak-tts";
// import { SpeechSynthesizer, SpeechConfig,  SpeechSynthesisOutputFormat, AudioConfig } from 'microsoft-cognitiveservices-speech-sdk';

// function  playAudio  (text)  {
//   // const text = 'Hello, this is a sample text.';
// //   const subscriptionKey = 'e978c78923a34d5da47628ee4a825ef5'; // Replace with your subscription key
// //   const region = 'eastus'; // Replace with your region
// // // // Replace with your region

// //   const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, region);
// //   const synthesizer = new SpeechSynthesizer(speechConfig, AudioConfig.fromDefaultSpeakerOutput());

// //   // Set the desired language and voice
// //   speechConfig.speechSynthesisLanguage = 'sv-SE'; // Replace with desired language code
// //   speechConfig.voiceName = "Microsoft Server Speech Text to Speech Voice (sv-SE, MattiasNeural)"; // Replace with desired voice name

// //   // Set the output format (e.g., audio-24khz-160kbitrate-mono-mp3)
// //   speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3;

// //   synthesizer.speakTextAsync(text, result => {
// //     if (result.errorDetails) {
// //       console.error('Speech synthesis failed:', result.errorDetails);
// //     } else {
// //       console.log('Speech synthesis succeeded.');
// //     }
//     // synthesizer.close();
//     // synthesizer = undefined;

//     // return result;
//   // });
//   fetch(`http://localhost:3000/synthesize?text=${encodeURIComponent(text)}`)
//   .then(response => {
//     if (response.ok) {
//       console.log('Audio file received');
//       return response.blob();
//     } else {
//       throw new Error('Text-to-speech synthesis failed');
//     }
//   })
//   .then(audioBlob => {
//     // Handle the synthesized audio, e.g., play it using an audio element
//     const audioUrl = URL.createObjectURL(audioBlob);
//     const audioElement = new Audio(audioUrl);
//     audioElement.play();
//   })
//   .catch(error => {
//     console.error('Error during text-to-speech synthesis:', error);
//     // Handle the error
//   });


// };

// export { playAudio };
const speech = new Speech();
function initializeSpeech() {
  // if (speech.hasBrowserSupport()) {
  //   // returns a boolean
  //   console.log("speech synthesis supported");
  // }
  speech.init({
    'volume': 1,
       'lang': 'sv-SE',
       'rate': 1,
       'pitch': 1,
       'voice':'Alva',
       'splitSentences': true,
       'listeners': {
           'onvoiceschanged': (voices) => {
               console.log("Event voiceschanged", voices)
           }
       }
}).then((data) => {
    // The "data" object contains the list of available voices and the voice synthesis params
    console.log("Speech is ready, voices are available", data)
}).catch(e => {
    console.error("An error occured while initializing : ", e)
});
}

export { initializeSpeech };

function handlePlayAudio(translation) {
  speech
      .speak({
        text: translation,
      })
      .then(() => {
        console.log("Success !");
      })
      .catch((e) => {
        console.error("An error occurred :", e);
      });
}

export { handlePlayAudio };

//shuffle function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
export { shuffle };

//fetching data from firebase
const fetchChapters = async () => {
  try {
    const databaseRef = firebase.database().ref("chapters");
    const snapshot = await databaseRef.once("value");
    const chaptersData = snapshot.val();

    if (chaptersData) {
      const chaptersArray = Object.keys(chaptersData).map((key) => ({
        id: key,
        title: key,
        words: chaptersData[key].words || [],
      }));
      // console.log("chaptersArray", chaptersArray);
     return chaptersArray;
    }
  } catch (error) {
    console.error("Failed to fetch chapters:", error);
  }
};

export { fetchChapters };

// calling apis

const getTranslation = async (word) => {
  let key = "fd71f14f5fb047ee998a71b51665aea3";
  let endpoint = "https://api.cognitive.microsofttranslator.com";
  let location = "eastus";

  const url = `${endpoint}/translate?api-version=3.0&from=en&to=sv`;

  const options = {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Ocp-Apim-Subscription-Region": location,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        text: word,
      },
    ]),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data[0].translations[0].text);
    const translatedWord = (data[0].translations[0].text);
    return translatedWord;
  } catch (error) {
    throw new Error(error);
  }
};

export { getTranslation };

const callDictionaryAPI = async (word) => {
  // const { v4: uuidv4 } = require("uuid");

  let key = "fd71f14f5fb047ee998a71b51665aea3";
  let endpoint = "https://api.cognitive.microsofttranslator.com";
  let location = "eastus";

  const url = `${endpoint}/dictionary/lookup?api-version=3.0&from=en&to=sv`;

  const options = {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Ocp-Apim-Subscription-Region": location,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        text: word,
      },
    ]),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    // console.log(data);
    // setApiResponse(data);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
export { callDictionaryAPI };

const callDictionaryExampleAPI = async (source, target) => {
  // const { v4: uuidv4 } = require("uuid");

  let key = "fd71f14f5fb047ee998a71b51665aea3";
  let endpoint = "https://api.cognitive.microsofttranslator.com";
  let location = "eastus";

  const url = `${endpoint}/dictionary/examples?api-version=3.0&from=en&to=sv`;
  const options = {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Ocp-Apim-Subscription-Region": location,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        text: source,
        translation: target,
      },
    ]),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export { callDictionaryExampleAPI };
