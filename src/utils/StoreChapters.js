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
