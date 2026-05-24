import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyCprFNfDxEuQMKyxCvxTK0kAi17JA-f9RM",
  authDomain: "pi-social-hub.firebaseapp.com",
  databaseURL: "https://pi-social-hub-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pi-social-hub",
  storageBucket: "pi-social-hub.firebasestorage.app",
  messagingSenderId: "30791275310",
  appId: "1:30791275310:web:6a47ce1dca582d725ce0bf",
}

const app = initializeApp(firebaseConfig)

export const database = getDatabase(app)