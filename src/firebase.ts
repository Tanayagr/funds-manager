import { initializeApp } from "firebase/app";
// @ts-ignore - This is a known issue with the Firebase JS SDK where TypeScript
// may not recognize the 'react-native' specific exports from the main 'firebase/auth' entry point.
// The Metro bundler correctly resolves this at runtime.
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
    runTransaction,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);

export {
    addDoc,
    auth,
    collection,
    db,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    runTransaction,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
};
