// lib/firebase-client.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase-client"; // مسار الـ db عندك

export const createRealAccount = async (uid: string) => {
  await setDoc(doc(db, "users", uid), {
    type: "real",
    balance: 0,        // يبدأ من صفر
    createdAt: serverTimestamp(),
    verified: true     // حساب حقيقي مباشرة
  });
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// ✅ نضمن إنه يتعمل initialize مرة واحدة
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
