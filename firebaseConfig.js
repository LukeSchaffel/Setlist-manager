// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZXPIddl_5xkkdtYuLGyl3am1__lamCTw",
  authDomain: "test-7b4a6.firebaseapp.com",
  projectId: "test-7b4a6",
  storageBucket: "test-7b4a6.appspot.com",
  messagingSenderId: "908049553391",
  appId: "1:908049553391:web:96a4b3416a3e762b5c481a",
  measurementId: "G-NHHH525V3P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
