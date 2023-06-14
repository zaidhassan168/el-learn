import firebase from "firebase/compat/app"; // Importing the firebase module from the Firebase library
import Speech from "speak-tts"; // Importing the speak-tts module
import { auth } from "../utils/Firebase"; // Importing the auth service from the Firebase utils file

let languageCode; // Declaring a variable to store the language code
const speech = new Speech(); // Creating a new instance of the Speech class
function initializeSpeech(language) { // Defining a function to initialize the speech synthesis
  if (speech.hasBrowserSupport()) { // Checking if the browser supports speech synthesis
    console.log("speech synthesis supported"); // Logging a message to the console
  }
  let voice = ""; // Declaring a variable to store the voice
  let lang = ""; // Declaring a variable to store the language
  switch (language) { // Using a switch statement to set the voice and language based on the selected language
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

  speech.init({ // Initializing the speech synthesis with the specified parameters
    'volume': 1,
    'lang': lang,
    'rate': 1,
    'pitch': 1,
    'voice': voice,
    'splitSentences': true,
    'listeners': {
      'onvoiceschanged': (voices) => { // Adding a listener for the onvoiceschanged event
        console.log("Event voiceschanged", voices)
      }
    }
  }).then((data) => { // Handling the promise returned by the init() function
    console.log("Speech is ready, voices are available", data) // Logging a message to the console
  }).catch(e => { // Handling any errors that occur during initialization
    console.error("An error occured while initializing : ", e) // Logging an error message to the console
  });
}

export { initializeSpeech }; // Exporting the initializeSpeech function as a named export

function handlePlayAudio(translation) { // Defining a function to handle playing audio
  console.log("translation in speech functions", translation); // Logging the translation to the console
  speech
    .speak({
      text: translation, // Setting the text to be spoken to the translation
    })
    .then(() => { // Handling the promise returned by the speak() function
      console.log("Success !"); // Logging a success message to the console
    })
    .catch((e) => { // Handling any errors that occur during speech synthesis
      console.error("An error occurred :", e); // Logging an error message to the console
    });
}

export { handlePlayAudio }; // Exporting the handlePlayAudio function as a named export

//shuffle function
function shuffle(array) { // Defining a function to shuffle an array
  for (let i = array.length - 1; i > 0; i--) { // Using a for loop to iterate over the array
    const j = Math.floor(Math.random() * (i + 1)); // Generating a random index
    [array[i], array[j]] = [array[j], array[i]]; // Swapping the elements at the current and random indices
  }
  return array; // Returning the shuffled array
}
export { shuffle }; // Exporting the shuffle function as a named export

//fetching data from firebase
const fetchChapters = async () => { // Defining an asynchronous function to fetch chapters from Firebase
  try {
    const databaseRef = firebase.database().ref("chapters"); // Creating a reference to the "chapters" node in the Firebase database
    const snapshot = await databaseRef.once("value"); // Retrieving the data from the database
    const chaptersData = snapshot.val(); // Extracting the chapter data from the snapshot

    if (chaptersData) { // Checking if the chapter data exists
      const chaptersArray = Object.keys(chaptersData).map((key) => ({ // Converting the chapter data to an array of objects
        id: key,
        title: key,
        words: chaptersData[key].words || [],
      }));
      // console.log("chaptersArray", chaptersArray);
      return chaptersArray; // Returning the array of chapters
    }
  } catch (error) { // Handling any errors that occur during the fetch
    console.error("Failed to fetch chapters:", error); // Logging an error message to the console
  }
};

export { fetchChapters }; // Exporting the fetchChapters function as a named export

const getSelectedLanguage = () => { // Defining a function to get the selected language from Firebase
  return new Promise((resolve, reject) => { // Returning a promise
    const userId = auth.currentUser.uid; // Getting the current user's ID
    const userRef = firebase.database().ref('users/' + userId); // Creating a reference to the user's data in the Firebase database
    userRef.child('selectedLanguage').once('value', (snapshot) => { // Retrieving the selected language from the database
      const selectedLanguage = snapshot.val() || ''; // Extracting the selected language from the snapshot
      // targetLanguage = selectedLanguage;
      resolve(selectedLanguage); // Resolving the promise with the selected language
    }, (error) => { // Handling any errors that occur during the fetch
      reject(error); // Rejecting the promise with the error
    });
  });
};

export { getSelectedLanguage }; // Exporting the getSelectedLanguage function as a named export

const setLanguageCode = (language) => { // Defining a function to set the language code
  switch (language) { // Using a switch statement to set the language code based on the selected language
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

export { setLanguageCode }; // Exporting the setLanguageCode function as a named export

// calling apis

const getTranslation = async (word) => { // Defining an asynchronous function to get a translation from the Microsoft Translator API
  let key = "a66e5450f625435ba6d83335dd70fd10"; // Setting the API key
  let endpoint = "https://api.cognitive.microsofttranslator.com"; // Setting the API endpoint
  let location = "swedencentral"; // Setting the API location
  console.log("languageCode", languageCode); // Logging the language code to the console
  if (languageCode === undefined || languageCode === "" || languageCode === null) { // Checking if the language code is undefined, empty, or null
    languageCode = "sv"; // Setting the language code to Swedish by default
  }
  // const url = `${endpoint}/translate?api-version=3.0&from=en&to=sv`;
  const url = `${endpoint}/translate?api-version=3.0&from=en&to=${languageCode}`; // Constructing the API URL
  const options = { // Setting the API request options
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Ocp-Apim-Subscription-Region": location,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        text: word, // Setting the text to be translated to the specified word
      },
    ]),
  };

  try {
    const response = await fetch(url, options); // Sending the API request and waiting for the response
    const data = await response.json(); // Parsing the response data as JSON
    console.log(data[0].translations[0].text); // Logging the translated text to the console
    const translatedWord = (data[0].translations[0].text); // Extracting the translated text from the response
    return translatedWord; // Returning the translated text
  } catch (error) { // Handling any errors that occur during the API call
    throw new Error(error); // Throwing an error
  }
};

export { getTranslation }; // Exporting the getTranslation function as a named export

const callDictionaryAPI = async (word) => { // Defining an asynchronous function to call the Microsoft Translator Dictionary API
  // const { v4: uuidv4 } = require("uuid");

  let key = "a66e5450f625435ba6d83335dd70fd10"; // Setting the API key
  let endpoint = "https://api.cognitive.microsofttranslator.com"; // Setting the API endpoint
  let location = "swedencentral"; // Setting the API location

  const url = `${endpoint}/dictionary/lookup?api-version=3.0&from=en&to=${languageCode}`; // Constructing the API URL

  const options = { // Setting the API request options
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Ocp-Apim-Subscription-Region": location,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        text: word, // Setting the text to be looked up to the specified word
      },
    ]),
  };

  try {
    const response = await fetch(url, options); // Sending the API request and waiting for the response
    const data = await response.json(); // Parsing the response data as JSON
    // console.log(data);
    // setApiResponse(data);
    return data; // Returning the API response
  } catch (error) { // Handling any errors that occur during the API call
    throw new Error(error); // Throwing an error
  }
};
export { callDictionaryAPI }; // Exporting the callDictionaryAPI function as a named export

const callDictionaryExampleAPI = async (source, target) => { // Defining an asynchronous function to call the Microsoft Translator Dictionary Examples API
  // const { v4: uuidv4 } = require("uuid");

  let key = "a66e5450f625435ba6d83335dd70fd10"; // Setting the API key
  let endpoint = "https://api.cognitive.microsofttranslator.com"; // Setting the API endpoint
  let location = "swedencentral"; // Setting the API location

  const url = `${endpoint}/dictionary/examples?api-version=3.0&from=en&to=${languageCode}`; // Constructing the API URL
  const options = { // Setting the API request options
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Ocp-Apim-Subscription-Region": location,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        text: source, // Setting the source text to be looked up
        translation: target, // Setting the target text to be looked up
      },
    ]),
  };

  try {
    const response = await fetch(url, options); // Sending the API request and waiting for the response
    const data = await response.json(); // Parsing the response data as JSON
    // console.log(data);
    return data; // Returning the API response
  } catch (error) { // Handling any errors that occur during the API call
    throw new Error(error); // Throwing an error
  }
};

export { callDictionaryExampleAPI }; // Exporting the callDictionaryExampleAPI function as a named export