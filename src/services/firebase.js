import React from "react";
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId,
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
const FirebaseAuth = () => <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}></StyledFirebaseAuth>;
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
