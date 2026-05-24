import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "pi-social-hub.firebaseapp.com",
  projectId: "pi-social-hub",
  storageBucket: "pi-social-hub.appspot.com",
  messagingSenderId: "30791275310",
  appId: "1:30791275310:web:6a47ce1dca582d725ce0bf",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);