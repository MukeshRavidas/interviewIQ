import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-f8b70.firebaseapp.com",
  projectId: "interviewiq-f8b70",
  storageBucket: "interviewiq-f8b70.firebasestorage.app",
  messagingSenderId: "627535615367",
  appId: "1:627535615367:web:630a2c2b8d27ab81b52f22"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export {auth, provider}