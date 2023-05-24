import firebase from "firebase/compat/app";
import "firebase/compat/database";

const storeChapters = (chapters) => {
  const databaseRef = firebase.database().ref("chapters");
  databaseRef
    .set(chapters)
    .then(() => {
      console.log("chapters stored successfully.");
    })
    .catch((error) => {
      console.error("Error storing chapters:", error);
    });
};

export default storeChapters;




// useEffect(() => {
//   const chapters = [
//     'Greetings and Basic Phrases',
//     'Numbers and Counting',
//     'Colors',
//     'Family and Relationships',
//     'Food and Drinks',
//     'Animals',
//     'Clothing and Fashion',
//     'Weather',
//     'Time and Dates',
//     'Daily Routine and Activities',
//     'Body Parts',
//     'Travel and Transportation',
//     'Directions and Maps',
//     'Hobbies and Interests',
//     'Occupations and Jobs',
//     'Shopping and Markets',
//     'Health and Medical Terms',
//     'Sports and Fitness',
//     'Technology and Electronics',
//     'Holidays and Celebrations',
//     'Nature and Environment',
//     'Grammar and Sentence Structure',
//     'Verbs and Tenses',
//     'Adjectives and Adverbs',
//     'Pronouns and Prepositions',
//     'Idioms and Expressions',
//     'Culture and Customs',
//     'Conversation and Dialogue Practice',
//     'Writing and Reading Exercises',
//     'Listening and Speaking Exercises'
//   ];

//   storeChapters(chapters);
// }, []);
