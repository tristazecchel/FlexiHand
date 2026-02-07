// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlp6JRpFaLsCC6uOSDhQi0MBGtXcu1KqI",
  authDomain: "flexihand.firebaseapp.com",
  projectId: "flexihand",
  storageBucket: "flexihand.firebasestorage.app",
  messagingSenderId: "499968532032",
  appId: "1:499968532032:web:d9ce31feafd34a0a2f09a5",
  measurementId: "G-KGVFXHDQ4Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Creating authentification and database 
export const auth = getAuth(app);
export const db = getFirestore(app);
