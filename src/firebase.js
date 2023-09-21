// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//--------- added by me ------------------
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// ----------------------------------------

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7-HSh02_0_CruH5rlEXnkNpETkLdT7xA",
  authDomain: "financely-rec-ec631.firebaseapp.com",
  projectId: "financely-rec-ec631",
  storageBucket: "financely-rec-ec631.appspot.com",
  messagingSenderId: "649757865062",
  appId: "1:649757865062:web:65ba7cb6d6de2666d169a7",
  measurementId: "G-DNSWLZ5NXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//-------- added by me -------
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// export { db, auth, provider, doc, setDoc };
export { db, auth, provider };

//----------------------------------