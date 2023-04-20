import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyB_h8fvb2J3XFdP6TGlynRsNV_79fxlZvU",
  authDomain: "finalproject-9e9c9.firebaseapp.com",
  projectId: "finalproject-9e9c9",
  storageBucket: "finalproject-9e9c9.appspot.com",
  messagingSenderId: "111093244594",
  appId: "1:111093244594:web:6f138df7685f0f61abdfab"
};


const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

const storage = getStorage(app);

export { db, storage }

