import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDy4App9rCLY5wUDo0LEQJhUrhearZYZTs",
  authDomain: "leave-tracker-47a6c.firebaseapp.com",
  projectId: "leave-tracker-47a6c",
  storageBucket: "leave-tracker-47a6c.firebasestorage.app",
  messagingSenderId: "942385223415",
  appId: "1:942385223415:web:42cc3291c9f934bc1ea5f2",
  measurementId: "G-VSMWE16Q89"
};

export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
