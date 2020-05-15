import React from "react";
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

const firebaseConfig = {
  apiKey: "AIzaSyCYrFIhNo3nctoCQIqE0KIZCavNDo-QmKs",
  authDomain: "think-piece-ee6b6.firebaseapp.com",
  databaseURL: "https://think-piece-ee6b6.firebaseio.com",
  projectId: "think-piece-ee6b6",
  storageBucket: "think-piece-ee6b6.appspot.com",
  messagingSenderId: "1003050621641",
  appId: "1:1003050621641:web:57f4a36b23712a33728b18",
  measurementId: "G-WMGP37GG60",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const firestore = firebase.firestore();
const storage = firebase.storage();

// firebase functions
const signInWithGoogle = async () => {
  try {
    await auth.signInWithPopup(provider);
  } catch (error) {
    console.error(error);
  }
};
const signIn = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error(error);
  }
};
const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error(error);
  }
};
const signUp = async (email, password) => {
  try {
    const { user } = await auth.createUserWithEmailAndPassword(email, password);
    return user;
  } catch (error) {
    console.error(error);
  }
};
// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};
const FirebaseAuth = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={auth}
  ></StyledFirebaseAuth>
);
window.firebase = firebase;

const createUserProfileDocument = async (user, additionalData) => {
  if (!user) return;

  const userRef = firestore.doc(`/users/${user.uid}`);
  const snapshot = await userRef.get();
  if (!snapshot.exists) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error(error);
    }
  }
  return getUserDocument(user.uid);
};
const getUserDocument = (uid) => {
  if (!uid) return null;
  return firestore.collection("users").doc(uid);
};
export {
  auth,
  signUp,
  createUserProfileDocument,
  getUserDocument,
  signIn,
  signInWithGoogle,
  signOut,
  firestore,
  storage,
  FirebaseAuth,
};
export default firebase;
