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


// export const addWordsToChapters = async (wordsArray) => {
//   try {
//     const chaptersRef = firebase.database().ref('chapters');

//     // Fetch all chapters
//     const snapshot = await chaptersRef.once('value');
//     const chapters = snapshot.val();

//     // Loop through each chapter and add the words
//     for (const chapterId in chapters) {
//       if (Object.hasOwnProperty.call(chapters, chapterId)) {
//         const chapterRef = chaptersRef.child(chapterId).child('words');
//         chapterRef.push().set(wordsArray);
//       }
//     }

//     return true;
//   } catch (error) {
//     console.error('Failed to add words to chapters:', error);
//     return false;
//   }
// };
const chapters = [
  'Greetings and Introductions',
  'Numbers and Counting',
  'Basic Vocabulary and Phrases',
  'Colors and Shapes',
  'Family and Relationships',
  'Weather and Seasons',
  'Daily Routine and Activities',
  'Time and Dates',
  'Jobs and Occupations',
  'Food and Drinks',
  'Shopping and Money',
  'Transportation and Travel',
  'Directions and Places',
  'Health and Medical',
  'Hobbies and Leisure',
  'Sports and Fitness',
  'Nature and Environment',
  'Technology and Gadgets',
  'Education and Learning',
  'Celebrations and Holidays',
  'Culture and Customs',
  'Grammar and Sentence Structure',
  'Verb Conjugation',
  'Adjectives and Adverbs',
  'Prepositions and Conjunctions',
  'Pronouns and Possessives',
  'Interrogatives and Question Words',
  'Expressions and Idioms',
  'Socializing and Small Talk',
  'Describing People and Things',
];

// Array of words to be added to each chapter
const words = [
  'Apple',
  'Book',
  'Cat',
  'Dog',
  'Elephant',
  'Friend',
  'House',
  'Internet',
  'Job',
  'Key',
  'Love',
  'Money',
  'Night',
  'Ocean',
  'Paper',
  'Queen',
  'Rain',
  'Sun',
  'Tree',
  'Umbrella',
  'Voice',
  'Water',
  'X-ray',
  'Yellow',
  'Zoo',
]
// Function to add words to each chapter
export const addWordsToChapters = async () => {
  try {
    const chaptersRef = firebase.database().ref('chapters');

    for (const chapter of chapters) {
      const chapterRef = chaptersRef.child(chapter).child('words');
      chapterRef.set(words);
    }

    return true;
  } catch (error) {
    console.error('Failed to add words to chapters:', error);
    return false;
  }
};

// Call the function to add the words to each chapter
const success = addWordsToChapters();

if (success) {
  console.log('Words added to chapters successfully');
} else {
  console.log('Failed to add words to chapters');
}
