// firebase-auth.js (loaded ONLY when user triggers login)

export async function getFirebaseAuth() {
  const { initializeApp, getApps, getApp } = await import("firebase/app");
  const {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    setPersistence,
    browserLocalPersistence,
    signOut
  } = await import("firebase/auth");

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  await setPersistence(auth, browserLocalPersistence);

  return { auth, provider, signInWithPopup, signOut };
}

export async function signInWithGoogle() {
  const { auth, provider, signInWithPopup } = await getFirebaseAuth();

  const result = await signInWithPopup(auth, provider);
  return result.user;
}
