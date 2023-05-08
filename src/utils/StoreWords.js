import firebase from "firebase/compat/app";
import "firebase/compat/database";

const storeWords = (words) => {
  const databaseRef = firebase.database().ref("words");
  databaseRef
    .set(words)
    .then(() => {
      console.log("Words stored successfully.");
    })
    .catch((error) => {
      console.error("Error storing words:", error);
    });
};

export default storeWords;

// const database = firebase.database();

// const addWords = async (newWords) => {
//     try {
//       const wordsRef = database.ref('/words');

//       // Push each new word to the array
//       for (const word of newWords) {
//         await wordsRef.push(word);
//       }

//       console.log('Words added successfully!');
//     } catch (error) {
//       console.error('Error adding words:', error);
//     }
//   };

//   // Usage: Call addWords with the new array of words
//   const newWords = ['word1', 'word2', 'word3'];
//   addWords(newWords);
