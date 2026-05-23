import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCprENfdxEuQMKyxCvxTK0kAi17JA-f9RM",

  authDomain: "pi-social-hub.firebaseapp.com",

  projectId: "pi-social-hub",

  storageBucket: "pi-social-hub.firebasestorage.app",

  messagingSenderId: "30791275310",

  appId: "1:30791275310:web:6a47ce1dca582d725ce0bf",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const storage = getStorage(app);

export const auth = getAuth(app);