import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
} satisfies FirebaseOptions

const requiredFirebaseEnv = {
  NEXT_PUBLIC_FIREBASE_API_KEY: firebaseConfig.apiKey,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
  NEXT_PUBLIC_FIREBASE_APP_ID: firebaseConfig.appId,
}

const missingFirebaseEnv = Object.entries(requiredFirebaseEnv)
  .filter(([, value]) => !value)
  .map(([key]) => key)

export const firebaseReady = missingFirebaseEnv.length === 0

if (!firebaseReady) {
  const message = `[Firebase Config] Missing public env values: ${missingFirebaseEnv.join(", ")}. ` +
    "Add them to the root .env file or Pi App Studio environment settings."

  if (typeof window === "undefined") {
    console.warn(message)
  } else {
    console.error(message)
  }
}

const app: FirebaseApp | null = firebaseReady ? (!getApps().length ? initializeApp(firebaseConfig) : getApp()) : null

const assertFirebaseApp = () => {
  if (!app) {
    throw new Error(
      `Firebase is not configured. Missing: ${missingFirebaseEnv.join(", ") || "unknown NEXT_PUBLIC_FIREBASE_* values"}.`,
    )
  }

  return app
}

export const auth = app ? getAuth(app) : null
export const database = app ? getDatabase(app) : null
export const db = app ? getFirestore(app) : null

export const getFirebaseDb = () => getFirestore(assertFirebaseApp())

export default app
