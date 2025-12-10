import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Helper function to get env variable or fallback
const getEnv = (key: string, fallback: string = "") => {
  // In Vite, env variables are accessed via import.meta.env
  // For this scaffold, we'll try to look for them, but provide dummy defaults 
  // if not found to prevent immediate crashes before configuration.
  return (import.meta as any).env?.[key] || fallback;
};

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY", "PLACEHOLDER_KEY"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN", "placeholder.firebaseapp.com"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID", "placeholder-id"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET", "placeholder.appspot.com"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID", "00000000000"),
  appId: getEnv("VITE_FIREBASE_APP_ID", "1:00000000000:web:00000000000000")
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);