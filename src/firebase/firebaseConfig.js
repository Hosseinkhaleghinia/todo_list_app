import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnZnXtbu1Vs-pL67lsfg7hIXfTG6bsOOY",
  authDomain: "todo-list-5b6e0.firebaseapp.com",
  projectId: "todo-list-5b6e0",
  storageBucket: "todo-list-5b6e0.firebasestorage.app",
  messagingSenderId: "321858978461",
  appId: "1:321858978461:web:2cda0b379b35855558ca74"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
