import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCd64icq3m0sk3ehbPatrwt4xQeM2UBUo8",
  authDomain: "el-learn-8e905.firebaseapp.com",
  databaseURL: "https://el-learn-8e905-default-rtdb.firebaseio.com",
  projectId: "el-learn-8e905",
  storageBucket: "el-learn-8e905.appspot.com",
  messagingSenderId: "53454997882",
  appId: "1:53454997882:web:dbc34e4463be8792a66ec3",
  measurementId: "G-STGFL18T5T"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
