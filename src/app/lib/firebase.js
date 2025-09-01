import { initializeApp, getApps, getApp } from 'firebase/app';
import { getPerformance } from "firebase/performance";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  collection,
  addDoc,
  deleteDoc,
  startAfter,
  limit,
  where,
  orderBy,
  arrayUnion,
  arrayRemove,
  updateDoc,
  query,
  getDocs,
  deleteField
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId ||
  !firebaseConfig.storageBucket ||
  !firebaseConfig.messagingSenderId ||
  !firebaseConfig.appId
) {
  throw new Error('Firebase configuration is missing environment variables');
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {

      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName,
        phoneNumber: "",
        email: user.email,
        profilePicture: user.photoURL,
        createdAt: new Date(),
      });
      console.log('New user registered and saved to Firestore');
    } else {
      console.log('User already exists in Firestore, logging in...');
    }

    return user;
  } catch (error) {
    console.error('Error during Google sign-in or Firestore check:', error);
    throw error;
  }
};

let perf;
if (typeof window !== "undefined") {
  perf = getPerformance(app);
}

setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  });


export {
  auth,
  signInWithGoogle,
  db,
  googleProvider,
  collection,
  addDoc,
  perf,
  arrayRemove,
  getDoc,
  setDoc,
  query,
  Timestamp,
  where,
  limit,
  startAfter,
  getDocs,
  updateDoc,
  deleteField,
  deleteDoc,
  arrayUnion,
  doc,
  orderBy,
  signOut
};
