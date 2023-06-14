
import firebase from "firebase/compat/app";
import Speech from "speak-tts";
import { auth } from "../utils/Firebase";

let languageCode;
const speech = new Speech();
function initializeSpeech(language) {
  if (speech.hasBrowserSupport()) {

    console.log("speech synthesis supported");
  }
  let voice = "";
  let lang = "";
  switch (language) {
    case 'Swedish':
      voice = 'Alva';
      lang = 'sv-SE';
      break;
    case 'Spanish':
      voice = 'Alvaro';
      lang = 'es-ES';
      break;
    case 'French':
      voice = 'Antoine';
      lang = 'fr-FR';
      break;
    case 'German':
      voice = 'Katja';
      lang = 'de-DE';
      break;
    case 'Italian':
      voice = 'Cosimo';
      lang = 'it-IT';
      break;
    default:
      // Set a default language code or handle the case when selectedLanguage is not recognized
      voice = 'Alva';
      lang = 'sv-SE';
  }

  speech.init({
    'volume': 1,
    'lang': lang,
    'rate': 1,
    'pitch': 1,
    'voice': voice,
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

  console.log("translation in speech functions", translation);
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


const getSelectedLanguage = () => {
  return new Promise((resolve, reject) => {
    const userId = auth.currentUser.uid;
    const userRef = firebase.database().ref('users/' + userId);
    userRef.child('selectedLanguage').once('value', (snapshot) => {
      const selectedLanguage = snapshot.val() || '';
      // targetLanguage = selectedLanguage;
      resolve(selectedLanguage);
    }, (error) => {
      reject(error);
    });
  });
};

export { getSelectedLanguage };

const setLanguageCode = (language) => {
  switch (language) {
    case 'English':
      languageCode = 'en';
      break;
    case 'Spanish':
      languageCode = 'es';
      break;
    case 'French':
      languageCode = 'fr';
      break;
    case 'German':
      languageCode = 'de';
      break;
    case 'Italian':
      languageCode = 'it';
      break;
    default:
      // Set a default language code or handle the case when selectedLanguage is not recognized
      languageCode = '';
  }
};

export { setLanguageCode };

// calling apis

const getTranslation = async (word) => {
  let key = "a66e5450f625435ba6d83335dd70fd10";
  let endpoint = "https://api.cognitive.microsofttranslator.com";
  let location = "swedencentral";
  console.log("languageCode", languageCode);
  if (languageCode === undefined || languageCode === "" || languageCode === null) {
    languageCode = "sv";
  }
  // const url = `${endpoint}/translate?api-version=3.0&from=en&to=sv`;
  const url = `${endpoint}/translate?api-version=3.0&from=en&to=${languageCode}`;
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

  let key = "a66e5450f625435ba6d83335dd70fd10";
  let endpoint = "https://api.cognitive.microsofttranslator.com";
  let location = "swedencentral";

  const url = `${endpoint}/dictionary/lookup?api-version=3.0&from=en&to=${languageCode}`;

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

  let key = "a66e5450f625435ba6d83335dd70fd10";
  let endpoint = "https://api.cognitive.microsofttranslator.com";
  let location = "swedencentral";

  const url = `${endpoint}/dictionary/examples?api-version=3.0&from=en&to=${languageCode}`;
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
